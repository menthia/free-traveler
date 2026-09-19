# TASK-E2E-TRAVEL-TOOLS: Playwright 여행 준비 흐름

- **Seq:** 65
- **Category:** E2E Test (Playwright) (`E2E_TEST`)
- **Implementation Status:** IMPLEMENT
- **Priority:** Must

---

## Context

Playwright Chromium 기반으로 'Playwright 여행 준비 흐름'을 검증하는 End-to-End 테스트를 작성하는 Task다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다.

## Requirement Ref

- REQ-FUNC-013
- REQ-FUNC-016
- REQ-FUNC-021
- REQ-FUNC-024

## Screen / Route / Page Entry

- Screen: SCR-003
- Route: /travel-tools
- Page Entry: —

## Design Ref

- `docs/02_SRS_BASELINE.md` §6.8(Validation Plan) 및 Critical Test Scenarios
- `design-reference/D-001/DESIGN.md` §19 Do Not(광고·별점·실시간 가격·Airbnb 상표 등 금지 확인 대상)

## Depends On

- TASK-PAGE-SCR003

## Expected Files

- tests/e2e/travel-tools.spec.ts (신규)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. 흐름 5: 항공 탭 조건 입력→검증 오류 확인→정상 입력→요약→외부 이동(새 탭, 네트워크에 값 미포함 확인). 흐름 6: 숙소 탭 동일 시나리오.
2. Chromium 단일 브라우저로만 실행한다(다중 브라우저 매트릭스 없음).

## Visual AC

1. 비-UI Task로 해당 없음

## Security/Privacy AC

1. 네트워크 요청에 목적지·날짜 값이 포함되지 않음을 자동 검증.

## Test Cases

- TC-01: 흐름 5: 항공 탭 조건 입력→검증 오류 확인→정상 입력→요약→외부 이동(새 탭, 네트워크에 값 미포함 확인). 흐름 6: 숙소 탭 동일 시나리오.
- TC-02: Chromium 단일 브라우저로만 실행한다(다중 브라우저 매트릭스 없음).

## Verify

- —

## Definition of Done

- [ ] 위 Expected Files가 모두 생성/수정되어 있고 그 밖의 파일 변경이 없다.
- [ ] Functional AC, Visual AC, Security/Privacy AC를 모두 충족한다.
- [ ] Test Cases가 Verify에 명시된 방법으로 확인 가능하다.
- [ ] Depends On에 나열된 모든 Task가 먼저 완료되어 있다.

## Forbidden

- **Expected Files 목록 밖의 어떤 파일도 생성·수정하지 않는다.**
- 이 Task 수행 중 실제 구현 코드 실행 결과 커밋, Git Branch 생성, Pull Request 생성을 하지 않는다(이 문서는 계획/명세 파일이다).
- 항공·숙소 조건 입력값을 서버 API, DB, 외부 URL의 쿼리·본문·쿠키로 전달하지 않는다.
- Chromium 외 다른 브라우저(Firefox/WebKit) 매트릭스를 추가하지 않는다.

---

*— TASK-E2E-TRAVEL-TOOLS 끝 —*
