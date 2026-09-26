#!/usr/bin/env python3
"""
check_screen_contract.py — SCREEN_ROUTE_CONTRACT.json/TASK_MANIFEST.csv/src/app 실제 트리를
대조해 "정확히 5개 고정 화면" 계약이 지켜지는지 검사한다.

입력:
  - design-reference/SCREEN_ROUTE_CONTRACT.json (Screen·Route·Page Entry 정본)
  - TASKS/TASK_MANIFEST.csv                     (Page Owner 등 Task 배정 현황)
  - src/app 디렉터리                             (--mode=ci/--mode=release에서만 실제 파일 확인)

실행 모드(--mode, 기본값 plan):
  - plan    : Page Owner 배정과 Route "계획"만 검사한다(Contract·Manifest 문서만 본다).
  - ci      : plan 검사 + 실제 구현된 Page 파일·기술 경로가 계약과 일치하는지 확인한다.
  - release : ci 검사 + docs/preview-checks/SCR-001.md ~ SCR-005.md Preview Checkpoint
              기록 존재 여부를 더한다.

고정 화면 5개:
  SCR-001 `/`, SCR-002 `/about`, SCR-003 `/travel-tools`, SCR-004 `/mates`, SCR-005 `/account`

허용 기술 경로: `/auth/callback`, `/api/**`, `not-found`(및 짝을 이루는 error boundary)
  — 이 경로들은 5개 화면 수에 포함하지 않는다.

검사(6개):
  1. 고정 화면 5개가 정확히 존재한다.
  2. 각 화면 Page Owner Task가 정확히 하나다.
  3. 기술 경로를 사용자 화면으로 세지 않는다.
  4. 여행지 상세·안전정보를 새 Page로 만들지 않았다(SCR-001 Drawer로 통합되어야 함).
  5. SCR-003 Task가 여행 입력(항공·숙소)과 동행 작성 요구를 모두 포함한다.
  6. (release 전용) docs/preview-checks/SCR-001.md ~ SCR-005.md가 존재한다.

오류는 파일·화면 ID·수정 힌트를 포함해 출력한다. 하나라도 실패하면 exit 1.
"""
from __future__ import annotations

import argparse
import csv
import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
CONTRACT_PATH = REPO_ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
MANIFEST_PATH = REPO_ROOT / "TASKS" / "TASK_MANIFEST.csv"
SRC_APP_DIR = REPO_ROOT / "src" / "app"
PREVIEW_CHECKS_DIR = REPO_ROOT / "docs" / "preview-checks"

FIXED_SCREENS = {
    "SCR-001": "/",
    "SCR-002": "/about",
    "SCR-003": "/travel-tools",
    "SCR-004": "/mates",
    "SCR-005": "/account",
}
SCREEN_ORDER = ["SCR-001", "SCR-002", "SCR-003", "SCR-004", "SCR-005"]

# 허용 기술 경로 패턴. not_found/error_boundary는 SCREEN_ROUTE_CONTRACT.json의
# technical_routes에서 항상 짝으로 등장하므로(§ file: not-found.tsx / error.tsx) 같은
# "not-found" 허용 항목 아래 함께 취급한다.
ALLOWED_TECHNICAL_TYPES = {"auth_callback", "api_route", "not_found", "error_boundary"}

FORBIDDEN_ROUTE_SEGMENTS = ["destinations", "safety"]


class Check:
    def __init__(self, n: int, name: str):
        self.n = n
        self.name = name
        self.ok = True
        self.errors: list[str] = []
        self.infos: list[str] = []

    def fail(self, *, file: str, screen: str, message: str, hint: str):
        self.ok = False
        self.errors.append(f"file={file} | screen={screen} | {message} | 수정 힌트: {hint}")

    def info(self, msg: str):
        self.infos.append(msg)


def load_contract() -> dict:
    if not CONTRACT_PATH.exists():
        print(f"BUILD_ERROR: {CONTRACT_PATH}가 없습니다.")
        sys.exit(1)
    return json.loads(CONTRACT_PATH.read_text(encoding="utf-8"))


