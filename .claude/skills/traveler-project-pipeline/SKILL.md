---
name: traveler-project-pipeline
description: Traveler PRD/SRS에서 Task를 생성·상세화·감사하고 5개 Screen과 Wave 개발을 지원하는 프로젝트 Skill
---

# Traveler Project Pipeline

Free Traveler의 PRD/SRS를 실제 Next.js 구현 Task로 변환·상세화·감사하고, `/run-wave WXX`(`CLAUDE.md` 규칙 6) 기반 Wave 개발을 지원하는 프로젝트 Skill이다.

**이 Skill은 `CLAUDE.md`(루트 전역 규칙)를 대체하지 않는다.** `CLAUDE.md`의 23개 규칙과 Harness Marker(`HARNESS_SCHEMA`, `DESIGN_PATH`, `SCREEN_CONTRACT`, `PROJECT_SCOPE`, `PLAYWRIGHT_ENABLED`, `PLAYWRIGHT_SCOPE`, `AUTO_MERGE`, `AWS_ENABLED`)가 항상 우선한다. 이 문서의 어떤 절도 `CLAUDE.md`와 다른 값을 말하지 않으며, 상충이 발견되면 `CLAUDE.md`를 정본으로 따르고 이 Skill을 갱신한다.

---

## 1. 입력 문서 목록

| 문서 | 역할 |
|---|---|
| `docs/06_SRS_UIUX_REVISED.md` | SRS 정본(`CLAUDE.md` 규칙 2) — Route/화면 구조, UI Route Contract, Release Acceptance Criteria |
| `docs/PROJECT_SCOPE.md` | Scope 분류 정본(`CLAUDE.md` 규칙 3) — REQ-FUNC-001~080/REQ-NF-001~034의 IMPLEMENT/EXCLUDED |
| `design-reference/D-001/DESIGN.md` | 디자인 정본(`CLAUDE.md` 규칙 4, `Status: LOCKED`) |
| `design-reference/SCREEN_ROUTE_CONTRACT.json` | Screen 정본(`CLAUDE.md` 규칙 5) — Screen ID·Route·Page Entry·Section 순서·기술 Route·이동·금지 기능 |
| `design-reference/UI_CONTRACT.md` | Screen별 영역 순서·주요 Component·상태·사용자 행동 서술본 |
| `docs/UIUX_TRACEABILITY.md` | 114개 Requirement ↔ Screen/Route/Page Entry 전수 추적표 |
| `docs/ARCHITECTURE.md` | 기술 스택·Server/Client 경계·Supabase 범위·DB 6테이블·테스트/CI 경계 |
| `docs/DECISION_LOG.md` | DEC-001~014 결정 이력(Wave, DB 6테이블, EXCLUDED 관리 등의 근거) |
| `TASKS/00_TASK_LIST.md` | Task List 정본(§4) — Category별 개요/상세 표 + NON_IMPLEMENTATION 표 |
| `TASKS/TASK-<ID>.md` | Task 상세 파일(§4) |
| `TASKS/TASK_MANIFEST.csv` | Task 평탄화 목록(Wave 분할·의존성 조회용) |
| `package.json`, 현재 `src/app`/`src/data` 파일 트리 | 실제 존재 여부 확인(가정 금지) |
| `CLAUDE.md` | 전역 규칙·Harness Marker(정본, 항상 우선) |

작업 시작 전 `python3 scripts/validate_inputs.py`로 위 정본 문서들의 정합성(스키마 버전, Screen 5개, Route 일치, Requirement 114개, AWS/EC2 비활성 등 11개 검사)을 확인한다. 실패하면 진행하지 않는다.

---

## 2. 5개 Screen과 Page Entry

`design-reference/SCREEN_ROUTE_CONTRACT.json`을 그대로 승계한다.

| Screen | Route | Page Entry | 역할 |
|---|---|---|---|
| SCR-001 | `/` | `src/app/page.tsx` | 핵심 |
| SCR-002 | `/about` | `src/app/about/page.tsx` | 보조 |
| SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | 핵심 |
| SCR-004 | `/mates` | `src/app/mates/page.tsx` | 핵심 |
| SCR-005 | `/account` | `src/app/account/page.tsx` | 핵심 |

