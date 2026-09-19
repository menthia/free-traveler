# TASK-API-AUTH-CALLBACK: Supabase Auth 콜백 Route

- **Seq:** 48
- **Category:** API / Backend (`API`)
- **Implementation Status:** IMPLEMENT
- **Priority:** Must

---

## Context

'Supabase Auth 콜백 Route'을 제공하는 서버 측 로직/Route Handler를 구현하는 Task다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다.

## Requirement Ref

- REQ-FUNC-066

## Screen / Route / Page Entry

- Screen: —
- Route: /auth/callback
- Page Entry: —

## Design Ref

- `docs/02_SRS_BASELINE.md` §6.1(Internal API and Server Actions) 중 해당 엔드포인트
- `docs/PROJECT_SCOPE.md`의 관련 REQ-FUNC 처리 방법 절

## Depends On

- TASK-INFRA-SUPABASE-PROJECT

## Expected Files

- src/app/auth/callback/route.ts (신규)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. 이메일 인증·비밀번호 재설정 콜백을 처리하고 세션을 설정한다.

## Visual AC

1. 비-UI Task로 해당 없음

## Security/Privacy AC

1. TLS 1.2 이상 연결에서만 동작(Vercel 기본 제공).

## Test Cases

- TC-01: 이메일 인증·비밀번호 재설정 콜백을 처리하고 세션을 설정한다.

## Verify

- E2E-MATE-AUTH

## Definition of Done

- [ ] 위 Expected Files가 모두 생성/수정되어 있고 그 밖의 파일 변경이 없다.
- [ ] Functional AC, Visual AC, Security/Privacy AC를 모두 충족한다.
- [ ] Test Cases가 Verify에 명시된 방법으로 확인 가능하다.
- [ ] Depends On에 나열된 모든 Task가 먼저 완료되어 있다.

## Forbidden

- **Expected Files 목록 밖의 어떤 파일도 생성·수정하지 않는다.**
- 이 Task 수행 중 실제 구현 코드 실행 결과 커밋, Git Branch 생성, Pull Request 생성을 하지 않는다(이 문서는 계획/명세 파일이다).

---

*— TASK-API-AUTH-CALLBACK 끝 —*
