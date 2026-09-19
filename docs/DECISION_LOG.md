# Free Traveler — Decision Log

- **Document ID:** DECLOG-TRAVEL-001
- **작성일:** 2026-09-20
- **상태:** Active — 새 결정은 이 문서 끝에 신규 DEC-XXX 항목으로 추가하고, 기존 항목은 삭제 대신 상태를 `Superseded`로 변경한다.

---

## 표기 규칙

각 결정은 ID·제목·상태·결정일·컨텍스트·결정 내용·근거·관련 문서·영향/후속 조치를 기록한다. 상태는 `Accepted`(유효) 또는 `Superseded`(다른 결정으로 대체됨) 중 하나다.

---

## DEC-001 — 실제 개발 루트는 `traveler/app`

- **상태:** Accepted
- **결정일:** 2026-09-20

**컨텍스트:** 저장소 최상위 디렉터리와 실제 Next.js 프로젝트 루트가 다르다. `package.json`, `src/app`, `node_modules` 해석 기준은 모두 `traveler/app` 아래에 있다.

**결정 내용:** 이 프로젝트의 실제 개발 루트는 `traveler/app`이다. 모든 파일 경로(`src/app/page.tsx` 등), 스크립트 실행(`python3 scripts/validate_inputs.py` 등), 문서 내 상대 경로는 `traveler/app`을 기준으로 한다.

**근거:** `package.json`이 `traveler/app/package.json`에 위치하며, `AGENTS.md`가 "node_modules 해석은 이 파일의 디렉터리 기준"임을 명시한다.

**관련 문서:** `package.json`, `AGENTS.md`, `CLAUDE.md`

**영향/후속 조치:** 이후 모든 문서·스크립트·Task 파일의 경로 표기는 `traveler/app`을 프로젝트 루트로 가정한다(별도로 `app/` 접두사를 붙이지 않는다).

---

## DEC-002 — 디자인 Screen은 핵심 4개·보조 1개

- **상태:** Accepted
- **결정일:** 2026-09-19

**컨텍스트:** 원래 SRS(`02_SRS_BASELINE.md`)는 `/destinations`, `/flights`, `/hotels`, `/mates`, `/mates/[id]`, `/safety` 등 다수의 개별 Route를 정의했다. 이를 그대로 구현하면 화면 수가 과도하게 늘어난다.

**결정 내용:** 디자인 Screen을 정확히 5개(SCR-001~005)로 고정하고, 그중 4개(SCR-001, SCR-003, SCR-004, SCR-005)를 핵심 화면, 1개(SCR-002)를 보조 화면으로 구분한다. 그 외 Route는 5개 Screen의 탭·패널·Drawer/Modal로 통합한다.

**근거:** `docs/03_UI_COVERAGE_ANALYSIS.md`, `docs/05_UIUX_APPROVED.md`의 Route→Screen 통합 매핑, `design-reference/SCREEN_ROUTE_CONTRACT.json`의 `screen_role_summary`(core_count=4, supporting_count=1), `design-reference/UI_CONTRACT.md` §0.

**관련 문서:** `docs/03_UI_COVERAGE_ANALYSIS.md`, `docs/05_UIUX_APPROVED.md`, `docs/06_SRS_UIUX_REVISED.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`, `design-reference/UI_CONTRACT.md`

**영향/후속 조치:** `/destinations/[slug]`, `/safety/[countryCode]`, `/mates/[id]`, `/mates/new`, `/flights`, `/hotels`, `/auth/*`, `/my/*`, `/admin/*`는 별도 페이지 파일로 만들지 않는다.

---

## DEC-003 — `/travel-tools`에 항공·숙소·동행 작성을 통합

- **상태:** Accepted
- **결정일:** 2026-09-19

**컨텍스트:** DEC-002에 따라 화면 수를 5개로 제한하면서, 원래 분리돼 있던 항공(`/flights`)·숙소(`/hotels`)·동행 작성(`/mates/new`) 흐름을 어디에 배치할지 결정해야 했다.

**결정 내용:** SCR-003(`/travel-tools`) 한 화면 안에 항공편/숙소/동행 구하기 3개 탭을 두고, 각 탭이 독립적인 입력·검증·완료 상태를 갖도록 조립한다.

