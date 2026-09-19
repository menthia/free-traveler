#!/usr/bin/env python3
"""
audit_tasks.py — Traveler Task 산출물 최종 감사 스크립트.

입력:
  - TASKS/00_TASK_LIST.md   (Task List: Category별 A.개요/B.상세 표 + NON_IMPLEMENTATION 표)
  - TASKS/TASK-*.md         (Task 상세 1개 = 파일 1개)
  - docs/PROJECT_SCOPE.md   (REQ-FUNC-001~080/REQ-NF-001~034의 IMPLEMENT/EXCLUDED 정본)
  - design-reference/SCREEN_ROUTE_CONTRACT.json (Screen·Route·Page Entry 정본)

검사(18개):
   1. Task List 구현 ID와 상세 Task 파일 1:1
   2. 중복 Task ID 0
   3. Depends On 누락(존재하지 않는 Task 참조) 0
   4. Dependency Cycle 0
   5. Screen 5개(SCR-001~005) 모두 Page Owner 정확히 1개
   6. Page Owner의 Route·Page Entry·Expected Files가 SCREEN_ROUTE_CONTRACT.json과 일치
   7. Component-only Screen 0(Page Owner 없이 Component만 있는 Screen 없음)
   8. SCR-001 Starter 제거 AC 존재
   9. SCR-003 세 탭(항공·숙소·동행) 조립 AC 존재
  10. SCR-005 역할별(Guest·Member·Admin) 상태 조립 AC 존재
  11. DB Schema·RLS·Access·Seed Task 존재
  12. DB Table 범위가 기본 테이블 집합을 크게 넘지 않음
  13. 외부 입력(항공·숙소) 비저장 AC 존재
  14. Auth·성인 확인·기본 RLS AC 존재
  15. Playwright Chromium Smoke Task 존재
  16. AWS·EC2·자동 Merge를 활성 구현 대상으로 삼는 Task 0
  17. REQ-FUNC 80개 + REQ-NF 34개 전부가 Task Requirement Ref 또는 NON_IMPLEMENTATION 표에 존재
  18. EXCLUDED Requirement에 대한 상세 구현 파일이 생성되지 않음

출력:
  - TASKS/TASK_MANIFEST.csv   (전체 Task 평탄화 목록)
  - TASKS/TASK_AUDIT_REPORT.md(검사 결과 상세)

성공 시 표준출력에 `AUDIT_PASS`와 검사 수를 출력하고 종료 코드 0.
실패 시 `AUDIT_FAIL`과 실패 목록을 출력하고 종료 코드 1.
"""
from __future__ import annotations

import csv
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
TASK_LIST_PATH = REPO_ROOT / "TASKS" / "00_TASK_LIST.md"
TASKS_DIR = REPO_ROOT / "TASKS"
PROJECT_SCOPE_PATH = REPO_ROOT / "docs" / "PROJECT_SCOPE.md"
CONTRACT_PATH = REPO_ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
MANIFEST_OUT_PATH = TASKS_DIR / "TASK_MANIFEST.csv"
REPORT_OUT_PATH = TASKS_DIR / "TASK_AUDIT_REPORT.md"

TOTAL_CHECKS = 18
SCREEN_IDS = ["SCR-001", "SCR-002", "SCR-003", "SCR-004", "SCR-005"]
FORBIDDEN_KEYWORDS = ["EC2", "AWS", "자동 병합", "auto-merge", "오토 머지", "automerge"]
EXCLUSION_CONTEXT_RE = re.compile(r"제외|않는다|금지|말고|아니다")
CANONICAL_DB_TABLES = {
    "USER_PROFILE", "MATE_POST", "MATE_APPLICATION",
    "USER_BLOCK", "REPORT", "OUTBOUND_LINK_SETTING",
}
DB_TABLE_NOISE = {
    "REQ_FUNC", "REQ_NF", "TASK_ID", "TASK_LIST", "NON_IMPLEMENTATION",
    "PROJECT_SCOPE", "TASK_MANIFEST", "SCREEN_ROUTE_CONTRACT", "DESIGN_MANIFEST",
    "ARCHITECTURE", "DECISION_LOG", "RLS_BASE", "SCHEMA_BASE", "SEED_BASE",
}

