#!/usr/bin/env python3
"""
validate_harness.py — Traveler 프로젝트의 "하네스"(CLAUDE.md + Skill + Command 세트) 자체를
검증하는 스크립트. scripts/validate_inputs.py(정본 문서 정합성)와 scripts/audit_tasks.py
(Task 산출물 정합성)와는 별개로, "Agent가 지켜야 할 규칙 체계 자체가 온전히 존재하는가"를
검사한다.

검사 항목(13개):
   1.  CLAUDE.md 존재
   2.  Claude Code Skill 파일 존재(.claude/skills/traveler-project-pipeline/SKILL.md)
   3.  7개 Command 존재(.claude/commands/*.md)
   4.  traveler-screen-route-v1 Marker 존재(CLAUDE.md와 SCREEN_ROUTE_CONTRACT.json 일치)
   5.  D-001 DESIGN 경로 일치(CLAUDE.md ↔ 실제 파일 ↔ DESIGN_MANIFEST.md)
   6.  Screen Contract 경로 일치(CLAUDE.md ↔ 실제 파일)
   7.  Page Owner 5개 규칙 존재
   8.  DB Table 6개 기본 범위 존재
   9.  외부 입력 비저장 규칙 존재
  10.  Playwright Chromium Smoke 규칙 존재
  11.  AUTO_MERGE=false
  12.  AWS_ENABLED=false
  13.  EXCLUDED 보호 규칙 존재

성공 시 `VALIDATE_HARNESS_PASS`를 출력하고 종료 코드 0.
실패 시 문제가 된 파일과 누락된 규칙을 출력하고 종료 코드 1.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

CLAUDE_MD_PATH = REPO_ROOT / "CLAUDE.md"
SKILL_PATH = REPO_ROOT / ".claude" / "skills" / "traveler-project-pipeline" / "SKILL.md"
COMMANDS_DIR = REPO_ROOT / ".claude" / "commands"
CONTRACT_PATH = REPO_ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
DESIGN_MD_PATH = REPO_ROOT / "design-reference" / "D-001" / "DESIGN.md"
DESIGN_MANIFEST_PATH = REPO_ROOT / "design-reference" / "DESIGN_MANIFEST.md"

EXPECTED_COMMANDS = {
    "gen-tasklist.md",
    "gen-task-details.md",
    "audit-tasks.md",
    "prepare-task.md",
    "implement-task.md",
    "run-wave.md",
    "release-check.md",
}
EXPECTED_HARNESS_SCHEMA = "traveler-screen-route-v1"
EXPECTED_DESIGN_PATH = "design-reference/D-001/DESIGN.md"
EXPECTED_SCREEN_CONTRACT = "design-reference/SCREEN_ROUTE_CONTRACT.json"
CANONICAL_DB_TABLES = [
    "USER_PROFILE", "MATE_POST", "MATE_APPLICATION",
    "USER_BLOCK", "REPORT", "OUTBOUND_LINK_SETTING",
]

TOTAL_CHECKS = 13


class Check:
    def __init__(self, n: int, name: str):
        self.n = n
        self.name = name
        self.passed = True
        self.notes: list[str] = []

    def fail(self, msg: str):
        self.passed = False
        self.notes.append(msg)

    def info(self, msg: str):
        self.notes.append(msg)


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8") if path.exists() else ""


def check_1_claude_md(c: Check):
    if not CLAUDE_MD_PATH.exists():
        c.fail(f"[MISSING_FILE] {CLAUDE_MD_PATH.relative_to(REPO_ROOT)}가 없습니다.")
    else:
        c.info(f"{CLAUDE_MD_PATH.relative_to(REPO_ROOT)} 존재 확인")


def check_2_skill_file(c: Check):
    if not SKILL_PATH.exists():
        c.fail(f"[MISSING_FILE] {SKILL_PATH.relative_to(REPO_ROOT)}가 없습니다.")
        return
    text = read(SKILL_PATH)
    if not re.search(r"^name:\s*traveler-project-pipeline\s*$", text, re.MULTILINE):
        c.fail(
            f"[BAD_FRONTMATTER] {SKILL_PATH.relative_to(REPO_ROOT)}의 frontmatter에 "
            "'name: traveler-project-pipeline'이 없습니다."
        )
    else:
        c.info(f"{SKILL_PATH.relative_to(REPO_ROOT)} 존재 및 frontmatter 확인")


def check_3_seven_commands(c: Check):
    if not COMMANDS_DIR.exists():
        c.fail(f"[MISSING_DIR] {COMMANDS_DIR.relative_to(REPO_ROOT)}가 없습니다.")
        return
    actual = {p.name for p in COMMANDS_DIR.glob("*.md")}
    missing = sorted(EXPECTED_COMMANDS - actual)
    extra = sorted(actual - EXPECTED_COMMANDS)
    if missing:
        c.fail(f"[MISSING_COMMAND] 없는 Command 파일: {missing}")
    if len(actual) != 7:
        c.fail(
            f"[COMMAND_COUNT] .claude/commands/*.md 개수가 7개가 아닙니다(실제 {len(actual)}개): "
            f"{sorted(actual)}"
        )
    if not missing and len(actual) == 7:
        c.info(f"7개 Command 전부 존재: {sorted(actual)}")
    if extra:
        c.info(f"[참고] 예상 목록 외 Command 추가로 발견됨(오류 아님): {extra}")


def check_4_harness_marker(c: Check):
    claude_text = read(CLAUDE_MD_PATH)
    m = re.search(r"^HARNESS_SCHEMA=(\S+)\s*$", claude_text, re.MULTILINE)
    if not m:
        c.fail("[MISSING_MARKER] CLAUDE.md에 'HARNESS_SCHEMA=...' 마커가 없습니다.")
    elif m.group(1) != EXPECTED_HARNESS_SCHEMA:
        c.fail(
            f"[MARKER_MISMATCH] CLAUDE.md의 HARNESS_SCHEMA='{m.group(1)}' "
            f"(기대값 '{EXPECTED_HARNESS_SCHEMA}')"
        )
    else:
        c.info(f"CLAUDE.md HARNESS_SCHEMA={m.group(1)} 확인")

    if not CONTRACT_PATH.exists():
        c.fail(f"[MISSING_FILE] {CONTRACT_PATH.relative_to(REPO_ROOT)}가 없습니다.")
        return
    try:
        contract = json.loads(read(CONTRACT_PATH))
    except json.JSONDecodeError as exc:
        c.fail(f"[INVALID_JSON] SCREEN_ROUTE_CONTRACT.json: {exc}")
        return
    schema_version = contract.get("schema_version")
    if schema_version != EXPECTED_HARNESS_SCHEMA:
        c.fail(
            f"[SCHEMA_MISMATCH] SCREEN_ROUTE_CONTRACT.json schema_version='{schema_version}' "
            f"(기대값 '{EXPECTED_HARNESS_SCHEMA}')"
        )
    else:
        c.info(f"SCREEN_ROUTE_CONTRACT.json schema_version={schema_version} 확인(CLAUDE.md와 일치)")


def check_5_design_path(c: Check):
    claude_text = read(CLAUDE_MD_PATH)
    m = re.search(r"^DESIGN_PATH=(\S+)\s*$", claude_text, re.MULTILINE)
    if not m:
        c.fail("[MISSING_MARKER] CLAUDE.md에 'DESIGN_PATH=...' 마커가 없습니다.")
        return
    if m.group(1) != EXPECTED_DESIGN_PATH:
        c.fail(f"[MARKER_MISMATCH] CLAUDE.md DESIGN_PATH='{m.group(1)}' (기대값 '{EXPECTED_DESIGN_PATH}')")

    if not DESIGN_MD_PATH.exists():
        c.fail(f"[MISSING_FILE] {DESIGN_MD_PATH.relative_to(REPO_ROOT)}가 없습니다(DESIGN_PATH 대상 파일).")

    if not DESIGN_MANIFEST_PATH.exists():
        c.fail(f"[MISSING_FILE] {DESIGN_MANIFEST_PATH.relative_to(REPO_ROOT)}가 없습니다.")
    else:
        manifest_text = read(DESIGN_MANIFEST_PATH)
        if EXPECTED_DESIGN_PATH not in manifest_text:
            c.fail(
                f"[MANIFEST_MISMATCH] DESIGN_MANIFEST.md의 Active File이 '{EXPECTED_DESIGN_PATH}'를 "
                "가리키지 않습니다."
            )
        if "LOCKED" not in manifest_text:
            c.fail("[MANIFEST_NOT_LOCKED] DESIGN_MANIFEST.md에 'LOCKED' 상태가 없습니다.")

    if c.passed:
        c.info(f"DESIGN_PATH='{m.group(1)}' — CLAUDE.md/실제 파일/DESIGN_MANIFEST.md 일치")


def check_6_screen_contract_path(c: Check):
    claude_text = read(CLAUDE_MD_PATH)
    m = re.search(r"^SCREEN_CONTRACT=(\S+)\s*$", claude_text, re.MULTILINE)
    if not m:
        c.fail("[MISSING_MARKER] CLAUDE.md에 'SCREEN_CONTRACT=...' 마커가 없습니다.")
        return
    if m.group(1) != EXPECTED_SCREEN_CONTRACT:
        c.fail(
            f"[MARKER_MISMATCH] CLAUDE.md SCREEN_CONTRACT='{m.group(1)}' "
            f"(기대값 '{EXPECTED_SCREEN_CONTRACT}')"
        )
    if not CONTRACT_PATH.exists():
        c.fail(f"[MISSING_FILE] {CONTRACT_PATH.relative_to(REPO_ROOT)}가 없습니다(SCREEN_CONTRACT 대상 파일).")
    if c.passed:
        c.info(f"SCREEN_CONTRACT='{m.group(1)}' — CLAUDE.md/실제 파일 일치")


def check_7_page_owner_rule(c: Check):
    claude_text = read(CLAUDE_MD_PATH)
    skill_text = read(SKILL_PATH)
    claude_ok = bool(re.search(r"Page Owner", claude_text)) and bool(
        re.search(r"PAGE-SCR001~005|정확히 1개", claude_text)
    )
    skill_ok = bool(re.search(r"Page Owner", skill_text)) and bool(re.search(r"정확히 1개", skill_text))
    if not claude_ok:
        c.fail("[MISSING_RULE] CLAUDE.md에 Page Owner 5개(PAGE-SCR001~005) 규칙이 없습니다.")
    if not skill_ok:
        c.fail("[MISSING_RULE] SKILL.md에 Page Owner '정확히 1개' 규칙이 없습니다.")
    if claude_ok and skill_ok:
        c.info("CLAUDE.md·SKILL.md 모두 Page Owner 5개 규칙 확인")


def check_8_db_six_tables(c: Check):
    claude_text = read(CLAUDE_MD_PATH)
    skill_text = read(SKILL_PATH)
    combined = claude_text + "\n" + skill_text

    has_six = bool(re.search(r"정확히\s*6개\s*테이블|6개\s*Table", combined))
    missing_tables = [t for t in CANONICAL_DB_TABLES if t not in combined]

    if not has_six:
        c.fail("[MISSING_RULE] CLAUDE.md/SKILL.md 어디에도 'DB 6개 테이블 제한' 문구가 없습니다.")
    if missing_tables:
        c.fail(f"[MISSING_TABLE_NAMES] 6개 테이블 중 명시되지 않은 것: {missing_tables}")
    if has_six and not missing_tables:
        c.info("DB 6개 테이블(USER_PROFILE/MATE_POST/MATE_APPLICATION/USER_BLOCK/REPORT/OUTBOUND_LINK_SETTING) 규칙 확인")


def check_9_no_external_input_persist(c: Check):
    claude_text = read(CLAUDE_MD_PATH)
    ok = bool(re.search(r"항공·숙소", claude_text)) and bool(
        re.search(r"서버.*보내지 않는다|저장하지 않는다|전달되지 않는다", claude_text)
    )
    if not ok:
        c.fail("[MISSING_RULE] CLAUDE.md에 항공·숙소 입력값 서버/DB 비저장 규칙이 없습니다.")
    else:
        c.info("항공·숙소 외부 입력 비저장 규칙 확인")


def check_10_playwright_chromium_smoke(c: Check):
    claude_text = read(CLAUDE_MD_PATH)
    ok = "Chromium" in claude_text and re.search(r"[Ss]moke", claude_text)
    scope_ok = "PLAYWRIGHT_SCOPE=chromium-smoke" in claude_text
    if not ok:
        c.fail("[MISSING_RULE] CLAUDE.md에 Playwright Chromium Smoke 규칙이 없습니다.")
    if not scope_ok:
        c.fail("[MISSING_MARKER] CLAUDE.md에 'PLAYWRIGHT_SCOPE=chromium-smoke' 마커가 없습니다.")
    if ok and scope_ok:
        c.info("Playwright Chromium Smoke 규칙·마커 확인")


def check_11_auto_merge_false(c: Check):
    claude_text = read(CLAUDE_MD_PATH)
    if not re.search(r"^AUTO_MERGE=false\s*$", claude_text, re.MULTILINE):
        c.fail("[MARKER_MISSING_OR_WRONG] CLAUDE.md에 'AUTO_MERGE=false'가 없습니다.")
    else:
        c.info("AUTO_MERGE=false 확인")


def check_12_aws_enabled_false(c: Check):
    claude_text = read(CLAUDE_MD_PATH)
    if not re.search(r"^AWS_ENABLED=false\s*$", claude_text, re.MULTILINE):
        c.fail("[MARKER_MISSING_OR_WRONG] CLAUDE.md에 'AWS_ENABLED=false'가 없습니다.")
    else:
        c.info("AWS_ENABLED=false 확인")


def check_13_excluded_protection(c: Check):
    claude_text = read(CLAUDE_MD_PATH)
    skill_text = read(SKILL_PATH)
    claude_ok = bool(re.search(r"EXCLUDED.*임의로 구현하지 않는다", claude_text))
    skill_ok = "EXCLUDED" in skill_text and bool(re.search(r"보호", skill_text))
    if not claude_ok:
        c.fail("[MISSING_RULE] CLAUDE.md에 'EXCLUDED 임의 구현 금지' 규칙이 없습니다.")
    if not skill_ok:
        c.fail("[MISSING_RULE] SKILL.md에 EXCLUDED 보호 관련 절이 없습니다.")
    if claude_ok and skill_ok:
        c.info("EXCLUDED 보호 규칙 확인(CLAUDE.md 금지 규칙 + SKILL.md 보호 절)")


def main() -> int:
    checks = [
        (1, "CLAUDE.md 존재", check_1_claude_md),
        (2, "Claude Code Skill 파일 존재", check_2_skill_file),
        (3, "7개 Command 존재", check_3_seven_commands),
        (4, "traveler-screen-route-v1 Marker 존재", check_4_harness_marker),
        (5, "D-001 DESIGN 경로 일치", check_5_design_path),
        (6, "Screen Contract 경로 일치", check_6_screen_contract_path),
        (7, "Page Owner 5개 규칙 존재", check_7_page_owner_rule),
        (8, "DB Table 6개 기본 범위 존재", check_8_db_six_tables),
        (9, "외부 입력 비저장 규칙 존재", check_9_no_external_input_persist),
        (10, "Playwright Chromium Smoke 규칙 존재", check_10_playwright_chromium_smoke),
        (11, "AUTO_MERGE=false", check_11_auto_merge_false),
        (12, "AWS_ENABLED=false", check_12_aws_enabled_false),
        (13, "EXCLUDED 보호 규칙 존재", check_13_excluded_protection),
    ]
    assert len(checks) == TOTAL_CHECKS

    print("=== Traveler Harness Validation ===\n")
    all_notes = []
    failed = 0
    for n, name, fn in checks:
        c = Check(n, name)
        fn(c)
        status = "PASS" if c.passed else "FAIL"
        if not c.passed:
            failed += 1
        print(f"[{status}] {n}. {name}")
        for note in c.notes:
            print(f"       - {note}")

    print()
    if failed:
        print(f"VALIDATE_HARNESS_FAIL ({failed}/{TOTAL_CHECKS}개 검사 실패)")
        return 1

    print(f"VALIDATE_HARNESS_PASS (검사 수: {TOTAL_CHECKS})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