**근거:** `docs/PROJECT_SCOPE.md`의 "여행 준비" 화면 정의, `design-reference/SCREEN_ROUTE_CONTRACT.json`의 SCR-003 `sections_order`(`tab_bar_flight_hotel_mate` 포함), `TASKS/TASK-PAGE-SCR003.md`.

**관련 문서:** `docs/PROJECT_SCOPE.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`, `TASKS/TASK-PAGE-SCR003.md`, `TASKS/TASK-COMP-SCR003-*.md`

**영향/후속 조치:** SCR-003 Page Owner Task는 하위 Component를 새로 만들지 않고 항공/숙소/동행 Component 3종을 조립하는 데만 집중한다(`docs/ARCHITECTURE.md` §4).

---

## DEC-004 — 여행지·안전·대표는 정적 TypeScript Data

- **상태:** Accepted
- **결정일:** 2026-09-17

**컨텍스트:** 원래 SRS는 `DESTINATION`, `COUNTRY_SAFETY`, `REPRESENTATIVE_PROFILE` 등을 Supabase 테이블로 정의했으나, 콘텐츠 관리자 CRUD(CMS)까지 만들면 MVP 범위를 크게 벗어난다.

**결정 내용:** 여행지, 국가별 안전정보, 대표(`free_traveler`) 소개 콘텐츠는 Supabase DB가 아니라 `src/data`의 TypeScript 정적 데이터로 관리한다. 콘텐츠 변경은 코드 배포로만 반영하고 관리자 CRUD 화면(CMS)은 만들지 않는다.

**근거:** `docs/PROJECT_SCOPE.md` §3 구현 방식("여행지·안전·대표 콘텐츠는 `src/data`의 정적 데이터"), §4 공통 제외 범위("전체 콘텐츠 CMS").

**관련 문서:** `docs/PROJECT_SCOPE.md`, `docs/ARCHITECTURE.md` §6, `TASKS/TASK-DATA-DESTINATIONS.md`, `TASKS/TASK-DATA-SAFETY.md`, `TASKS/TASK-DATA-REPRESENTATIVE.md`

**영향/후속 조치:** DEC-006(DB 6개 테이블 제한)에서 콘텐츠 계열 테이블이 제외된 직접적 원인이 된다.

---

## DEC-005 — Supabase는 Auth와 동행 기능 중심

- **상태:** Accepted
- **결정일:** 2026-09-20

**컨텍스트:** DEC-004로 콘텐츠 저장을 Supabase에서 제외한 뒤, Supabase의 실제 사용 범위를 명확히 할 필요가 있었다.

**결정 내용:** Supabase는 (1) 이메일 회원가입·인증·로그인·성인 확인 상태 저장, (2) 동행 모집글·참가 요청·차단·신고·외부 URL 설정의 데이터 저장 및 RLS 강제, 이 두 가지 목적으로만 사용한다.

**근거:** `docs/PROJECT_SCOPE.md` §3, `docs/ARCHITECTURE.md` §7("Supabase는 콘텐츠 저장소가 아니라 회원 인증과 동행 기능 전용").

**관련 문서:** `docs/PROJECT_SCOPE.md`, `docs/ARCHITECTURE.md` §7, `TASKS/TASK-DB-SCHEMA-BASE.md`

**영향/후속 조치:** Supabase Storage(이미지 업로드)는 사용하지 않는다(이미지는 일반 인터넷 URL + alt 텍스트만 사용, DEC-004와 연계).

---

## DEC-006 — DB는 6개 Table로 제한

- **상태:** Accepted
- **결정일:** 2026-09-20

**컨텍스트:** DEC-004·DEC-005에 따라 Supabase 사용 범위를 좁힌 결과, 실제로 필요한 테이블 수를 명시적으로 확정할 필요가 있었다.

**결정 내용:** Supabase DB는 정확히 6개 테이블(`USER_PROFILE`, `MATE_POST`, `MATE_APPLICATION`, `USER_BLOCK`, `REPORT`, `OUTBOUND_LINK_SETTING`)로 제한한다. 원래 SRS의 `COUNTRY`/`REGION`/`DESTINATION`/`DESTINATION_CONTENT`/`COUNTRY_SAFETY`/`MEDIA_ASSET`/`REPRESENTATIVE_PROFILE`(DEC-004로 정적 데이터화)과 `AUDIT_LOG`(DEC-014로 EXCLUDED)는 만들지 않는다.

**근거:** `TASKS/TASK-DB-SCHEMA-BASE.md`, `docs/ARCHITECTURE.md` §7.2. `scripts/audit_tasks.py` 검사 12번이 이 범위를 자동 검증한다.