OVERVIEW_HEADER = (
    "| Seq | Task ID | 제목 | Implementation Status | Requirement Ref | "
    "Screen | Route | Page Entry | Depends On | Priority |"
)
DETAIL_HEADER = "| Task ID | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify |"
NON_IMPL_HEADER = "| Requirement | 근거(제외 사유) | 후속 방향 |"


class Check:
    def __init__(self, n: int, name: str):
        self.n = n
        self.name = name
        self.ok = True
        self.notes: list[str] = []

    def fail(self, msg: str):
        self.ok = False
        self.notes.append(msg)

    def info(self, msg: str):
        self.notes.append(msg)


def split_row(line: str) -> list[str]:
    line = line.strip()
    return [p.strip() for p in line[1:-1].split("|")]


def unbr(cell: str) -> list[str]:
    if cell in ("—", ""):
        return []
    return [x.strip() for x in cell.split("<br>")]


def parse_task_list():
    """반환: (tasks dict, raw_id_sequence list(중복 포함), non_implementation dict)"""
    text = TASK_LIST_PATH.read_text(encoding="utf-8")
    lines = text.splitlines()
    tasks: dict[str, dict] = {}
    raw_ids: list[str] = []
    non_impl: dict[str, dict] = {}
    mode = None
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if line == OVERVIEW_HEADER:
            mode = "overview"
            i += 2
            continue
        if line == DETAIL_HEADER:
            mode = "detail"
            i += 2
            continue
        if line == NON_IMPL_HEADER:
            mode = "non_impl"
            i += 2
            continue
        if line.startswith("#") or line.startswith("---"):
            mode = None
            i += 1
            continue
        if mode == "overview" and line.startswith("|"):
            cols = split_row(line)
            if len(cols) == 10:
                seq, tid, title, impl, reqref, screen, route, entry, deps, prio = cols
                raw_ids.append(tid)
                tasks[tid] = dict(
                    seq=seq, task_id=tid, title=title, impl_status=impl,
                    req_ids=unbr(reqref), screen=screen, route=route,
                    page_entry=entry, depends_on=unbr(deps), priority=prio,
                    expected_files=[], functional_ac=[], visual_ac=[],
                    security_ac=[], verify="",
                )
            i += 1
            continue
        if mode == "detail" and line.startswith("|"):
            cols = split_row(line)
            if len(cols) == 6:
                tid, files, fac, vac, sac, verify = cols
                if tid in tasks:
                    tasks[tid].update(
                        expected_files=unbr(files), functional_ac=unbr(fac),
                        visual_ac=unbr(vac), security_ac=unbr(sac), verify=verify,
                    )
            i += 1
            continue
        if mode == "non_impl" and line.startswith("|"):
            cols = split_row(line)
            if len(cols) == 3 and re.match(r"REQ-(FUNC|NF)-\d{3}", cols[0]):
                non_impl[cols[0]] = dict(reason=cols[1], followup=cols[2])
            i += 1
            continue
        i += 1
    return tasks, raw_ids, non_impl


def parse_project_scope_status() -> dict[str, str]:
    """docs/PROJECT_SCOPE.md §5/§6 표에서 REQ ID -> Implementation Status(IMPLEMENT/IMPLEMENT(변형)/EXCLUDED)."""
    text = PROJECT_SCOPE_PATH.read_text(encoding="utf-8")
    status: dict[str, str] = {}
    row_re = re.compile(r"^\|\s*(REQ-(?:FUNC|NF)-\d{3})\s*\|\s*([^|]+?)\s*\|")
    for line in text.splitlines():
        m = row_re.match(line.strip())
        if m and m.group(1) not in status:
            status[m.group(1)] = m.group(2).strip()
    return status


def get_category(detail_text: str) -> str | None:
    m = re.search(r"\*\*Category:\*\*.*\(`([A-Z0-9_]+)`\)", detail_text)
    return m.group(1) if m else None


def load_detail_texts() -> dict[str, str]:
    return {
        p.stem[len("TASK-"):]: p.read_text(encoding="utf-8")
        for p in sorted(TASKS_DIR.glob("TASK-*.md"))
    }


# ---------------------------------------------------------------- checks ---

