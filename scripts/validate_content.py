#!/usr/bin/env python3
"""
validate_content.py — 여행지/안전정보 정적 콘텐츠의 완전성·수량을 검증한다.

관리자 CRUD UI 대신 CI에서 실행하는 검증 스크립트로 대체한다(PROJECT_SCOPE.md §3).

입력(코드로 직접 읽지 않고, Node/tsx로 TypeScript 데이터 모듈을 평가해 JSON으로 덤프받는다):
  - src/data/destinations.ts
  - src/data/safety.ts

검사:
  1. 국내 여행지 10곳 이상
  2. 해외 여행지 15개국 이상 / 30개 도시 이상
  3. 안전정보 국가 수 == 여행지의 해외 국가 수(커버리지 100%)
  4. 각 여행지 필수 필드: 소개 300자 이상, 명소 5개 이상, 음식 3개 이상, 에티켓 3개 이상,
     출처 1개 이상, 이미지 alt 텍스트 존재

실패 시 누락 목록을 출력하고 종료 코드 1로 끝난다(규칙 8: 자동 수정하지 않는다).
"""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DESTINATIONS_TS = REPO_ROOT / "src" / "data" / "destinations.ts"
SAFETY_TS = REPO_ROOT / "src" / "data" / "safety.ts"

MIN_DOMESTIC = 10
MIN_OVERSEAS_COUNTRIES = 15
MIN_OVERSEAS_CITIES = 30
MIN_INTRO_LEN = 300
MIN_ATTRACTIONS = 5
MIN_FOOD = 3
MIN_ETIQUETTE = 3
MIN_SOURCES = 1


class ValidationError(Exception):
    pass


def load_ts_data_as_json() -> dict:
    """Node(tsx)로 destinations.ts/safety.ts를 평가해 필요한 배열을 JSON으로 받는다."""
    if not DESTINATIONS_TS.exists():
        raise ValidationError(f"{DESTINATIONS_TS}가 없습니다. DATA-DESTINATIONS Task를 먼저 완료하세요.")
    if not SAFETY_TS.exists():
        raise ValidationError(f"{SAFETY_TS}가 없습니다. DATA-SAFETY Task를 먼저 완료하세요.")

    script = f"""
import {{ DESTINATIONS }} from "{DESTINATIONS_TS.as_posix()}";
import {{ COUNTRY_SAFETY_INFO }} from "{SAFETY_TS.as_posix()}";
console.log(JSON.stringify({{
  destinations: DESTINATIONS,
  safetyCountryIds: COUNTRY_SAFETY_INFO.map((s) => s.id),
}}));
"""
    try:
        proc = subprocess.run(
            ["npx", "tsx", "-e", script],
            cwd=REPO_ROOT,
            capture_output=True,
            text=True,
            timeout=60,
            check=False,
        )
    except FileNotFoundError as e:
        raise ValidationError(f"npx/tsx 실행 실패: {e}") from e

    if proc.returncode != 0:
        raise ValidationError(f"TypeScript 데이터 로드 실패(tsx 실행 오류):\n{proc.stderr}")

    stdout = proc.stdout.strip().splitlines()
    if not stdout:
        raise ValidationError("tsx 실행 결과가 비어 있습니다.")
    # tsx가 경고를 함께 출력할 수 있으므로 JSON으로 파싱되는 마지막 줄을 사용한다.
    for line in reversed(stdout):
        try:
            return json.loads(line)
        except json.JSONDecodeError:
            continue
    raise ValidationError("tsx 실행 결과에서 JSON을 찾지 못했습니다:\n" + "\n".join(stdout))


def check_destination_fields(dest: dict) -> list[str]:
    errors = []
    did = dest.get("id", "(id 없음)")
    if len(dest.get("intro", "")) < MIN_INTRO_LEN:
        errors.append(f"{did}: intro {len(dest.get('intro', ''))}자 (<{MIN_INTRO_LEN})")
    if len(dest.get("attractions", [])) < MIN_ATTRACTIONS:
        errors.append(f"{did}: attractions {len(dest.get('attractions', []))}개 (<{MIN_ATTRACTIONS})")
    if len(dest.get("food", [])) < MIN_FOOD:
        errors.append(f"{did}: food {len(dest.get('food', []))}개 (<{MIN_FOOD})")
    if len(dest.get("etiquette", [])) < MIN_ETIQUETTE:
        errors.append(f"{did}: etiquette {len(dest.get('etiquette', []))}개 (<{MIN_ETIQUETTE})")
    if len(dest.get("sources", [])) < MIN_SOURCES:
        errors.append(f"{did}: sources {len(dest.get('sources', []))}개 (<{MIN_SOURCES})")
    image = dest.get("image") or {}
    if not image.get("alt"):
        errors.append(f"{did}: image.alt 누락")
    if not image.get("sourceUrl"):
        errors.append(f"{did}: image.sourceUrl 누락")
    return errors


def main() -> int:
    all_errors: list[str] = []

    try:
        data = load_ts_data_as_json()
    except ValidationError as e:
        print(f"[FAIL] 데이터 로드 실패: {e}")
        return 1

    destinations = data.get("destinations", [])
    safety_ids = set(data.get("safetyCountryIds", []))

    domestic = [d for d in destinations if d.get("region") == "domestic"]
    overseas = [d for d in destinations if d.get("region") == "overseas"]
    overseas_countries = {d.get("country") for d in overseas}
    overseas_safety_ids = {d.get("safetyCountryId") for d in overseas if d.get("safetyCountryId")}

    print(f"국내 여행지: {len(domestic)}곳 (최소 {MIN_DOMESTIC})")
    if len(domestic) < MIN_DOMESTIC:
        all_errors.append(f"국내 여행지 부족: {len(domestic)}/{MIN_DOMESTIC}")

    print(f"해외 여행지: {len(overseas_countries)}개국 / {len(overseas)}개 도시 "
          f"(최소 {MIN_OVERSEAS_COUNTRIES}개국 / {MIN_OVERSEAS_CITIES}개 도시)")
    if len(overseas_countries) < MIN_OVERSEAS_COUNTRIES:
        all_errors.append(f"해외 국가 수 부족: {len(overseas_countries)}/{MIN_OVERSEAS_COUNTRIES}")
    if len(overseas) < MIN_OVERSEAS_CITIES:
        all_errors.append(f"해외 도시 수 부족: {len(overseas)}/{MIN_OVERSEAS_CITIES}")

    missing_safety = overseas_safety_ids - safety_ids
    extra_safety = safety_ids - overseas_safety_ids
    print(f"안전정보 커버리지: {len(safety_ids)}개국 (해외 여행지 국가 {len(overseas_safety_ids)}개국과 비교)")
    if missing_safety:
        all_errors.append(f"안전정보 누락 국가: {sorted(missing_safety)}")
    if extra_safety:
        all_errors.append(f"여행지 없는 여분 안전정보 국가: {sorted(extra_safety)}")

    field_errors: list[str] = []
    for dest in destinations:
        field_errors.extend(check_destination_fields(dest))
    if field_errors:
        print(f"필수 필드 누락 {len(field_errors)}건:")
        for err in field_errors:
            print(f"  - {err}")
        all_errors.extend(field_errors)

    if all_errors:
        print(f"\n[FAIL] 콘텐츠 완전성 검증 실패 — {len(all_errors)}건")
        return 1

    print("\n[PASS] 콘텐츠 완전성 검증 통과")
    return 0


if __name__ == "__main__":
    sys.exit(main())