**관련 문서:** `TASKS/TASK-DB-SCHEMA-BASE.md`, `TASKS/TASK-DB-RLS-BASE.md`, `TASKS/TASK-DB-ACCESS.md`, `TASKS/TASK-DB-SEED-BASE.md`, `docs/ARCHITECTURE.md` §7

**영향/후속 조치:** 신규 기능 추가 시 7번째 테이블이 필요하다고 판단되면, 이 DEC-006을 갱신하거나 새 DEC 항목으로 예외를 명시적으로 기록해야 한다(암묵적 추가 금지).

---

## DEC-007 — 항공·숙소 입력은 Browser Memory에만 유지

- **상태:** Accepted
- **결정일:** 2026-09-17

**컨텍스트:** 항공·숙소 조건 입력이 실제 예약/검색 기능처럼 오인되지 않도록, 입력값의 저장·전달 범위를 처음부터 제한해야 했다(`01_PRD.md` 제품 원칙 3번).

**결정 내용:** 항공·숙소 국가·지역·날짜 입력값은 Client Component의 `useState` 일시 상태로만 유지한다. 서버 API, Server Action, DB, 외부 URL의 쿼리·본문·쿠키, 서버 로그, 분석 이벤트 어디로도 전송하지 않는다. 이 폼을 위한 API Route도 만들지 않는다.

**근거:** `docs/PROJECT_SCOPE.md`의 CON-01/CON-02(원 SRS 제약 승계), REQ-FUNC-017/025, REQ-NF-017. `docs/ARCHITECTURE.md` §5.

**관련 문서:** `docs/PROJECT_SCOPE.md`, `docs/ARCHITECTURE.md` §5, `TASKS/TASK-COMP-SCR003-FLIGHT-FORM.md`, `TASKS/TASK-COMP-SCR003-HOTEL-FORM.md`

**영향/후속 조치:** `scripts/audit_tasks.py` 검사 13번("외부 입력 비저장 AC 존재")이 이 결정의 준수 여부를 자동 검사한다.

---

## DEC-008 — Airbnb `DESIGN.md`는 Vendor 참고본, D-001이 실제 정본

- **상태:** Accepted
- **결정일:** 2026-09-19

**컨텍스트:** `design-reference/vendor/airbnb/DESIGN.md`를 구조적 참고 자료로 사용했으나, 이 자료의 색상·폰트·컴포넌트를 그대로 베끼면 상표·라이선스 문제가 발생할 수 있었다.

**결정 내용:** `design-reference/vendor/airbnb/DESIGN.md`는 여백·카드·타이포그래피 배치 등 **구조적 아이디어만 참고하는 Vendor 참고본**으로 취급한다. 실제 색상 토큰·타이포그래피·컴포넌트 규칙의 정본은 `design-reference/D-001/DESIGN.md`이며, `design-reference/DESIGN_MANIFEST.md`에서 `Status: LOCKED`로 고정한다.

**근거:** `design-reference/D-001/DESIGN.md` §0 Overview("Airbnb의 색상 값·폰트명·워드마크·예약/결제 UI는 어떤 형태로도 재현하지 않는다"), `design-reference/DESIGN_MANIFEST.md`.

**관련 문서:** `design-reference/vendor/airbnb/DESIGN.md`, `design-reference/D-001/DESIGN.md`, `design-reference/DESIGN_MANIFEST.md`

**영향/후속 조치:** 디자인 토큰을 바꿔야 할 경우 `D-001`을 직접 수정하지 않고 `D-002` 디렉터리를 새로 만들어 `DESIGN_MANIFEST.md`의 Active Design을 갱신하는 절차를 따른다.

---

## DEC-009 — Playwright는 Chromium Smoke만 필수

- **상태:** Accepted
- **결정일:** 2026-09-19

**컨텍스트:** 다중 브라우저(Firefox/WebKit) E2E 매트릭스는 MVP 단계의 리소스 대비 효용이 낮다.

**결정 내용:** Playwright E2E 테스트는 Chromium 단일 브라우저로만 구성하며, 핵심 흐름을 커버하는 Smoke 성격의 Task(`E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH`)만 필수로 둔다. Firefox·WebKit 프로젝트는 구성하지 않는다.

