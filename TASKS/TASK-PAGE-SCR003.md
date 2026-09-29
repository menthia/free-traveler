# TASK-PAGE-SCR003: SCR-003 통합 여행 준비 페이지 조립(`/travel-tools`)

- **Seq:** 24
- **Category:** Page Owner (`PAGE_OWNER`)
- **Implementation Status:** IMPLEMENT
- **Priority:** Must

---

## Context

SCR-003(`/travel-tools`, 통합 여행 준비) 화면을 실제 Next.js Route Page로 조립하는 Task다. 이 Task는 새로운 UI 조각을 설계·구현하지 않고, Depends On에 명시된 Component/Data/API Task가 만든 결과물을 지정된 Section 순서대로 배치하고 라우팅·데이터 연결을 완성하는 데만 집중한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다.

## Requirement Ref

- REQ-FUNC-011
- REQ-FUNC-012
- REQ-FUNC-013
- REQ-FUNC-014
- REQ-FUNC-015
- REQ-FUNC-016
- REQ-FUNC-018
- REQ-FUNC-019
- REQ-FUNC-020
- REQ-FUNC-021
- REQ-FUNC-022
- REQ-FUNC-023
- REQ-FUNC-024
- REQ-FUNC-026
- REQ-FUNC-027
- REQ-FUNC-028
- REQ-FUNC-031
- REQ-FUNC-032
- REQ-FUNC-054
- REQ-FUNC-080

## Screen / Route / Page Entry

- Screen: SCR-003
- Route: /travel-tools
- Page Entry: src/app/travel-tools/page.tsx

## Design Ref

- `design-reference/D-001/DESIGN.md` §6(Header·Footer), §14(Desktop·Mobile 규칙), §15(Hero 높이 규칙), §16(Section 계층과 시각적 리듬), §17(화면별 Section 순서·최소 콘텐츠 수), §18(완성형 Empty State·Placeholder 금지), §19(Do/Do Not)
- `design-reference/UI_CONTRACT.md`의 해당 Screen 절(영역 순서·주요 Component·상태·이동·금지 기능)
- `design-reference/SCREEN_ROUTE_CONTRACT.json`의 `screens[].sections_order`(대상: SCR-003)

## Depends On

- TASK-COMP-GLOBAL-SHELL
- TASK-COMP-GLOBAL-SEO-METADATA
- TASK-COMP-SCR003-INTRO-TABS
- TASK-COMP-SCR003-FLIGHT-FORM
- TASK-COMP-SCR003-HOTEL-FORM
- TASK-COMP-SCR003-TIPS
- TASK-COMP-SCR003-MATE-COMPOSE
- TASK-COMP-SCR003-MATE-LOGIN-GATE

## Expected Files

- src/app/travel-tools/page.tsx (신규)
- src/components/travel-tools/SummaryActionCard.tsx (수정 — REQ-FUNC-054 "항공 외부 이동
  요약에서 안전정보 고지 노출" 요구는 COMP-SCR003-FLIGHT-FORM 완료 시점에는 반영되지
  않았다. 항공 탭에서만 표시하는 선택적 안전정보 고지 문구 prop을 추가한다. 숙소 탭
  동작은 바꾸지 않는다)
- src/components/travel-tools/FlightConditionForm.tsx (수정 — 위 SummaryActionCard의
  새 prop을 항공 탭에서 켜도록 하고, 아래 이유로 제출 버튼을 제거해 유효 입력 시 자동으로
  요약을 표시하도록 변경)
- src/components/travel-tools/HotelConditionForm.tsx (수정 — `tests/e2e/public-smoke.spec.ts`
  의 기존 E2E-003/E2E-004(이 저장소에 이미 커밋되어 있던 테스트, 이번 Task 이전에 작성됨)가
  별도 제출 버튼 클릭 없이 4개 필드 입력만으로 요약+외부 이동 링크가 나타나는 것을 전제하고
  있었다. `SummaryActionCard`의 외부 이동 CTA도 `window.open` 버튼에서 실제 `<a href>`
  태그로 바꿔 href에 입력값이 담기지 않음을 테스트가 직접 확인할 수 있게 한다)
