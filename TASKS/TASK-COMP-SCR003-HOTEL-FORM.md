# TASK-COMP-SCR003-HOTEL-FORM: 숙소 조건 입력·검증·요약·외부 이동

- **Seq:** 20
- **Category:** Component (`COMPONENT`)
- **Implementation Status:** IMPLEMENT
- **Priority:** Must

---

## Context

SCR-003(`/travel-tools`, 통합 여행 준비) 내부에서 재사용되는 UI 조각 '숙소 조건 입력·검증·요약·외부 이동'을 구현하는 Task다. 이 컴포넌트는 해당 Page Owner Task에 의해 조립되며, 페이지 라우팅이나 다른 화면의 책임을 지지 않는다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다.

## Requirement Ref

- REQ-FUNC-019
- REQ-FUNC-020
- REQ-FUNC-021
- REQ-FUNC-022
- REQ-FUNC-023
- REQ-FUNC-024
- REQ-FUNC-025
- REQ-FUNC-026
- REQ-NF-017

## Screen / Route / Page Entry

- Screen: SCR-003
- Route: /travel-tools
- Page Entry: —

## Design Ref

- `design-reference/D-001/DESIGN.md` §6~13(Header·Footer, Search·Filter, Destination Card, Form·Tabs, Mate Post Card, Drawer·Modal, Alert·Toast 중 해당 컴포넌트 절), §1~5(Color/Typography/Spacing/Radius/Shadow 토큰)
- `design-reference/UI_CONTRACT.md`의 해당 Screen 절 '주요 Component' 목록

## Depends On

- TASK-COMP-SCR003-INTRO-TABS
- TASK-API-DATE-VALIDATION-UTIL
- TASK-COMP-SCR003-FLIGHT-FORM

## Expected Files

- src/components/travel-tools/HotelConditionForm.tsx (신규)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. 국가·지역·체크인·체크아웃 4개 필수 필드를 제공하고, 체크인이 과거이거나 체크아웃이 체크인과 같거나 빠르면 제출을 차단한다(UNIT-TRAVEL-DATES).
2. 요약에 비전달 고지를 표시하고 `호텔 보러 가기` 클릭 시 새 탭으로만 이동하며 쿼리·본문·쿠키로 값을 전달하지 않는다.
3. URL 오류 시 이동을 차단·재시도하고 현재 입력을 유지한다.
4. 입력값을 서버 DB·로그·분석 이벤트에 저장하지 않는다.

## Visual AC

1. 비-UI Task로 해당 없음

## Security/Privacy AC

1. 숙소 조건 입력값은 어떤 API 요청에도 포함되지 않는다.

## Test Cases

- TC-01: 국가·지역·체크인·체크아웃 4개 필수 필드를 제공하고, 체크인이 과거이거나 체크아웃이 체크인과 같거나 빠르면 제출을 차단한다(UNIT-TRAVEL-DATES).
- TC-02: 요약에 비전달 고지를 표시하고 `호텔 보러 가기` 클릭 시 새 탭으로만 이동하며 쿼리·본문·쿠키로 값을 전달하지 않는다.
- TC-03: URL 오류 시 이동을 차단·재시도하고 현재 입력을 유지한다.
- TC-04: 입력값을 서버 DB·로그·분석 이벤트에 저장하지 않는다.

## Verify

- E2E-TRAVEL-TOOLS, UNIT-TRAVEL-DATES

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
- 항공·숙소 조건 입력값을 서버 API, DB, 외부 URL의 쿼리·본문·쿠키로 전달하지 않는다.

---

*— TASK-COMP-SCR003-HOTEL-FORM 끝 —*