**근거:** `TASKS/TASK-E2E-PUBLIC-SMOKE.md` 등의 Forbidden 절("Chromium 외 다른 브라우저 매트릭스를 추가하지 않는다"), `docs/ARCHITECTURE.md` §8.

**관련 문서:** `TASKS/TASK-E2E-PUBLIC-SMOKE.md`, `TASKS/TASK-E2E-TRAVEL-TOOLS.md`, `TASKS/TASK-E2E-MATE-AUTH.md`, `docs/ARCHITECTURE.md` §8

**영향/후속 조치:** `scripts/audit_tasks.py` 검사 15번이 Chromium Smoke Task 존재를, 16번 인접 로직이 타 브라우저 미언급을 자동 검사한다.

---

## DEC-010 — 사용자의 개발 실행 단위는 Wave

- **상태:** Accepted
- **결정일:** 2026-09-20

**컨텍스트:** `TASKS/00_TASK_LIST.md`의 73개 Task를 한 번에 전부 실행하지 않고, 의존 관계(Depends On)를 고려해 묶어서 순차 진행할 실행 단위가 필요했다.

**결정 내용:** 사용자는 Task 목록을 임의 개수로 나눈 **Wave** 단위로 개발을 실행한다. 하나의 Wave는 서로 의존하는 Task들을 묶어 하나의 작업 세션에서 처리할 대상으로 삼는다.

**근거:** 사용자가 이 세션에서 개발 실행 방식으로 명시함. Wave의 세부 분할 기준(Task 수, 우선순위 정렬 등)은 이 문서 작성 시점에 별도로 문서화되어 있지 않다.

**관련 문서:** `TASKS/00_TASK_LIST.md`, `TASKS/TASK_MANIFEST.csv`

**영향/후속 조치:** Wave 분할 기준이 별도 문서로 확정되면 이 항목에 참조를 추가한다. 그 전까지는 Task의 `Depends On` 열(`TASKS/TASK_MANIFEST.csv`)을 Wave 순서 결정의 근거로 사용한다.

---

## DEC-011 — Single Agent가 Wave 내부 Task를 순차 수행

- **상태:** Accepted
- **결정일:** 2026-09-20

**컨텍스트:** DEC-010의 Wave 내부에서 여러 Task를 병렬 Agent로 나눠 처리할지, 하나의 Agent가 순서대로 처리할지 결정이 필요했다.

**결정 내용:** 하나의 Wave 안에서는 **Single Agent**가 Task를 Seq/Depends On 순서에 따라 순차적으로 수행한다. Wave 내부 Task를 여러 Agent에 동시 분배하지 않는다.

**근거:** 사용자가 이 세션에서 실행 방식으로 명시함. Task 간 의존 관계(Depends On)가 촘촘해 병렬화 이득보다 순서 보장의 중요성이 크다.

**관련 문서:** `TASKS/00_TASK_LIST.md`, `TASKS/TASK_MANIFEST.csv`

**영향/후속 조치:** 병렬 실행이 필요한 예외 상황(예: 서로 의존하지 않는 DATA Task 여러 개)이 생기면 이 결정에 예외 조건을 추가하는 형태로 갱신한다.

---

## DEC-012 — PR·Merge는 사용자가 수동 수행

- **상태:** Accepted
- **결정일:** 2026-09-20

**컨텍스트:** CI(GitHub Actions)와 Vercel Preview까지는 자동화하되, 코드를 main 브랜치에 실제로 반영하는 마지막 단계의 책임 소재를 명확히 할 필요가 있었다.

**결정 내용:** Pull Request 생성과 Merge는 자동화하지 않고 **사용자가 직접 검토하고 수동으로 수행**한다. Agent나 CI 파이프라인이 자동으로 Merge하지 않는다.

**근거:** `docs/ARCHITECTURE.md` §9("사람이 PR을 검토하고 병합한다"), `TASKS/TASK-CI-PIPELINE.md`의 Functional AC("자동 Merge Runner는 만들지 않는다 — 병합 승인은 사람이 수행한다").

**관련 문서:** `docs/ARCHITECTURE.md` §9, `TASKS/TASK-CI-PIPELINE.md`, `TASKS/TASK-INFRA-VERCEL-DEPLOY.md`

**영향/후속 조치:** DEC-013(자동 Merge 미사용)과 함께 `scripts/audit_tasks.py` 검사 16번이 "자동 병합/auto-merge" 관련 키워드가 활성 구현 대상으로 등장하지 않는지 자동 검사한다.

