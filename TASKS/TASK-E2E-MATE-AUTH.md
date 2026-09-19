# TASK-E2E-MATE-AUTH: Playwright 동행 인증 흐름

- **Seq:** 66
- **Category:** E2E Test (Playwright) (`E2E_TEST`)
- **Implementation Status:** IMPLEMENT
- **Priority:** Must

---

## Context

Playwright Chromium 기반으로 'Playwright 동행 인증 흐름'을 검증하는 End-to-End 테스트를 작성하는 Task다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다.

## Requirement Ref

- REQ-FUNC-027
- REQ-FUNC-031
- REQ-FUNC-034
- REQ-FUNC-036
- REQ-FUNC-039
- REQ-FUNC-040
- REQ-FUNC-066

## Screen / Route / Page Entry

- Screen: SCR-003, SCR-004, SCR-005
- Route: /travel-tools, /mates, /account
- Page Entry: —

## Design Ref

- `docs/02_SRS_BASELINE.md` §6.8(Validation Plan) 및 Critical Test Scenarios
- `design-reference/D-001/DESIGN.md` §19 Do Not(광고·별점·실시간 가격·Airbnb 상표 등 금지 확인 대상)

## Depends On

- TASK-PAGE-SCR003
- TASK-PAGE-SCR004
- TASK-PAGE-SCR005

## Expected Files

- tests/e2e/mate-auth.spec.ts (신규)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. 흐름 7: 회원가입/로그인→성인확인→동행글 작성(연락처 탐지 차단 케이스 포함)→SCR-004에서 참가 요청→작성자 승인→신고/차단 시나리오까지 하나의 로그인 세션으로 연결한다.
2. Chromium 단일 브라우저로만 실행한다.

## Visual AC

1. 비-UI Task로 해당 없음

## Security/Privacy AC

1. 해당 없음

## Test Cases

- TC-01: 흐름 7: 회원가입/로그인→성인확인→동행글 작성(연락처 탐지 차단 케이스 포함)→SCR-004에서 참가 요청→작성자 승인→신고/차단 시나리오까지 하나의 로그인 세션으로 연결한다.
- TC-02: Chromium 단일 브라우저로만 실행한다.

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
- 사용자 간 별점·평점·리뷰 점수 기능을 추가하지 않는다.
- 차트·그래프·KPI 대시보드를 추가하지 않는다(간단한 카드·리스트만 사용).
- Chromium 외 다른 브라우저(Firefox/WebKit) 매트릭스를 추가하지 않는다.

---

*— TASK-E2E-MATE-AUTH 끝 —*
