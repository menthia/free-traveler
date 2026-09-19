# TASK-API-APPLICATIONS: 참가 요청 API Route

- **Seq:** 53
- **Category:** API / Backend (`API`)
- **Implementation Status:** IMPLEMENT
- **Priority:** Must

---

## Context

'참가 요청 API Route'을 제공하는 서버 측 로직/Route Handler를 구현하는 Task다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다.

## Requirement Ref

- REQ-FUNC-034
- REQ-FUNC-035
- REQ-FUNC-036
- REQ-FUNC-043

## Screen / Route / Page Entry

- Screen: —
- Route: /api/mates/[id]/applications, /api/applications/[id]
- Page Entry: —

## Design Ref

- `docs/02_SRS_BASELINE.md` §6.1(Internal API and Server Actions) 중 해당 엔드포인트
- `docs/PROJECT_SCOPE.md`의 관련 REQ-FUNC 처리 방법 절

## Depends On

- TASK-DB-ACCESS

## Expected Files

- src/app/api/mates/[id]/applications/route.ts (신규)
- src/app/api/applications/[id]/route.ts (신규)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. 참가 요청 생성 시 중복 PENDING/ACCEPTED를 DB unique 제약과 함께 차단한다.
2. 작성자만 상태를 ACCEPTED/REJECTED로 변경할 수 있으며 비작성자 요청은 403을 반환한다.
3. 상태 변경 시 알림 상태를 1분 이내 갱신한다(이메일은 발송하지 않고 화면 상태로 대체).

## Visual AC

1. 비-UI Task로 해당 없음

## Security/Privacy AC

1. 비작성자의 승인/거절 시도는 403.

## Test Cases

- TC-01: 참가 요청 생성 시 중복 PENDING/ACCEPTED를 DB unique 제약과 함께 차단한다.
- TC-02: 작성자만 상태를 ACCEPTED/REJECTED로 변경할 수 있으며 비작성자 요청은 403을 반환한다.
- TC-03: 상태 변경 시 알림 상태를 1분 이내 갱신한다(이메일은 발송하지 않고 화면 상태로 대체).

## Verify

- TEST-RLS-BASIC, UNIT-MATE-STATE

## Definition of Done

- [ ] 위 Expected Files가 모두 생성/수정되어 있고 그 밖의 파일 변경이 없다.
- [ ] Functional AC, Visual AC, Security/Privacy AC를 모두 충족한다.
- [ ] Test Cases가 Verify에 명시된 방법으로 확인 가능하다.
- [ ] Depends On에 나열된 모든 Task가 먼저 완료되어 있다.

## Forbidden

- **Expected Files 목록 밖의 어떤 파일도 생성·수정하지 않는다.**
- 이 Task 수행 중 실제 구현 코드 실행 결과 커밋, Git Branch 생성, Pull Request 생성을 하지 않는다(이 문서는 계획/명세 파일이다).

---

*— TASK-API-APPLICATIONS 끝 —*
