# TASK-UNIT-CONTACT-DETECTION: 연락처 탐지 Unit Test

- **Seq:** 61
- **Category:** Unit / Integration Test (`UNIT_TEST`)
- **Implementation Status:** IMPLEMENT
- **Priority:** Must

---

## Context

'연락처 탐지 Unit Test'을 검증하는 단위/통합 테스트를 작성하는 Task다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다.

## Requirement Ref

- REQ-FUNC-032

## Screen / Route / Page Entry

- Screen: —
- Route: —
- Page Entry: —

## Design Ref

- `docs/02_SRS_BASELINE.md` §6.8(Validation Plan) 및 Critical Test Scenarios
- `design-reference/D-001/DESIGN.md` §19 Do Not(광고·별점·실시간 가격·Airbnb 상표 등 금지 확인 대상)

## Depends On

- TASK-API-CONTACT-DETECTION-UTIL

## Expected Files

- src/lib/contact-detection.test.ts (신규)
- src/lib/contact-detection.ts (수정 — 테스트 작성 중 발견: "카카오톡 아이디는 abc123"처럼
  "아이디" 뒤에 조사(는/를/가 등)가 붙는 자연스러운 한국어 문장에서 메신저 ID 탐지가
  실패했다. 라벨 뒤 0~3자의 한글 조사를 허용하도록 정규식을 보정한다)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. 전화번호·이메일·메신저 ID 패턴 기준 테스트셋으로 탐지율 95% 이상, 오탐 5% 이하를 검증한다.

## Visual AC

1. 비-UI Task로 해당 없음

## Security/Privacy AC

1. 해당 없음

## Test Cases

- TC-01: 전화번호·이메일·메신저 ID 패턴 기준 테스트셋으로 탐지율 95% 이상, 오탐 5% 이하를 검증한다.

## Verify

- CI-PIPELINE

## Definition of Done

- [ ] 위 Expected Files가 모두 생성/수정되어 있고 그 밖의 파일 변경이 없다.
- [ ] Functional AC, Visual AC, Security/Privacy AC를 모두 충족한다.
- [ ] Test Cases가 Verify에 명시된 방법으로 확인 가능하다.
- [ ] Depends On에 나열된 모든 Task가 먼저 완료되어 있다.

## Forbidden

- **Expected Files 목록 밖의 어떤 파일도 생성·수정하지 않는다.**
- 이 Task 수행 중 실제 구현 코드 실행 결과 커밋, Git Branch 생성, Pull Request 생성을 하지 않는다(이 문서는 계획/명세 파일이다).

---

*— TASK-UNIT-CONTACT-DETECTION 끝 —*