---

## DEC-013 — EC2·AWS는 사용하지 않음

- **상태:** Accepted
- **결정일:** 2026-09-17

**컨텍스트:** 인프라를 Vercel+Supabase로 한정할지, 추가 클라우드 인프라(AWS EC2 등)를 허용할지 MVP 초기에 결정할 필요가 있었다.

**결정 내용:** 인프라는 **Vercel(호스팅)과 Supabase(DB·Auth)만 사용**하며, EC2를 포함한 AWS 서비스는 사용하지 않는다.

**근거:** `docs/PROJECT_SCOPE.md` §4 공통 제외 범위("EC2·AWS 인프라 — Vercel 배포로 한정"), `docs/ARCHITECTURE.md` §9.

**관련 문서:** `docs/PROJECT_SCOPE.md`, `docs/ARCHITECTURE.md` §9, `TASKS/TASK-INFRA-VERCEL-DEPLOY.md`, `TASKS/TASK-INFRA-SUPABASE-PROJECT.md`

**영향/후속 조치:** `scripts/validate_inputs.py` 검사 11번과 `scripts/audit_tasks.py` 검사 16번이 AWS/EC2가 "활성 기술로 정의"되지 않았는지 각각 입력 문서와 Task 상세 파일 기준으로 자동 검사한다.

---

## DEC-014 — 제외 기능은 EXCLUDED로 관리

- **상태:** Accepted
- **결정일:** 2026-09-17

**컨텍스트:** `02_SRS_BASELINE.md`의 REQ-FUNC-001~080, REQ-NF-001~034 중 이번 MVP 범위에서 만들지 않는 항목이 다수 있었다. 이를 요구사항 목록에서 삭제하면 향후 추적이 불가능해진다.

**결정 내용:** MVP 범위에서 제외하는 모든 Requirement는 목록에서 **삭제하지 않고 `EXCLUDED` 상태로 표기**하며, 제외 사유와 후속 방향을 함께 기록한다. `EXCLUDED` Requirement에 대해서는 상세 구현 Task나 Task 상세 파일을 만들지 않는다.

**근거:** `docs/PROJECT_SCOPE.md`("어떤 Requirement도 표에서 삭제하지 않는다"), `docs/UIUX_TRACEABILITY.md`, `TASKS/00_TASK_LIST.md`의 NON_IMPLEMENTATION 표.

**관련 문서:** `docs/PROJECT_SCOPE.md`, `docs/UIUX_TRACEABILITY.md`, `TASKS/00_TASK_LIST.md` §2 NON_IMPLEMENTATION, `scripts/audit_tasks.py`

**영향/후속 조치:** `scripts/audit_tasks.py` 검사 17번(114개 Requirement 전부가 Task 또는 EXCLUDED 표에 존재)과 18번(EXCLUDED Requirement에 구현 Task/상세 파일이 없음)이 이 결정의 준수 여부를 자동 검사한다.

---

## 요약 표

| ID | 제목 | 상태 |
|---|---|---|
| DEC-001 | 실제 개발 루트는 `traveler/app` | Accepted |
| DEC-002 | 디자인 Screen은 핵심 4개·보조 1개 | Accepted |
| DEC-003 | `/travel-tools`에 항공·숙소·동행 작성을 통합 | Accepted |
| DEC-004 | 여행지·안전·대표는 정적 TypeScript Data | Accepted |
| DEC-005 | Supabase는 Auth와 동행 기능 중심 | Accepted |
| DEC-006 | DB는 6개 Table로 제한 | Accepted |
| DEC-007 | 항공·숙소 입력은 Browser Memory에만 유지 | Accepted |
| DEC-008 | Airbnb `DESIGN.md`는 Vendor 참고본, D-001이 실제 정본 | Accepted |
| DEC-009 | Playwright는 Chromium Smoke만 필수 | Accepted |
| DEC-010 | 사용자의 개발 실행 단위는 Wave | Accepted |
| DEC-011 | Single Agent가 Wave 내부 Task를 순차 수행 | Accepted |
| DEC-012 | PR·Merge는 사용자가 수동 수행 | Accepted |
| DEC-013 | EC2·AWS는 사용하지 않음 | Accepted |
| DEC-014 | 제외 기능은 EXCLUDED로 관리 | Accepted |

---

*— End of DECLOG-TRAVEL-001 —*
