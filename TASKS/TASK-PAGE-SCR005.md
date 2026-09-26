# TASK-PAGE-SCR005: SCR-005 계정·관리 페이지 조립(`/account`)

- **Seq:** 38
- **Category:** Page Owner (`PAGE_OWNER`)
- **Implementation Status:** IMPLEMENT(변형)
- **Priority:** Must

---

## Context

SCR-005(`/account`, 계정·관리) 화면을 실제 Next.js Route Page로 조립하는 Task다. 이 Task는 새로운 UI 조각을 설계·구현하지 않고, Depends On에 명시된 Component/Data/API Task가 만든 결과물을 지정된 Section 순서대로 배치하고 라우팅·데이터 연결을 완성하는 데만 집중한다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT(변형)**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다. 단, 원 요구사항을 그대로 만족하지 않고 단순화된 방식(§Design Ref 참고: 정적 데이터/localStorage/Toast/렌더링 시점 계산 등)으로 구현하도록 승인되어 있다 — 이 축소 범위를 임의로 되돌려 원 요구사항 전체를 구현하지 않는다.

## Requirement Ref

- REQ-FUNC-027
- REQ-FUNC-028
- REQ-FUNC-029
- REQ-FUNC-036
- REQ-FUNC-038
- REQ-FUNC-040
- REQ-FUNC-041
- REQ-FUNC-042
- REQ-FUNC-043
- REQ-FUNC-066
- REQ-FUNC-068
- REQ-FUNC-077
- REQ-FUNC-080

## Screen / Route / Page Entry

- Screen: SCR-005
- Route: /account
- Page Entry: src/app/account/page.tsx

## Design Ref

- `design-reference/D-001/DESIGN.md` §6(Header·Footer), §14(Desktop·Mobile 규칙), §15(Hero 높이 규칙), §16(Section 계층과 시각적 리듬), §17(화면별 Section 순서·최소 콘텐츠 수), §18(완성형 Empty State·Placeholder 금지), §19(Do/Do Not)
- `design-reference/UI_CONTRACT.md`의 해당 Screen 절(영역 순서·주요 Component·상태·이동·금지 기능)
- `design-reference/SCREEN_ROUTE_CONTRACT.json`의 `screens[].sections_order`(대상: SCR-005)

## Depends On

- TASK-COMP-GLOBAL-SHELL
- TASK-COMP-GLOBAL-SEO-METADATA
- TASK-COMP-SCR005-GUEST-AUTH
- TASK-COMP-SCR005-PROFILE-AND-CONSENT
- TASK-COMP-SCR005-MY-ACTIVITY
- TASK-COMP-SCR005-ADMIN-REPORT-QUEUE
- TASK-COMP-SCR005-ADMIN-URL-SETTINGS
- TASK-DB-RLS-BASE

## Expected Files

