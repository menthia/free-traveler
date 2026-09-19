#!/usr/bin/env python3
"""
build_waves.py — Traveler Task Manifest를 Wave 단위 실행 계획으로 변환한다.

입력:
  - TASKS/TASK_MANIFEST.csv           (Task 평탄화 목록, scripts/audit_tasks.py 산출물)
  - TASKS/TASK-*.md                   (Task 상세 — manifest의 detail_file 열이 가리키는 실제 경로.
                                        요청 문서의 'TASKS/details/TASK-*.md'는 이 저장소의 실제 배치와
                                        달라 detail_file 열 값을 그대로 신뢰한다.)
  - design-reference/SCREEN_ROUTE_CONTRACT.json (Screen 순서 정본)

출력:
  - TASKS/TASK_DAG.md                 (의존성 그래프·위상 정렬·순환 검사 결과)
  - TASKS/WAVE_PLAN.md                (Wave별 Task 목록 + Preview Checkpoint 여부)
  - TASKS/WAVE_STATE.json             (Wave 실행 상태 초기값)
  - TASKS/TASK_MANIFEST.csv           (wave_id 열을 추가해 같은 파일에 다시 기록)

이 스크립트는 실제 구현 코드·Git Branch·PR·Merge를 만들지 않는다(규칙 8).
"""
from __future__ import annotations

import csv
import json
import re
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
TASKS_DIR = REPO_ROOT / "TASKS"
MANIFEST_PATH = TASKS_DIR / "TASK_MANIFEST.csv"
CONTRACT_PATH = REPO_ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
DAG_OUT_PATH = TASKS_DIR / "TASK_DAG.md"
WAVE_PLAN_OUT_PATH = TASKS_DIR / "WAVE_PLAN.md"
WAVE_STATE_OUT_PATH = TASKS_DIR / "WAVE_STATE.json"

MIN_PER_WAVE = 4
MAX_PER_WAVE = 7

# 요청된 10개 Wave Group 순서와 제목(그대로 유지 — 실제 Wave ID는 여기서 고정하지 않는다).
GROUP_TITLES: dict[int, str] = {
    1: "Scaffold, 문서, Harness 확인",
    2: "공통 UI, 정적 데이터, Layout",
    3: "Supabase Auth, 6개 Table, 기본 RLS",
    4: "SCR-001 메인 Component와 Page Owner",
    5: "SCR-002 대표 소개 Component와 Page Owner",
    6: "SCR-003 여행 입력·외부 이동·동행글 입력 Component와 Page Owner",
    7: "SCR-004 동행 목록·상세·신청 Component와 Page Owner",
    8: "SCR-005 계정·내 활동·간단 관리자 Component와 Page Owner",
    9: "Unit·Playwright·접근성·CI",
    10: "Vercel Preview와 Release 확인",
}

SCREEN_TO_GROUP = {
    "SCR-001": 4,
    "SCR-002": 5,
    "SCR-003": 6,
    "SCR-004": 7,
    "SCR-005": 8,
}

# 화면에 속하지 않는(screen이 COMMON/— 인) Task를 어느 Group에 둘지 결정하는 규칙.
# 위에서 아래로 먼저 매치되는 규칙을 적용한다.
NON_SCREEN_GROUP_RULES: list[tuple[re.Pattern, int]] = [
    (re.compile(r"^COMP-GLOBAL-"), 2),
    (re.compile(r"^DATA-"), 2),
    (re.compile(r"^API-ERROR-PAGES$"), 2),
    (re.compile(r"^API-(DATE-VALIDATION|CONTACT-DETECTION)-UTIL$"), 2),
    (re.compile(r"^INFRA-SUPABASE-PROJECT$"), 3),
    (re.compile(r"^DB-"), 3),
    (re.compile(r"^API-AUTH-CALLBACK$"), 3),
    (re.compile(r"^API-(MATE-AUTOCLOSE|MATES-CRUD|APPLICATIONS|BLOCKS|REPORTS|"
                r"ADMIN-REPORTS|ADMIN-OUTBOUND-SETTINGS|SECURITY-BASELINE)$"), 3),
    (re.compile(r"^UNIT-|^TEST-|^E2E-"), 9),
    (re.compile(r"^CI-PIPELINE$"), 9),
    (re.compile(r"^MANUAL-(RESPONSIVE|A11Y)-CHECK$"), 9),
    (re.compile(r"^INFRA-VERCEL-DEPLOY$"), 10),
    (re.compile(r"^RELEASE-CHECK-"), 10),
]