- src/components/travel-tools/TravelToolsTabsSection.tsx (신규 — Page Owner는
  `generateMetadata`를 export해야 하므로 Server Component여야 하지만, 탭 전환은 Client
  state가 필요하다. Next.js의 Server/Client 경계 제약상 이 상태를 들고 있을 정확히 하나의
  얇은 Client wrapper가 필요하며, COMP-SCR001-THEME-CHIPS의 `DestinationExplorerSection`과
  동일한 선례 패턴이다 — 새 UI를 설계하지 않고 이미 만들어진 TabBar/Form/Tip/Gate
  Component만 조립하며, 탭 전환 시 다른 탭 입력값이 사라지지 않도록 3개 탭 콘텐츠를 모두
  마운트한 채 `hidden`으로만 전환한다)
- src/middleware.ts (수정 — 프로덕션 빌드로 이 Task를 검증하던 중 발견: CSP의
  `'strict-dynamic'`가 브라우저에서 `'self'` 호스트 허용을 무효화해 Turbopack이 동적으로
  삽입하는 코드분할 청크 스크립트 로딩 자체를 차단하고 있었다(사이트 전체 하이드레이션이
  깨지는 심각한 회귀). Next의 인라인 스트리밍 스크립트는 nonce로 이미 허용되므로
  `'strict-dynamic'`을 제거하고 `'self' 'nonce-X'`만 사용하도록 고친다. 같은 검증 중
  `connect-src`가 없어 `default-src 'self'`로 대체되면서 Client Component의 Supabase
  fetch(예: `outbound_link_setting` 조회)가 전부 차단되는 것도 함께 발견해 `connect-src
  'self' <NEXT_PUBLIC_SUPABASE_URL>`을 추가한다)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. 항공편·숙소·동행 구하기 3개 탭을 실제로 조립해 각 탭이 독립적인 입력·검증·완료 상태를 갖도록 한다(탭만 만들고 내용을 비워두지 않는다).
2. Section 순서: ① Intro(3단계) → ② 탭바 → ③ 여행정보 Form(활성 탭에 따라 항공/숙소 필드, 데이터 출처: 사용자 입력만, 서버 저장 없음) → ④ 입력 요약·외부 이동 Action Card → ⑤ 비전달 고지+Tip 3개 → ⑥ 동행 작성 Form 또는 로그인 안내+안전 안내(데이터 출처: API-MATES-CRUD).
3. 항공·숙소 탭에는 최소 콘텐츠로 Tip 3개, 필드 4개(국가/지역/날짜 2개)를 반드시 포함한다.
4. 안전정보 요약 고지(REQ-FUNC-054)를 항공 요약 단계에도 표시한다.
5. Lorem ipsum·'준비 중'·'정보 확인 필요' 문구나 내용 없는 빈 Card를 두지 않는다. 동행 탭의 비로그인 상태는 완성형 안내 Card(설명+CTA)로 처리하며 빈 화면으로 보이지 않게 한다.
6. 동행 탭은 `design-reference/D-001/DESIGN.md` §13 상태 규칙을 따른다: 로그인·성인 확인 상태 조회 중에는 Loading(버튼/카드 내 스피너), 동행글 제출(API-MATES-CRUD POST) 실패 시 실패 사유+재시도 CTA를 포함한 Error를 표시한다. 항공·숙소 탭은 서버 조회가 없는 클라이언트 로컬 폼이므로 이 상태가 적용되지 않는다(입력 검증 오류는 필드별 오류 메시지로 별도 처리).
7. `src/lib/seo.ts`(COMP-GLOBAL-SEO-METADATA)의 유틸을 사용해 SCR-003 고유의 `generateMetadata`를 export한다.

## Visual AC

