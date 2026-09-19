# TASK-DATA-SAFETY: 국가별 안전정보 정적 데이터

- **Seq:** 40
- **Category:** Static Data (`DATA`)
- **Implementation Status:** IMPLEMENT
- **Priority:** Must

---

## Context

'국가별 안전정보 정적 데이터' 정적 데이터를 `src/data`에 TypeScript로 작성하는 Task다. 데이터베이스를 사용하지 않는다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다.

## Requirement Ref

- REQ-FUNC-046
- REQ-FUNC-047
- REQ-FUNC-048
- REQ-FUNC-052
- REQ-FUNC-053

## Screen / Route / Page Entry

- Screen: SCR-001
- Route: /
- Page Entry: —

## Design Ref

- `design-reference/D-001/DESIGN.md` §17(Section별 최소 콘텐츠 수), §18(완성형 Empty State·Placeholder 금지)
- `docs/PROJECT_SCOPE.md` §3 구현 방식(정적 데이터 src/data 사용, 이미지 alt+URL만 기록)

## Depends On

- 없음(선행 Task 없이 시작 가능)

## Expected Files

- src/data/safety.ts (신규)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. 소개되는 해외 15개국 전체에 대해 치안·사기·법규·교통·재난·보건·문화·긴급연락처 8개 카테고리, 출처명/URL/확인일/편집자, scope_type(COUNTRY/REGION)을 정적 데이터로 작성한다.
2. 국가 수와 안전정보 수가 정확히 일치해야 한다(커버리지 100%).

## Visual AC

1. 비-UI Task로 해당 없음

## Security/Privacy AC

1. 해당 없음

## Test Cases

- TC-01: 소개되는 해외 15개국 전체에 대해 치안·사기·법규·교통·재난·보건·문화·긴급연락처 8개 카테고리, 출처명/URL/확인일/편집자, scope_type(COUNTRY/REGION)을 정적 데이터로 작성한다.
- TC-02: 국가 수와 안전정보 수가 정확히 일치해야 한다(커버리지 100%).

## Verify

- DATA-CONTENT-COMPLETENESS-CHECK

## Definition of Done

- [ ] 위 Expected Files가 모두 생성/수정되어 있고 그 밖의 파일 변경이 없다.
- [ ] Functional AC, Visual AC, Security/Privacy AC를 모두 충족한다.
- [ ] Test Cases가 Verify에 명시된 방법으로 확인 가능하다.
- [ ] Depends On에 나열된 모든 Task가 먼저 완료되어 있다.

## Forbidden

- **Expected Files 목록 밖의 어떤 파일도 생성·수정하지 않는다.**
- 이 Task 수행 중 실제 구현 코드 실행 결과 커밋, Git Branch 생성, Pull Request 생성을 하지 않는다(이 문서는 계획/명세 파일이다).

---

*— TASK-DATA-SAFETY 끝 —*