def load_manifest() -> list[dict]:
    if not MANIFEST_PATH.exists():
        print(f"BUILD_ERROR: {MANIFEST_PATH}가 없습니다. 먼저 scripts/audit_tasks.py를 실행하세요.")
        sys.exit(1)
    with open(MANIFEST_PATH, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


# ------------------------------------------------------------------ checks


def check_1_fixed_five_screens(contract: dict, c: Check):
    screens = contract.get("screens", [])
    by_id = {s["screen_id"]: s for s in screens}

    if len(screens) != 5:
        c.fail(
            file=str(CONTRACT_PATH.relative_to(REPO_ROOT)),
            screen="—",
            message=f"screens 배열 길이={len(screens)}(기대값 5)",
            hint="SCREEN_ROUTE_CONTRACT.json의 screens를 정확히 5개(SCR-001~005)로 유지한다.",
        )

    missing = [sid for sid in SCREEN_ORDER if sid not in by_id]
    extra = [sid for sid in by_id if sid not in FIXED_SCREENS]
    if missing:
        c.fail(
            file=str(CONTRACT_PATH.relative_to(REPO_ROOT)),
            screen=", ".join(missing),
            message="고정 화면 ID 누락",
            hint=f"{missing}를 screens 배열에 추가한다.",
        )
    if extra:
        c.fail(
            file=str(CONTRACT_PATH.relative_to(REPO_ROOT)),
            screen=", ".join(extra),
            message="고정 5개 화면 밖의 Screen ID 존재",
            hint="SCR-001~005 외의 Screen을 추가하지 않는다(6번째 화면 금지).",
        )

    for sid, expected_route in FIXED_SCREENS.items():
        s = by_id.get(sid)
        if s is None:
            continue
        if s.get("route") != expected_route:
            c.fail(
                file=str(CONTRACT_PATH.relative_to(REPO_ROOT)),
                screen=sid,
                message=f"route='{s.get('route')}'(기대값 '{expected_route}')",
                hint=f"{sid}의 route를 '{expected_route}'로 고정한다.",
            )

    if not c.errors:
        c.info(f"고정 화면 5개 확인: {list(FIXED_SCREENS.items())}")


def check_2_page_owner_per_screen(manifest: list[dict], contract: dict, mode: str, c: Check):
    contract_by_screen = {s["screen_id"]: s for s in contract.get("screens", [])}
    owners_by_screen: dict[str, list[dict]] = {sid: [] for sid in SCREEN_ORDER}
    for row in manifest:
        if row.get("category") == "PAGE_OWNER":
            screen = (row.get("screen") or "").strip()
            if screen in owners_by_screen:
                owners_by_screen[screen].append(row)

    for sid in SCREEN_ORDER:
        owners = owners_by_screen[sid]
        if len(owners) != 1:
            c.fail(
                file=str(MANIFEST_PATH.relative_to(REPO_ROOT)),
                screen=sid,
                message=f"Page Owner Task 수={len(owners)}(기대값 1): {[o['task_id'] for o in owners]}",
                hint=f"{sid}에 category=PAGE_OWNER인 Task를 정확히 1개만 배정한다.",
            )
            continue

        owner = owners[0]
        ref = contract_by_screen.get(sid)
        if ref is None:
            continue
        if owner.get("route") != ref["route"]:
            c.fail(
                file=owner.get("detail_file", "TASKS/TASK_MANIFEST.csv"),
                screen=sid,
                message=f"{owner['task_id']}의 route='{owner.get('route')}' != Contract route='{ref['route']}'",
                hint="Task Manifest의 route 열을 SCREEN_ROUTE_CONTRACT.json과 일치시킨다.",
            )
        if owner.get("page_entry") != ref["page_entry"]:
            c.fail(
                file=owner.get("detail_file", "TASKS/TASK_MANIFEST.csv"),
                screen=sid,
                message=f"{owner['task_id']}의 page_entry='{owner.get('page_entry')}' != Contract page_entry='{ref['page_entry']}'",
                hint="Task Manifest의 page_entry 열을 SCREEN_ROUTE_CONTRACT.json과 일치시킨다.",
            )

        if mode in ("ci", "release"):
            page_file = REPO_ROOT / ref["page_entry"]
            if not page_file.exists():
                c.fail(
                    file=ref["page_entry"],
                    screen=sid,
                    message="Page Entry 파일이 실제로 존재하지 않음",
                    hint=f"{owner['task_id']}를 구현해 {ref['page_entry']}를 생성한다(mode=ci는 실제 구현을 전제로 함).",
                )

    if not c.errors:
        c.info("5개 화면 모두 Page Owner Task 정확히 1개, Route/Page Entry 일치")


def check_3_technical_routes_not_counted(manifest: list[dict], contract: dict, mode: str, c: Check):
    technical_routes = contract.get("technical_routes", [])
    bad_types = [t for t in technical_routes if t.get("type") not in ALLOWED_TECHNICAL_TYPES]
    if bad_types:
        for t in bad_types:
            c.fail(
                file=str(CONTRACT_PATH.relative_to(REPO_ROOT)),
                screen="—",
                message=f"허용되지 않은 기술 경로 유형: {t.get('type')}({t.get('route')})",
                hint="기술 경로는 /auth/callback, /api/**, not-found(및 error boundary)만 허용한다.",
            )

    screen_routes = set(FIXED_SCREENS.values())
    for t in technical_routes:
        route = t.get("route", "")
        if route in screen_routes:
            c.fail(
                file=str(CONTRACT_PATH.relative_to(REPO_ROOT)),
                screen="—",
                message=f"기술 경로 '{route}'가 고정 화면 Route와 겹침",
                hint="기술 경로와 화면 Route가 겹치지 않게 한다.",
            )

    # Task Manifest에서 화면(SCR-00X)으로 배정된 Task의 route가 기술 경로면 오분류다.
    technical_route_strings = {t.get("route") for t in technical_routes if t.get("route") != "*"}
    for row in manifest:
        screen = (row.get("screen") or "").strip()
        route = (row.get("route") or "").strip()
        if screen in FIXED_SCREENS and route and route != FIXED_SCREENS.get(screen):
            if route in technical_route_strings or route.startswith("/api/") or route == "/auth/callback":
                c.fail(
                    file=row.get("detail_file", "TASKS/TASK_MANIFEST.csv"),
                    screen=screen,
                    message=f"{row['task_id']}가 화면 {screen}에 배정되어 있지만 route='{route}'는 기술 경로다",
                    hint="기술 경로 Task는 screen 열을 '—'로 두고 화면 5개 중 하나로 세지 않는다.",
                )

    if mode in ("ci", "release"):
        # 실제 src/app 트리에서 기술 경로 파일이 존재하되, 그 아래에 별도 page.tsx(=6번째
        # 사용자 화면)를 만들지 않았는지 확인한다.
        technical_dirs = [
            SRC_APP_DIR / "auth" / "callback",
            SRC_APP_DIR / "api",
        ]
        for d in technical_dirs:
            if not d.exists():
                continue
            for page in d.rglob("page.tsx"):
                c.fail(
                    file=str(page.relative_to(REPO_ROOT)),
                    screen="—",
                    message="기술 경로 디렉터리 안에 page.tsx(사용자 화면)가 존재함",
                    hint="기술 경로에는 route.ts만 두고 page.tsx를 만들지 않는다(6번째 화면 금지).",
                )

    if not c.errors:
        c.info(f"기술 경로 {len(technical_routes)}건 모두 화면 수에서 제외됨 확인")


def check_4_no_new_destination_safety_pages(contract: dict, mode: str, c: Check):
    # API 기술 경로(예: /api/destinations)는 데이터 조회용이라 정당하다 — 여기서는
    # 사용자에게 노출되는 "화면(Page)" Route만 검사 대상으로 한다.
    all_routes = [s["route"] for s in contract.get("screens", [])]
    for route in all_routes:
        for seg in FORBIDDEN_ROUTE_SEGMENTS:
            if f"/{seg}" in route or route.startswith(f"/{seg}"):
                c.fail(
                    file=str(CONTRACT_PATH.relative_to(REPO_ROOT)),
                    screen="—",
                    message=f"금지된 Route 세그먼트 '{seg}'가 포함된 Route 정의: {route}",
                    hint="여행지 상세/안전정보는 SCR-001의 Drawer/Modal로 통합한다(별도 Route 생성 금지, docs/06_SRS_UIUX_REVISED.md §1).",
                )

    if mode in ("ci", "release") and SRC_APP_DIR.exists():
        for seg in FORBIDDEN_ROUTE_SEGMENTS:
            seg_dir = SRC_APP_DIR / seg
            if not seg_dir.exists():
                continue
            pages = list(seg_dir.rglob("page.tsx"))
            if pages:
                for page in pages:
                    c.fail(
                        file=str(page.relative_to(REPO_ROOT)),
                        screen="SCR-001",
                        message=f"금지된 신규 Page 발견(src/app/{seg}/**)",
                        hint="이 Page를 삭제하고 SCR-001의 Drawer/Modal 안에서 동일 콘텐츠를 조립한다.",
                    )

    if not c.errors:
        c.info("여행지 상세·안전정보 전용 신규 Page 없음 확인")


def check_5_scr003_covers_travel_input_and_mate_compose(manifest: list[dict], c: Check):
    scr003_rows = [r for r in manifest if "SCR-003" in (r.get("screen") or "")]
    if not scr003_rows:
        c.fail(
            file=str(MANIFEST_PATH.relative_to(REPO_ROOT)),
            screen="SCR-003",
            message="SCR-003에 배정된 Task가 없음",
            hint="SCR-003 Task(항공·숙소 Form, 동행 작성 Form 등)를 Task Manifest에 배정한다.",
        )
        return

    joined = " ".join(f"{r.get('title', '')} {r.get('task_id', '')}" for r in scr003_rows)
    has_travel_input = bool(re.search(r"항공|숙소|호텔", joined))
    has_mate_compose = bool(re.search(r"동행", joined))

    if not has_travel_input:
        c.fail(
            file=str(MANIFEST_PATH.relative_to(REPO_ROOT)),
            screen="SCR-003",
            message="여행 입력(항공·숙소) 관련 Task를 찾지 못함",
            hint="COMP-SCR003-FLIGHT-FORM/HOTEL-FORM 같은 Task가 SCR-003에 배정되어 있는지 확인한다.",
        )
    if not has_mate_compose:
        c.fail(
            file=str(MANIFEST_PATH.relative_to(REPO_ROOT)),
            screen="SCR-003",
            message="동행 작성 관련 Task를 찾지 못함",
            hint="COMP-SCR003-MATE-COMPOSE 같은 Task가 SCR-003에 배정되어 있는지 확인한다.",
        )

    if not c.errors:
        c.info(f"SCR-003 Task {len(scr003_rows)}건이 여행 입력·동행 작성 요구를 모두 포함")


def check_6_preview_checkpoints_exist(c: Check):
    for sid in SCREEN_ORDER:
        p = PREVIEW_CHECKS_DIR / f"{sid}.md"
        if not p.exists():
            c.fail(
                file=str(p.relative_to(REPO_ROOT)),
                screen=sid,
                message="Preview Checkpoint 기록 파일이 없음",
                hint=f"{sid} Wave의 사람 Preview 확인 결과를 {p.relative_to(REPO_ROOT)}에 기록한다"
                     "(run-wave.md §0 Preview Checkpoint 개념 참고).",
            )
    if not c.errors:
        c.info(f"docs/preview-checks/SCR-001.md ~ SCR-005.md 5개 모두 존재")


# --------------------------------------------------------------------- main


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--mode",
        choices=["plan", "ci", "release"],
        default="plan",
        help="plan(기본값)=계획 검사만, ci=실제 파일 존재까지 검사, release=ci + Preview Checkpoint 기록",
    )
    args = parser.parse_args()
    mode = args.mode

    contract = load_contract()
    manifest = load_manifest()

    checks: list[Check] = []

    c1 = Check(1, "고정 화면 5개 존재"); check_1_fixed_five_screens(contract, c1); checks.append(c1)
    c2 = Check(2, "화면별 Page Owner 정확히 1개"); check_2_page_owner_per_screen(manifest, contract, mode, c2); checks.append(c2)
    c3 = Check(3, "기술 경로를 화면으로 세지 않음"); check_3_technical_routes_not_counted(manifest, contract, mode, c3); checks.append(c3)
    c4 = Check(4, "여행지 상세·안전정보 신규 Page 금지"); check_4_no_new_destination_safety_pages(contract, mode, c4); checks.append(c4)
    c5 = Check(5, "SCR-003 여행 입력·동행 작성 요구 포함"); check_5_scr003_covers_travel_input_and_mate_compose(manifest, c5); checks.append(c5)
    checks_total = 5

    if mode == "release":
        c6 = Check(6, "Preview Checkpoint 기록 존재(release 전용)")
        check_6_preview_checkpoints_exist(c6)
        checks.append(c6)
        checks_total = 6

    print(f"MODE: {mode}")
    for c in checks:
        status = "PASS" if c.ok else "FAIL"
        print(f"[{status}] {c.n}. {c.name}")
        for info in c.infos:
            print(f"    - {info}")
        for err in c.errors:
            print(f"    - {err}")

    failed = [c for c in checks if not c.ok]
    print()
    if failed:
        print(f"SCREEN_CONTRACT_FAIL ({len(failed)}/{checks_total}개 검사 실패, mode={mode})")
        return 1

    print(f"SCREEN_CONTRACT_PASS (검사 수: {checks_total}, mode={mode})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