- src/app/account/page.tsx (신규)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. Auth(Guest 로그인)·Profile·My Activity·Admin 4개 영역을 각각 별도 Component로 분리해 조립한다.
2. Guest·Member·Admin 3개 역할 상태를 실제로 조립한다: Guest는 [로그인/가입] 뷰만, Member는 [프로필][내 활동] 탭만, Admin/Moderator는 [프로필][내 활동][관리자] 3탭을 렌더링한다.
3. 역할에 없는 관리 영역(예: 일반 회원의 관리자 탭)은 렌더링하지 않는다(DOM에 존재하지 않아야 하며 CSS로만 숨기지 않는다).
4. Section 순서(역할별): Guest — 계정 기능 Intro→로그인/가입/재설정 Card→기능 Chip 목록→보안 안내. Member — 프로필·성인확인 요약(데이터 출처: USER_PROFILE)→정책 동의 현황→내 활동 목록(데이터 출처: MATE_POST/MATE_APPLICATION/USER_BLOCK)→새 글 작성 CTA. Admin — 관리 Intro→신고 큐(데이터 출처: REPORT)→외부 URL 설정(데이터 출처: OUTBOUND_LINK_SETTING).
5. 차트·그래프·KPI 대시보드를 어디에도 포함하지 않는다(간단한 카드·리스트만 사용).
6. Lorem ipsum·'준비 중'·'정보 확인 필요' 문구나 내용 없는 빈 Card를 두지 않으며, 목록형 데이터가 없으면 완성형 Empty State를 표시한다.
7. 프로필·내 활동·관리자 신고 큐·외부 URL 설정은 모두 Supabase(Auth/DB-ACCESS) 조회에 의존하므로 `design-reference/D-001/DESIGN.md` §13 상태 규칙을 따른다: 조회 중 카드 스켈레톤(Loading), 조회·저장 실패 시 실패 사유+재시도 CTA(Error)를 각각 Empty State와 구분해 표시한다. Guest 뷰의 로그인/가입 폼은 제출 중 버튼 내 스피너(Loading), 실패 시 필드 오류(Error)를 표시한다.
8. `src/lib/seo.ts`(COMP-GLOBAL-SEO-METADATA)의 유틸을 사용해 SCR-005 고유의 `generateMetadata`를 export한다.

## Visual AC

1. Desktop 탭 가로 배치, Mobile 탭 가로 스크롤, 콘텐츠 최대 폭 1200~1280px.

## Security/Privacy AC

1. 역할별 데이터 접근은 DB-RLS-BASE로 서버에서 강제하며 클라이언트 조건부 렌더링만으로 보안을 보장하지 않는다.

## Test Cases

- TC-01: Auth(Guest 로그인)·Profile·My Activity·Admin 4개 영역을 각각 별도 Component로 분리해 조립한다.
- TC-02: Guest·Member·Admin 3개 역할 상태를 실제로 조립한다: Guest는 [로그인/가입] 뷰만, Member는 [프로필][내 활동] 탭만, Admin/Moderator는 [프로필][내 활동][관리자] 3탭을 렌더링한다.
- TC-03: 역할에 없는 관리 영역(예: 일반 회원의 관리자 탭)은 렌더링하지 않는다(DOM에 존재하지 않아야 하며 CSS로만 숨기지 않는다).
- TC-04: Section 순서(역할별): Guest — 계정 기능 Intro→로그인/가입/재설정 Card→기능 Chip 목록→보안 안내. Member — 프로필·성인확인 요약(데이터 출처: USER_PROFILE)→정책 동의 현황→내 활동 목록(데이터 출처: MATE_POST/MATE_APPLICATION/USER_BLOCK)→새 글 작성 CTA. Admin — 관리 Intro→신고 큐(데이터 출처: REPORT)→외부 URL 설정(데이터 출처: OUTBOUND_LINK_SETTING).
- TC-05: 차트·그래프·KPI 대시보드를 어디에도 포함하지 않는다(간단한 카드·리스트만 사용).
- TC-06: Lorem ipsum·'준비 중'·'정보 확인 필요' 문구나 내용 없는 빈 Card를 두지 않으며, 목록형 데이터가 없으면 완성형 Empty State를 표시한다.
- TC-07: 프로필·내 활동·관리자 영역에서 조회 중 Loading, 실패 시 재시도 CTA가 있는 Error 상태를 확인하고, Guest 로그인/가입 제출 중 Loading·실패 시 Error를 확인한다.
- TC-08: 1440px Desktop과 390px Mobile 두 뷰포트에서 모두 위 Functional AC를 재확인한다.
- TC-09: `src/app/account/page.tsx`가 `generateMetadata`를 export하고, `src/lib/seo.ts` 유틸을 사용해 SCR-005 고유 값을 반환한다.

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
- 차트·그래프·KPI 대시보드를 추가하지 않는다(간단한 카드·리스트만 사용).

---

*— TASK-PAGE-SCR005 끝 —*
