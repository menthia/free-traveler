# TASK-PAGE-SCR001: SCR-001 메인 페이지 조립(`/`)

- **Seq:** 10
- **Category:** Page Owner (`PAGE_OWNER`)
- **Implementation Status:** IMPLEMENT(변형)
- **Priority:** Must

---

## Context

SCR-001(`/`, 여행지 탐색) 화면을 실제 Next.js Route Page로 조립하는 Task다. 이 Task는 새로운 UI 조각을 설계·구현하지 않고, Depends On에 명시된 Component/Data/API Task가 만든 결과물을 지정된 Section 순서대로 배치하고 라우팅·데이터 연결을 완성하는 데만 집중한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT(변형)**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다. 단, 원 요구사항을 그대로 만족하지 않고 단순화된 방식(§Design Ref 참고: 정적 데이터/localStorage/Toast/렌더링 시점 계산 등)으로 구현하도록 승인되어 있다 — 이 축소 범위를 임의로 되돌려 원 요구사항 전체를 구현하지 않는다.

## Requirement Ref

- REQ-FUNC-001
- REQ-FUNC-002
- REQ-FUNC-003
- REQ-FUNC-004
- REQ-FUNC-005
- REQ-FUNC-006
- REQ-FUNC-007
- REQ-FUNC-009
- REQ-FUNC-047
- REQ-FUNC-048
- REQ-FUNC-049
- REQ-FUNC-050
- REQ-FUNC-051
- REQ-FUNC-052
- REQ-FUNC-053
- REQ-FUNC-054
- REQ-FUNC-067
- REQ-FUNC-068

## Screen / Route / Page Entry

- Screen: SCR-001
- Route: /
- Page Entry: src/app/page.tsx

## Design Ref

- `design-reference/D-001/DESIGN.md` §6(Header·Footer), §14(Desktop·Mobile 규칙), §15(Hero 높이 규칙), §16(Section 계층과 시각적 리듬), §17(화면별 Section 순서·최소 콘텐츠 수), §18(완성형 Empty State·Placeholder 금지), §19(Do/Do Not)
- `design-reference/UI_CONTRACT.md`의 해당 Screen 절(영역 순서·주요 Component·상태·이동·금지 기능)
- `design-reference/SCREEN_ROUTE_CONTRACT.json`의 `screens[].sections_order`(대상: SCR-001)

## Depends On

- TASK-COMP-GLOBAL-SHELL
- TASK-COMP-GLOBAL-SEO-METADATA
- TASK-COMP-SCR001-HERO-SEARCH
- TASK-COMP-SCR001-DESTINATION-DIRECTORY
- TASK-COMP-SCR001-THEME-CHIPS
- TASK-COMP-SCR001-SAFETY
- TASK-COMP-SCR001-MATE-PREVIEW
- TASK-COMP-SCR001-CURATOR-SUMMARY
- TASK-DATA-DESTINATIONS
- TASK-DATA-SAFETY
- TASK-DATA-REPRESENTATIVE

## Expected Files

