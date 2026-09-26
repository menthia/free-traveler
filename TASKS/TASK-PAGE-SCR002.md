# TASK-PAGE-SCR002: SCR-002 대표 소개 페이지 조립(`/about`)

- **Seq:** 17
- **Category:** Page Owner (`PAGE_OWNER`)
- **Implementation Status:** IMPLEMENT(변형)
- **Priority:** Should

---

## Context

SCR-002(`/about`, 대표 소개) 화면을 실제 Next.js Route Page로 조립하는 Task다. 이 Task는 새로운 UI 조각을 설계·구현하지 않고, Depends On에 명시된 Component/Data/API Task가 만든 결과물을 지정된 Section 순서대로 배치하고 라우팅·데이터 연결을 완성하는 데만 집중한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT(변형)**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다. 단, 원 요구사항을 그대로 만족하지 않고 단순화된 방식(§Design Ref 참고: 정적 데이터/localStorage/Toast/렌더링 시점 계산 등)으로 구현하도록 승인되어 있다 — 이 축소 범위를 임의로 되돌려 원 요구사항 전체를 구현하지 않는다.

## Requirement Ref

- REQ-FUNC-057
- REQ-FUNC-058
- REQ-FUNC-059
- REQ-FUNC-060
- REQ-FUNC-061
- REQ-FUNC-062
- REQ-FUNC-063

## Screen / Route / Page Entry

- Screen: SCR-002
- Route: /about
- Page Entry: src/app/about/page.tsx

## Design Ref

- `design-reference/D-001/DESIGN.md` §6(Header·Footer), §14(Desktop·Mobile 규칙), §15(Hero 높이 규칙), §16(Section 계층과 시각적 리듬), §17(화면별 Section 순서·최소 콘텐츠 수), §18(완성형 Empty State·Placeholder 금지), §19(Do/Do Not)
- `design-reference/UI_CONTRACT.md`의 해당 Screen 절(영역 순서·주요 Component·상태·이동·금지 기능)
- `design-reference/SCREEN_ROUTE_CONTRACT.json`의 `screens[].sections_order`(대상: SCR-002)

## Depends On

- TASK-COMP-GLOBAL-SHELL
- TASK-COMP-GLOBAL-SEO-METADATA
- TASK-COMP-SCR002-PROFILE-HERO
- TASK-COMP-SCR002-STATS-AND-INTRO
- TASK-COMP-SCR002-TIMELINE
- TASK-COMP-SCR002-COUNTRY-CHIPS
- TASK-COMP-SCR002-GALLERY
- TASK-COMP-SCR002-MEMORABLE-CTA
- TASK-DATA-REPRESENTATIVE

## Expected Files

- src/app/about/page.tsx (신규)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. Section 순서를 다음과 같이 정확히 배치한다: ① Profile Hero → ② 여행 지표(데이터 출처: DATA-REPRESENTATIVE) → ③ 소개·철학 → ④ Timeline 6개 이상 → ⑤ 방문 국가 30개(Chip, 데이터 출처: DATA-REPRESENTATIVE) → ⑥ Gallery 8개 → ⑦ 기억에 남는 여행지 4개+CTA.
2. 문의·SNS 링크(REQ-FUNC-062)는 빈 값이면 렌더링하지 않고 허용 프로토콜만 연다.
3. 각 Section 최소 콘텐츠 수(Timeline 6, Gallery 8, 방문 국가 30, 기억에 남는 여행지 4)를 반드시 충족한다.
4. Desktop 콘텐츠 최대 폭 1200~1280px, Section 상하 여백 64~96px(Mobile 40~64px).
5. 이 화면의 모든 Section은 `DATA-REPRESENTATIVE` 정적 데이터만 사용해 Server Component로 렌더링하므로 런타임 네트워크 조회가 없다 — `design-reference/D-001/DESIGN.md` §13의 Loading/Error 상태는 적용 대상이 아니다(정적 데이터 자체가 누락되면 §7 콘텐츠 완전성 검증(DATA-CONTENT-COMPLETENESS-CHECK)에서 빌드 이전에 걸러진다).
6. `src/lib/seo.ts`(COMP-GLOBAL-SEO-METADATA)의 유틸을 사용해 SCR-002 고유의 `generateMetadata`를 export한다.

## Visual AC

1. Hero 460~480px로 제한해 1440px 첫 화면에서 지표 Section 제목이 보인다.
2. Hero, 통계 Card, 좌우분할, Timeline, Chip 목록, Gallery Card Grid, Card Grid+CTA Banner 순으로 레이아웃 패턴을 교차 사용한다.

## Security/Privacy AC

1. 해당 없음

## Test Cases

- TC-01: Section 순서를 다음과 같이 정확히 배치한다: ① Profile Hero → ② 여행 지표(데이터 출처: DATA-REPRESENTATIVE) → ③ 소개·철학 → ④ Timeline 6개 이상 → ⑤ 방문 국가 30개(Chip, 데이터 출처: DATA-REPRESENTATIVE) → ⑥ Gallery 8개 → ⑦ 기억에 남는 여행지 4개+CTA.
- TC-02: 문의·SNS 링크(REQ-FUNC-062)는 빈 값이면 렌더링하지 않고 허용 프로토콜만 연다.
- TC-03: 각 Section 최소 콘텐츠 수(Timeline 6, Gallery 8, 방문 국가 30, 기억에 남는 여행지 4)를 반드시 충족한다.
- TC-04: Desktop 콘텐츠 최대 폭 1200~1280px, Section 상하 여백 64~96px(Mobile 40~64px).
- TC-05: 이 화면에 런타임 네트워크 조회(로그인 필요 데이터·Supabase 조회 등)가 없음을 코드 리뷰로 확인한다(Loading/Error 상태 불필요).
- TC-06: 1440px Desktop과 390px Mobile 두 뷰포트에서 모두 위 Functional AC를 재확인한다.
- TC-07: `src/app/about/page.tsx`가 `generateMetadata`를 export하고, `src/lib/seo.ts` 유틸을 사용해 SCR-002 고유 값을 반환한다.

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

*— TASK-PAGE-SCR002 끝 —*
