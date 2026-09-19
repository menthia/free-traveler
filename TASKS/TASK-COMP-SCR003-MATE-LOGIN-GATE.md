# TASK-COMP-SCR003-MATE-LOGIN-GATE: 동행 탭 로그인·성인확인 게이트

- **Seq:** 23
- **Category:** Component (`COMPONENT`)
- **Implementation Status:** IMPLEMENT
- **Priority:** Must

---

## Context

SCR-003(`/travel-tools`, 통합 여행 준비) 내부에서 재사용되는 UI 조각 '동행 탭 로그인·성인확인 게이트'을 구현하는 Task다. 이 컴포넌트는 해당 Page Owner Task에 의해 조립되며, 페이지 라우팅이나 다른 화면의 책임을 지지 않는다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다.

## Requirement Ref

- REQ-FUNC-027
- REQ-FUNC-028

## Screen / Route / Page Entry

- Screen: SCR-003
- Route: /travel-tools
- Page Entry: —

## Design Ref

- `design-reference/D-001/DESIGN.md` §6~13(Header·Footer, Search·Filter, Destination Card, Form·Tabs, Mate Post Card, Drawer·Modal, Alert·Toast 중 해당 컴포넌트 절), §1~5(Color/Typography/Spacing/Radius/Shadow 토큰)
- `design-reference/UI_CONTRACT.md`의 해당 Screen 절 '주요 Component' 목록

## Depends On

- TASK-COMP-SCR003-INTRO-TABS

## Expected Files

- src/components/travel-tools/MateLoginGateCard.tsx (신규)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. 비로그인 또는 성인 확인 미완료 상태에서는 작성 Form 대신 안내 Card와 `로그인/가입하기`(→SCR-005) 버튼을 표시한다.
2. 정확한 생년월일은 저장하지 않고 성인 확인 여부·확인 시각만 사용한다.

## Visual AC

1. 비-UI Task로 해당 없음

## Security/Privacy AC

1. 성인 확인 없이 동행 작성 API를 호출할 수 없다(서버 측 재검증).

## Test Cases

- TC-01: 비로그인 또는 성인 확인 미완료 상태에서는 작성 Form 대신 안내 Card와 `로그인/가입하기`(→SCR-005) 버튼을 표시한다.
- TC-02: 정확한 생년월일은 저장하지 않고 성인 확인 여부·확인 시각만 사용한다.

## Verify

- E2E-MATE-AUTH

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
- 사용자 간 별점·평점·리뷰 점수 기능을 추가하지 않는다.

---

*— TASK-COMP-SCR003-MATE-LOGIN-GATE 끝 —*
