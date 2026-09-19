# TASK-DATA-POLICY-CONTENT: 이용약관·개인정보·안전수칙·면책 정적 페이지 콘텐츠

- **Seq:** 42
- **Category:** Static Data (`DATA`)
- **Implementation Status:** IMPLEMENT(변형)
- **Priority:** Must

---

## Context

'이용약관·개인정보·안전수칙·면책 정적 페이지 콘텐츠' 정적 데이터를 `src/data`에 TypeScript로 작성하는 Task다. 데이터베이스를 사용하지 않는다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT(변형)**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다. 단, 원 요구사항을 그대로 만족하지 않고 단순화된 방식(§Design Ref 참고: 정적 데이터/localStorage/Toast/렌더링 시점 계산 등)으로 구현하도록 승인되어 있다 — 이 축소 범위를 임의로 되돌려 원 요구사항 전체를 구현하지 않는다.

## Requirement Ref

- REQ-FUNC-080

## Screen / Route / Page Entry

- Screen: COMMON
- Route: 전체 5개 Route
- Page Entry: —

## Design Ref

- `design-reference/D-001/DESIGN.md` §17(Section별 최소 콘텐츠 수), §18(완성형 Empty State·Placeholder 금지)
- `docs/PROJECT_SCOPE.md` §3 구현 방식(정적 데이터 src/data 사용, 이미지 alt+URL만 기록)

## Depends On

- 없음(선행 Task 없이 시작 가능)

## Expected Files

- src/data/policies.ts (신규)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. 이용약관, 개인정보 처리방침, 동행 안전수칙, 콘텐츠 면책 안내 정적 텍스트와 정책 버전(예: v1)을 작성한다.

## Visual AC

1. 비-UI Task로 해당 없음

## Security/Privacy AC

1. 해당 없음

## Test Cases

- TC-01: 이용약관, 개인정보 처리방침, 동행 안전수칙, 콘텐츠 면책 안내 정적 텍스트와 정책 버전(예: v1)을 작성한다.

## Verify

- 코드 리뷰

## Definition of Done

- [ ] 위 Expected Files가 모두 생성/수정되어 있고 그 밖의 파일 변경이 없다.
- [ ] Functional AC, Visual AC, Security/Privacy AC를 모두 충족한다.
- [ ] Test Cases가 Verify에 명시된 방법으로 확인 가능하다.
- [ ] Depends On에 나열된 모든 Task가 먼저 완료되어 있다.

## Forbidden

- **Expected Files 목록 밖의 어떤 파일도 생성·수정하지 않는다.**
- 이 Task 수행 중 실제 구현 코드 실행 결과 커밋, Git Branch 생성, Pull Request 생성을 하지 않는다(이 문서는 계획/명세 파일이다).

---

*— TASK-DATA-POLICY-CONTENT 끝 —*
