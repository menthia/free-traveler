# TASK-DATA-REPRESENTATIVE: 대표(free_traveler) 프로필 정적 데이터

- **Seq:** 41
- **Category:** Static Data (`DATA`)
- **Implementation Status:** IMPLEMENT(변형)
- **Priority:** Must

---

## Context

'대표(free_traveler) 프로필 정적 데이터' 정적 데이터를 `src/data`에 TypeScript로 작성하는 Task다. 데이터베이스를 사용하지 않는다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT(변형)**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다. 단, 원 요구사항을 그대로 만족하지 않고 단순화된 방식(§Design Ref 참고: 정적 데이터/localStorage/Toast/렌더링 시점 계산 등)으로 구현하도록 승인되어 있다 — 이 축소 범위를 임의로 되돌려 원 요구사항 전체를 구현하지 않는다.

## Requirement Ref

- REQ-FUNC-057
- REQ-FUNC-058
- REQ-FUNC-059
- REQ-FUNC-060
- REQ-FUNC-061
- REQ-FUNC-062
- REQ-FUNC-063

## Screen / Route / Page Entry

- Screen: SCR-002
- Route: /about
- Page Entry: —

## Design Ref

- `design-reference/D-001/DESIGN.md` §17(Section별 최소 콘텐츠 수), §18(완성형 Empty State·Placeholder 금지)
- `docs/PROJECT_SCOPE.md` §3 구현 방식(정적 데이터 src/data 사용, 이미지 alt+URL만 기록)

## Depends On

- 없음(선행 Task 없이 시작 가능)

## Expected Files

- src/data/representative.ts (신규)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. 대표명·`50+ Trips`·`30+ Countries`·소개문·철학·방문 국가 30개 이상·타임라인 6개 이상·추천 여행지 6개·문의/SNS 링크를 정적 데이터로 작성한다.
2. 이미지에는 alt 텍스트와 출처 URL만 기록한다(라이선스·작가 메타데이터 관리 제외).

## Visual AC

1. 비-UI Task로 해당 없음

## Security/Privacy AC

1. 해당 없음

## Test Cases

- TC-01: 대표명·`50+ Trips`·`30+ Countries`·소개문·철학·방문 국가 30개 이상·타임라인 6개 이상·추천 여행지 6개·문의/SNS 링크를 정적 데이터로 작성한다.
- TC-02: 이미지에는 alt 텍스트와 출처 URL만 기록한다(라이선스·작가 메타데이터 관리 제외).

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

*— TASK-DATA-REPRESENTATIVE 끝 —*