- src/app/page.tsx (수정 — create-next-app 기본 Starter 콘텐츠 전체 제거)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. Next.js 기본 Starter 콘텐츠(Next.js 로고 `<Image src="/next.svg">`, 'To get started, edit the page.tsx file' 문구, 'Templates' 외부 링크 등)를 완전히 제거한다(SCREEN_ROUTE_CONTRACT.json starter_template_forbidden=true).
2. Section 순서를 다음과 같이 정확히 배치한다: ① 검색 Hero → ② 국내 여행지 Card Grid 6개(데이터 출처: DATA-DESTINATIONS) → ③ 해외 여행지 Card Grid 6개(데이터 출처: DATA-DESTINATIONS) → ④ 여행 동기 Chip 6개 → ⑤ 국가별 주의사항 Card Grid 6개(데이터 출처: DATA-SAFETY) → ⑥ 최근 동행글 3개 또는 완성형 Empty State(데이터 출처: API-MATES-CRUD) → ⑦ free_traveler 소개(데이터 출처: DATA-REPRESENTATIVE).
3. 각 Card Grid Section은 최소 콘텐츠 수(국내 6, 해외 6, 테마 6, 안전정보 6)를 반드시 충족한다.
4. Desktop(1440px) 콘텐츠 최대 폭 1200~1280px, Section 상하 여백 64~96px. Mobile(390px) Section 상하 여백 40~64px, Card 1열, 좌우 여백 20px(반응형 콘텐츠 밀도).
5. 어떤 Section에도 Lorem ipsum, '준비 중', '정보 확인 필요', 내용 없는 빈 Card를 두지 않는다.
6. 최근 동행글 Section은 데이터가 없을 때도 설명 문장+이용 방법+CTA를 모두 갖춘 완성형 Empty State를 표시한다.
7. 최근 동행글 Section(API-MATES-CRUD 조회)은 `design-reference/D-001/DESIGN.md` §13 상태 규칙을 따른다: 조회 중에는 카드 스켈레톤(Loading), 조회 실패 시 실패 사유 설명 문장+재시도 CTA(Error)를 표시하며, 두 상태 모두 데이터 없음(Empty)과 시각적으로 구분된다. 나머지 Section(정적 데이터 기반)은 빌드 시점에 데이터가 확정되므로 별도 Loading 상태가 필요하지 않다.

## Visual AC

1. Hero 560px(Mobile 420px)로 제한해 1440px 첫 화면에서 Section 2 제목이 보인다.
2. Hero, Card Grid×2, Chip 목록, Card Grid, 3카드/Empty, 좌우분할의 6개 레이아웃 패턴을 교차 사용해 같은 Card만 반복하지 않는다(국내/해외는 배경 톤 교대로 구분).

## Security/Privacy AC

1. 즐겨찾기(localStorage)는 사용자 기기 로컬에만 저장되고 서버로 전송하지 않는다.

## Test Cases

- TC-01: Next.js 기본 Starter 콘텐츠(Next.js 로고 `<Image src="/next.svg">`, 'To get started, edit the page.tsx file' 문구, 'Templates' 외부 링크 등)를 완전히 제거한다(SCREEN_ROUTE_CONTRACT.json starter_template_forbidden=true).
- TC-02: Section 순서를 다음과 같이 정확히 배치한다: ① 검색 Hero → ② 국내 여행지 Card Grid 6개(데이터 출처: DATA-DESTINATIONS) → ③ 해외 여행지 Card Grid 6개(데이터 출처: DATA-DESTINATIONS) → ④ 여행 동기 Chip 6개 → ⑤ 국가별 주의사항 Card Grid 6개(데이터 출처: DATA-SAFETY) → ⑥ 최근 동행글 3개 또는 완성형 Empty State(데이터 출처: API-MATES-CRUD) → ⑦ free_traveler 소개(데이터 출처: DATA-REPRESENTATIVE).
- TC-03: 각 Card Grid Section은 최소 콘텐츠 수(국내 6, 해외 6, 테마 6, 안전정보 6)를 반드시 충족한다.
- TC-04: Desktop(1440px) 콘텐츠 최대 폭 1200~1280px, Section 상하 여백 64~96px. Mobile(390px) Section 상하 여백 40~64px, Card 1열, 좌우 여백 20px(반응형 콘텐츠 밀도).
- TC-05: 어떤 Section에도 Lorem ipsum, '준비 중', '정보 확인 필요', 내용 없는 빈 Card를 두지 않는다.
- TC-06: 최근 동행글 Section은 데이터가 없을 때도 설명 문장+이용 방법+CTA를 모두 갖춘 완성형 Empty State를 표시한다.
- TC-07: 최근 동행글 Section 조회 중 Loading 스켈레톤, 조회 실패 시 재시도 CTA가 있는 Error 상태를 각각 확인한다(Empty 상태와 시각적으로 구분).
- TC-08: 1440px Desktop과 390px Mobile 두 뷰포트에서 모두 위 Functional AC를 재확인한다.

## Verify

- E2E-PUBLIC-SMOKE, MANUAL-RESPONSIVE-CHECK

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

---

*— TASK-PAGE-SCR001 끝 —*
