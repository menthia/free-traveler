# TASK-COMP-SCR003-FLIGHT-FORM: 항공 조건 입력·검증·요약·외부 이동

- **Seq:** 19
- **Category:** Component (`COMPONENT`)
- **Implementation Status:** IMPLEMENT
- **Priority:** Must

---

## Context

SCR-003(`/travel-tools`, 통합 여행 준비) 내부에서 재사용되는 UI 조각 '항공 조건 입력·검증·요약·외부 이동'을 구현하는 Task다. 이 컴포넌트는 해당 Page Owner Task에 의해 조립되며, 페이지 라우팅이나 다른 화면의 책임을 지지 않는다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다.

## Requirement Ref

- REQ-FUNC-011
- REQ-FUNC-012
- REQ-FUNC-013
- REQ-FUNC-014
- REQ-FUNC-015
- REQ-FUNC-016
- REQ-FUNC-017
- REQ-FUNC-018
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

## Expected Files

- src/components/travel-tools/FlightConditionForm.tsx (신규)
- src/components/travel-tools/SummaryActionCard.tsx (신규, 숙소와 공용)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. 국가·지역·출발일·귀국일 4개 필수 필드를 제공하고, 국가 변경 시 지역 옵션을 초기화한다.
2. 출발일이 과거이거나 귀국일이 출발일보다 빠르면 제출을 차단하고 필드별 오류를 표시한다(UNIT-TRAVEL-DATES로 로직 검증).
3. 유효 입력 후 요약 단계를 표시하고 '입력값은 외부 사이트로 전달되지 않습니다' 고지를 폼과 요약에 표시한다.
4. `항공편 보러 가기` 클릭 시 설정된 외부 URL을 `noopener,noreferrer`로 새 탭에 열며 쿼리·본문·쿠키로 값을 전달하지 않는다.
5. 외부 URL 미설정/허용목록 밖이면 이동을 차단하고 재시도 UI를 제공한다.
6. 입력값은 컴포넌트 로컬 상태로만 유지하며 서버 API·DB·로그로 전송하지 않는다(REQ-FUNC-017, REQ-NF-017).

## Visual AC

1. 비-UI Task로 해당 없음

## Security/Privacy AC

1. 항공 조건 입력값은 어떤 API 요청에도 포함되지 않는다(네트워크 탭 확인 대상).

## Test Cases

- TC-01: 국가·지역·출발일·귀국일 4개 필수 필드를 제공하고, 국가 변경 시 지역 옵션을 초기화한다.
- TC-02: 출발일이 과거이거나 귀국일이 출발일보다 빠르면 제출을 차단하고 필드별 오류를 표시한다(UNIT-TRAVEL-DATES로 로직 검증).
- TC-03: 유효 입력 후 요약 단계를 표시하고 '입력값은 외부 사이트로 전달되지 않습니다' 고지를 폼과 요약에 표시한다.
- TC-04: `항공편 보러 가기` 클릭 시 설정된 외부 URL을 `noopener,noreferrer`로 새 탭에 열며 쿼리·본문·쿠키로 값을 전달하지 않는다.
- TC-05: 외부 URL 미설정/허용목록 밖이면 이동을 차단하고 재시도 UI를 제공한다.
- TC-06: 입력값은 컴포넌트 로컬 상태로만 유지하며 서버 API·DB·로그로 전송하지 않는다(REQ-FUNC-017, REQ-NF-017).

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

*— TASK-COMP-SCR003-FLIGHT-FORM 끝 —*