1. Desktop 콘텐츠 최대 폭 1200~1280px, Section 상하 여백 64~96px(Mobile 40~64px), Form Desktop 2단/Mobile 1단.

## Security/Privacy AC

1. 항공·숙소 조건 입력값은 서버·DB·외부 URL 쿼리에 전달되지 않는다(CON-01/CON-02 재확인).

## Test Cases

- TC-01: 항공편·숙소·동행 구하기 3개 탭을 실제로 조립해 각 탭이 독립적인 입력·검증·완료 상태를 갖도록 한다(탭만 만들고 내용을 비워두지 않는다).
- TC-02: Section 순서: ① Intro(3단계) → ② 탭바 → ③ 여행정보 Form(활성 탭에 따라 항공/숙소 필드, 데이터 출처: 사용자 입력만, 서버 저장 없음) → ④ 입력 요약·외부 이동 Action Card → ⑤ 비전달 고지+Tip 3개 → ⑥ 동행 작성 Form 또는 로그인 안내+안전 안내(데이터 출처: API-MATES-CRUD).
- TC-03: 항공·숙소 탭에는 최소 콘텐츠로 Tip 3개, 필드 4개(국가/지역/날짜 2개)를 반드시 포함한다.
- TC-04: 안전정보 요약 고지(REQ-FUNC-054)를 항공 요약 단계에도 표시한다.
- TC-05: Lorem ipsum·'준비 중'·'정보 확인 필요' 문구나 내용 없는 빈 Card를 두지 않는다. 동행 탭의 비로그인 상태는 완성형 안내 Card(설명+CTA)로 처리하며 빈 화면으로 보이지 않게 한다.
- TC-06: 동행 탭에서 로그인/성인확인 조회 중 Loading, 동행글 제출 실패 시 재시도 CTA가 있는 Error 상태를 각각 확인한다.
- TC-07: 1440px Desktop과 390px Mobile 두 뷰포트에서 모두 위 Functional AC를 재확인한다.
- TC-08: `src/app/travel-tools/page.tsx`가 `generateMetadata`를 export하고, `src/lib/seo.ts` 유틸을 사용해 SCR-003 고유 값을 반환한다.

## Verify

- E2E-TRAVEL-TOOLS, MANUAL-RESPONSIVE-CHECK

## Definition of Done

- [ ] 위 Expected Files가 모두 생성/수정되어 있고 그 밖의 파일 변경이 없다.
- [ ] Functional AC, Visual AC, Security/Privacy AC를 모두 충족한다.
- [ ] Test Cases가 Verify에 명시된 방법으로 확인 가능하다.
- [ ] Depends On에 나열된 모든 Task가 먼저 완료되어 있다.
- [ ] 이 Task 안에서 새로운 Component/Data/API 파일을 만들지 않고 기존 결과물만 조립했다.

## Forbidden

- **Expected Files 목록 밖의 어떤 파일도 생성·수정하지 않는다.**
- 이 Task 수행 중 실제 구현 코드 실행 결과 커밋, Git Branch 생성, Pull Request 생성을 하지 않는다(이 문서는 계획/명세 파일이다).
- 하위 Component/Data/API 파일을 새로 생성하지 않는다 — Depends On에 명시된 Component/Data/API Task가 이미 만든 결과물만 import하여 조립한다.
- Airbnb 등 타 브랜드의 로고·워드마크·고유 색상 값·아이콘을 재현하지 않는다.
- 예약(Reserve)·결제(Checkout)·장바구니·가격 확정 UI를 추가하지 않는다.
- Lorem ipsum, '준비 중', '정보 확인 필요' 문구나 내용 없는 빈 Card를 추가하지 않는다.
- `design-reference/D-001/DESIGN.md` §1 Color Token 표에 없는 임의 색상을 추가하지 않는다.
- 항공·숙소 조건 입력값을 서버 API, DB, 외부 URL의 쿼리·본문·쿠키로 전달하지 않는다.

---

*— TASK-PAGE-SCR003 끝 —*