def check_1_list_detail_1to1(tasks, texts, c: Check):
    list_ids = set(tasks.keys())
    file_ids = set(texts.keys())
    missing = sorted(list_ids - file_ids)
    orphan = sorted(file_ids - list_ids)
    if missing:
        c.fail(f"Task List에는 있지만 상세 파일이 없는 Task: {missing}")
    if orphan:
        c.fail(f"상세 파일만 있고 Task List에 없는 고아 Task: {orphan}")
    if not missing and not orphan:
        c.info(f"{len(list_ids)}개 전부 1:1 대응 확인")


def check_2_duplicate_task_ids(raw_ids, c: Check):
    dupes = sorted({t for t in raw_ids if raw_ids.count(t) > 1})
    if dupes:
        c.fail(f"Task List 내 중복 Task ID: {dupes}")
    else:
        c.info(f"중복 Task ID 없음(고유 ID {len(set(raw_ids))}개)")


def check_3_dangling_depends_on(tasks, c: Check):
    all_ids = set(tasks.keys())
    dangling = []
    for tid, t in tasks.items():
        for d in t["depends_on"]:
            if d not in all_ids:
                dangling.append((tid, d))
    if dangling:
        c.fail(f"존재하지 않는 Task를 참조하는 Depends On: {dangling}")
    else:
        c.info("모든 Depends On이 실제 존재하는 Task를 참조함")


def check_4_dependency_cycle(tasks, c: Check):
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {tid: WHITE for tid in tasks}
    cycle_found = []

    def dfs(node, path):
        color[node] = GRAY
        path.append(node)
        for dep in tasks[node]["depends_on"]:
            if dep not in tasks:
                continue  # check_3에서 별도 보고
            if color[dep] == GRAY:
                idx = path.index(dep)
                cycle_found.append(path[idx:] + [dep])
                continue
            if color[dep] == WHITE:
                dfs(dep, path)
        path.pop()
        color[node] = BLACK

    for tid in tasks:
        if color[tid] == WHITE:
            dfs(tid, [])

    if cycle_found:
        c.fail(f"의존성 순환 발견: {cycle_found}")
    else:
        c.info("의존성 그래프에 순환 없음")


def check_5_page_owner_per_screen(tasks, texts, c: Check):
    owner_by_screen: dict[str, list[str]] = {}
    for tid, t in tasks.items():
        if get_category(texts.get(tid, "")) == "PAGE_OWNER":
            owner_by_screen.setdefault(t["screen"], []).append(tid)
    for sid in SCREEN_IDS:
        matches = owner_by_screen.get(sid, [])
        if len(matches) != 1:
            c.fail(f"{sid}의 PAGE_OWNER Task 수 = {len(matches)}(기대값 1): {matches}")
        else:
            c.info(f"{sid} → {matches[0]}")
    extra = set(owner_by_screen) - set(SCREEN_IDS)
    if extra:
        c.fail(f"SCR-001~005 밖 Screen에 PAGE_OWNER 존재: {sorted(extra)}")
    return owner_by_screen


def check_6_route_page_entry_expected_files(tasks, owner_by_screen, contract, c: Check):
    contract_by_screen = {s["screen_id"]: s for s in contract.get("screens", [])}
    for sid in SCREEN_IDS:
        owners = owner_by_screen.get(sid, [])
        if len(owners) != 1:
            continue  # check_5에서 이미 실패 보고
        tid = owners[0]
        t = tasks[tid]
        ref = contract_by_screen.get(sid)
        if ref is None:
            c.fail(f"SCREEN_ROUTE_CONTRACT.json에 {sid} 정의가 없습니다.")
            continue
        if t["route"] != ref["route"]:
            c.fail(f"{tid} Route 불일치: Task List='{t['route']}' vs Contract='{ref['route']}'")
        if t["page_entry"] != ref["page_entry"]:
            c.fail(f"{tid} Page Entry 불일치: Task List='{t['page_entry']}' vs Contract='{ref['page_entry']}'")
        if not any(ref["page_entry"] in f for f in t["expected_files"]):
            c.fail(f"{tid}의 Expected Files에 Page Entry({ref['page_entry']})가 포함되지 않음: {t['expected_files']}")
        else:
            c.info(f"{tid}: Route/Page Entry/Expected Files 일치")


