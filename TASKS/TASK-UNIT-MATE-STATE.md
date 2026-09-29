# TASK-UNIT-MATE-STATE: 동행글/참가요청 상태 전이 Unit Test

- **Seq:** 62
- **Category:** Unit / Integration Test (`UNIT_TEST`)
- **Implementation Status:** IMPLEMENT
- **Priority:** Must

---

## Context

'동행글/참가요청 상태 전이 Unit Test'을 검증하는 단위/통합 테스트를 작성하는 Task다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다.

## Requirement Ref

- REQ-FUNC-035
- REQ-FUNC-036
- REQ-FUNC-037

## Screen / Route / Page Entry

- Screen: —
- Route: —
- Page Entry: —

## Design Ref

- `docs/02_SRS_BASELINE.md` §6.8(Validation Plan) 및 Critical Test Scenarios
- `design-reference/D-001/DESIGN.md` §19 Do Not(광고·별점·실시간 가격·Airbnb 상표 등 금지 확인 대상)

## Depends On

- TASK-DB-ACCESS
- TASK-API-MATE-AUTOCLOSE

## Expected Files

- src/lib/db/mate-state.test.ts (신규)
- vitest.config.ts (수정 — 테스트 작성 중 발견: `src/lib/db/mates.ts`/`applications.ts`가
  모두 `@/lib/supabase/server`처럼 `@/` 경로 별칭으로 import하는데, `vitest.config.ts`에는
  이 별칭이 설정되어 있지 않아 `@/`로 시작하는 어떤 모듈을 import해도 테스트 자체가 실행되지
  못했다. `tsconfig.json`과 동일하게 `@` → `src`로 매핑하는 `resolve.alias`를 추가한다)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. OPEN→CLOSED(자동/수동), PENDING→ACCEPTED/REJECTED/WITHDRAWN 전이와 중복 요청 차단 로직을 검증한다.

## Visual AC

1. 비-UI Task로 해당 없음

## Security/Privacy AC

1. 해당 없음

## Test Cases

- TC-01: OPEN→CLOSED(자동/수동), PENDING→ACCEPTED/REJECTED/WITHDRAWN 전이와 중복 요청 차단 로직을 검증한다.

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
- 사용자 간 별점·평점·리뷰 점수 기능을 추가하지 않는다.

---

*— TASK-UNIT-MATE-STATE 끝 —*