class BuildError(Exception):
    pass


# ------------------------------------------------------------------ parsing


def load_manifest() -> tuple[list[str], dict[str, dict]]:
    if not MANIFEST_PATH.exists():
        raise BuildError(f"{MANIFEST_PATH}가 없습니다. 먼저 scripts/audit_tasks.py를 실행하세요.")
    with open(MANIFEST_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fieldnames = list(reader.fieldnames or [])
        tasks: dict[str, dict] = {}
        for row in reader:
            tid = row["task_id"]
            deps_raw = (row.get("depends_on") or "").strip()
            depends_on = [] if deps_raw in ("", "—") else [d.strip() for d in deps_raw.split(";") if d.strip()]
            tasks[tid] = {
                "seq": int(row["seq"]),
                "task_id": tid,
                "title": row["title"],
                "category": row["category"],
                "screen": row.get("screen", "") or "",
                "depends_on": depends_on,
                "detail_file": row["detail_file"],
                "row": row,
            }
    if not tasks:
        raise BuildError("TASK_MANIFEST.csv에서 유효한 Task 행을 찾지 못했습니다.")
    return fieldnames, tasks


def load_expected_files(tasks: dict[str, dict]) -> dict[str, list[str]]:
    expected: dict[str, list[str]] = {}
    for tid, t in tasks.items():
        path = REPO_ROOT / t["detail_file"]
        files: list[str] = []
        if path.exists():
            text = path.read_text(encoding="utf-8")
            m = re.search(r"## Expected Files\n(.*?)\n\n", text, re.S)
            if m:
                for line in m.group(1).splitlines():
                    line = line.strip()
                    if not line.startswith("-"):
                        continue
                    line = line.lstrip("- ").strip()
                    # "src/app/page.tsx (수정 — ...)" 형태에서 경로만 추출
                    file_match = re.match(r"([^\s(]+)", line)
                    if file_match:
                        candidate = file_match.group(1)
                        # "—(코드 산출물 없음...)" 같은 비-코드 Task는 실제 파일 경로가 아니므로 제외
                        if candidate != "—" and ("/" in candidate or "." in candidate):
                            files.append(candidate)
        expected[tid] = files
    return expected


def load_screen_order() -> list[str]:
    if not CONTRACT_PATH.exists():
        raise BuildError(f"{CONTRACT_PATH}가 없습니다.")
    contract = json.loads(CONTRACT_PATH.read_text(encoding="utf-8"))
    return [s["screen_id"] for s in contract.get("screens", [])]


# --------------------------------------------------------------- graph work


def detect_cycles(tasks: dict[str, dict]) -> list[list[str]]:
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {tid: WHITE for tid in tasks}
    cycles: list[list[str]] = []

    def dfs(node: str, path: list[str]):
        color[node] = GRAY
        path.append(node)
        for dep in tasks[node]["depends_on"]:
            if dep not in tasks:
                continue
            if color[dep] == GRAY:
                idx = path.index(dep)
                cycles.append(path[idx:] + [dep])
                continue
            if color[dep] == WHITE:
                dfs(dep, path)
        path.pop()
        color[node] = BLACK

    for tid in tasks:
        if color[tid] == WHITE:
            dfs(tid, [])
    return cycles


def topological_order(tasks: dict[str, dict]) -> list[str]:
    """Kahn 알고리즘. 동점(진입차수 동일)일 때는 원본 seq 순서를 사용해 결정적으로 정렬한다."""
    indegree = {tid: 0 for tid in tasks}
    forward: dict[str, list[str]] = defaultdict(list)
    for tid, t in tasks.items():
        for dep in t["depends_on"]:
            if dep in tasks:
                forward[dep].append(tid)
                indegree[tid] += 1

    ready = sorted([tid for tid, d in indegree.items() if d == 0], key=lambda x: tasks[x]["seq"])
    order: list[str] = []
    while ready:
        ready.sort(key=lambda x: tasks[x]["seq"])
        node = ready.pop(0)
        order.append(node)
        for nxt in forward[node]:
            indegree[nxt] -= 1
            if indegree[nxt] == 0:
                ready.append(nxt)

    if len(order) != len(tasks):
        remaining = sorted(set(tasks) - set(order))
        raise BuildError(f"위상 정렬 실패(순환 의존성으로 처리하지 못한 Task): {remaining}")
    return order


def classify_group(tid: str, t: dict) -> int:
    # 접두사 규칙이 화면(screen) 필드보다 우선한다: DATA-REPRESENTATIVE처럼
    # 특정 화면(SCR-002)에서 주로 쓰이더라도 정적 데이터 준비 자체는 모든 화면보다
    # 앞서야 하므로(Group 2), screen 필드만으로 뒤 Group에 배치되지 않게 한다.
    for pattern, group in NON_SCREEN_GROUP_RULES:
        if pattern.match(tid):
            return group
    screen = t["screen"]
    if screen in SCREEN_TO_GROUP:
        return SCREEN_TO_GROUP[screen]
    raise BuildError(f"Task {tid}를 어떤 Wave Group에도 분류하지 못했습니다(NON_SCREEN_GROUP_RULES 보강 필요).")


def verify_group_ordering(tasks: dict[str, dict], group_of: dict[str, int]) -> list[tuple[str, str]]:
    """규칙 2: 선행 Task의 Group이 후행 Task의 Group보다 뒤에 있으면 위반."""
    violations = []
    for tid, t in tasks.items():
        for dep in t["depends_on"]:
            if dep not in tasks:
                continue
            if group_of[dep] > group_of[tid]:
                violations.append((tid, dep))
    return violations


# --------------------------------------------------------------- chunking


def chunk_group_tasks(group_tasks: list[str], tasks: dict[str, dict],
                       expected_files: dict[str, list[str]]) -> list[list[str]]:
    """Group 내 Task를 위상 순서를 지키며 4~7개 단위 Wave로 분할하고,
    같은 파일을 건드리는 Task는 서로 다른 Wave로 분리한다(규칙 5)."""
    if not group_tasks:
        return [], 0

    n = len(group_tasks)
    if n <= MAX_PER_WAVE:
        chunks = [list(group_tasks)]
    else:
        num_waves = -(-n // MAX_PER_WAVE)  # ceil
        base = n // num_waves
        rem = n % num_waves
        chunks = []
        idx = 0
        for i in range(num_waves):
            size = base + (1 if i < rem else 0)
            chunks.append(group_tasks[idx:idx + size])
            idx += size

    # Page Owner는 자신이 속한 마지막 chunk의 맨 끝에 오도록 재배치(규칙 4).
    # (의존성상 이미 자연스럽게 마지막이 되지만, 안전하게 한 번 더 강제한다.)
    for chunk in chunks:
        owners = [tid for tid in chunk if tasks[tid]["category"] == "PAGE_OWNER"]
        for owner in owners:
            chunk.remove(owner)
            chunk.append(owner)

    # 규칙 5: 같은 Wave 안에서 파일이 겹치는 Task를 뒤 Wave로 미룬다(의존성 순서 위반 없이).
    moved = 0
    changed = True
    while changed:
        changed = False
        for ci, chunk in enumerate(chunks):
            seen: dict[str, str] = {}
            for tid in list(chunk):
                for f in expected_files.get(tid, []):
                    if f in seen and seen[f] != tid:
                        # tid를 다음 chunk로 이동(다음 chunk가 없으면 새로 만든다)
                        chunk.remove(tid)
                        if ci + 1 >= len(chunks):
                            chunks.append([])
                        chunks[ci + 1].insert(0, tid)
                        moved += 1
                        changed = True
                        break
                    seen[f] = tid
                if changed:
                    break
            if changed:
                break

    chunks = [c for c in chunks if c]
    return chunks, moved


# --------------------------------------------------------------------- main


def main() -> int:
    fieldnames, tasks = load_manifest()
    expected_files = load_expected_files(tasks)
    screen_order = load_screen_order()
    for sid in SCREEN_TO_GROUP:
        if sid not in screen_order:
            print(f"경고: SCREEN_ROUTE_CONTRACT.json에 {sid}가 없습니다.", file=sys.stderr)

    cycles = detect_cycles(tasks)
    if cycles:
        print(f"CYCLE_DETECTED: {len(cycles)}건")
        for cyc in cycles:
            print(f"  - {' -> '.join(cyc)}")
        print("순환 의존성이 있어 Wave를 생성하지 않았습니다.")
        return 1

    order = topological_order(tasks)

    group_of: dict[str, int] = {tid: classify_group(tid, tasks[tid]) for tid in tasks}

    violations = verify_group_ordering(tasks, group_of)
    if violations:
        print("GROUP_ORDER_VIOLATION: 선행 Task가 후행 Task보다 뒤 Group에 배치되었습니다.")
        for tid, dep in violations:
            print(f"  - {tid} (Group {group_of[tid]}) depends on {dep} (Group {group_of[dep]})")
        print("Wave를 생성하지 않았습니다. NON_SCREEN_GROUP_RULES를 보강하세요.")
        return 1

    # Group별로 위상 순서를 보존한 Task 목록을 만든다.
    group_task_lists: dict[int, list[str]] = defaultdict(list)
    for tid in order:
        group_task_lists[group_of[tid]].append(tid)

    all_chunks: list[tuple[int, list[str]]] = []
    total_moved = 0
    for g in sorted(GROUP_TITLES):
        group_tasks = group_task_lists.get(g, [])
        chunks, moved = chunk_group_tasks(group_tasks, tasks, expected_files)
        total_moved += moved
        for chunk in chunks:
            all_chunks.append((g, chunk))

    # Wave 간 의존성 재검증(파일 충돌로 인한 이동이 순서를 깨지 않았는지 최종 확인).
    wave_of: dict[str, int] = {}
    for wi, (_, chunk) in enumerate(all_chunks):
        for tid in chunk:
            wave_of[tid] = wi
    for tid, t in tasks.items():
        for dep in t["depends_on"]:
            if dep in wave_of and wave_of[dep] > wave_of[tid]:
                print(f"WAVE_ORDER_VIOLATION: {tid}(Wave idx {wave_of[tid]})가 "
                      f"의존 Task {dep}(Wave idx {wave_of[dep]})보다 앞선 Wave에 배치되었습니다.")
                return 1

    # Wave ID 부여(W01, W02, ... — 그룹별 개수를 미리 고정하지 않는다)
    wave_ids: list[str] = [f"W{idx + 1:02d}" for idx in range(len(all_chunks))]
    group_wave_counts: dict[int, int] = defaultdict(int)
    for g, _ in all_chunks:
        group_wave_counts[g] += 1
    group_wave_seen: dict[int, int] = defaultdict(int)

    waves_meta: list[dict] = []
    for wid, (g, chunk) in zip(wave_ids, all_chunks):
        group_wave_seen[g] += 1
        title = GROUP_TITLES[g]
        if group_wave_counts[g] > 1:
            title = f"{title} ({group_wave_seen[g]}/{group_wave_counts[g]})"
        has_page_owner = any(tasks[tid]["category"] == "PAGE_OWNER" for tid in chunk)
        checkpoint_required = has_page_owner or g == 10
        waves_meta.append({
            "wave_id": wid,
            "group": g,
            "title": title,
            "task_ids": chunk,
            "checkpoint_required": checkpoint_required,
        })

    # --- TASKS/TASK_DAG.md ---
    dag_lines = ["# Traveler Task Dependency Graph (TASK_DAG)", "",
                 f"- 생성 스크립트: `scripts/build_waves.py`",
                 f"- 순환 의존성: {len(cycles)}건",
                 f"- 전체 Task 수: {len(tasks)}개",
                 "",
                 "## 위상 정렬 순서(전체)", ""]
    for i, tid in enumerate(order, 1):
        dag_lines.append(f"{i}. `{tid}` (Group {group_of[tid]}: {GROUP_TITLES[group_of[tid]]})")
    dag_lines += ["", "## 의존성 인접 목록(Task → Depends On)", ""]
    for tid in order:
        deps = tasks[tid]["depends_on"]
        dag_lines.append(f"- `{tid}` → {', '.join(f'`{d}`' for d in deps) if deps else '(없음)'}")
    dag_lines += ["", "---", "", "*— End of TASK_DAG —*", ""]
    DAG_OUT_PATH.write_text("\n".join(dag_lines), encoding="utf-8")

    # --- TASKS/WAVE_PLAN.md ---
    plan_lines = ["# Wave Plan", "",
                  "이 파일은 `scripts/build_waves.py`가 생성했다. 사람이 그룹/순서를 바꾸려면",
                  "`scripts/build_waves.py`의 Group 분류 규칙을 고쳐 다시 생성한다(이 파일을 직접",
                  "손으로 편집해도 되지만, 다음 재생성 시 덮어써진다).", ""]
    for w in waves_meta:
        plan_lines.append(f"## {w['wave_id']} — {w['title']}")
        plan_lines.append(f"- Tasks: {', '.join(w['task_ids'])}")
        plan_lines.append(f"- Preview Checkpoint: {'true' if w['checkpoint_required'] else 'false'}")
        plan_lines.append("")
    WAVE_PLAN_OUT_PATH.write_text("\n".join(plan_lines), encoding="utf-8")

    # --- TASKS/WAVE_STATE.json ---
    state = {
        "schema_version": "traveler-wave-state-v1",
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "waves": [
            {
                "wave_id": w["wave_id"],
                "title": w["title"],
                "task_ids": w["task_ids"],
                "status": "pending",
                "checkpoint_required": w["checkpoint_required"],
                "checkpoint_result": "pending" if w["checkpoint_required"] else "not_required",
            }
            for w in waves_meta
        ],
    }
    WAVE_STATE_OUT_PATH.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    # --- TASKS/TASK_MANIFEST.csv (wave_id 열 추가) ---
    wave_id_of: dict[str, str] = {}
    for w in waves_meta:
        for tid in w["task_ids"]:
            wave_id_of[tid] = w["wave_id"]

    out_fieldnames = fieldnames + (["wave_id"] if "wave_id" not in fieldnames else [])
    with open(MANIFEST_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=out_fieldnames)
        writer.writeheader()
        for tid in sorted(tasks, key=lambda x: tasks[x]["seq"]):
            row = dict(tasks[tid]["row"])
            row["wave_id"] = wave_id_of.get(tid, "")
            writer.writerow(row)

    # --- 종료 출력 ---
    print(f"CYCLES: {len(cycles)}건")
    print(f"FILE_CONFLICT_SPLITS: {total_moved}건")
    print()
    print("Wave별 Task 수:")
    for w in waves_meta:
        print(f"  {w['wave_id']} ({w['title']}): {len(w['task_ids'])}개 — checkpoint_required={w['checkpoint_required']}")
    print()
    print("Page Owner 위치:")
    for w in waves_meta:
        owners = [tid for tid in w["task_ids"] if tasks[tid]["category"] == "PAGE_OWNER"]
        for owner in owners:
            is_last = w["task_ids"][-1] == owner
            print(f"  {owner} → {w['wave_id']} (마지막 Task: {'예' if is_last else '아니오'})")
    print()
    print("BUILD_WAVES_DONE")
    print(f"  - {DAG_OUT_PATH.relative_to(REPO_ROOT)}")
    print(f"  - {WAVE_PLAN_OUT_PATH.relative_to(REPO_ROOT)}")
    print(f"  - {WAVE_STATE_OUT_PATH.relative_to(REPO_ROOT)}")
    print(f"  - {MANIFEST_PATH.relative_to(REPO_ROOT)} (wave_id 열 추가)")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except BuildError as e:
        print(f"BUILD_WAVES_FAIL: {e}")
        sys.exit(1)
