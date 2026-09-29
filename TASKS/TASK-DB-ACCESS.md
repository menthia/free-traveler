# TASK-DB-ACCESS: 데이터 접근 레이어(Server Actions/Query 함수)

- **Seq:** 46
- **Category:** Database (`DB`)
- **Implementation Status:** IMPLEMENT
- **Priority:** Must

---

## Context

Supabase PostgreSQL에 '데이터 접근 레이어(Server Actions/Query 함수)'을 구성하는 Task다. 정확히 6개 테이블 범위 안에서만 작업한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다.

## Requirement Ref

- REQ-FUNC-030
- REQ-FUNC-035
- REQ-FUNC-036
- REQ-FUNC-037

## Screen / Route / Page Entry

- Screen: —
- Route: —
- Page Entry: —

## Design Ref

- `.claude/skills/traveler-project-pipeline/SKILL.md`의 'DB 스키마(정확히 6개 테이블)' 절
- `docs/02_SRS_BASELINE.md` §6.3 원본 데이터 모델(USER_PROFILE/MATE_POST/MATE_APPLICATION/USER_BLOCK/REPORT 필드 참고, COUNTRY/DESTINATION 등 콘텐츠 테이블과 AUDIT_LOG는 이번 스키마에서 제외)

## Depends On

- TASK-DB-SCHEMA-BASE
- TASK-DB-RLS-BASE

## Expected Files

- package.json (수정 — `@supabase/supabase-js`, `@supabase/ssr` 의존성 추가)
- package-lock.json (수정)
- src/lib/supabase/client.ts (신규)
- src/lib/supabase/server.ts (신규)
- src/lib/db/mates.ts (신규)
- src/lib/db/applications.ts (신규)
- src/lib/db/blocks.ts (신규)
- src/lib/db/reports.ts (신규)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.** (`src/lib/supabase/client.ts`/`server.ts`는 `docs/ARCHITECTURE.md` §7.1이 지정한 위치이지만 이를 만드는 Task가 없었다 — `src/lib/db/*.ts`가 실제로 이 Client를 사용하는 첫 지점이므로 여기서 함께 만든다. `@supabase/supabase-js`/`@supabase/ssr` 의존성도 이 저장소에 아직 설치되어 있지 않아 함께 추가한다. 이후 `API-AUTH-CALLBACK`, `COMP-SCR005-GUEST-AUTH` 등 Supabase Client가 필요한 다른 Task는 이 두 파일을 새로 만들지 않고 import해서 재사용한다.)

## Functional AC

1. 다중 조건 필터, 중복 요청 검사, 상태 전이(OPEN/CLOSED, PENDING/ACCEPTED/REJECTED/WITHDRAWN), 조회 시 자동 마감 계산을 캡슐화한 서버 함수를 제공한다(UNIT-MATE-STATE로 로직 검증).

## Visual AC

1. 비-UI Task로 해당 없음

## Security/Privacy AC

1. 모든 쓰기 함수는 RLS를 우회하는 service-role 키를 사용하지 않는다.

## Test Cases

- TC-01: 다중 조건 필터, 중복 요청 검사, 상태 전이(OPEN/CLOSED, PENDING/ACCEPTED/REJECTED/WITHDRAWN), 조회 시 자동 마감 계산을 캡슐화한 서버 함수를 제공한다(UNIT-MATE-STATE로 로직 검증).

## Verify

- TEST-RLS-BASIC, UNIT-MATE-STATE

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

*— TASK-DB-ACCESS 끝 —*