def check_7_component_only_screen(tasks, texts, c: Check):
    cats_by_screen: dict[str, set[str]] = {}
    for tid, t in tasks.items():
        cat = get_category(texts.get(tid, ""))
        cats_by_screen.setdefault(t["screen"], set()).add(cat)
    bad = [
        sid for sid in SCREEN_IDS
        if cats_by_screen.get(sid) == {"COMPONENT"}
    ]
    if bad:
        c.fail(f"Page Owner 없이 Component만 있는 Screen: {bad}")
    else:
        c.info("Component만 있고 Page Owner가 없는 Screen 없음")


def check_8_scr001_starter(tasks, owner_by_screen, texts, c: Check):
    owners = owner_by_screen.get("SCR-001", [])
    if len(owners) != 1:
        c.fail("SCR-001 Page Owner를 특정할 수 없어 검사 불가")
        return
    raw = texts[owners[0]]
    if re.search(r"[Ss]tarter|스타터", raw):
        c.info(f"{owners[0]}에 Starter 제거 AC 존재")
    else:
        c.fail(f"{owners[0]}에 Next.js Starter 제거 AC가 없습니다.")


def check_9_scr003_three_tabs(tasks, owner_by_screen, texts, c: Check):
    owners = owner_by_screen.get("SCR-003", [])
    if len(owners) != 1:
        c.fail("SCR-003 Page Owner를 특정할 수 없어 검사 불가")
        return
    raw = texts[owners[0]]
    flags = {
        "항공": bool(re.search(r"항공", raw)),
        "숙소/호텔": bool(re.search(r"숙소|호텔", raw)),
        "동행": bool(re.search(r"동행", raw)),
    }
    if all(flags.values()):
        c.info(f"{owners[0]}에 항공·숙소·동행 3탭 조립 AC 존재")
    else:
        c.fail(f"{owners[0]}에 3탭 중 누락: {flags}")


def check_10_scr005_role_states(tasks, owner_by_screen, texts, c: Check):
    owners = owner_by_screen.get("SCR-005", [])
    if len(owners) != 1:
        c.fail("SCR-005 Page Owner를 특정할 수 없어 검사 불가")
        return
    raw = texts[owners[0]]
    flags = {
        "Guest": bool(re.search(r"[Gg]uest|게스트", raw)),
        "Member": bool(re.search(r"[Mm]ember|회원|내 활동", raw)),
        "Admin": bool(re.search(r"[Aa]dmin|관리자", raw)),
    }
    if all(flags.values()):
        c.info(f"{owners[0]}에 Guest·Member·Admin 역할별 상태 조립 AC 존재")
    else:
        c.fail(f"{owners[0]}에 역할 상태 중 누락: {flags}")


def check_11_db_required_tasks(tasks, texts, c: Check):
    db_ids = [tid for tid in tasks if get_category(texts.get(tid, "")) == "DB"]
    need = {"SCHEMA": False, "RLS": False, "ACCESS": False, "SEED": False}
    matched = {}
    for tid in db_ids:
        upper = tid.upper()
        for key in need:
            if key in upper:
                need[key] = True
                matched.setdefault(key, tid)
    missing = [k for k, v in need.items() if not v]
    if missing:
        c.fail(f"DB Schema/RLS/Access/Seed Task 중 누락: {missing} (존재하는 DB Task: {db_ids})")
    else:
        c.info(f"DB Schema/RLS/Access/Seed Task 모두 존재: {matched}")


