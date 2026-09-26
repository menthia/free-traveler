# Traveler Task List

- **Document ID:** TASKS-LIST-001
- **기반 문서:** `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`, `docs/UIUX_TRACEABILITY.md`, `design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`, 현재 `src/app` 파일 트리
- **작성일:** 2026-09-19
- **선행 검사:** `python3 scripts/validate_inputs.py` → `VALIDATE_INPUTS_PASS (검사 수: 11)` 통과 후 작성
- **상태:** Task List Baseline — 실제 구현 코드·Branch·Commit·Issue는 생성하지 않았다

---

## 0. 요약

- **총 Task 수: 73개**

| Category | 개수 |
|---|---:|
| Page Owner(PAGE_OWNER) | 5 |
| Component(COMPONENT) | 33 |
| Static Data(DATA) | 5 |
| Database(DB) | 4 |
| API / Backend(API) | 12 |
| Unit / Integration Test(UNIT_TEST) | 4 |
| E2E Test (Playwright)(E2E_TEST) | 3 |
| CI / Infra(CI_INFRA) | 3 |
| Manual / Release Check(MANUAL_CHECK) | 4 |
| **합계** | **73** |

| Requirement 커버리지 | 개수 |
|---|---:|
| REQ-FUNC-001~080 + REQ-NF-001~034 (총) | 114 |
| IMPLEMENT 계열(IMPLEMENT+IMPLEMENT(변형)) | 84 |
| EXCLUDED(NON_IMPLEMENTATION 표로 이동) | 30 |
| IMPLEMENT 계열 중 Task에 연결됨 | 84 |
| **IMPLEMENT 계열 중 Task 미연결(누락)** | **0** |

**COMPLETION STATUS: 모든 IMPLEMENT 계열 Requirement가 최소 1개 Task에 연결되었고, 모든 EXCLUDED Requirement가 §2 NON_IMPLEMENTATION 표에 근거·후속 방향과 함께 기록되어 있다.**

Task 수(73개)는 참고 수치이며 완료 조건으로 사용하지 않는다. 완료 조건은 위 Requirement 커버리지(114개 전부 IMPLEMENT 또는 EXCLUDED로 귀결)다.

---

## 1. Task List

열 구성: `Seq, Task ID, 제목, Category, Implementation Status, Requirement Ref, Screen, Route, Page Entry, Depends On, Expected Files, Functional AC, Visual AC, Security/Privacy AC, Verify, Priority`

가독성을 위해 Category별로 묶고, 각 Task를 **A. 개요**(Seq/Task ID/제목/Category/Implementation Status/Requirement Ref/Screen/Route/Page Entry/Depends On/Priority)와 **B. 상세**(Expected Files/Functional AC/Visual AC/Security·Privacy AC/Verify) 두 개의 표로 짝지어 표기한다. Task ID로 두 표가 1:1 대응한다.

### 1.1 Page Owner (PAGE_OWNER) — 5개

**A. 개요**

| Seq | Task ID | 제목 | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Priority |
|---:|---|---|---|---|---|---|---|---|---|
| 10 | PAGE-SCR001 | SCR-001 메인 페이지 조립(`/`) | IMPLEMENT(변형) | REQ-FUNC-001<br>REQ-FUNC-002<br>REQ-FUNC-003<br>REQ-FUNC-004<br>REQ-FUNC-005<br>REQ-FUNC-006<br>REQ-FUNC-007<br>REQ-FUNC-009<br>REQ-FUNC-047<br>REQ-FUNC-048<br>REQ-FUNC-049<br>REQ-FUNC-050<br>REQ-FUNC-051<br>REQ-FUNC-052<br>REQ-FUNC-053<br>REQ-FUNC-054<br>REQ-FUNC-067<br>REQ-FUNC-068 | SCR-001 | / | src/app/page.tsx | COMP-GLOBAL-SHELL<br>COMP-GLOBAL-SEO-METADATA<br>COMP-SCR001-HERO-SEARCH<br>COMP-SCR001-DESTINATION-DIRECTORY<br>COMP-SCR001-THEME-CHIPS<br>COMP-SCR001-SAFETY<br>COMP-SCR001-MATE-PREVIEW<br>COMP-SCR001-CURATOR-SUMMARY<br>DATA-DESTINATIONS<br>DATA-SAFETY<br>DATA-REPRESENTATIVE | Must |
| 17 | PAGE-SCR002 | SCR-002 대표 소개 페이지 조립(`/about`) | IMPLEMENT(변형) | REQ-FUNC-057<br>REQ-FUNC-058<br>REQ-FUNC-059<br>REQ-FUNC-060<br>REQ-FUNC-061<br>REQ-FUNC-062<br>REQ-FUNC-063 | SCR-002 | /about | src/app/about/page.tsx | COMP-GLOBAL-SHELL<br>COMP-GLOBAL-SEO-METADATA<br>COMP-SCR002-PROFILE-HERO<br>COMP-SCR002-STATS-AND-INTRO<br>COMP-SCR002-TIMELINE<br>COMP-SCR002-COUNTRY-CHIPS<br>COMP-SCR002-GALLERY<br>COMP-SCR002-MEMORABLE-CTA<br>DATA-REPRESENTATIVE | Should |
| 24 | PAGE-SCR003 | SCR-003 통합 여행 준비 페이지 조립(`/travel-tools`) | IMPLEMENT | REQ-FUNC-011<br>REQ-FUNC-012<br>REQ-FUNC-013<br>REQ-FUNC-014<br>REQ-FUNC-015<br>REQ-FUNC-016<br>REQ-FUNC-018<br>REQ-FUNC-019<br>REQ-FUNC-020<br>REQ-FUNC-021<br>REQ-FUNC-022<br>REQ-FUNC-023<br>REQ-FUNC-024<br>REQ-FUNC-026<br>REQ-FUNC-027<br>REQ-FUNC-028<br>REQ-FUNC-031<br>REQ-FUNC-032<br>REQ-FUNC-054<br>REQ-FUNC-080 | SCR-003 | /travel-tools | src/app/travel-tools/page.tsx | COMP-GLOBAL-SHELL<br>COMP-GLOBAL-SEO-METADATA<br>COMP-SCR003-INTRO-TABS<br>COMP-SCR003-FLIGHT-FORM<br>COMP-SCR003-HOTEL-FORM<br>COMP-SCR003-TIPS<br>COMP-SCR003-MATE-COMPOSE<br>COMP-SCR003-MATE-LOGIN-GATE | Must |
| 32 | PAGE-SCR004 | SCR-004 동행 조회 페이지 조립(`/mates`) | IMPLEMENT(변형) | REQ-FUNC-030<br>REQ-FUNC-033<br>REQ-FUNC-034<br>REQ-FUNC-035<br>REQ-FUNC-036<br>REQ-FUNC-037<br>REQ-FUNC-039<br>REQ-FUNC-040<br>REQ-FUNC-043 | SCR-004 | /mates | src/app/mates/page.tsx | COMP-GLOBAL-SHELL<br>COMP-GLOBAL-SEO-METADATA<br>COMP-SCR004-INTRO<br>COMP-SCR004-FILTER-BAR<br>COMP-SCR004-POST-LIST<br>COMP-SCR004-DETAIL-PANEL<br>COMP-SCR004-APPLICATION-FORM<br>COMP-SCR004-REPORT-BLOCK-ACTIONS<br>COMP-SCR004-STEP-GUIDE-AND-SAFETY<br>API-MATES-CRUD | Must |
| 38 | PAGE-SCR005 | SCR-005 계정·관리 페이지 조립(`/account`) | IMPLEMENT(변형) | REQ-FUNC-027<br>REQ-FUNC-028<br>REQ-FUNC-029<br>REQ-FUNC-036<br>REQ-FUNC-038<br>REQ-FUNC-040<br>REQ-FUNC-041<br>REQ-FUNC-042<br>REQ-FUNC-043<br>REQ-FUNC-066<br>REQ-FUNC-068<br>REQ-FUNC-077<br>REQ-FUNC-080 | SCR-005 | /account | src/app/account/page.tsx | COMP-GLOBAL-SHELL<br>COMP-GLOBAL-SEO-METADATA<br>COMP-SCR005-GUEST-AUTH<br>COMP-SCR005-PROFILE-AND-CONSENT<br>COMP-SCR005-MY-ACTIVITY<br>COMP-SCR005-ADMIN-REPORT-QUEUE<br>COMP-SCR005-ADMIN-URL-SETTINGS<br>DB-RLS-BASE | Must |

**B. 상세(Expected Files / Acceptance Criteria / Verify)**