이 5개 외의 별도 Route(`/destinations/[slug]`, `/safety/[countryCode]`, `/mates/[id]`, `/mates/new`, `/flights`, `/hotels`, `/auth/*`, `/my/*`, `/admin/*`)는 만들지 않는다 — 각각 5개 Screen의 탭·패널·Drawer/Modal로 통합되어 있다(`docs/DECISION_LOG.md` DEC-002·DEC-003).

---

## 3. IMPLEMENT·EXCLUDED 상태 처리 규칙

- 모든 Requirement는 `docs/PROJECT_SCOPE.md` 기준 `IMPLEMENT`, `IMPLEMENT(변형)`, `EXCLUDED` 중 하나의 상태를 갖는다.
- `IMPLEMENT`/`IMPLEMENT(변형)` Requirement는 `TASKS/00_TASK_LIST.md`의 Task Requirement Ref에 최소 1개 이상 연결한다.
- `EXCLUDED` Requirement는 상세 구현 Task나 `TASKS/TASK-<ID>.md` 파일을 만들지 않는다(§11). 대신 `TASKS/00_TASK_LIST.md`의 NON_IMPLEMENTATION 표에 근거와 후속 방향을 기록해 삭제하지 않고 보존한다(`docs/DECISION_LOG.md` DEC-014, `CLAUDE.md` 규칙 19).
- 새 Requirement나 상태 변경은 `docs/PROJECT_SCOPE.md`를 먼저 갱신한 뒤 Task List/상세에 반영한다. 반대 순서(Task를 먼저 만들고 Scope를 나중에 맞추는 것)로 진행하지 않는다.

---

## 4. Task List·상세 Task 형식

### `TASKS/00_TASK_LIST.md`
- Category(PAGE_OWNER/COMPONENT/DATA/DB/API/UNIT_TEST/E2E_TEST/CI_INFRA/MANUAL_CHECK)별로 **A. 개요**(Seq/Task ID/제목/Implementation Status/Requirement Ref/Screen/Route/Page Entry/Depends On/Priority)와 **B. 상세**(Expected Files/Functional AC/Visual AC/Security·Privacy AC/Verify) 두 표를 Task ID로 1:1 대응시킨다.
- 문서 끝에 EXCLUDED Requirement의 NON_IMPLEMENTATION 표(Requirement/근거/후속 방향)를 둔다.

### `TASKS/TASK-<ID>.md`
다음 14개 절을 이 순서로 포함한다: `Context`, `Project Scope`, `Requirement Ref`, `Screen / Route / Page Entry`, `Design Ref`, `Depends On`, `Expected Files`, `Functional AC`, `Visual AC`, `Security/Privacy AC`, `Test Cases`, `Verify`, `Definition of Done`, `Forbidden`.

- `Expected Files` 목록 밖의 파일을 만들거나 고치지 않는다(`CLAUDE.md` 규칙 8).
- `Forbidden` 절에는 최소한 "Expected Files 밖 파일 금지"와 "구현 코드 실행 결과 커밋/Branch/PR 생성 금지"를 포함한다.
- Task List와 상세 파일은 항상 1:1이어야 한다(`python3 scripts/audit_tasks.py` 검사 1).

### `TASKS/TASK_MANIFEST.csv`
Task List를 seq/task_id/title/category/implementation_status/requirement_ref/screen/route/page_entry/depends_on/priority/detail_file 12열로 평탄화한 조회용 산출물이다. 이 CSV를 직접 편집하지 않는다 — `TASKS/00_TASK_LIST.md`를 고친 뒤 `scripts/audit_tasks.py`를 실행하면 다시 생성된다.

---

## 5. Page Owner·Component 분리 규칙

- SCR-001~005 각 Screen당 `PAGE_OWNER` Task를 **정확히 1개**만 둔다.
- Page Owner Task는 자신의 Page Entry(`src/app/**/page.tsx`)에서 이미 만들어진 Component/Data/API Task의 결과물을 **조립만** 한다. 새로운 Component 파일을 직접 생성하지 않는다(`CLAUDE.md` 규칙 9).
- Page Owner Task는 같은 Screen의 `COMPONENT` Task에 `Depends On`으로 최소 1개 이상 의존해야 한다.
- `SCR-001` Page Owner는 Next.js 기본 Starter 콘텐츠 제거를 Functional AC에 명시한다(`CLAUDE.md` 규칙 10).
- `SCR-003` Page Owner는 항공·숙소·동행 구하기 3개 탭을 모두 실제로 조립한다(`CLAUDE.md` 규칙 11).
- `SCR-005` Page Owner는 Guest·Member·Admin 역할별 상태를 실제로 조립하고, 역할에 없는 탭은 렌더링하지 않는다.
- 하나의 Task가 2개 이상의 Page Entry를 동시에 소유하지 않는다.