def check_12_db_table_scope(tasks, texts, c: Check):
    db_ids = [tid for tid in tasks if get_category(texts.get(tid, "")) == "DB"]
    schema_ids = [tid for tid in db_ids if "SCHEMA" in tid.upper()]
    table_pattern = re.compile(r"\b[A-Z][A-Z0-9]*(?:_[A-Z0-9]+){1,3}\b")

    def tables_in(text):
        # 줄 단위로 훑어서 "만들지 않는다/제외" 같은 부정 문맥에 등장하는 테이블명은
        # 실제 생성 대상으로 세지 않는다(check_16과 동일한 EXCLUSION_CONTEXT_RE 적용).
        found: set[str] = set()
        for line in text.splitlines():
            if EXCLUSION_CONTEXT_RE.search(line):
                continue
            found |= set(table_pattern.findall(line))
        return {f for f in found if f not in DB_TABLE_NOISE and not f.startswith("REQ_")}

    if not schema_ids:
        c.fail("DB-*SCHEMA* Task가 없어 기본 테이블 집합을 정할 수 없습니다.")
        return

    baseline = set(CANONICAL_DB_TABLES)

    total: set[str] = set()
    for tid in db_ids:
        total |= tables_in(texts[tid])
    total |= baseline

    extra = total - baseline
    tolerance = 0
    if len(extra) > tolerance:
        c.fail(
            f"DB Task 전체 테이블({sorted(total)})이 정본 6개 테이블({sorted(baseline)})을 "
            f"{len(extra)}개 초과(허용 오차 {tolerance}개): 초과분={sorted(extra)}"
        )
    else:
        c.info(
            f"정본 테이블 6개(CLAUDE.md 규칙 8·docs/ARCHITECTURE.md §7.2) 기준, "
            f"DB Task 전체에서 발견된 테이블도 동일한 {len(total)}개: {sorted(total)}"
        )


def check_13_external_input_not_persisted(tasks, texts, c: Check):
    targets = [tid for tid in tasks if re.search(r"FLIGHT|HOTEL|TRAVEL-TOOLS", tid.upper()) or tid == "PAGE-SCR003"]
    if not targets:
        c.fail("항공·숙소 관련 Task를 찾을 수 없습니다.")
        return
    ok_ids, bad_ids = [], []
    for tid in targets:
        raw = texts.get(tid, "")
        if re.search(r"서버.*저장하지 않|DB.*저장하지 않|비전달|전달되지 않|저장하지 않는다", raw):
            ok_ids.append(tid)
        else:
            bad_ids.append(tid)
    if not ok_ids:
        c.fail(f"항공·숙소 관련 Task 어디에도 '서버/DB 비저장' AC가 없습니다: {targets}")
    else:
        c.info(f"외부 입력 비저장 AC 확인: {ok_ids}" + (f" / 미기재: {bad_ids}" if bad_ids else ""))


def check_14_auth_adult_rls(tasks, texts, c: Check):
    auth_ids = [tid for tid in tasks if re.search(r"AUTH|LOGIN-GATE", tid.upper())]
    adult_ids = [tid for tid in tasks if "성인" in texts.get(tid, "")]
    rls_ids = [tid for tid in tasks if "RLS" in tid.upper()]
    missing = []
    if not auth_ids:
        missing.append("Auth 관련 Task 없음")
    if not adult_ids:
        missing.append("성인 확인 AC를 포함한 Task 없음")
    if not rls_ids:
        missing.append("RLS 관련 Task 없음")
    if missing:
        c.fail("; ".join(missing))
    else:
        c.info(f"Auth={auth_ids}, 성인확인 언급={adult_ids}, RLS={rls_ids}")


def check_15_playwright_chromium_smoke(tasks, texts, c: Check):
    e2e_ids = [tid for tid in tasks if get_category(texts.get(tid, "")) == "E2E_TEST"]
    smoke_ids = [tid for tid in e2e_ids if "SMOKE" in tid.upper() or "Smoke" in tasks[tid]["title"]]
    chromium_ok = [tid for tid in smoke_ids if "Chromium" in texts.get(tid, "")]
    if not smoke_ids:
        c.fail(f"Playwright Smoke Task를 찾지 못했습니다(E2E_TEST 목록: {e2e_ids}).")
    elif not chromium_ok:
        c.fail(f"Smoke Task는 있으나 Chromium 명시가 없습니다: {smoke_ids}")
    else:
        c.info(f"Playwright Chromium Smoke Task 확인: {chromium_ok}")


def check_16_no_aws_ec2_automerge(texts, c: Check):
    hits = []
    for tid, raw in texts.items():
        for line in raw.splitlines():
            for kw in FORBIDDEN_KEYWORDS:
                if kw.lower() in line.lower() and not EXCLUSION_CONTEXT_RE.search(line):
                    hits.append((tid, kw, line.strip()))
    if hits:
        c.fail(f"AWS/EC2/자동 Merge가 활성 구현 대상으로 언급됨: {hits}")
    else:
        c.info("AWS/EC2/자동 Merge를 활성 구현 대상으로 삼는 Task 없음")


