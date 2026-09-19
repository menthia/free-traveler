# TASK-API-ADMIN-REPORTS: 관리자 신고 처리 API Route

- **Seq:** 56
- **Category:** API / Backend (`API`)
- **Implementation Status:** IMPLEMENT(변형)
- **Priority:** Must

---

## Context

'관리자 신고 처리 API Route'을 제공하는 서버 측 로직/Route Handler를 구현하는 Task다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT(변형)**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다. 단, 원 요구사항을 그대로 만족하지 않고 단순화된 방식(§Design Ref 참고: 정적 데이터/localStorage/Toast/렌더링 시점 계산 등)으로 구현하도록 승인되어 있다 — 이 축소 범위를 임의로 되돌려 원 요구사항 전체를 구현하지 않는다.

## Requirement Ref

- REQ-FUNC-041
- REQ-FUNC-042

## Screen / Route / Page Entry

- Screen: —
- Route: /api/admin/reports
- Page Entry: —

## Design Ref

- `docs/02_SRS_BASELINE.md` §6.1(Internal API and Server Actions) 중 해당 엔드포인트
- `docs/PROJECT_SCOPE.md`의 관련 REQ-FUNC 처리 방법 절

## Depends On

- TASK-DB-ACCESS

## Expected Files

- src/app/api/admin/reports/route.ts (신규)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. OPEN/RESOLVED/DISMISSED 상태 필터 조회와 상태 변경(게시물 숨김 포함)을 제공한다.

## Visual AC

1. 비-UI Task로 해당 없음

## Security/Privacy AC

1. Moderator/Admin 역할만 접근 가능(RLS+역할 검증), 그 외는 403.

## Test Cases

- TC-01: OPEN/RESOLVED/DISMISSED 상태 필터 조회와 상태 변경(게시물 숨김 포함)을 제공한다.

## Verify

- TEST-RLS-BASIC

## Definition of Done

- [ ] 위 Expected Files가 모두 생성/수정되어 있고 그 밖의 파일 변경이 없다.
- [ ] Functional AC, Visual AC, Security/Privacy AC를 모두 충족한다.
- [ ] Test Cases가 Verify에 명시된 방법으로 확인 가능하다.
- [ ] Depends On에 나열된 모든 Task가 먼저 완료되어 있다.

## Forbidden

- **Expected Files 목록 밖의 어떤 파일도 생성·수정하지 않는다.**
- 이 Task 수행 중 실제 구현 코드 실행 결과 커밋, Git Branch 생성, Pull Request 생성을 하지 않는다(이 문서는 계획/명세 파일이다).
- 차트·그래프·KPI 대시보드를 추가하지 않는다(간단한 카드·리스트만 사용).

---

*— TASK-API-ADMIN-REPORTS 끝 —*
