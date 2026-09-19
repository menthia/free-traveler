# TASK-INFRA-SUPABASE-PROJECT: Supabase 프로젝트 연결 확인

- **Seq:** 69
- **Category:** CI / Infra (`CI_INFRA`)
- **Implementation Status:** IMPLEMENT
- **Priority:** Must

---

## Context

'Supabase 프로젝트 연결 확인'을 구성하는 CI/배포 설정 Task다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다.

## Requirement Ref

- 직접 연결된 REQ ID 없음(지원/인프라 Task)

## Screen / Route / Page Entry

- Screen: —
- Route: —
- Page Entry: —

## Design Ref

- `docs/PROJECT_SCOPE.md` §3(구현 방식), §4(공통 제외 범위 — EC2·AWS 인프라 제외)

## Depends On

- 없음(선행 Task 없이 시작 가능)

## Expected Files

- supabase/config.toml (신규)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. Supabase PostgreSQL/Auth 프로젝트를 생성하고 로컬·Vercel 환경에서 연결 가능함을 확인한다.

## Visual AC

1. 비-UI Task로 해당 없음

## Security/Privacy AC

1. 해당 없음

## Test Cases

- TC-01: Supabase PostgreSQL/Auth 프로젝트를 생성하고 로컬·Vercel 환경에서 연결 가능함을 확인한다.

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
- EC2·AWS 등 Vercel/Supabase 외의 인프라를 구성하지 않는다. 자동 Merge Runner를 만들지 않는다.

---

*— TASK-INFRA-SUPABASE-PROJECT 끝 —*