def check_17_requirement_coverage(tasks, non_impl, scope_status, c: Check):
    linked: set[str] = set()
    for t in tasks.values():
        linked.update(t["req_ids"])
    excluded_listed = set(non_impl.keys())

    all_ids = set(scope_status.keys())
    covered = linked | excluded_listed
    missing = sorted(all_ids - covered)
    if len(all_ids) != 114:
        c.fail(f"docs/PROJECT_SCOPE.md에서 추출한 Requirement 수가 114개가 아닙니다: {len(all_ids)}개")
    if missing:
        c.fail(f"Task에도, NON_IMPLEMENTATION 표에도 없는 Requirement {len(missing)}개: {missing}")
    else:
        c.info(f"REQ-FUNC 80개 + REQ-NF 34개 = 114개 전부 Task 또는 NON_IMPLEMENTATION 표에 존재")


def check_18_excluded_no_detail_file(tasks, non_impl, scope_status, texts, c: Check):
    excluded_ids = {rid for rid, st in scope_status.items() if st == "EXCLUDED"}
    if set(non_impl.keys()) != excluded_ids:
        only_in_table = sorted(set(non_impl.keys()) - excluded_ids)
        only_in_scope = sorted(excluded_ids - set(non_impl.keys()))
        if only_in_table:
            c.fail(f"NON_IMPLEMENTATION 표에는 있는데 PROJECT_SCOPE.md 기준 EXCLUDED가 아닌 항목: {only_in_table}")
        if only_in_scope:
            c.fail(f"PROJECT_SCOPE.md 기준 EXCLUDED인데 NON_IMPLEMENTATION 표에 없는 항목: {only_in_scope}")

    wrongly_linked = []
    for tid, t in tasks.items():
        for r in t["req_ids"]:
            if r in excluded_ids:
                wrongly_linked.append((tid, r))
    stray_files = [rid for rid in excluded_ids if rid in texts]  # TASK-<REQ-ID>.md 같은 오생성 방지

    if wrongly_linked:
        c.fail(f"EXCLUDED Requirement가 구현 Task에 링크되어 있음: {wrongly_linked}")
    if stray_files:
        c.fail(f"EXCLUDED Requirement ID로 상세 파일이 생성되어 있음: {stray_files}")
    if not wrongly_linked and not stray_files:
        c.info("EXCLUDED Requirement에 대한 구현 Task/상세 파일 없음")


# --------------------------------------------------------------- manifest --

