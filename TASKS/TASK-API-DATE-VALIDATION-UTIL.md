# TASK-API-DATE-VALIDATION-UTIL: 여행 날짜 검증 유틸

- **Seq:** 50
- **Category:** API / Backend (`API`)
- **Implementation Status:** IMPLEMENT
- **Priority:** Must

---

## Context

'여행 날짜 검증 유틸'을 제공하는 서버 측 로직/Route Handler를 구현하는 Task다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다.

## Requirement Ref

- REQ-FUNC-013
- REQ-FUNC-021

## Screen / Route / Page Entry

- Screen: —
- Route: —
- Page Entry: —

## Design Ref

- `docs/02_SRS_BASELINE.md` §6.1(Internal API and Server Actions) 중 해당 엔드포인트
- `docs/PROJECT_SCOPE.md`의 관련 REQ-FUNC 처리 방법 절

## Depends On

- 없음(선행 Task 없이 시작 가능)

## Expected Files

- src/lib/date-validation.ts (신규)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. 과거 날짜, 역전된 날짜, 체크인=체크아웃 등 경계값을 판정하는 순수 함수를 제공한다(UNIT-TRAVEL-DATES).

## Visual AC

1. 비-UI Task로 해당 없음

## Security/Privacy AC

1. 해당 없음

## Test Cases

- TC-01: 과거 날짜, 역전된 날짜, 체크인=체크아웃 등 경계값을 판정하는 순수 함수를 제공한다(UNIT-TRAVEL-DATES).

## Verify

- UNIT-TRAVEL-DATES

## Definition of Done

- [ ] 위 Expected Files가 모두 생성/수정되어 있고 그 밖의 파일 변경이 없다.
- [ ] Functional AC, Visual AC, Security/Privacy AC를 모두 충족한다.
- [ ] Test Cases가 Verify에 명시된 방법으로 확인 가능하다.
- [ ] Depends On에 나열된 모든 Task가 먼저 완료되어 있다.

## Forbidden

- **Expected Files 목록 밖의 어떤 파일도 생성·수정하지 않는다.**
- 이 Task 수행 중 실제 구현 코드 실행 결과 커밋, Git Branch 생성, Pull Request 생성을 하지 않는다(이 문서는 계획/명세 파일이다).

---

*— TASK-API-DATE-VALIDATION-UTIL 끝 —*