| Task ID | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify |
|---|---|---|---|---|---|
| PAGE-SCR001 | src/app/page.tsx (수정 — create-next-app 기본 Starter 콘텐츠 전체 제거) | Next.js 기본 Starter 콘텐츠(Next.js 로고 `<Image src="/next.svg">`, 'To get started, edit the page.tsx file' 문구, 'Templates' 외부 링크 등)를 완전히 제거한다(SCREEN_ROUTE_CONTRACT.json starter_template_forbidden=true).<br>Section 순서를 다음과 같이 정확히 배치한다: ① 검색 Hero → ② 국내 여행지 Card Grid 6개(데이터 출처: DATA-DESTINATIONS) → ③ 해외 여행지 Card Grid 6개(데이터 출처: DATA-DESTINATIONS) → ④ 여행 동기 Chip 6개 → ⑤ 국가별 주의사항 Card Grid 6개(데이터 출처: DATA-SAFETY) → ⑥ 최근 동행글 3개 또는 완성형 Empty State(데이터 출처: API-MATES-CRUD) → ⑦ free_traveler 소개(데이터 출처: DATA-REPRESENTATIVE).<br>각 Card Grid Section은 최소 콘텐츠 수(국내 6, 해외 6, 테마 6, 안전정보 6)를 반드시 충족한다.<br>Desktop(1440px) 콘텐츠 최대 폭 1200~1280px, Section 상하 여백 64~96px. Mobile(390px) Section 상하 여백 40~64px, Card 1열, 좌우 여백 20px(반응형 콘텐츠 밀도).<br>어떤 Section에도 Lorem ipsum, '준비 중', '정보 확인 필요', 내용 없는 빈 Card를 두지 않는다.<br>최근 동행글 Section은 데이터가 없을 때도 설명 문장+이용 방법+CTA를 모두 갖춘 완성형 Empty State를 표시한다.<br>최근 동행글 Section(API-MATES-CRUD 조회)은 D-001 §13 상태 규칙에 따라 조회 중 Loading 스켈레톤, 조회 실패 시 재시도 CTA가 있는 Error를 Empty와 구분해 표시한다(나머지 Section은 정적 데이터라 Loading 불필요).<br>`src/lib/seo.ts`(COMP-GLOBAL-SEO-METADATA) 유틸을 사용해 SCR-001 고유의 `generateMetadata`를 export한다. | Hero 560px(Mobile 420px)로 제한해 1440px 첫 화면에서 Section 2 제목이 보인다.<br>Hero, Card Grid×2, Chip 목록, Card Grid, 3카드/Empty, 좌우분할의 6개 레이아웃 패턴을 교차 사용해 같은 Card만 반복하지 않는다(국내/해외는 배경 톤 교대로 구분). | 즐겨찾기(localStorage)는 사용자 기기 로컬에만 저장되고 서버로 전송하지 않는다. | E2E-PUBLIC-SMOKE, MANUAL-RESPONSIVE-CHECK |
| PAGE-SCR002 | src/app/about/page.tsx (신규) | Section 순서를 다음과 같이 정확히 배치한다: ① Profile Hero → ② 여행 지표(데이터 출처: DATA-REPRESENTATIVE) → ③ 소개·철학 → ④ Timeline 6개 이상 → ⑤ 방문 국가 30개(Chip, 데이터 출처: DATA-REPRESENTATIVE) → ⑥ Gallery 8개 → ⑦ 기억에 남는 여행지 4개+CTA.<br>문의·SNS 링크(REQ-FUNC-062)는 빈 값이면 렌더링하지 않고 허용 프로토콜만 연다.<br>각 Section 최소 콘텐츠 수(Timeline 6, Gallery 8, 방문 국가 30, 기억에 남는 여행지 4)를 반드시 충족한다.<br>Desktop 콘텐츠 최대 폭 1200~1280px, Section 상하 여백 64~96px(Mobile 40~64px).<br>이 화면은 DATA-REPRESENTATIVE 정적 데이터만 사용하는 Server Component로 런타임 네트워크 조회가 없어 D-001 §13 Loading/Error 상태가 적용되지 않는다.<br>`src/lib/seo.ts`(COMP-GLOBAL-SEO-METADATA) 유틸을 사용해 SCR-002 고유의 `generateMetadata`를 export한다. | Hero 460~480px로 제한해 1440px 첫 화면에서 지표 Section 제목이 보인다.<br>Hero, 통계 Card, 좌우분할, Timeline, Chip 목록, Gallery Card Grid, Card Grid+CTA Banner 순으로 레이아웃 패턴을 교차 사용한다. | — | E2E-PUBLIC-SMOKE, MANUAL-RESPONSIVE-CHECK |
| PAGE-SCR003 | src/app/travel-tools/page.tsx (신규) | 항공편·숙소·동행 구하기 3개 탭을 실제로 조립해 각 탭이 독립적인 입력·검증·완료 상태를 갖도록 한다(탭만 만들고 내용을 비워두지 않는다).<br>Section 순서: ① Intro(3단계) → ② 탭바 → ③ 여행정보 Form(활성 탭에 따라 항공/숙소 필드, 데이터 출처: 사용자 입력만, 서버 저장 없음) → ④ 입력 요약·외부 이동 Action Card → ⑤ 비전달 고지+Tip 3개 → ⑥ 동행 작성 Form 또는 로그인 안내+안전 안내(데이터 출처: API-MATES-CRUD).<br>항공·숙소 탭에는 최소 콘텐츠로 Tip 3개, 필드 4개(국가/지역/날짜 2개)를 반드시 포함한다.<br>안전정보 요약 고지(REQ-FUNC-054)를 항공 요약 단계에도 표시한다.<br>Lorem ipsum·'준비 중'·'정보 확인 필요' 문구나 내용 없는 빈 Card를 두지 않는다. 동행 탭의 비로그인 상태는 완성형 안내 Card(설명+CTA)로 처리하며 빈 화면으로 보이지 않게 한다.<br>동행 탭은 D-001 §13 상태 규칙에 따라 로그인·성인확인 조회 중 Loading, 동행글 제출 실패 시 재시도 CTA가 있는 Error를 표시한다(항공·숙소 탭은 서버 조회가 없어 적용 대상 아님).<br>`src/lib/seo.ts`(COMP-GLOBAL-SEO-METADATA) 유틸을 사용해 SCR-003 고유의 `generateMetadata`를 export한다. | Desktop 콘텐츠 최대 폭 1200~1280px, Section 상하 여백 64~96px(Mobile 40~64px), Form Desktop 2단/Mobile 1단. | 항공·숙소 조건 입력값은 서버·DB·외부 URL 쿼리에 전달되지 않는다(CON-01/CON-02 재확인). | E2E-TRAVEL-TOOLS, MANUAL-RESPONSIVE-CHECK |
| PAGE-SCR004 | src/app/mates/page.tsx (신규) | 목록·필터·상세·참가·신고·차단을 각각 별도 Component로 분리해 조립한다(Component Task 참고).<br>Section 순서: ① Intro+작성 CTA → ② Filter+결과 요약 → ③ 동행글 목록(최대 8, 데이터 출처: API-MATES-CRUD) → ④ 목록+상세 분할/Drawer(참가·신고·차단 포함) → ⑤ 신청 방법 3단계 → ⑥ 안전·신고·차단 CTA Banner.<br>목록 Empty State는 필터 결과 없음/전체 없음을 구분해 각각 이용 방법+CTA를 포함한 완성형으로 표시한다.<br>Lorem ipsum·'준비 중'·'정보 확인 필요' 문구나 내용 없는 빈 Card를 두지 않는다.<br>목록·상세·참가·신고·차단은 D-001 §13 상태 규칙에 따라 조회 중 Loading, 조회·제출 실패 시 재시도 CTA가 있는 Error를 Empty와 구분해 표시한다.<br>`src/lib/seo.ts`(COMP-GLOBAL-SEO-METADATA) 유틸을 사용해 SCR-004 고유의 `generateMetadata`를 export한다. | Desktop 목록 40%+상세 60% 좌우분할, Mobile 목록 1열+하단 Drawer, 콘텐츠 최대 폭 1200~1280px. | 차단 관계·신고 상세는 RLS로 서버에서 강제 격리한다(DB-RLS-BASE 의존). | E2E-MATE-AUTH, MANUAL-RESPONSIVE-CHECK |
| PAGE-SCR005 | src/app/account/page.tsx (신규) | Auth(Guest 로그인)·Profile·My Activity·Admin 4개 영역을 각각 별도 Component로 분리해 조립한다.<br>Guest·Member·Admin 3개 역할 상태를 실제로 조립한다: Guest는 [로그인/가입] 뷰만, Member는 [프로필][내 활동] 탭만, Admin/Moderator는 [프로필][내 활동][관리자] 3탭을 렌더링한다.<br>역할에 없는 관리 영역(예: 일반 회원의 관리자 탭)은 렌더링하지 않는다(DOM에 존재하지 않아야 하며 CSS로만 숨기지 않는다).<br>Section 순서(역할별): Guest — 계정 기능 Intro→로그인/가입/재설정 Card→기능 Chip 목록→보안 안내. Member — 프로필·성인확인 요약(데이터 출처: USER_PROFILE)→정책 동의 현황→내 활동 목록(데이터 출처: MATE_POST/MATE_APPLICATION/USER_BLOCK)→새 글 작성 CTA. Admin — 관리 Intro→신고 큐(데이터 출처: REPORT)→외부 URL 설정(데이터 출처: OUTBOUND_LINK_SETTING).<br>차트·그래프·KPI 대시보드를 어디에도 포함하지 않는다(간단한 카드·리스트만 사용).<br>Lorem ipsum·'준비 중'·'정보 확인 필요' 문구나 내용 없는 빈 Card를 두지 않으며, 목록형 데이터가 없으면 완성형 Empty State를 표시한다.<br>프로필·내 활동·관리자 신고 큐·외부 URL 설정은 D-001 §13 상태 규칙에 따라 조회 중 Loading, 조회·저장 실패 시 재시도 CTA가 있는 Error를 Empty와 구분해 표시하며, Guest 로그인/가입 제출도 Loading·Error를 표시한다.<br>`src/lib/seo.ts`(COMP-GLOBAL-SEO-METADATA) 유틸을 사용해 SCR-005 고유의 `generateMetadata`를 export한다. | Desktop 탭 가로 배치, Mobile 탭 가로 스크롤, 콘텐츠 최대 폭 1200~1280px. | 역할별 데이터 접근은 DB-RLS-BASE로 서버에서 강제하며 클라이언트 조건부 렌더링만으로 보안을 보장하지 않는다. | E2E-MATE-AUTH, MANUAL-RESPONSIVE-CHECK |

### 1.2 Component (COMPONENT) — 33개

**A. 개요**