---

## 6. DB 6개 Table과 정적 Data 경계

- Supabase DB는 정확히 6개 테이블로 제한한다: `USER_PROFILE`, `MATE_POST`, `MATE_APPLICATION`, `USER_BLOCK`, `REPORT`, `OUTBOUND_LINK_SETTING`(`docs/DECISION_LOG.md` DEC-006).
- 여행지·국가별 안전정보·대표(`free_traveler`) 소개는 `src/data`의 정적 TypeScript Data로 관리하며 DB 테이블을 만들지 않는다(`CLAUDE.md` 규칙 16, `docs/DECISION_LOG.md` DEC-004).
- `DB` 카테고리 Task는 Schema·RLS·Access·Seed 4종을 모두 갖춘다(`TASK-DB-SCHEMA-BASE`, `TASK-DB-RLS-BASE`, `TASK-DB-ACCESS`, `TASK-DB-SEED-BASE`).
- Prisma를 포함한 어떤 ORM도 사용하지 않는다. Supabase JS Client(`@supabase/supabase-js`, `@supabase/ssr`)를 `src/lib/db/*`에서 직접 호출한다(`CLAUDE.md` 규칙 17).

---

## 7. 외부 입력 비저장 불변조건

- 항공·숙소 조건 입력값(국가·지역·날짜)은 Client Component의 일시 상태(`useState`)로만 유지한다.
- 이 값을 서버 API, Server Action, DB, 외부 URL의 쿼리·본문·쿠키, 서버 로그, 분석 이벤트 **어디로도 보내지 않는다**(`CLAUDE.md` 규칙 12, `docs/DECISION_LOG.md` DEC-007).
- 이 입력을 위한 API Route를 만들지 않는다.
- 관련 Task(`TASK-COMP-SCR003-FLIGHT-FORM`, `TASK-COMP-SCR003-HOTEL-FORM`, `TASK-PAGE-SCR003`)의 AC와 Forbidden 절에 이 불변조건을 명시하고, `scripts/audit_tasks.py` 검사 13으로 확인한다.

---

## 8. 기본 Auth·성인·RLS 규칙

- Supabase Auth로 이메일 회원가입·인증·로그인·로그아웃·비밀번호 재설정을 구현한다.
- 성인 확인은 `is_adult`, `adult_verified_at`만 저장하고 정확한 생년월일은 저장하지 않는다.
- RLS는 다음 3원칙만 적용한다(`docs/ARCHITECTURE.md` §7.3):
  1. 본인 데이터만 쓰기(`MATE_POST`/`USER_BLOCK`/`REPORT`는 소유자만 쓰기 가능)
  2. 당사자만 비공개 열람(`MATE_APPLICATION.message`는 신청자 본인과 글 작성자만 조회)
  3. 역할 기반 관리자 열람(`REPORT` 상세·`OUTBOUND_LINK_SETTING` 쓰기는 Moderator/Admin만)
- Supabase 쓰기는 Auth·동행(모집글/참가요청/차단)·신고·외부 URL 설정 범위로 제한한다(`CLAUDE.md` 규칙 13).
- RLS를 우회하는 Client 코드(조건 없는 전체 조회, RLS 미적용 테이블 직접 접근)를 작성하지 않고, Service Role Key는 Client 코드·번들에 절대 포함하지 않는다(`CLAUDE.md` 규칙 14·15).

---

## 9. Playwright Chromium Smoke 범위

- `PLAYWRIGHT_ENABLED=true`, `PLAYWRIGHT_SCOPE=chromium-smoke`(`CLAUDE.md` Harness Marker)를 그대로 따른다.
- `E2E_TEST` 카테고리 Task는 2~3개(`E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH`)로 핵심 흐름만 커버한다.
- Chromium 단일 브라우저로만 실행하고 Firefox·WebKit 매트릭스를 추가하지 않는다(`CLAUDE.md` 규칙 18).
- `scripts/audit_tasks.py` 검사 15가 Smoke Task 존재와 Chromium 단독 여부를 확인한다.

