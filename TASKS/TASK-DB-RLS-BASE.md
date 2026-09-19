# TASK-DB-RLS-BASE: Row Level Security 정책

- **Seq:** 45
- **Category:** Database (`DB`)
- **Implementation Status:** IMPLEMENT
- **Priority:** Must

---

## Context

Supabase PostgreSQL에 'Row Level Security 정책'을 구성하는 Task다. 정확히 6개 테이블 범위 안에서만 작업한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다.

## Requirement Ref

- REQ-FUNC-044
- REQ-NF-013

## Screen / Route / Page Entry

- Screen: —
- Route: —
- Page Entry: —

## Design Ref

- `.claude/skills/traveler-project-pipeline/SKILL.md`의 'DB 스키마(정확히 6개 테이블)' 절
- `docs/02_SRS_BASELINE.md` §6.3 원본 데이터 모델(USER_PROFILE/MATE_POST/MATE_APPLICATION/USER_BLOCK/REPORT 필드 참고, COUNTRY/DESTINATION 등 콘텐츠 테이블과 AUDIT_LOG는 이번 스키마에서 제외)

## Depends On

- TASK-DB-SCHEMA-BASE

## Expected Files

- supabase/migrations/0002_rls_base.sql (신규)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. 본인 글·요청, 요청 대상 작성자, Moderator/Admin만 비공개 데이터(MATE_APPLICATION.message, REPORT 상세)를 열람할 수 있도록 정책을 정의한다.
2. 차단 관계에 있는 사용자 간 데이터 노출을 정책 수준에서 차단한다.

## Visual AC

1. 비-UI Task로 해당 없음

## Security/Privacy AC

1. 권한별 부정 접근 테스트가 모두 403 또는 빈 결과를 반환해야 한다.

## Test Cases

- TC-01: 본인 글·요청, 요청 대상 작성자, Moderator/Admin만 비공개 데이터(MATE_APPLICATION.message, REPORT 상세)를 열람할 수 있도록 정책을 정의한다.
- TC-02: 차단 관계에 있는 사용자 간 데이터 노출을 정책 수준에서 차단한다.

## Verify

- TEST-RLS-BASIC

## Definition of Done

- [ ] 위 Expected Files가 모두 생성/수정되어 있고 그 밖의 파일 변경이 없다.
- [ ] Functional AC, Visual AC, Security/Privacy AC를 모두 충족한다.
- [ ] Test Cases가 Verify에 명시된 방법으로 확인 가능하다.
- [ ] Depends On에 나열된 모든 Task가 먼저 완료되어 있다.
- [ ] 전체 스키마의 테이블 수가 6개(USER_PROFILE/MATE_POST/MATE_APPLICATION/USER_BLOCK/REPORT/OUTBOUND_LINK_SETTING)를 넘지 않는다.

## Forbidden

- **Expected Files 목록 밖의 어떤 파일도 생성·수정하지 않는다.**
- 이 Task 수행 중 실제 구현 코드 실행 결과 커밋, Git Branch 생성, Pull Request 생성을 하지 않는다(이 문서는 계획/명세 파일이다).
- `USER_PROFILE`, `MATE_POST`, `MATE_APPLICATION`, `USER_BLOCK`, `REPORT`, `OUTBOUND_LINK_SETTING` 6개 테이블 외의 신규 테이블을 만들지 않는다(콘텐츠 계열은 정적 데이터, AUDIT_LOG는 EXCLUDED).

---

*— TASK-DB-RLS-BASE 끝 —*