def write_manifest(tasks: dict, texts: dict):
    MANIFEST_OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(MANIFEST_OUT_PATH, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow([
            "seq", "task_id", "title", "category", "implementation_status",
            "requirement_ref", "screen", "route", "page_entry", "depends_on",
            "priority", "detail_file",
        ])
        for tid in sorted(tasks, key=lambda x: int(tasks[x]["seq"])):
            t = tasks[tid]
            cat = get_category(texts.get(tid, "")) or ""
            w.writerow([
                t["seq"], tid, t["title"], cat, t["impl_status"],
                "; ".join(t["req_ids"]), t["screen"], t["route"], t["page_entry"],
                "; ".join(t["depends_on"]), t["priority"], f"TASKS/TASK-{tid}.md",
            ])


# -------------------------------------------------------------------- main -

def main() -> int:
    if not TASK_LIST_PATH.exists():
        print("TASKS/00_TASK_LIST.md가 없습니다. 아직 Task List가 생성되지 않았습니다.")
        return 0

    import json
    contract = json.loads(CONTRACT_PATH.read_text(encoding="utf-8"))
    tasks, raw_ids, non_impl = parse_task_list()
    texts = load_detail_texts()
    scope_status = parse_project_scope_status()

    if not tasks:
        print("TASKS/00_TASK_LIST.md에서 유효한 Task 행을 찾지 못했습니다.")
        return 1

    checks: list[Check] = []

    c1 = Check(1, "Task List ↔ 상세 파일 1:1"); check_1_list_detail_1to1(tasks, texts, c1); checks.append(c1)
    c2 = Check(2, "중복 Task ID 0"); check_2_duplicate_task_ids(raw_ids, c2); checks.append(c2)
    c3 = Check(3, "Depends On 누락 0"); check_3_dangling_depends_on(tasks, c3); checks.append(c3)
    c4 = Check(4, "Dependency Cycle 0"); check_4_dependency_cycle(tasks, c4); checks.append(c4)
    c5 = Check(5, "Screen 5개 모두 Page Owner 정확히 1개"); owner_by_screen = check_5_page_owner_per_screen(tasks, texts, c5); checks.append(c5)
    c6 = Check(6, "Route·Page Entry·Expected Files 일치"); check_6_route_page_entry_expected_files(tasks, owner_by_screen, contract, c6); checks.append(c6)
    c7 = Check(7, "Component-only Screen 0"); check_7_component_only_screen(tasks, texts, c7); checks.append(c7)
    c8 = Check(8, "SCR-001 Starter 제거 AC 존재"); check_8_scr001_starter(tasks, owner_by_screen, texts, c8); checks.append(c8)
    c9 = Check(9, "SCR-003 세 탭 조립 AC 존재"); check_9_scr003_three_tabs(tasks, owner_by_screen, texts, c9); checks.append(c9)
    c10 = Check(10, "SCR-005 역할별 상태 조립 AC 존재"); check_10_scr005_role_states(tasks, owner_by_screen, texts, c10); checks.append(c10)
    c11 = Check(11, "DB Schema·RLS·Access·Seed Task 존재"); check_11_db_required_tasks(tasks, texts, c11); checks.append(c11)
    c12 = Check(12, "DB Table 범위가 기본 집합을 크게 넘지 않음"); check_12_db_table_scope(tasks, texts, c12); checks.append(c12)
    c13 = Check(13, "외부 입력 비저장 AC 존재"); check_13_external_input_not_persisted(tasks, texts, c13); checks.append(c13)
    c14 = Check(14, "Auth·성인·기본 RLS AC 존재"); check_14_auth_adult_rls(tasks, texts, c14); checks.append(c14)
    c15 = Check(15, "Playwright Chromium Smoke Task 존재"); check_15_playwright_chromium_smoke(tasks, texts, c15); checks.append(c15)
    c16 = Check(16, "AWS·EC2·자동 Merge 구현 Task 0"); check_16_no_aws_ec2_automerge(texts, c16); checks.append(c16)
    c17 = Check(17, "REQ-FUNC 80 + REQ-NF 34가 Task 또는 EXCLUDED 표에 존재"); check_17_requirement_coverage(tasks, non_impl, scope_status, c17); checks.append(c17)
    c18 = Check(18, "EXCLUDED 상세 구현 파일 미생성"); check_18_excluded_no_detail_file(tasks, non_impl, scope_status, texts, c18); checks.append(c18)

    assert len(checks) == TOTAL_CHECKS

    write_manifest(tasks, texts)

    report_lines = ["# Traveler Task Audit Report", ""]
    report_lines.append(f"- 총 검사 수: {TOTAL_CHECKS}")
    failed = [c for c in checks if not c.ok]
    report_lines.append(f"- PASS: {TOTAL_CHECKS - len(failed)}")
    report_lines.append(f"- FAIL: {len(failed)}")
    report_lines.append("")
    for c in checks:
        status = "PASS" if c.ok else "FAIL"
        report_lines.append(f"## [{status}] {c.n}. {c.name}")
        for note in c.notes:
            report_lines.append(f"- {note}")
        report_lines.append("")
    report_lines.append(f"- Manifest: `TASKS/TASK_MANIFEST.csv` ({len(tasks)} rows)")
    report_lines.append("")

    print("\n".join(f"[{'PASS' if c.ok else 'FAIL'}] {c.n}. {c.name}" for c in checks))
    for c in checks:
        if not c.ok:
            for note in c.notes:
                print(f"    - {note}")

    REPORT_OUT_PATH.write_text("\n".join(report_lines), encoding="utf-8")

    print()
    if failed:
        print(f"AUDIT_FAIL ({len(failed)}/{TOTAL_CHECKS}개 검사 실패)")
        return 1

    print(f"AUDIT_PASS (검사 수: {TOTAL_CHECKS})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