---

## 10. Wave 내부 순차 실행

- `/run-wave WXX`가 표준 개발 명령이다(`CLAUDE.md` 규칙 6, `docs/DECISION_LOG.md` DEC-010).
- Wave 내부 Task는 `TASKS/TASK_MANIFEST.csv`의 `depends_on` 순서에 따라 **한 번에 하나씩** 구현한다(`CLAUDE.md` 규칙 7, DEC-011 — Single Agent 순차 수행).
- 각 Task는 §4의 Task 상세 형식이 정의한 `Expected Files` 밖을 수정하지 않는다.
- 하나의 Wave(예: 하나의 Screen 조립)를 완료하면 사람의 Preview 확인을 받은 뒤에만 다음 Wave로 진행한다(`CLAUDE.md` 규칙 22).
- Task 완료 순서는 `CLAUDE.md`의 "Task 완료 순서"(Task 읽기 → 입력 확인 → 구현 → 관련 포맷·Unit Test → 필요 시 Playwright → Diff 확인 → 완료 보고)를 그대로 따른다.

---

## 11. EXCLUDED 보호

- `EXCLUDED` Requirement에 대해 구현 Task를 만들지 않고, `TASKS/TASK-<ID>.md` 상세 파일도 만들지 않는다(§3).
- `EXCLUDED` Requirement ID를 어떤 Task의 Requirement Ref에도 링크하지 않는다.
- `docs/06_SRS_UIUX_REVISED.md`·`docs/UIUX_TRACEABILITY.md`·`TASKS/00_TASK_LIST.md`의 NON_IMPLEMENTATION 표에서 `EXCLUDED` 항목을 삭제하지 않는다 — 상태 변경이 필요하면 `docs/PROJECT_SCOPE.md`를 먼저 개정한다(§3).
- `scripts/audit_tasks.py` 검사 17(114개 Requirement 전부가 Task 또는 NON_IMPLEMENTATION 표에 존재)과 18(EXCLUDED가 구현 Task/상세 파일에 없음)로 보호 상태를 자동 확인한다.

---

## 12. AWS·EC2·자동 Merge 금지

- `AWS_ENABLED=false`, `AUTO_MERGE=false`(`CLAUDE.md` Harness Marker)를 그대로 따른다.
- 인프라는 Vercel(호스팅)과 Supabase(DB·Auth)만 사용한다. EC2를 포함한 AWS 서비스, 그 밖의 별도 클라우드 인프라를 추가하지 않는다(`CLAUDE.md` 규칙 17, `docs/DECISION_LOG.md` DEC-013).
- CI(GitHub Actions)는 검증(타입체크·Lint·Test·콘텐츠 완전성 검사)까지만 수행한다. PR 생성과 Merge는 자동화하지 않고 사람이 수행한다(`CLAUDE.md` 규칙 21, DEC-012).
- `scripts/audit_tasks.py` 검사 16이 EC2/AWS/자동 Merge가 활성 구현 대상으로 언급되지 않았는지 확인한다(배제 문맥 서술은 위반으로 보지 않는다).

---

## 파이프라인 스크립트

| 스크립트 | 시점 | 역할 |
|---|---|---|
| `python3 scripts/validate_inputs.py` | Task List/상세를 만들거나 고치기 전 | 11개 검사(§1) — 실패 시 진행하지 않는다 |
| `python3 scripts/audit_tasks.py` | Task List/상세를 만들거나 고친 직후, Wave 완료 보고 전 | 18개 검사(§3~12에 대응) + `TASKS/TASK_MANIFEST.csv`·`TASKS/TASK_AUDIT_REPORT.md` 생성 — 실패 시 완료로 보고하지 않는다(`CLAUDE.md` 규칙 23) |

---

*이 Skill과 `.claude/commands/gen-tasklist.md`, `gen-task-details.md`, `audit-tasks.md`는 동일한 경로 규칙(`TASKS/00_TASK_LIST.md`, `TASKS/TASK-<ID>.md`)을 공유해야 한다. Command 파일이 이전 경로(`docs/tasks/`)를 참조하고 있다면 이 Skill 기준으로 갱신한다.*
