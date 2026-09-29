# TASK-PAGE-SCR004: SCR-004 동행 조회 페이지 조립(`/mates`)

- **Seq:** 32
- **Category:** Page Owner (`PAGE_OWNER`)
- **Implementation Status:** IMPLEMENT(변형)
- **Priority:** Must

---

## Context

SCR-004(`/mates`, 동행 조회) 화면을 실제 Next.js Route Page로 조립하는 Task다. 이 Task는 새로운 UI 조각을 설계·구현하지 않고, Depends On에 명시된 Component/Data/API Task가 만든 결과물을 지정된 Section 순서대로 배치하고 라우팅·데이터 연결을 완성하는 데만 집중한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT(변형)**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다. 단, 원 요구사항을 그대로 만족하지 않고 단순화된 방식(§Design Ref 참고: 정적 데이터/localStorage/Toast/렌더링 시점 계산 등)으로 구현하도록 승인되어 있다 — 이 축소 범위를 임의로 되돌려 원 요구사항 전체를 구현하지 않는다.

## Requirement Ref

- REQ-FUNC-030
- REQ-FUNC-033
- REQ-FUNC-034
- REQ-FUNC-035
- REQ-FUNC-036
- REQ-FUNC-037
- REQ-FUNC-039
- REQ-FUNC-040
- REQ-FUNC-043

## Screen / Route / Page Entry

- Screen: SCR-004
- Route: /mates
- Page Entry: src/app/mates/page.tsx

## Design Ref

- `design-reference/D-001/DESIGN.md` §6(Header·Footer), §14(Desktop·Mobile 규칙), §15(Hero 높이 규칙), §16(Section 계층과 시각적 리듬), §17(화면별 Section 순서·최소 콘텐츠 수), §18(완성형 Empty State·Placeholder 금지), §19(Do/Do Not)
- `design-reference/UI_CONTRACT.md`의 해당 Screen 절(영역 순서·주요 Component·상태·이동·금지 기능)
- `design-reference/SCREEN_ROUTE_CONTRACT.json`의 `screens[].sections_order`(대상: SCR-004)

## Depends On

- TASK-COMP-GLOBAL-SHELL
- TASK-COMP-GLOBAL-SEO-METADATA
- TASK-COMP-SCR004-INTRO
- TASK-COMP-SCR004-FILTER-BAR
- TASK-COMP-SCR004-POST-LIST
- TASK-COMP-SCR004-DETAIL-PANEL
- TASK-COMP-SCR004-APPLICATION-FORM
- TASK-COMP-SCR004-REPORT-BLOCK-ACTIONS
- TASK-COMP-SCR004-STEP-GUIDE-AND-SAFETY
- TASK-API-MATES-CRUD

## Expected Files

- src/app/mates/page.tsx (신규)
- src/components/mates/MateDetailPanel.tsx (수정 — `children`을 정적 ReactNode에서
  `(ctx: { postId, ownerId }) => ReactNode` 렌더 prop으로 바꾼다. Page Owner가
  `ApplicationForm`/`ReportBlockActions`를 상세 안에 조립하려면 상세가 이미 조회해 둔
  글 작성자 `owner_id`(REPORT-BLOCK-ACTIONS의 `blockedUserId`에 필요)를 다시 조회하지
  않고 그대로 전달받아야 하기 때문이다)
- src/components/mates/MateDetailDrawer.tsx (수정 — 위와 동일한 이유로 `children`을
  같은 렌더 prop 형태로 그대로 전달하도록 바꾼다)
- src/components/mates/MatesPageSections.tsx (신규 — Page Owner는 `generateMetadata`를
  export해야 해서 Server Component여야 하지만, 선택된 동행글(`selectedPostId`) state는
  Client에서만 들고 있을 수 있다. PAGE-SCR003의 `TravelToolsTabsSection`과 동일한 선례
  패턴 — 새 UI를 설계하지 않고 이미 만들어진 POST-LIST/DETAIL-PANEL/DETAIL-DRAWER/
  APPLICATION-FORM/REPORT-BLOCK-ACTIONS만 조립하는 얇은 Client wrapper)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. 목록·필터·상세·참가·신고·차단을 각각 별도 Component로 분리해 조립한다(Component Task 참고).
2. Section 순서: ① Intro+작성 CTA → ② Filter+결과 요약 → ③ 동행글 목록(최대 8, 데이터 출처: API-MATES-CRUD) → ④ 목록+상세 분할/Drawer(참가·신고·차단 포함) → ⑤ 신청 방법 3단계 → ⑥ 안전·신고·차단 CTA Banner.
3. 목록 Empty State는 필터 결과 없음/전체 없음을 구분해 각각 이용 방법+CTA를 포함한 완성형으로 표시한다.
4. Lorem ipsum·'준비 중'·'정보 확인 필요' 문구나 내용 없는 빈 Card를 두지 않는다.
5. 동행글 목록·상세·참가·신고·차단은 모두 API-MATES-CRUD/API-APPLICATIONS/API-REPORTS/API-BLOCKS 조회·제출에 의존하므로 `design-reference/D-001/DESIGN.md` §13 상태 규칙을 따른다: 조회 중 카드 스켈레톤(Loading), 조회·제출 실패 시 실패 사유+재시도 CTA(Error)를 각각 Empty State와 구분해 표시한다.
6. `src/lib/seo.ts`(COMP-GLOBAL-SEO-METADATA)의 유틸을 사용해 SCR-004 고유의 `generateMetadata`를 export한다.

## Visual AC

1. Desktop 목록 40%+상세 60% 좌우분할, Mobile 목록 1열+하단 Drawer, 콘텐츠 최대 폭 1200~1280px.

## Security/Privacy AC

1. 차단 관계·신고 상세는 RLS로 서버에서 강제 격리한다(DB-RLS-BASE 의존).

## Test Cases

- TC-01: 목록·필터·상세·참가·신고·차단을 각각 별도 Component로 분리해 조립한다(Component Task 참고).
- TC-02: Section 순서: ① Intro+작성 CTA → ② Filter+결과 요약 → ③ 동행글 목록(최대 8, 데이터 출처: API-MATES-CRUD) → ④ 목록+상세 분할/Drawer(참가·신고·차단 포함) → ⑤ 신청 방법 3단계 → ⑥ 안전·신고·차단 CTA Banner.
- TC-03: 목록 Empty State는 필터 결과 없음/전체 없음을 구분해 각각 이용 방법+CTA를 포함한 완성형으로 표시한다.
- TC-04: Lorem ipsum·'준비 중'·'정보 확인 필요' 문구나 내용 없는 빈 Card를 두지 않는다.
- TC-05: 목록·상세·참가·신고·차단 각각에서 조회 중 Loading, 실패 시 재시도 CTA가 있는 Error 상태를 확인한다.
- TC-06: 1440px Desktop과 390px Mobile 두 뷰포트에서 모두 위 Functional AC를 재확인한다.
- TC-07: `src/app/mates/page.tsx`가 `generateMetadata`를 export하고, `src/lib/seo.ts` 유틸을 사용해 SCR-004 고유 값을 반환한다.

## Verify

- E2E-MATE-AUTH, MANUAL-RESPONSIVE-CHECK

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
- 사용자 간 별점·평점·리뷰 점수 기능을 추가하지 않는다.

---

*— TASK-PAGE-SCR004 끝 —*
