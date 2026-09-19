# TASK-DB-SEED-BASE: 개발용 시드 데이터

- **Seq:** 47
- **Category:** Database (`DB`)
- **Implementation Status:** IMPLEMENT
- **Priority:** Should

---

## Context

Supabase PostgreSQL에 '개발용 시드 데이터'을 구성하는 Task다. 정확히 6개 테이블 범위 안에서만 작업한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다.

## Requirement Ref

- 직접 연결된 REQ ID 없음(지원/인프라 Task)

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

- supabase/seed.sql (신규)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. 로컬/스테이징 개발을 위한 최소 시드(테스트 계정 2~3개, 동행글 3~5개)를 제공한다. 실 서비스 배포에는 적용하지 않는다.

## Visual AC

1. 비-UI Task로 해당 없음

## Security/Privacy AC

1. 시드에 실제 개인정보를 포함하지 않는다.

## Test Cases

- TC-01: 로컬/스테이징 개발을 위한 최소 시드(테스트 계정 2~3개, 동행글 3~5개)를 제공한다. 실 서비스 배포에는 적용하지 않는다.

## Verify

- 코드 리뷰

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

*— TASK-DB-SEED-BASE 끝 —*
