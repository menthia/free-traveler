#!/usr/bin/env python3
"""
validate_inputs.py — Traveler Task 생성 Pipeline의 입력 검증 스크립트.

Task List/상세 파일을 생성하기 전에 반드시 이 스크립트를 통과해야 한다
(.claude/skills/traveler-project-pipeline/SKILL.md, .claude/commands/gen-tasklist.md 참고).

검사 항목(11개):
  1.  package.json에 Next.js 의존성이 있다.
  2.  src/app/page.tsx와 src/app/layout.tsx가 존재한다.
  3.  PRD·SRS·Project Scope·UI 문서가 존재한다.
  4.  D-001 DESIGN.md와 LOCKED Manifest가 존재한다.
  5.  SCREEN_ROUTE_CONTRACT.json을 JSON으로 파싱할 수 있다.
  6.  Screen 수가 정확히 5개다.
  7.  SCR-001~005가 모두 존재한다.
  8.  Route가 `/`, `/about`, `/travel-tools`, `/mates`, `/account`다.
  9.  Page Entry가 실제 Next.js App Router 경로 형식이다.
  10. PROJECT_SCOPE.md에 REQ-FUNC 80개와 REQ-NF 34개가 모두 등장한다.
  11. AWS·EC2가 활성 기술로 정의되지 않았다.

검사 성공 시 `VALIDATE_INPUTS_PASS`와 검사 수를 출력하고 종료 코드 0으로 끝난다.
검사 실패 시 누락된 파일·Screen·Requirement ID를 출력하고 종료 코드 1로 끝난다.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

PACKAGE_JSON_PATH = REPO_ROOT / "package.json"
PAGE_TSX_PATH = REPO_ROOT / "src" / "app" / "page.tsx"
LAYOUT_TSX_PATH = REPO_ROOT / "src" / "app" / "layout.tsx"
SRC_APP_DIR = REPO_ROOT / "src" / "app"

DOC_PATHS = {
    "PRD": [REPO_ROOT / "docs" / "01_PRD.md"],
    "SRS": [REPO_ROOT / "docs" / "02_SRS_BASELINE.md"],
    "PROJECT_SCOPE": [REPO_ROOT / "docs" / "PROJECT_SCOPE.md"],
    "UI_DOCS": [
        REPO_ROOT / "docs" / "03_UI_COVERAGE_ANALYSIS.md",
        REPO_ROOT / "docs" / "04_UIUX_PLAN.md",
        REPO_ROOT / "docs" / "05_UIUX_APPROVED.md",
        REPO_ROOT / "docs" / "06_SRS_UIUX_REVISED.md",
        REPO_ROOT / "docs" / "UIUX_TRACEABILITY.md",
        REPO_ROOT / "design-reference" / "UI_CONTRACT.md",
    ],
}

DESIGN_MD_PATH = REPO_ROOT / "design-reference" / "D-001" / "DESIGN.md"
DESIGN_MANIFEST_PATH = REPO_ROOT / "design-reference" / "DESIGN_MANIFEST.md"
CONTRACT_PATH = REPO_ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
PROJECT_SCOPE_PATH = REPO_ROOT / "docs" / "PROJECT_SCOPE.md"

EXPECTED_SCREEN_IDS = ["SCR-001", "SCR-002", "SCR-003", "SCR-004", "SCR-005"]
EXPECTED_ROUTES = {"/", "/about", "/travel-tools", "/mates", "/account"}
PAGE_ENTRY_RE = re.compile(r"^src/app(/[A-Za-z0-9_-]+)*/page\.tsx$")

TOTAL_CHECKS = 11


class Check:
    def __init__(self, number: int, name: str):
        self.number = number
        self.name = name
        self.passed = True
        self.details: list[str] = []

    def fail(self, detail: str):
        self.passed = False
        self.details.append(detail)


def check_1_nextjs_dependency(results: list[Check]):
    c = Check(1, "package.json에 Next.js 의존성이 있다")
    if not PACKAGE_JSON_PATH.exists():
        c.fail(f"[MISSING_FILE] {PACKAGE_JSON_PATH.relative_to(REPO_ROOT)}")
        results.append(c)
        return
    try:
        pkg = json.loads(PACKAGE_JSON_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        c.fail(f"[INVALID_JSON] package.json: {exc}")
        results.append(c)
        return
    deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
    if "next" not in deps:
        c.fail("[MISSING_DEPENDENCY] package.json에 'next' 의존성이 없습니다.")
    results.append(c)


def check_2_app_router_entrypoints(results: list[Check]):
    c = Check(2, "src/app/page.tsx와 src/app/layout.tsx가 존재한다")
    if not PAGE_TSX_PATH.exists():
        c.fail(f"[MISSING_FILE] {PAGE_TSX_PATH.relative_to(REPO_ROOT)}")
    if not LAYOUT_TSX_PATH.exists():
        c.fail(f"[MISSING_FILE] {LAYOUT_TSX_PATH.relative_to(REPO_ROOT)}")
    results.append(c)


def check_3_core_docs_exist(results: list[Check]):
    c = Check(3, "PRD·SRS·Project Scope·UI 문서가 존재한다")
    for _label, paths in DOC_PATHS.items():
        for p in paths:
            if not p.exists():
                c.fail(f"[MISSING_FILE] {p.relative_to(REPO_ROOT)}")
    results.append(c)


def check_4_design_locked(results: list[Check]):
    c = Check(4, "D-001 DESIGN.md와 LOCKED Manifest가 존재한다")
    if not DESIGN_MD_PATH.exists():
        c.fail(f"[MISSING_FILE] {DESIGN_MD_PATH.relative_to(REPO_ROOT)}")
    if not DESIGN_MANIFEST_PATH.exists():
        c.fail(f"[MISSING_FILE] {DESIGN_MANIFEST_PATH.relative_to(REPO_ROOT)}")
    else:
        text = DESIGN_MANIFEST_PATH.read_text(encoding="utf-8")
        if "D-001" not in text:
            c.fail("[MANIFEST_MISMATCH] DESIGN_MANIFEST.md에 'D-001'이 없습니다.")
        if "LOCKED" not in text:
            c.fail("[MANIFEST_NOT_LOCKED] DESIGN_MANIFEST.md에 'LOCKED' 상태가 없습니다.")
    results.append(c)


def check_5_contract_json_parsable(results: list[Check]) -> dict | None:
    c = Check(5, "SCREEN_ROUTE_CONTRACT.json을 JSON으로 파싱할 수 있다")
    if not CONTRACT_PATH.exists():
        c.fail(f"[MISSING_FILE] {CONTRACT_PATH.relative_to(REPO_ROOT)}")
        results.append(c)
        return None
    try:
        data = json.loads(CONTRACT_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        c.fail(f"[INVALID_JSON] SCREEN_ROUTE_CONTRACT.json: {exc}")
        results.append(c)
        return None
    results.append(c)
    return data


def check_6_screen_count(results: list[Check], contract: dict | None):
    c = Check(6, "Screen 수가 정확히 5개다")
    if contract is None:
        c.fail("[NO_CONTRACT] SCREEN_ROUTE_CONTRACT.json을 읽지 못해 검사할 수 없습니다.")
        results.append(c)
        return
    screens = contract.get("screens", [])
    if len(screens) != 5:
        c.fail(f"[SCREEN_COUNT] 실제 Screen 수: {len(screens)}개 (기대값 5)")
    results.append(c)


def check_7_screen_ids(results: list[Check], contract: dict | None):
    c = Check(7, "SCR-001~005가 모두 존재한다")
    if contract is None:
        c.fail("[NO_CONTRACT] SCREEN_ROUTE_CONTRACT.json을 읽지 못해 검사할 수 없습니다.")
        results.append(c)
        return
    actual_ids = {s.get("screen_id") for s in contract.get("screens", [])}
    missing = [sid for sid in EXPECTED_SCREEN_IDS if sid not in actual_ids]
    extra = sorted(actual_ids - set(EXPECTED_SCREEN_IDS))
    if missing:
        c.fail(f"[MISSING_SCREEN] 누락된 Screen: {missing}")
    if extra:
        c.fail(f"[UNEXPECTED_SCREEN] SCR-001~005 밖의 Screen: {extra}")
    results.append(c)


def check_8_routes(results: list[Check], contract: dict | None):
    c = Check(8, "Route가 /, /about, /travel-tools, /mates, /account다")
    if contract is None:
        c.fail("[NO_CONTRACT] SCREEN_ROUTE_CONTRACT.json을 읽지 못해 검사할 수 없습니다.")
        results.append(c)
        return
    actual_routes = {s.get("route") for s in contract.get("screens", [])}
    missing = sorted(EXPECTED_ROUTES - actual_routes)
    extra = sorted(actual_routes - EXPECTED_ROUTES)
    if missing:
        c.fail(f"[MISSING_ROUTE] 누락된 Route: {missing}")
    if extra:
        c.fail(f"[UNEXPECTED_ROUTE] 정의되지 않은 Route: {extra}")
    results.append(c)


def check_9_page_entry_format(results: list[Check], contract: dict | None):
    c = Check(9, "Page Entry가 실제 Next.js App Router 경로 형식이다")
    if contract is None:
        c.fail("[NO_CONTRACT] SCREEN_ROUTE_CONTRACT.json을 읽지 못해 검사할 수 없습니다.")
        results.append(c)
        return
    for s in contract.get("screens", []):
        entry = s.get("page_entry", "")
        if not PAGE_ENTRY_RE.match(entry):
            c.fail(
                f"[INVALID_PAGE_ENTRY] {s.get('screen_id')}의 page_entry '{entry}'가 "
                "'src/app/**/page.tsx' 형식이 아닙니다."
            )
    results.append(c)


def check_10_requirement_ids_in_project_scope(results: list[Check]):
    c = Check(10, "PROJECT_SCOPE.md에 REQ-FUNC 80개와 REQ-NF 34개가 모두 등장한다")
    if not PROJECT_SCOPE_PATH.exists():
        c.fail(f"[MISSING_FILE] {PROJECT_SCOPE_PATH.relative_to(REPO_ROOT)}")
        results.append(c)
        return

    text = PROJECT_SCOPE_PATH.read_text(encoding="utf-8")
    found_func = set(re.findall(r"REQ-FUNC-\d{3}", text))
    found_nf = set(re.findall(r"REQ-NF-\d{3}", text))

    expected_func = {f"REQ-FUNC-{i:03d}" for i in range(1, 81)}
    expected_nf = {f"REQ-NF-{i:03d}" for i in range(1, 35)}

    missing_func = sorted(expected_func - found_func)
    missing_nf = sorted(expected_nf - found_nf)

    if missing_func:
        c.fail(
            f"[MISSING_REQUIREMENT] REQ-FUNC 누락 {len(missing_func)}개: "
            f"{missing_func[:10]}{' ...' if len(missing_func) > 10 else ''}"
        )
    if missing_nf:
        c.fail(
            f"[MISSING_REQUIREMENT] REQ-NF 누락 {len(missing_nf)}개: "
            f"{missing_nf[:10]}{' ...' if len(missing_nf) > 10 else ''}"
        )
    results.append(c)


def check_11_no_active_aws_ec2(results: list[Check]):
    c = Check(11, "AWS·EC2가 활성 기술로 정의되지 않았다")

    # package.json 의존성에 AWS 관련 패키지가 없어야 한다.
    if PACKAGE_JSON_PATH.exists():
        try:
            pkg = json.loads(PACKAGE_JSON_PATH.read_text(encoding="utf-8"))
            deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
            aws_deps = [d for d in deps if "aws" in d.lower()]
            if aws_deps:
                c.fail(f"[ACTIVE_AWS_DEPENDENCY] package.json에 AWS 관련 의존성: {aws_deps}")
        except json.JSONDecodeError:
            pass  # check_1에서 이미 보고됨

    # SCREEN_ROUTE_CONTRACT.json 어디에도 AWS/EC2가 등장하면 안 된다(순수 Route 계약).
    if CONTRACT_PATH.exists():
        contract_text = CONTRACT_PATH.read_text(encoding="utf-8")
        if re.search(r"\bAWS\b|\bEC2\b", contract_text, re.IGNORECASE):
            c.fail("[ACTIVE_AWS_REFERENCE] SCREEN_ROUTE_CONTRACT.json에 AWS/EC2 참조가 있습니다.")

    # PROJECT_SCOPE.md에서는 "제외 기능" 섹션 밖에 AWS/EC2가 등장하면 활성 기술로 간주해 실패 처리한다.
    if PROJECT_SCOPE_PATH.exists():
        text = PROJECT_SCOPE_PATH.read_text(encoding="utf-8")
        sections = re.split(r"(?m)^##\s+", text)[1:]
        for section in sections:
            header_line = section.splitlines()[0] if section.splitlines() else ""
            is_excluded_section = "제외" in header_line
            if is_excluded_section:
                continue
            if re.search(r"\bAWS\b|\bEC2\b", section, re.IGNORECASE):
                c.fail(
                    f"[ACTIVE_AWS_REFERENCE] PROJECT_SCOPE.md의 '{header_line.strip()}' "
                    "섹션(제외 목록이 아님)에 AWS/EC2가 언급되어 활성 기술로 오인될 수 있습니다."
                )

    results.append(c)


def main() -> int:
    results: list[Check] = []

    check_1_nextjs_dependency(results)
    check_2_app_router_entrypoints(results)
    check_3_core_docs_exist(results)
    check_4_design_locked(results)
    contract = check_5_contract_json_parsable(results)
    check_6_screen_count(results, contract)
    check_7_screen_ids(results, contract)
    check_8_routes(results, contract)
    check_9_page_entry_format(results, contract)
    check_10_requirement_ids_in_project_scope(results)
    check_11_no_active_aws_ec2(results)

    assert len(results) == TOTAL_CHECKS, f"내부 오류: 검사 {len(results)}개 실행됨(기대값 {TOTAL_CHECKS})"

    # 참고용 부가 산출물: src/app 파일 스냅샷(있으면 gen-tasklist/gen-task-details가 활용).
    if SRC_APP_DIR.exists():
        files = sorted(
            str(p.relative_to(REPO_ROOT)) for p in SRC_APP_DIR.rglob("*") if p.is_file()
        )
        snapshot_path = REPO_ROOT / "docs" / "tasks" / "_src_tree_snapshot.json"
        snapshot_path.parent.mkdir(parents=True, exist_ok=True)
        snapshot_path.write_text(
            json.dumps({"src_app_files": files}, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )

    print("=== Traveler Task Pipeline — Input Validation ===\n")
    failed = [c for c in results if not c.passed]

    for c in results:
        status = "PASS" if c.passed else "FAIL"
        print(f"[{status}] {c.number}. {c.name}")
        for d in c.details:
            print(f"       - {d}")

    print()
    if failed:
        print(f"VALIDATE_INPUTS_FAIL ({len(failed)}/{TOTAL_CHECKS}개 검사 실패)")
        return 1

    print(f"VALIDATE_INPUTS_PASS (검사 수: {TOTAL_CHECKS})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