| Seq | Task ID | 제목 | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Priority |
|---:|---|---|---|---|---|---|---|---|---|
| 1 | COMP-GLOBAL-SHELL | 전역 Header/Footer/RootLayout 조립 | IMPLEMENT | REQ-FUNC-064<br>REQ-FUNC-065<br>REQ-FUNC-079<br>REQ-NF-023 | COMMON | 전체 5개 Route | — | — | Must |
| 2 | COMP-GLOBAL-SEO-METADATA | 페이지별 SEO 메타데이터 유틸 | IMPLEMENT | REQ-FUNC-070<br>REQ-NF-030 | COMMON | 전체 5개 Route | — | COMP-GLOBAL-SHELL | Must |
| 3 | COMP-GLOBAL-TOAST | 전역 Toast/화면 상태 알림 컴포넌트 | IMPLEMENT(변형) | REQ-FUNC-043 | COMMON | 전체 5개 Route | — | COMP-GLOBAL-SHELL | Must |
| 4 | COMP-SCR001-HERO-SEARCH | SCR-001 검색 Hero | IMPLEMENT | REQ-FUNC-003<br>REQ-FUNC-067 | SCR-001 | / | — | COMP-GLOBAL-SHELL | Must |
| 5 | COMP-SCR001-DESTINATION-DIRECTORY | 국내/해외 여행지 Card Grid + 상세 Drawer | IMPLEMENT(변형) | REQ-FUNC-001<br>REQ-FUNC-002<br>REQ-FUNC-004<br>REQ-FUNC-005<br>REQ-FUNC-006<br>REQ-FUNC-007<br>REQ-FUNC-009<br>REQ-FUNC-068 | SCR-001 | / | — | COMP-GLOBAL-SHELL<br>DATA-DESTINATIONS<br>DATA-SAFETY | Must |
| 6 | COMP-SCR001-THEME-CHIPS | 여행 동기·테마 Chip 필터 | IMPLEMENT | REQ-FUNC-002 | SCR-001 | / | — | COMP-SCR001-DESTINATION-DIRECTORY | Must |
| 7 | COMP-SCR001-SAFETY | 국가별 주의사항 Card Grid + 안전정보 Drawer | IMPLEMENT(변형) | REQ-FUNC-047<br>REQ-FUNC-048<br>REQ-FUNC-049<br>REQ-FUNC-050<br>REQ-FUNC-051<br>REQ-FUNC-052<br>REQ-FUNC-053<br>REQ-FUNC-054 | SCR-001 | / | — | COMP-GLOBAL-SHELL<br>DATA-SAFETY | Must |
| 8 | COMP-SCR001-MATE-PREVIEW | 최근 동행글 미리보기(Empty State 포함) | IMPLEMENT | REQ-FUNC-030 | SCR-001 | / | — | COMP-GLOBAL-SHELL<br>API-MATES-CRUD | Must |
| 9 | COMP-SCR001-CURATOR-SUMMARY | free_traveler 요약 섹션 | IMPLEMENT | REQ-FUNC-057 | SCR-001 | / | — | COMP-GLOBAL-SHELL<br>DATA-REPRESENTATIVE | Should |
| 11 | COMP-SCR002-PROFILE-HERO | 대표 소개 Hero | IMPLEMENT(변형) | REQ-FUNC-057<br>REQ-FUNC-061 | SCR-002 | /about | — | COMP-GLOBAL-SHELL<br>DATA-REPRESENTATIVE | Must |
| 12 | COMP-SCR002-STATS-AND-INTRO | 여행 지표 + 소개·철학 Section | IMPLEMENT | REQ-FUNC-057<br>REQ-FUNC-058 | SCR-002 | /about | — | COMP-GLOBAL-SHELL<br>DATA-REPRESENTATIVE | Must |
| 13 | COMP-SCR002-TIMELINE | 여행 Timeline | IMPLEMENT | REQ-FUNC-060 | SCR-002 | /about | — | COMP-GLOBAL-SHELL<br>DATA-REPRESENTATIVE | Must |
| 14 | COMP-SCR002-COUNTRY-CHIPS | 방문 국가 권역별 Chip | IMPLEMENT | REQ-FUNC-059 | SCR-002 | /about | — | COMP-GLOBAL-SHELL<br>DATA-REPRESENTATIVE | Must |
| 15 | COMP-SCR002-GALLERY | 여행 Gallery | IMPLEMENT | REQ-FUNC-061 | SCR-002 | /about | — | COMP-GLOBAL-SHELL<br>DATA-REPRESENTATIVE | Should |
| 16 | COMP-SCR002-MEMORABLE-CTA | 기억에 남는 여행지 4개 + CTA Banner | IMPLEMENT | REQ-FUNC-063 | SCR-002 | /about | — | COMP-GLOBAL-SHELL<br>DATA-REPRESENTATIVE | Should |
| 18 | COMP-SCR003-INTRO-TABS | 이용 안내 3단계 + 탭바 | IMPLEMENT | REQ-FUNC-015<br>REQ-FUNC-023 | SCR-003 | /travel-tools | — | COMP-GLOBAL-SHELL | Must |
| 19 | COMP-SCR003-FLIGHT-FORM | 항공 조건 입력·검증·요약·외부 이동 | IMPLEMENT | REQ-FUNC-011<br>REQ-FUNC-012<br>REQ-FUNC-013<br>REQ-FUNC-014<br>REQ-FUNC-015<br>REQ-FUNC-016<br>REQ-FUNC-017<br>REQ-FUNC-018<br>REQ-NF-017 | SCR-003 | /travel-tools | — | COMP-SCR003-INTRO-TABS<br>API-DATE-VALIDATION-UTIL | Must |
| 20 | COMP-SCR003-HOTEL-FORM | 숙소 조건 입력·검증·요약·외부 이동 | IMPLEMENT | REQ-FUNC-019<br>REQ-FUNC-020<br>REQ-FUNC-021<br>REQ-FUNC-022<br>REQ-FUNC-023<br>REQ-FUNC-024<br>REQ-FUNC-025<br>REQ-FUNC-026<br>REQ-NF-017 | SCR-003 | /travel-tools | — | COMP-SCR003-INTRO-TABS<br>API-DATE-VALIDATION-UTIL<br>COMP-SCR003-FLIGHT-FORM | Must |
| 21 | COMP-SCR003-TIPS | 비전달 고지 + 이용 Tip 3개 | IMPLEMENT | REQ-FUNC-015<br>REQ-FUNC-023 | SCR-003 | /travel-tools | — | COMP-SCR003-FLIGHT-FORM<br>COMP-SCR003-HOTEL-FORM | Should |
| 22 | COMP-SCR003-MATE-COMPOSE | 동행 모집글 작성 Form(연락처 탐지·안전수칙 동의) | IMPLEMENT(변형) | REQ-FUNC-031<br>REQ-FUNC-032<br>REQ-FUNC-080 | SCR-003 | /travel-tools | — | COMP-SCR003-INTRO-TABS<br>API-CONTACT-DETECTION-UTIL<br>API-MATES-CRUD<br>COMP-GLOBAL-TOAST<br>DATA-POLICY-CONTENT | Must |
| 23 | COMP-SCR003-MATE-LOGIN-GATE | 동행 탭 로그인·성인확인 게이트 | IMPLEMENT | REQ-FUNC-027<br>REQ-FUNC-028 | SCR-003 | /travel-tools | — | COMP-SCR003-INTRO-TABS | Must |
| 25 | COMP-SCR004-INTRO | 동행 찾기 Intro + 작성 CTA | IMPLEMENT | REQ-FUNC-064 | SCR-004 | /mates | — | COMP-GLOBAL-SHELL | Must |
| 26 | COMP-SCR004-FILTER-BAR | 국가·지역·기간·모집 상태 Filter | IMPLEMENT | REQ-FUNC-030 | SCR-004 | /mates | — | COMP-GLOBAL-SHELL<br>API-MATES-CRUD | Must |
| 27 | COMP-SCR004-POST-LIST | 동행글 목록(최대 8개, Empty State 포함) | IMPLEMENT | REQ-FUNC-033<br>REQ-FUNC-037 | SCR-004 | /mates | — | COMP-SCR004-FILTER-BAR<br>API-MATE-AUTOCLOSE | Must |
| 28 | COMP-SCR004-DETAIL-PANEL | 동행글 상세 패널(Desktop 분할/Mobile Drawer) | IMPLEMENT | REQ-FUNC-033<br>REQ-FUNC-036 | SCR-004 | /mates | — | COMP-SCR004-POST-LIST | Must |
| 29 | COMP-SCR004-APPLICATION-FORM | 참가 요청 제출 Form | IMPLEMENT | REQ-FUNC-034<br>REQ-FUNC-035<br>REQ-FUNC-043 | SCR-004 | /mates | — | COMP-SCR004-DETAIL-PANEL<br>API-APPLICATIONS<br>COMP-GLOBAL-TOAST | Must |
| 30 | COMP-SCR004-REPORT-BLOCK-ACTIONS | 신고·차단 액션 | IMPLEMENT | REQ-FUNC-039<br>REQ-FUNC-040 | SCR-004 | /mates | — | COMP-SCR004-DETAIL-PANEL<br>API-REPORTS<br>API-BLOCKS<br>COMP-GLOBAL-TOAST | Must |
| 31 | COMP-SCR004-STEP-GUIDE-AND-SAFETY | 신청 방법 3단계 + 안전 CTA Banner | IMPLEMENT | REQ-FUNC-064 | SCR-004 | /mates | — | COMP-GLOBAL-SHELL | Should |
| 33 | COMP-SCR005-GUEST-AUTH | Guest 로그인/가입/비밀번호 재설정 | IMPLEMENT | REQ-FUNC-066 | SCR-005 | /account | — | COMP-GLOBAL-SHELL<br>API-AUTH-CALLBACK | Must |
| 34 | COMP-SCR005-PROFILE-AND-CONSENT | 프로필·성인확인·정책 동의 요약 | IMPLEMENT | REQ-FUNC-028<br>REQ-FUNC-029<br>REQ-FUNC-080 | SCR-005 | /account | — | COMP-SCR005-GUEST-AUTH<br>DATA-POLICY-CONTENT | Must |
| 35 | COMP-SCR005-MY-ACTIVITY | 내 활동(글/요청/차단/즐겨찾기) | IMPLEMENT | REQ-FUNC-036<br>REQ-FUNC-038<br>REQ-FUNC-040<br>REQ-FUNC-043<br>REQ-FUNC-068 | SCR-005 | /account | — | COMP-SCR005-GUEST-AUTH<br>API-MATES-CRUD<br>API-APPLICATIONS<br>API-BLOCKS<br>COMP-GLOBAL-TOAST | Must |
| 36 | COMP-SCR005-ADMIN-REPORT-QUEUE | 관리자 신고 큐 | IMPLEMENT(변형) | REQ-FUNC-041<br>REQ-FUNC-042 | SCR-005 | /account | — | COMP-SCR005-GUEST-AUTH<br>API-ADMIN-REPORTS | Must |
| 37 | COMP-SCR005-ADMIN-URL-SETTINGS | 관리자 외부 URL 설정 | IMPLEMENT | REQ-FUNC-077 | SCR-005 | /account | — | COMP-SCR005-GUEST-AUTH<br>API-ADMIN-OUTBOUND-SETTINGS | Must |

**B. 상세(Expected Files / Acceptance Criteria / Verify)**

