# TASK-COMP-GLOBAL-SHELL: 전역 Header/Footer/RootLayout 조립

- **Seq:** 1
- **Category:** Component (`COMPONENT`)
- **Implementation Status:** IMPLEMENT
- **Priority:** Must

---

## Context

공통(5개 Screen 전체) 내부에서 재사용되는 UI 조각 '전역 Header/Footer/RootLayout 조립'을 구현하는 Task다. 이 컴포넌트는 해당 Page Owner Task에 의해 조립되며, 페이지 라우팅이나 다른 화면의 책임을 지지 않는다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다.

## Requirement Ref

- REQ-FUNC-064
- REQ-FUNC-065
- REQ-FUNC-071(GA4 페이지뷰 추적 — 사용자 요청으로 EXCLUDED→IMPLEMENT(변형) 갱신,
  `docs/PROJECT_SCOPE.md` 참고. RootLayout에 `next/script`로 추가했다)
- REQ-FUNC-079
- REQ-NF-023

## Screen / Route / Page Entry

- Screen: COMMON
- Route: 전체 5개 Route
- Page Entry: —

## Design Ref

- `design-reference/D-001/DESIGN.md` §6~13(Header·Footer, Search·Filter, Destination Card, Form·Tabs, Mate Post Card, Drawer·Modal, Alert·Toast 중 해당 컴포넌트 절), §1~5(Color/Typography/Spacing/Radius/Shadow 토큰)
- `design-reference/UI_CONTRACT.md`의 해당 Screen 절 '주요 Component' 목록

## Depends On

- 없음(선행 Task 없이 시작 가능)

## Expected Files

- src/app/layout.tsx (수정)
- src/components/layout/GlobalHeader.tsx (신규)
- src/components/layout/GlobalFooter.tsx (신규)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. 5개 Screen 모두에서 동일한 Header(로고, 4개 내비 링크, 계정 버튼)와 Footer(서비스/정책/안전·출처 고지/Legal Band)를 렌더링한다.
2. 320px~1440px 전 구간에서 가로 스크롤·겹침 없이 표시된다(Mobile 390px 기준 햄버거 메뉴로 전환).
3. 모든 폼·모달·탭·알림에 올바른 HTML 시맨틱과 ARIA 상태(role, aria-expanded, aria-selected 등)를 부여한다.

## Visual AC

1. 코랄(#FF6A4D) 포인트, 흰 배경, 짙은 회색 텍스트(D-001 §1)를 그대로 따른다.
2. 포커스 링(2px 코랄/잉크, outline-offset 2px)이 모든 인터랙션 요소에 보인다.
3. 터치 영역 최소 44×44px.

## Security/Privacy AC

1. 해당 없음

## Test Cases

- TC-01: 5개 Screen 모두에서 동일한 Header(로고, 4개 내비 링크, 계정 버튼)와 Footer(서비스/정책/안전·출처 고지/Legal Band)를 렌더링한다.
- TC-02: 320px~1440px 전 구간에서 가로 스크롤·겹침 없이 표시된다(Mobile 390px 기준 햄버거 메뉴로 전환).
- TC-03: 모든 폼·모달·탭·알림에 올바른 HTML 시맨틱과 ARIA 상태(role, aria-expanded, aria-selected 등)를 부여한다.

## Verify

- E2E-PUBLIC-SMOKE, MANUAL-A11Y-CHECK

## Definition of Done

- [ ] 위 Expected Files가 모두 생성/수정되어 있고 그 밖의 파일 변경이 없다.
- [ ] Functional AC, Visual AC, Security/Privacy AC를 모두 충족한다.
- [ ] Test Cases가 Verify에 명시된 방법으로 확인 가능하다.
- [ ] Depends On에 나열된 모든 Task가 먼저 완료되어 있다.

## Forbidden

- **Expected Files 목록 밖의 어떤 파일도 생성·수정하지 않는다.**
- 이 Task 수행 중 실제 구현 코드 실행 결과 커밋, Git Branch 생성, Pull Request 생성을 하지 않는다(이 문서는 계획/명세 파일이다).
- Airbnb 등 타 브랜드의 로고·워드마크·고유 색상 값·아이콘을 재현하지 않는다.
- 예약(Reserve)·결제(Checkout)·장바구니·가격 확정 UI를 추가하지 않는다.
- Lorem ipsum, '준비 중', '정보 확인 필요' 문구나 내용 없는 빈 Card를 추가하지 않는다.
- `design-reference/D-001/DESIGN.md` §1 Color Token 표에 없는 임의 색상을 추가하지 않는다.

---

*— TASK-COMP-GLOBAL-SHELL 끝 —*