| Task ID | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify |
|---|---|---|---|---|---|
| COMP-GLOBAL-SHELL | src/app/layout.tsx (수정)<br>src/components/layout/GlobalHeader.tsx (신규)<br>src/components/layout/GlobalFooter.tsx (신규) | 5개 Screen 모두에서 동일한 Header(로고, 4개 내비 링크, 계정 버튼)와 Footer(서비스/정책/안전·출처 고지/Legal Band)를 렌더링한다.<br>320px~1440px 전 구간에서 가로 스크롤·겹침 없이 표시된다(Mobile 390px 기준 햄버거 메뉴로 전환).<br>모든 폼·모달·탭·알림에 올바른 HTML 시맨틱과 ARIA 상태(role, aria-expanded, aria-selected 등)를 부여한다. | 코랄(#FF6A4D) 포인트, 흰 배경, 짙은 회색 텍스트(D-001 §1)를 그대로 따른다.<br>포커스 링(2px 코랄/잉크, outline-offset 2px)이 모든 인터랙션 요소에 보인다.<br>터치 영역 최소 44×44px. | — | E2E-PUBLIC-SMOKE, MANUAL-A11Y-CHECK |
| COMP-GLOBAL-SEO-METADATA | src/lib/seo.ts (신규) | Screen ID를 입력받아 title/description/canonical/Open Graph 값을 반환하는 유틸(예: `buildScreenMetadata`)을 export한다(각 Page Owner Task가 자신의 page.tsx에서 이 유틸을 사용해 `generateMetadata`를 작성한다 — 이 Task 자체는 page.tsx를 고치지 않는다).<br>필수 필드 누락 시 콘솔 경고를 출력한다. | — | — | CI-PIPELINE |
| COMP-GLOBAL-TOAST | src/components/ui/Toast.tsx (신규)<br>src/lib/toast-context.tsx (신규) | 실제 이메일 발송 없이 참가 요청 접수/승인/거절/신고 접수 결과를 화면 내 Toast 또는 상태 배지로 표시한다(구현 방식: PROJECT_SCOPE.md §3 Toast/화면 상태).<br>Toast는 success/error/info/warning 4개 semantic color(D-001 §1) 중 하나 + 텍스트 라벨을 함께 표시한다(색상 단독 사용 금지). | Tier-1 그림자(D-001 §5)만 사용, 3~5초 후 자동 소멸 또는 수동 닫기. | — | E2E-MATE-AUTH |
| COMP-SCR001-HERO-SEARCH | src/components/home/SearchHero.tsx (신규) | Hero 높이 560px(Mobile 420px) 고정, 뷰포트 전체를 차지하지 않아 1440px에서 다음 Section 제목이 보인다(D-001 §15).<br>여행지명·국가명·테마 한글 키워드 부분 일치 검색 및 여행지+안전정보 통합 검색을 지원한다(REQ-FUNC-067).<br>`/travel-tools` 이동 CTA와 `동행 찾기` 보조 링크를 포함한다. | pill 검색창(radius 999px), 코랄 검색 버튼, 여행 사진 배경. | — | E2E-PUBLIC-SMOKE |
| COMP-SCR001-DESTINATION-DIRECTORY | src/components/home/DestinationCardGrid.tsx (신규)<br>src/components/home/DestinationDrawer.tsx (신규) | 국내 6개, 해외 6개를 각각 별도 Card Grid로 표시하고(D-001 §17), 국가·도시·계절·테마·기간 필터를 AND 조건으로 적용한다.<br>필터 결과가 없으면 300ms 이내 안내 문구+전체 초기화 버튼을 표시한다(빈 화면 금지).<br>카드 클릭 시 같은 화면 안에서 상세 Drawer를 열고, 소개 300자 이상·명소 5개 이상·1일/3일 일정·예산·교통·음식 3개 이상·에티켓·출처·수정일을 표시한다.<br>해외 여행지 상세에서 안전정보 Drawer로 전환할 수 있다(REQ-FUNC-006).<br>즐겨찾기 토글은 `localStorage`에 저장하고 새로고침 후에도 유지된다(구현 방식: PROJECT_SCOPE.md §3 localStorage, 중복 즐겨찾기 방지).<br>이미지에는 실제 장소를 설명하는 alt 텍스트와 출처 URL을 기록한다(라이선스·작가 메타데이터는 관리하지 않음, REQ-FUNC-007 변형). | Card radius 16px, Desktop 3열/Mobile 1열, Card 간격 Desktop 24px/Mobile 16px. | — | E2E-PUBLIC-SMOKE, UNIT-CONTACT-DETECTION(해당없음) |
| COMP-SCR001-THEME-CHIPS | src/components/home/ThemeChipFilter.tsx (신규) | 자연·힐링/도심 미식/가족 여행/액티비티·모험/문화·역사 탐방/나 홀로 여행 6개 Chip을 표시한다.<br>Chip 선택 시 여행지 Card Grid가 해당 테마로 필터링된다. | pill Chip, 활성 시 코랄 배경+흰 텍스트, 비활성 시 surface-strong 배경. | — | E2E-PUBLIC-SMOKE |
| COMP-SCR001-SAFETY | src/components/home/CountrySafetyCardGrid.tsx (신규)<br>src/components/home/SafetyDrawer.tsx (신규) | 국가별 주의사항 Card 6개를 표시하고, 최종 확인일 기준 7일 초과 시 렌더링 시점에 계산해 Stale 경고 배지(경고색+텍스트)를 표시한다(구현 방식: PROJECT_SCOPE.md §3 stale 렌더링 계산).<br>Drawer에는 치안·사기·법규·교통·재난·보건·문화·긴급연락처 8개 카테고리, 출처명·URL·확인일·편집자, 외교부 새 탭 링크(noopener,noreferrer)를 표시한다.<br>중대 경보(여행금지·특별여행주의보 등)는 색상만이 아닌 텍스트 라벨로 상단에 표시한다.<br>국가 전체 경보와 지역 경보의 범위를 텍스트로 구분 표시한다.<br>공식 판단을 대체하지 않는다는 고지 문구를 표시한다. | 경고 배지는 D-001 §1 warning 토큰(#9A5B12/#FFF3E1)만 사용, 코랄과 혼용하지 않는다. | — | E2E-PUBLIC-SMOKE |
| COMP-SCR001-MATE-PREVIEW | src/components/home/RecentMatePreview.tsx (신규) | 동행글이 있으면 최근 3개를 국가·지역/기간/모집인원/스타일 배지/모집상태와 함께 표시하고 `동행 더 보기` 링크로 SCR-004 이동, 없으면 완성형 Empty State(설명 문장+이용 방법 3단계 요약+`동행글 작성하기` CTA → SCR-003 동행 탭)를 표시한다.<br>Lorem ipsum, '준비 중', '정보 확인 필요' 문구나 내용 없는 빈 Card를 사용하지 않는다. | — | — | E2E-PUBLIC-SMOKE |
| COMP-SCR001-CURATOR-SUMMARY | src/components/home/CuratorSummary.tsx (신규) | `50+ Trips`/`30+ Countries` 수치와 한 줄 철학, `대표 소개 더 보기` CTA(→ SCR-002)를 좌우분할로 표시한다. | Desktop 좌 46%/우 54%, Mobile 세로 스택. | — | E2E-PUBLIC-SMOKE |
| COMP-SCR002-PROFILE-HERO | src/components/about/ProfileHero.tsx (신규) | 대표 이미지+한 문장 소개를 표시하고 Hero 높이 460~480px로 제한해 다음 Section 제목이 보이게 한다. | 대표 이미지 alt 텍스트에 실제 장면을 설명한다(라이선스 메타데이터는 관리하지 않음, REQ-FUNC-061 변형). | — | E2E-PUBLIC-SMOKE |
| COMP-SCR002-STATS-AND-INTRO | src/components/about/StatCardGroup.tsx (신규)<br>src/components/about/IntroPhilosophySplit.tsx (신규) | `50+ Trips`/`30+ Countries`/권역 수 3개 통계 Card(차트 없음)를 표시한다.<br>자기소개·여행을 시작한 이유·여행 철학을 2~4개 문단 좌우분할로 표시한다. | — | — | E2E-PUBLIC-SMOKE |
| COMP-SCR002-TIMELINE | src/components/about/Timeline.tsx (신규) | 연도·장소·한 줄 요약을 포함한 시점 6개 이상을 시간순으로 표시한다(데이터 출처: DATA-REPRESENTATIVE). | — | — | E2E-PUBLIC-SMOKE |
| COMP-SCR002-COUNTRY-CHIPS | src/components/about/RegionChipGroup.tsx (신규) | 아시아/유럽/북미/오세아니아 4개 권역으로 묶어 방문 국가 30개 이상(또는 대표 샘플+‘30개국’ 총계 표기)을 Chip으로 표시한다.<br>여행지 콘텐츠가 있는 국가 Chip 클릭 시 SCR-001로 이동해 해당 국가 Drawer가 열린다. | — | — | E2E-PUBLIC-SMOKE |
| COMP-SCR002-GALLERY | src/components/about/Gallery.tsx (신규) | 서로 다른 장소의 사진 8장 이상을 표시하고, 각 이미지에 실제 장소를 설명하는 alt 텍스트를 붙인다. | Desktop 4열×2행, Mobile 가로 스크롤. | — | E2E-PUBLIC-SMOKE |
| COMP-SCR002-MEMORABLE-CTA | src/components/about/MemorableDestinationCta.tsx (신규) | 여행지 4개 Card(선정 이유 한 줄 포함)와 `여행 준비하기`(→SCR-003)/`동행 찾기`(→SCR-004) CTA Banner를 표시한다.<br>카드 클릭 시 SCR-001로 이동해 해당 여행지 Drawer가 열린다. 비공개 여행지는 자동 제외한다. | — | — | E2E-PUBLIC-SMOKE |
| COMP-SCR003-INTRO-TABS | src/components/travel-tools/IntroStepGuide.tsx (신규)<br>src/components/travel-tools/TabBar.tsx (신규) | 조건 입력→요약 확인→외부 이동/게시 3단계 안내와 항공편/숙소/동행 구하기 3개 탭을 표시한다.<br>탭 전환 시 다른 탭의 입력값·검증 상태·완료 상태에 영향을 주지 않는다. | — | — | E2E-TRAVEL-TOOLS |
| COMP-SCR003-FLIGHT-FORM | src/components/travel-tools/FlightConditionForm.tsx (신규)<br>src/components/travel-tools/SummaryActionCard.tsx (신규, 숙소와 공용) | 국가·지역·출발일·귀국일 4개 필수 필드를 제공하고, 국가 변경 시 지역 옵션을 초기화한다.<br>출발일이 과거이거나 귀국일이 출발일보다 빠르면 제출을 차단하고 필드별 오류를 표시한다(UNIT-TRAVEL-DATES로 로직 검증).<br>유효 입력 후 요약 단계를 표시하고 '입력값은 외부 사이트로 전달되지 않습니다' 고지를 폼과 요약에 표시한다.<br>`항공편 보러 가기` 클릭 시 설정된 외부 URL을 `noopener,noreferrer`로 새 탭에 열며 쿼리·본문·쿠키로 값을 전달하지 않는다.<br>외부 URL 미설정/허용목록 밖이면 이동을 차단하고 재시도 UI를 제공한다.<br>입력값은 컴포넌트 로컬 상태로만 유지하며 서버 API·DB·로그로 전송하지 않는다(REQ-FUNC-017, REQ-NF-017). | — | 항공 조건 입력값은 어떤 API 요청에도 포함되지 않는다(네트워크 탭 확인 대상). | E2E-TRAVEL-TOOLS, UNIT-TRAVEL-DATES |
| COMP-SCR003-HOTEL-FORM | src/components/travel-tools/HotelConditionForm.tsx (신규) | 국가·지역·체크인·체크아웃 4개 필수 필드를 제공하고, 체크인이 과거이거나 체크아웃이 체크인과 같거나 빠르면 제출을 차단한다(UNIT-TRAVEL-DATES).<br>요약에 비전달 고지를 표시하고 `호텔 보러 가기` 클릭 시 새 탭으로만 이동하며 쿼리·본문·쿠키로 값을 전달하지 않는다.<br>URL 오류 시 이동을 차단·재시도하고 현재 입력을 유지한다.<br>입력값을 서버 DB·로그·분석 이벤트에 저장하지 않는다. | — | 숙소 조건 입력값은 어떤 API 요청에도 포함되지 않는다. | E2E-TRAVEL-TOOLS, UNIT-TRAVEL-DATES |
| COMP-SCR003-TIPS | src/components/travel-tools/DisclosureTipSection.tsx (신규) | 활성 탭(항공/숙소)에 맞는 Tip 3개를 표시한다. | — | — | E2E-TRAVEL-TOOLS |
| COMP-SCR003-MATE-COMPOSE | src/components/travel-tools/MateComposeForm.tsx (신규) | 제목·국가·지역·시작일·종료일·모집 인원·선호 조건·여행 스타일·상세 설명·안전수칙 동의 체크박스를 입력받는다.<br>필수값 누락·날짜 역전·과거 종료일은 제출을 차단한다.<br>본문에서 전화번호·이메일·메신저 ID 패턴을 탐지하면 제출을 차단하고 수정 안내를 표시한다(UNIT-CONTACT-DETECTION로 로직 검증).<br>안전수칙 동의 체크 없이는 게시할 수 없고, 정책 버전과 동의 시각을 저장한다(DB: MATE_POST 및 USER_PROFILE 동의 필드).<br>게시 성공 시 Toast로 알리고 SCR-004로 이동 링크를 제공한다. | — | 본문에 공개 연락처가 포함된 게시물은 저장되지 않는다. | E2E-MATE-AUTH, UNIT-CONTACT-DETECTION |
| COMP-SCR003-MATE-LOGIN-GATE | src/components/travel-tools/MateLoginGateCard.tsx (신규) | 비로그인 또는 성인 확인 미완료 상태에서는 작성 Form 대신 안내 Card와 `로그인/가입하기`(→SCR-005) 버튼을 표시한다.<br>정확한 생년월일은 저장하지 않고 성인 확인 여부·확인 시각만 사용한다. | — | 성인 확인 없이 동행 작성 API를 호출할 수 없다(서버 측 재검증). | E2E-MATE-AUTH |
| COMP-SCR004-INTRO | src/components/mates/MateIntro.tsx (신규) | 목적 설명 1~2문장과 `동행글 작성하기`(→SCR-003 동행 탭) CTA를 표시한다. | — | — | E2E-MATE-AUTH |
| COMP-SCR004-FILTER-BAR | src/components/mates/MateFilterBar.tsx (신규) | 국가·지역·기간 겹침·연령대·성별·여행 스타일·모집 상태를 AND 조건으로 필터링하고 결과 요약 텍스트('조건에 맞는 동행글 N건')를 표시한다.<br>차단 관계에 있는 사용자의 글은 결과에서 제외한다. | — | 차단된 상대의 글은 필터 결과·API 응답 어디에도 노출되지 않는다. | E2E-MATE-AUTH |
| COMP-SCR004-POST-LIST | src/components/mates/MatePostList.tsx (신규) | 데이터가 있으면 최대 8개 Card(국가·지역/기간/모집인원/스타일/모집상태 배지)를 우선 노출한다.<br>조회 시점에 종료일 경과 여부를 계산해 CLOSED 글을 공개 모집중 목록에서 제외한다(구현 방식: PROJECT_SCOPE.md §3, 배치 없이 조회 시 계산).<br>필터 결과 0건과 전체 게시글 0건을 서로 다른 문구로 안내하며, 각각 필터 초기화 또는 작성 CTA와 이용 방법을 포함한 완성형 Empty State를 표시한다.<br>연락처 등 공개 개인정보는 어떤 카드에도 표시하지 않는다. | — | — | E2E-MATE-AUTH |
| COMP-SCR004-DETAIL-PANEL | src/components/mates/MateDetailPanel.tsx (신규)<br>src/components/mates/MateDetailDrawer.tsx (Mobile, 신규) | 조건 요약·상세 설명·작성자(닉네임·연령대·여행 스타일, 연락처 비노출)를 표시한다.<br>작성자 시점에서 참가 요청을 승인/거절할 수 있다.<br>Desktop은 목록(좌 40%)+상세(우 60%) 분할, Mobile은 목록 탭 시 하단 Drawer로 전환한다. | — | 이메일·전화번호는 HTML/JSON 응답 어디에도 포함되지 않는다. | E2E-MATE-AUTH |
| COMP-SCR004-APPLICATION-FORM | src/components/mates/ApplicationForm.tsx (신규) | 최대 500자 비공개 참가 메시지를 제출하면 PENDING 상태로 저장되고 Toast로 접수를 안내한다.<br>동일 사용자가 동일 글에 중복 PENDING/ACCEPTED 요청을 보내면 오류를 표시하고 차단한다(UNIT-MATE-STATE로 상태 전이 검증).<br>비로그인 상태에서 제출을 시도하면 로그인 안내(→SCR-005)로 전환한다. | — | 참가 메시지는 작성자와 요청자만 열람 가능(RLS로 서버 강제). | E2E-MATE-AUTH, UNIT-MATE-STATE |
| COMP-SCR004-REPORT-BLOCK-ACTIONS | src/components/mates/ReportBlockActions.tsx (신규) | 글·사용자·참가 요청을 사유 코드+설명으로 신고하면 3초 이내 접수 번호를 표시한다.<br>차단·해제 기능을 제공하고, 차단 후에는 상대의 글·프로필·요청이 상호 노출되지 않는다. | — | 신고·피신고 상세 정보는 Moderator/Admin만 열람 가능(RLS). | E2E-MATE-AUTH |
| COMP-SCR004-STEP-GUIDE-AND-SAFETY | src/components/mates/ApplicationStepGuide.tsx (신규)<br>src/components/mates/SafetyCtaBanner.tsx (신규) | ① 비공개 메시지로 참가 요청 → ② 작성자 승인/거절 → ③ 승인 시 인앱 알림 확인 3단계를 표시한다.<br>신원·안전 미보증 고지와 신고·차단 안내, `/travel-tools` 이동 CTA를 포함한 CTA Banner를 표시한다. | — | — | E2E-MATE-AUTH |
| COMP-SCR005-GUEST-AUTH | src/components/account/GuestAuthForm.tsx (신규) | 이메일 회원가입·인증·로그인·로그아웃·비밀번호 재설정을 제공한다.<br>인증되지 않은 이메일 계정은 동행 쓰기 권한을 얻지 못한다(서버 재검증). | — | 비밀번호는 Supabase Auth가 관리하며 애플리케이션 코드에 평문 저장하지 않는다. | E2E-MATE-AUTH |
| COMP-SCR005-PROFILE-AND-CONSENT | src/components/account/ProfileSummaryCard.tsx (신규)<br>src/components/account/AdultVerificationCard.tsx (신규)<br>src/components/account/PolicyConsentStatus.tsx (신규) | 닉네임·연령대·성별(선택)·여행 스타일·자기소개를 표시·수정한다.<br>성인 확인 완료 여부와 확인 시각만 저장·표시하고 정확한 생년월일은 저장하지 않는다.<br>동행 안전수칙 동의 여부와 동의 시각을 표시한다. | — | 생년월일 원본은 어떤 테이블·응답에도 저장·노출되지 않는다(USER_PROFILE.adult_verified_at만 사용). | E2E-MATE-AUTH |
| COMP-SCR005-MY-ACTIVITY | src/components/account/MyActivityLists.tsx (신규) | 내가 쓴 동행글(상태 배지+수정/마감/삭제), 내가 보낸/받은 참가 요청(대기/승인/거절, 작성자는 여기서도 승인·거절 가능), 차단 목록(해제 버튼), 즐겨찾기(localStorage 기반)를 각각 목록으로 표시한다.<br>각 목록이 비어 있으면 설명+CTA를 포함한 완성형 Empty State를 표시한다(예: 즐겨찾기 없음 → '메인 화면에서 저장해보세요' + `여행지 보러 가기`).<br>새 동행글 작성 CTA(→SCR-003)를 제공한다. | — | 본인 데이터만 조회되도록 RLS로 서버에서 강제한다. | E2E-MATE-AUTH |
| COMP-SCR005-ADMIN-REPORT-QUEUE | src/components/account/AdminReportQueue.tsx (신규) | OPEN/RESOLVED/DISMISSED 상태 필터와 신고 대상·사유·접수 시각 목록을 표시한다.<br>게시물 숨기기/처리 완료/기각 액션으로 상태를 변경한다(경고 메시지 발송·계정 정지 등 고급 기능은 범위 밖).<br>Moderator/Admin 역할이 아니면 이 탭 자체를 렌더링하지 않는다. | 차트·그래프·KPI 대시보드를 포함하지 않는다. | 신고자·피신고자 상세는 Moderator/Admin 역할만 조회 가능(RLS). | E2E-MATE-AUTH |
| COMP-SCR005-ADMIN-URL-SETTINGS | src/components/account/AdminExternalUrlForm.tsx (신규) | 항공·숙소 외부 URL을 HTTPS 허용목록 내 주소로만 저장할 수 있게 한다(HTTP/javascript/data URL 저장 차단).<br>저장 성공/실패를 Toast로 안내한다. | — | URL 저장은 Admin 역할만 가능(RLS/서버 검증). | E2E-MATE-AUTH |

### 1.3 Static Data (DATA) — 5개

**A. 개요**

| Seq | Task ID | 제목 | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Priority |
|---:|---|---|---|---|---|---|---|---|---|
| 39 | DATA-DESTINATIONS | 국내·해외 여행지 정적 데이터 | IMPLEMENT(변형) | REQ-FUNC-001<br>REQ-FUNC-004<br>REQ-FUNC-007<br>REQ-FUNC-008<br>REQ-FUNC-009<br>REQ-NF-006 | SCR-001 | / | — | — | Must |
| 40 | DATA-SAFETY | 국가별 안전정보 정적 데이터 | IMPLEMENT | REQ-FUNC-046<br>REQ-FUNC-047<br>REQ-FUNC-048<br>REQ-FUNC-052<br>REQ-FUNC-053 | SCR-001 | / | — | — | Must |
| 41 | DATA-REPRESENTATIVE | 대표(free_traveler) 프로필 정적 데이터 | IMPLEMENT(변형) | REQ-FUNC-057<br>REQ-FUNC-058<br>REQ-FUNC-059<br>REQ-FUNC-060<br>REQ-FUNC-061<br>REQ-FUNC-062<br>REQ-FUNC-063 | SCR-002 | /about | — | — | Must |
| 42 | DATA-POLICY-CONTENT | 이용약관·개인정보·안전수칙·면책 정적 페이지 콘텐츠 | IMPLEMENT(변형) | REQ-FUNC-080 | COMMON | 전체 5개 Route | — | — | Must |
| 43 | DATA-CONTENT-COMPLETENESS-CHECK | 콘텐츠 완전성·수량 검증 스크립트 | IMPLEMENT(변형) | REQ-FUNC-008<br>REQ-FUNC-074<br>REQ-NF-026<br>REQ-NF-027 | — | — | — | DATA-DESTINATIONS<br>DATA-SAFETY | Must |

**B. 상세(Expected Files / Acceptance Criteria / Verify)**

| Task ID | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify |
|---|---|---|---|---|---|
| DATA-DESTINATIONS | src/data/destinations.ts (신규)<br>src/data/destinations.schema.ts (신규) | 국내 10곳, 해외 15개국 30개 도시 이상의 TypeScript 정적 데이터를 작성한다(구현 방식: PROJECT_SCOPE.md §3 src/data 정적 데이터, DB 미사용).<br>각 항목에 소개 300자 이상, 명소 5개 이상, 추천 시기, 1일/3일 일정, 예산, 교통, 음식 3개 이상, 에티켓 3개 이상, 출처 1개 이상, 수정일, 이미지 alt+출처 URL 필드를 포함한다.<br>Next.js `Image` 컴포넌트의 반응형 크기·lazy load를 적용한다(REQ-NF-006). | — | — | DATA-CONTENT-COMPLETENESS-CHECK |
| DATA-SAFETY | src/data/safety.ts (신규) | 소개되는 해외 15개국 전체에 대해 치안·사기·법규·교통·재난·보건·문화·긴급연락처 8개 카테고리, 출처명/URL/확인일/편집자, scope_type(COUNTRY/REGION)을 정적 데이터로 작성한다.<br>국가 수와 안전정보 수가 정확히 일치해야 한다(커버리지 100%). | — | — | DATA-CONTENT-COMPLETENESS-CHECK |
| DATA-REPRESENTATIVE | src/data/representative.ts (신규) | 대표명·`50+ Trips`·`30+ Countries`·소개문·철학·방문 국가 30개 이상·타임라인 6개 이상·추천 여행지 6개·문의/SNS 링크를 정적 데이터로 작성한다.<br>이미지에는 alt 텍스트와 출처 URL만 기록한다(라이선스·작가 메타데이터 관리 제외). | — | — | DATA-CONTENT-COMPLETENESS-CHECK |
| DATA-POLICY-CONTENT | src/data/policies.ts (신규) | 이용약관, 개인정보 처리방침, 동행 안전수칙, 콘텐츠 면책 안내 정적 텍스트와 정책 버전(예: v1)을 작성한다. | — | — | 코드 리뷰 |
| DATA-CONTENT-COMPLETENESS-CHECK | scripts/validate_content.py (신규) | 국내 10곳 이상/해외 15개국 30도시 이상, 안전정보 15개국 커버리지 100%, 여행지 필수 필드(소개 300자·명소 5개·음식 3개·에티켓 3개·출처 1개·이미지 alt) 충족 여부를 자동 검사한다.<br>누락 목록을 반환하고 실패 시 종료 코드 1로 끝난다(관리자 UI 없이 CI 스크립트로 대체, PROJECT_SCOPE.md §3). | — | — | CI-PIPELINE |

### 1.4 Database (DB) — 4개

**A. 개요**

| Seq | Task ID | 제목 | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Priority |
|---:|---|---|---|---|---|---|---|---|---|
| 44 | DB-SCHEMA-BASE | Supabase 6개 테이블 스키마 생성 | IMPLEMENT | REQ-FUNC-029<br>REQ-FUNC-031<br>REQ-FUNC-034<br>REQ-FUNC-039<br>REQ-FUNC-040<br>REQ-FUNC-077 | — | — | — | INFRA-SUPABASE-PROJECT | Must |
| 45 | DB-RLS-BASE | Row Level Security 정책 | IMPLEMENT | REQ-FUNC-044<br>REQ-NF-013 | — | — | — | DB-SCHEMA-BASE | Must |
| 46 | DB-ACCESS | 데이터 접근 레이어(Server Actions/Query 함수) | IMPLEMENT | REQ-FUNC-030<br>REQ-FUNC-035<br>REQ-FUNC-036<br>REQ-FUNC-037 | — | — | — | DB-SCHEMA-BASE<br>DB-RLS-BASE | Must |
| 47 | DB-SEED-BASE | 개발용 시드 데이터 | IMPLEMENT | — | — | — | — | DB-SCHEMA-BASE | Should |

**B. 상세(Expected Files / Acceptance Criteria / Verify)**

| Task ID | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify |
|---|---|---|---|---|---|
| DB-SCHEMA-BASE | supabase/migrations/0001_schema_base.sql (신규) | 정확히 6개 테이블만 생성한다: USER_PROFILE, MATE_POST, MATE_APPLICATION, USER_BLOCK, REPORT, OUTBOUND_LINK_SETTING.<br>여행지·안전정보·대표 소개·감사 로그용 테이블(COUNTRY/DESTINATION/COUNTRY_SAFETY/MEDIA_ASSET/REPRESENTATIVE_PROFILE/AUDIT_LOG)은 만들지 않는다(정적 데이터 또는 EXCLUDED로 대체). | — | 각 테이블의 PK/FK, UNIQUE 제약(USER_BLOCK 쌍, MATE_APPLICATION 중복 방지)을 정의한다. | TEST-RLS-BASIC |
| DB-RLS-BASE | supabase/migrations/0002_rls_base.sql (신규) | 본인 글·요청, 요청 대상 작성자, Moderator/Admin만 비공개 데이터(MATE_APPLICATION.message, REPORT 상세)를 열람할 수 있도록 정책을 정의한다.<br>차단 관계에 있는 사용자 간 데이터 노출을 정책 수준에서 차단한다. | — | 권한별 부정 접근 테스트가 모두 403 또는 빈 결과를 반환해야 한다. | TEST-RLS-BASIC |
| DB-ACCESS | src/lib/db/mates.ts (신규)<br>src/lib/db/applications.ts (신규)<br>src/lib/db/blocks.ts (신규)<br>src/lib/db/reports.ts (신규) | 다중 조건 필터, 중복 요청 검사, 상태 전이(OPEN/CLOSED, PENDING/ACCEPTED/REJECTED/WITHDRAWN), 조회 시 자동 마감 계산을 캡슐화한 서버 함수를 제공한다(UNIT-MATE-STATE로 로직 검증). | — | 모든 쓰기 함수는 RLS를 우회하는 service-role 키를 사용하지 않는다. | TEST-RLS-BASIC, UNIT-MATE-STATE |
| DB-SEED-BASE | supabase/seed.sql (신규) | 로컬/스테이징 개발을 위한 최소 시드(테스트 계정 2~3개, 동행글 3~5개)를 제공한다. 실 서비스 배포에는 적용하지 않는다. | — | 시드에 실제 개인정보를 포함하지 않는다. | 코드 리뷰 |

### 1.5 API / Backend (API) — 12개

**A. 개요**

| Seq | Task ID | 제목 | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Priority |
|---:|---|---|---|---|---|---|---|---|---|
| 48 | API-AUTH-CALLBACK | Supabase Auth 콜백 Route | IMPLEMENT | REQ-FUNC-066 | — | /auth/callback | — | INFRA-SUPABASE-PROJECT | Must |
| 49 | API-CONTACT-DETECTION-UTIL | 연락처 패턴 탐지 유틸 | IMPLEMENT | REQ-FUNC-032 | — | — | — | — | Must |
| 50 | API-DATE-VALIDATION-UTIL | 여행 날짜 검증 유틸 | IMPLEMENT | REQ-FUNC-013<br>REQ-FUNC-021 | — | — | — | — | Must |
| 51 | API-MATE-AUTOCLOSE | 동행글 자동 마감 계산 로직 | IMPLEMENT(변형) | REQ-FUNC-037 | — | — | — | DB-ACCESS | Must |
| 52 | API-MATES-CRUD | 동행 모집글 API Route | IMPLEMENT | REQ-FUNC-031<br>REQ-FUNC-032<br>REQ-FUNC-033<br>REQ-FUNC-038 | — | /api/mates | — | DB-ACCESS<br>API-CONTACT-DETECTION-UTIL | Must |
| 53 | API-APPLICATIONS | 참가 요청 API Route | IMPLEMENT | REQ-FUNC-034<br>REQ-FUNC-035<br>REQ-FUNC-036<br>REQ-FUNC-043 | — | /api/mates/[id]/applications, /api/applications/[id] | — | DB-ACCESS | Must |
| 54 | API-BLOCKS | 차단 API Route | IMPLEMENT | REQ-FUNC-040 | — | /api/blocks | — | DB-ACCESS | Must |
| 55 | API-REPORTS | 신고 API Route | IMPLEMENT | REQ-FUNC-039 | — | /api/reports | — | DB-ACCESS | Must |
| 56 | API-ADMIN-REPORTS | 관리자 신고 처리 API Route | IMPLEMENT(변형) | REQ-FUNC-041<br>REQ-FUNC-042 | — | /api/admin/reports | — | DB-ACCESS | Must |
| 57 | API-ADMIN-OUTBOUND-SETTINGS | 관리자 외부 URL 설정 API Route | IMPLEMENT | REQ-FUNC-077 | — | /api/admin/settings/outbound | — | DB-ACCESS | Must |
| 58 | API-ERROR-PAGES | 404/500 오류 복구 화면 | IMPLEMENT | REQ-FUNC-078 | — | not-found / error boundary | — | COMP-GLOBAL-SHELL | Must |
| 59 | API-SECURITY-BASELINE | CSRF/XSS 방어 기본 설정 | IMPLEMENT | REQ-NF-014<br>REQ-NF-015 | — | — | — | DB-ACCESS | Must |

**B. 상세(Expected Files / Acceptance Criteria / Verify)**

| Task ID | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify |
|---|---|---|---|---|---|
| API-AUTH-CALLBACK | src/app/auth/callback/route.ts (신규) | 이메일 인증·비밀번호 재설정 콜백을 처리하고 세션을 설정한다. | — | TLS 1.2 이상 연결에서만 동작(Vercel 기본 제공). | E2E-MATE-AUTH |
| API-CONTACT-DETECTION-UTIL | src/lib/contact-detection.ts (신규) | 전화번호, 이메일, 카카오톡/텔레그램 등 메신저 ID 패턴을 정규식 기반으로 탐지한다.<br>기준 테스트셋 기준 탐지율 95% 이상, 오탐 5% 이하를 목표로 한다(UNIT-CONTACT-DETECTION). | — | — | UNIT-CONTACT-DETECTION |
| API-DATE-VALIDATION-UTIL | src/lib/date-validation.ts (신규) | 과거 날짜, 역전된 날짜, 체크인=체크아웃 등 경계값을 판정하는 순수 함수를 제공한다(UNIT-TRAVEL-DATES). | — | — | UNIT-TRAVEL-DATES |
| API-MATE-AUTOCLOSE | src/lib/mate-autoclose.ts (신규) | 배치 작업 없이 조회 시점에 `end_date` 경과 여부를 계산해 CLOSED 상태를 파생시킨다(UNIT-MATE-STATE로 검증). | — | — | UNIT-MATE-STATE |
| API-MATES-CRUD | src/app/api/mates/route.ts (신규)<br>src/app/api/mates/[id]/route.ts (신규) | 목록 조회(GET), 생성(POST), 수정/마감/삭제(PATCH/DELETE)를 제공하며 응답에 연락처 필드를 포함하지 않는다.<br>본문 저장 전 연락처 탐지 유틸을 서버에서도 재검증한다(클라이언트 우회 방지). | — | 비회원 POST는 401로 차단한다. | TEST-RLS-BASIC, UNIT-CONTACT-DETECTION |
| API-APPLICATIONS | src/app/api/mates/[id]/applications/route.ts (신규)<br>src/app/api/applications/[id]/route.ts (신규) | 참가 요청 생성 시 중복 PENDING/ACCEPTED를 DB unique 제약과 함께 차단한다.<br>작성자만 상태를 ACCEPTED/REJECTED로 변경할 수 있으며 비작성자 요청은 403을 반환한다.<br>상태 변경 시 알림 상태를 1분 이내 갱신한다(이메일은 발송하지 않고 화면 상태로 대체). | — | 비작성자의 승인/거절 시도는 403. | TEST-RLS-BASIC, UNIT-MATE-STATE |
| API-BLOCKS | src/app/api/blocks/route.ts (신규) | 차단 생성/해제를 제공하고 차단 후 상호 글·프로필·요청 노출을 차단한다. | — | 차단 목록은 본인만 조회 가능. | TEST-RLS-BASIC |
| API-REPORTS | src/app/api/reports/route.ts (신규) | 신고 생성 시 3초 이내 접수 ID를 반환한다. | — | 신고자·피신고자 상세는 Moderator/Admin만 조회 가능. | TEST-RLS-BASIC |
| API-ADMIN-REPORTS | src/app/api/admin/reports/route.ts (신규) | OPEN/RESOLVED/DISMISSED 상태 필터 조회와 상태 변경(게시물 숨김 포함)을 제공한다. | — | Moderator/Admin 역할만 접근 가능(RLS+역할 검증), 그 외는 403. | TEST-RLS-BASIC |
| API-ADMIN-OUTBOUND-SETTINGS | src/app/api/admin/settings/outbound/route.ts (신규) | HTTPS 허용목록 내 주소만 저장하도록 서버에서 재검증한다(HTTP/javascript/data URL 거부). | — | Admin 역할만 접근 가능, 그 외 403. | TEST-RLS-BASIC |
| API-ERROR-PAGES | src/app/not-found.tsx (신규)<br>src/app/error.tsx (신규) | 404·500·권한 없음·외부 연결 실패 화면에 홈/이전/재시도 중 최소 1개의 복구 행동을 제공한다. | — | — | E2E-PUBLIC-SMOKE |
| API-SECURITY-BASELINE | src/middleware.ts (신규 또는 수정) | Server Actions/Route Handler에 SameSite 쿠키와 CSRF 방어를 적용한다.<br>사용자 입력을 검증·이스케이프해 저장 XSS를 차단한다(OWASP 기준). | — | — | TEST-RLS-BASIC |

### 1.6 Unit / Integration Test (UNIT_TEST) — 4개

**A. 개요**

| Seq | Task ID | 제목 | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Priority |
|---:|---|---|---|---|---|---|---|---|---|
| 60 | UNIT-TRAVEL-DATES | 날짜 검증 Unit Test | IMPLEMENT | REQ-FUNC-013<br>REQ-FUNC-021 | — | — | — | API-DATE-VALIDATION-UTIL | Must |
| 61 | UNIT-CONTACT-DETECTION | 연락처 탐지 Unit Test | IMPLEMENT | REQ-FUNC-032 | — | — | — | API-CONTACT-DETECTION-UTIL | Must |
| 62 | UNIT-MATE-STATE | 동행글/참가요청 상태 전이 Unit Test | IMPLEMENT | REQ-FUNC-035<br>REQ-FUNC-036<br>REQ-FUNC-037 | — | — | — | DB-ACCESS<br>API-MATE-AUTOCLOSE | Must |
| 63 | TEST-RLS-BASIC | RLS 기본 정책 Integration Test | IMPLEMENT | REQ-FUNC-044<br>REQ-NF-013 | — | — | — | DB-RLS-BASE<br>DB-ACCESS | Must |

**B. 상세(Expected Files / Acceptance Criteria / Verify)**

| Task ID | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify |
|---|---|---|---|---|---|
| UNIT-TRAVEL-DATES | src/lib/date-validation.test.ts (신규) | 과거 출발일/체크인, 역전된 귀국일/체크아웃, 체크인=체크아웃 등 경계값 케이스를 모두 검증한다.<br>statement coverage 80% 이상, 핵심 규칙 100% 커버. | — | — | CI-PIPELINE |
| UNIT-CONTACT-DETECTION | src/lib/contact-detection.test.ts (신규) | 전화번호·이메일·메신저 ID 패턴 기준 테스트셋으로 탐지율 95% 이상, 오탐 5% 이하를 검증한다. | — | — | CI-PIPELINE |
| UNIT-MATE-STATE | src/lib/db/mate-state.test.ts (신규) | OPEN→CLOSED(자동/수동), PENDING→ACCEPTED/REJECTED/WITHDRAWN 전이와 중복 요청 차단 로직을 검증한다. | — | — | CI-PIPELINE |
| TEST-RLS-BASIC | tests/integration/rls-basic.test.ts (신규) | 익명/타인/Moderator/Admin 4개 역할로 각 테이블에 대한 부정 접근 시나리오를 실행해 모두 403 또는 빈 결과를 반환하는지 검증한다. | — | — | CI-PIPELINE |

### 1.7 E2E Test (Playwright) (E2E_TEST) — 3개

**A. 개요**

| Seq | Task ID | 제목 | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Priority |
|---:|---|---|---|---|---|---|---|---|---|
| 64 | E2E-PUBLIC-SMOKE | Playwright 공개 화면 Smoke(비로그인) | IMPLEMENT | REQ-FUNC-001<br>REQ-FUNC-002<br>REQ-FUNC-004<br>REQ-FUNC-006<br>REQ-FUNC-057<br>REQ-NF-024 | SCR-001, SCR-002 | /, /about | — | PAGE-SCR001<br>PAGE-SCR002<br>API-ERROR-PAGES | Must |
| 65 | E2E-TRAVEL-TOOLS | Playwright 여행 준비 흐름 | IMPLEMENT | REQ-FUNC-013<br>REQ-FUNC-016<br>REQ-FUNC-021<br>REQ-FUNC-024 | SCR-003 | /travel-tools | — | PAGE-SCR003 | Must |
| 66 | E2E-MATE-AUTH | Playwright 동행 인증 흐름 | IMPLEMENT | REQ-FUNC-027<br>REQ-FUNC-031<br>REQ-FUNC-034<br>REQ-FUNC-036<br>REQ-FUNC-039<br>REQ-FUNC-040<br>REQ-FUNC-066 | SCR-003, SCR-004, SCR-005 | /travel-tools, /mates, /account | — | PAGE-SCR003<br>PAGE-SCR004<br>PAGE-SCR005 | Must |

**B. 상세(Expected Files / Acceptance Criteria / Verify)**

| Task ID | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify |
|---|---|---|---|---|---|
| E2E-PUBLIC-SMOKE | tests/e2e/public-smoke.spec.ts (신규) | 흐름 1: SCR-001 진입→필터 적용→여행지 Drawer 열람. 흐름 2: 해외 상세→안전정보 Drawer 전환. 흐름 3: SCR-002 진입→Gallery/Timeline 노출 확인. 흐름 4: 404 페이지 복구 행동 확인.<br>axe-core 자동 접근성 검사에서 serious/critical 위반 0건(REQ-NF-024). | — | — | — |
| E2E-TRAVEL-TOOLS | tests/e2e/travel-tools.spec.ts (신규) | 흐름 5: 항공 탭 조건 입력→검증 오류 확인→정상 입력→요약→외부 이동(새 탭, 네트워크에 값 미포함 확인). 흐름 6: 숙소 탭 동일 시나리오.<br>Chromium 단일 브라우저로만 실행한다(다중 브라우저 매트릭스 없음). | — | 네트워크 요청에 목적지·날짜 값이 포함되지 않음을 자동 검증. | — |
| E2E-MATE-AUTH | tests/e2e/mate-auth.spec.ts (신규) | 흐름 7: 회원가입/로그인→성인확인→동행글 작성(연락처 탐지 차단 케이스 포함)→SCR-004에서 참가 요청→작성자 승인→신고/차단 시나리오까지 하나의 로그인 세션으로 연결한다.<br>Chromium 단일 브라우저로만 실행한다. | — | — | — |

### 1.8 CI / Infra (CI_INFRA) — 3개

**A. 개요**

| Seq | Task ID | 제목 | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Priority |
|---:|---|---|---|---|---|---|---|---|---|
| 67 | CI-PIPELINE | CI 파이프라인(TypeScript strict·Lint·Unit Test) | IMPLEMENT | REQ-NF-031 | — | — | — | UNIT-TRAVEL-DATES<br>UNIT-CONTACT-DETECTION<br>UNIT-MATE-STATE<br>TEST-RLS-BASIC<br>DATA-CONTENT-COMPLETENESS-CHECK | Must |
| 68 | INFRA-VERCEL-DEPLOY | Vercel 배포 및 환경변수 설정 | IMPLEMENT | REQ-NF-012<br>REQ-NF-016<br>REQ-NF-034 | — | — | — | — | Must |
| 69 | INFRA-SUPABASE-PROJECT | Supabase 프로젝트 연결 확인 | IMPLEMENT | — | — | — | — | — | Must |

**B. 상세(Expected Files / Acceptance Criteria / Verify)**

| Task ID | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify |
|---|---|---|---|---|---|
| CI-PIPELINE | .github/workflows/ci.yml (신규) | main 병합 전 `tsc --noEmit`, `next lint`, Unit Test, 콘텐츠 완전성 검증 스크립트를 실행하고 실패 시 병합을 막는다.<br>자동 Merge Runner는 만들지 않는다 — 병합 승인은 사람이 수행한다. | — | — | 코드 리뷰 |
| INFRA-VERCEL-DEPLOY | vercel.json (신규, 필요 시)<br>.env.example (신규) | FLIGHT_OUTBOUND_URL, HOTEL_OUTBOUND_URL, Supabase URL/키를 Vercel 환경변수로 관리하고 클라이언트 번들에 비밀키를 포함하지 않는다.<br>HTTPS/TLS 1.2 이상은 Vercel 기본 제공을 사용한다.<br>무료 또는 최저 유료 티어를 선택해 월 인프라 비용 목표(10만원 이하)를 충족한다.<br>EC2·AWS 등 별도 인프라는 구성하지 않는다. | — | 비밀키는 서버 전용 환경변수로만 노출한다. | RELEASE-CHECK-EXTERNAL-LINKS |
| INFRA-SUPABASE-PROJECT | supabase/config.toml (신규) | Supabase PostgreSQL/Auth 프로젝트를 생성하고 로컬·Vercel 환경에서 연결 가능함을 확인한다. | — | — | 코드 리뷰 |

### 1.9 Manual / Release Check (MANUAL_CHECK) — 4개

**A. 개요**

| Seq | Task ID | 제목 | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Priority |
|---:|---|---|---|---|---|---|---|---|---|
| 70 | MANUAL-RESPONSIVE-CHECK | 반응형 수동 확인(320px~1440px) | IMPLEMENT | REQ-FUNC-065 | COMMON | 전체 5개 Route | — | PAGE-SCR001<br>PAGE-SCR002<br>PAGE-SCR003<br>PAGE-SCR004<br>PAGE-SCR005 | Must |
| 71 | MANUAL-A11Y-CHECK | 핵심 흐름 키보드·스크린리더 수동 확인 | IMPLEMENT(변형) | REQ-NF-023 | COMMON | 전체 5개 Route | — | E2E-PUBLIC-SMOKE<br>E2E-TRAVEL-TOOLS<br>E2E-MATE-AUTH | Should |
| 72 | RELEASE-CHECK-EXTERNAL-LINKS | 배포 전 외부 링크 수동 점검 | IMPLEMENT | REQ-FUNC-016<br>REQ-FUNC-024<br>REQ-FUNC-049 | SCR-001, SCR-003 | /, /travel-tools | — | PAGE-SCR001<br>PAGE-SCR003 | Must |
| 73 | RELEASE-CHECK-CONTENT-GATE | 배포 전 콘텐츠 완전성 게이트 실행 확인 | IMPLEMENT(변형) | REQ-FUNC-074 | — | — | — | DATA-CONTENT-COMPLETENESS-CHECK | Must |

**B. 상세(Expected Files / Acceptance Criteria / Verify)**

| Task ID | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify |
|---|---|---|---|---|---|
| MANUAL-RESPONSIVE-CHECK | —(코드 산출물 없음, 체크리스트: TASKS/checklists/responsive.md 신규) | 실제 브라우저(Chrome DevTools 또는 실기기)에서 320px, 390px, 744px, 1128px, 1440px 5개 폭으로 5개 Screen을 열어 가로 스크롤·겹침이 없는지 확인한다. | — | — | 사람이 직접 실행 |
| MANUAL-A11Y-CHECK | —(체크리스트: TASKS/checklists/a11y.md 신규) | 핵심 흐름(검색, 폼 입력, 모달/Drawer 닫기, 참가 요청 제출)을 키보드만으로 완료할 수 있는지 확인한다.<br>전체 Use Case에 대한 정식 스크린리더 QA는 범위 밖이며(REQ-NF-025 EXCLUDED), 핵심 흐름만 확인한다. | — | — | 사람이 직접 실행 |
| RELEASE-CHECK-EXTERNAL-LINKS | —(체크리스트: TASKS/checklists/external-links.md 신규) | 배포 직전 항공/숙소 외부 URL과 외교부 안전정보 링크를 실제 브라우저에서 열어 정상 동작을 확인한다(자동 주간 점검은 REQ-NF-011 EXCLUDED의 대체 조치). | — | — | 사람이 직접 실행 |
| RELEASE-CHECK-CONTENT-GATE | —(체크리스트: TASKS/checklists/content-gate.md 신규) | 배포 전 `scripts/validate_content.py` 실행 결과가 통과인지 사람이 최종 확인한다. | — | — | 사람이 직접 실행 |

---
## 2. NON_IMPLEMENTATION (EXCLUDED Requirement 추적표)

`PROJECT_SCOPE.md` 기준 EXCLUDED로 결정된 30개 Requirement는 상세 구현 Task를 만들지 않는다. 아래 표에서 근거와 후속 방향을 기록해 추적표에서 삭제하지 않는다(원본 근거는 `docs/PROJECT_SCOPE.md` §5~6과 동일).

| Requirement | 근거(제외 사유) | 후속 방향 |
|---|---|---|
| REQ-FUNC-010 | 필수 구현 범위(핵심 화면·안전정보·항공·호텔·동행·인증·신고·차단·관리자·테스트·배포) 밖의 UX 고도화이며 정적 데이터 규모상 필요성이 낮음 | MVP 운영 지표에서 필터 재사용 빈도가 높게 확인되면 Should 항목으로 재검토. |
| REQ-FUNC-045 | 30일 지연 삭제 파이프라인·법적 보존 예외 처리·감사 로그는 범용 감사 로그·배치 인프라 제외 범위에 해당, 계정 삭제 시 프로필 즉시 비식별화만 제공 | 실 서비스 전환 시 개인정보 보호법 요구사항에 맞춰 배치 삭제 파이프라인을 별도 과제로 설계. |
| REQ-FUNC-055 | Editor/Admin 작성·검수·게시 워크플로는 전체 콘텐츠 CMS 제외 범위에 해당, 정적 데이터 직접 편집·배포로 대체 | 콘텐츠 규모가 커지면 헤드리스 CMS 또는 관리자 CRUD 도입을 재검토. |
| REQ-FUNC-056 | 이전 값·새 값·사유 등 변경 이력 보존은 범용 감사 로그 제외 범위에 해당, git 커밋 이력으로 대체 | 운영 인력이 늘어나면 안전정보 변경 이력 UI를 별도 과제로 도입. |
| REQ-FUNC-069 | 필수 구현 범위 밖의 부가 UX이며 브라우저 기본 URL 복사로 충분히 대체 가능 | 공유 클릭률 데이터가 확보되면 Web Share API 기반 공유 버튼 도입 검토. |
| REQ-FUNC-071 | 별도 분석 이벤트 수집 인프라 구축은 필수 구현 범위·구현 방식에 없음, KPI 계측은 MVP 이후 과제 | MVP 이후 GA4 등 경량 분석 도구 도입 검토. |
| REQ-FUNC-072 | Editor/Admin 콘텐츠 CRUD·미리보기는 전체 콘텐츠 CMS 제외 범위에 해당 | REQ-FUNC-055와 함께 CMS 도입 시 재검토. |
| REQ-FUNC-073 | 미디어 업로드 시 출처·작가·라이선스 필수 입력은 미디어 업로드·라이선스 워크플로 제외 범위에 해당 | 이미지 자산이 늘어나고 라이선스 분쟁 리스크가 커지면 도입. |
| REQ-FUNC-075 | stale 현황·담당자 대시보드는 관리자가 신고 상태와 외부 URL만 다루는 범위 밖 | 안전정보 운영 인력이 배정되면 별도 대시보드 과제로 분리. |
| REQ-FUNC-076 | 관리자 변경·신고 처리·권한 변경 감사 로그는 범용 감사 로그 제외 범위에 해당 | 운영 신뢰성 요구가 커지면 감사 로그 테이블·UI를 별도 과제로 도입. |
| REQ-NF-001 | 정량적 LCP 측정·성능 CI는 부하 테스트 제외 범위에 준함, Next.js 기본 최적화만 적용 | Public Beta 단계에서 Lighthouse CI 파이프라인 도입 검토. |
| REQ-NF-002 | INP 실측 인프라 미구축, 상호작용 최적화는 코드 수준에서만 고려 | 실사용자 필드 데이터(CrUX) 확보 후 재평가. |
| REQ-NF-003 | CLS 실측 인프라 미구축 | Lighthouse CI 도입 시 함께 계측. |
| REQ-NF-004 | 필터 응답 p95 측정 인프라 없음(기능 자체는 REQ-FUNC-002/030으로 구현됨) | 트래픽 증가 시 APM 도구 도입 후 SLA 재정의. |
| REQ-NF-005 | 쓰기 API 응답 p95 측정 인프라 없음 | APM 도구 도입 시 함께 계측. |
| REQ-NF-007 | Lighthouse CI 성능 예산 게이트는 부하 테스트·CI 인프라 제외 범위에 해당 | CI 리소스 확보 시 CI-PIPELINE에 통합. |
| REQ-NF-008 | 가용성 SLA 측정·모니터링은 자동 백업·장애 알림 제외 범위에 해당, Vercel 기본 인프라에 의존 | 유료 모니터링 도구(Vercel Analytics 등) 도입 시 재평가. |
| REQ-NF-009 | 5xx 비율 모니터링 인프라 미구축 | APM/로그 수집 도구 도입 시 재평가. |
| REQ-NF-010 | DB 백업 RPO/RTO 체계는 자동 백업 제외 범위에 명시적으로 해당 | Supabase 유료 플랜의 Point-in-time Recovery 도입 검토. |
| REQ-NF-011 | 외부 링크 주간 자동 검사 배치는 인프라 제외 범위에 해당, 배포 전 수동 점검으로 대체 | RELEASE-CHECK-EXTERNAL-LINKS(수동)로 배포 시점마다 대체 수행, 트래픽 증가 시 자동화 스케줄러 도입 검토. |
| REQ-NF-018 | 개인정보 내보내기와 30일 지연 삭제 파이프라인은 범용 감사 로그·배치 인프라 제외 범위에 해당, 계정 삭제 시 즉시 비식별화만 제공 | REQ-FUNC-045와 함께 배치 삭제/내보내기 파이프라인을 별도 과제로 설계. |
| REQ-NF-019 | 신고 접수 응답 p95 측정 인프라 없음(기능 자체는 REQ-FUNC-039로 구현됨) | APM 도구 도입 시 재평가. |
| REQ-NF-020 | 신고 1차 검토 SLA 추적·알림 인프라는 제외 범위에 해당, 운영자가 관리자 탭에서 수동 확인 | 운영 인력 확대 시 SLA 추적 대시보드 도입 검토. |
| REQ-NF-021 | 사용자별 요청 속도 제한(429) 미들웨어 인프라는 필수 구현 범위 밖 | 어뷰징 신고가 실제로 발생하면 Rate Limiting 미들웨어 도입. |
| REQ-NF-022 | Moderator 조치 추적성(감사 로그)은 범용 감사 로그 제외 범위에 해당 | REQ-FUNC-076과 함께 감사 로그 도입 시 재평가. |
| REQ-NF-025 | 모든 Use Case에 대한 정식 키보드/스크린리더 수동 QA 프로세스는 운영 리소스 밖, 핵심 흐름 개발 중 키보드 동작만 확인 | MANUAL-A11Y-CHECK로 핵심 흐름만 우선 확인, QA 리소스 확보 시 전체 UC로 확대. |
| REQ-NF-028 | 안전정보 7일 이내 확인율 95%는 콘텐츠 운영 KPI로 소프트웨어가 자동 보장할 수 없음, stale 경고 기능 자체는 REQ-FUNC-050으로 구현됨 | 운영 담당자 지정 후 주간 검수 프로세스로 KPI 관리. |
| REQ-NF-029 | 미디어 라이선스 메타데이터 100%는 이미지 정책 단순화(alt+URL만)로 제외 | REQ-FUNC-073과 함께 라이선스 관리가 필요해지면 도입. |
| REQ-NF-032 | 구조화 로그 수집·저장 인프라는 모니터링 제외 범위와 연계되어 제외 | APM/로그 수집 도구 도입 시 구조화 로그 포맷 정의. |
| REQ-NF-033 | 5분 이내 핵심 오류 알림은 장애 알림 제외 범위에 명시적으로 해당 | 모니터링 도구 도입 시 Slack/이메일 알림 연동 검토. |

**NON_IMPLEMENTATION 총 30개 확인(REQ-FUNC 10개 + REQ-NF 20개 = PROJECT_SCOPE.md 요약 통계와 일치).**

---
## 3. 범위 고지

- 이 문서는 Task 목록만 정의한다. 이 작업 중 실제 구현 코드, Git Branch, Commit, Issue는 생성하지 않았다.
- 모든 Task의 Expected Files는 현재 `src/app` 파일 트리(`src/app/favicon.ico`, `globals.css`, `layout.tsx`, `page.tsx`만 존재, 나머지 라우트 없음)를 확인한 뒤 (신규)/(수정)으로 표기했다.
- Page Owner Task 5개는 각각 정확히 1개의 Page Entry만 소유하며(§1.1 참고), 어떤 Task도 2개 이상의 Page Entry를 동시에 소유하지 않는다.
- DB는 `DB-SCHEMA-BASE`에서 정확히 6개 테이블(USER_PROFILE, MATE_POST, MATE_APPLICATION, USER_BLOCK, REPORT, OUTBOUND_LINK_SETTING)로 제한했다.
- Playwright E2E는 `E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH` 3개 Task, Chromium 단일 브라우저로 핵심 7개 흐름(공개 탐색·안전정보 전환·대표소개, 항공 조건, 숙소 조건, 동행 작성부터 신고·차단까지)을 커버한다.
- EC2·AWS·자동 Merge Runner에 해당하는 Task는 만들지 않았다(`INFRA-VERCEL-DEPLOY`, `CI-PIPELINE` 참고).

---

*— End of TASKS-LIST-001 —*
