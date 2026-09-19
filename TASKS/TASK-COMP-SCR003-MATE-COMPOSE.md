# TASK-COMP-SCR003-MATE-COMPOSE: 동행 모집글 작성 Form(연락처 탐지·안전수칙 동의)

- **Seq:** 22
- **Category:** Component (`COMPONENT`)
- **Implementation Status:** IMPLEMENT(변형)
- **Priority:** Must

---

## Context

SCR-003(`/travel-tools`, 통합 여행 준비) 내부에서 재사용되는 UI 조각 '동행 모집글 작성 Form(연락처 탐지·안전수칙 동의)'을 구현하는 Task다. 이 컴포넌트는 해당 Page Owner Task에 의해 조립되며, 페이지 라우팅이나 다른 화면의 책임을 지지 않는다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT(변형)**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다. 단, 원 요구사항을 그대로 만족하지 않고 단순화된 방식(§Design Ref 참고: 정적 데이터/localStorage/Toast/렌더링 시점 계산 등)으로 구현하도록 승인되어 있다 — 이 축소 범위를 임의로 되돌려 원 요구사항 전체를 구현하지 않는다.

## Requirement Ref

- REQ-FUNC-031
- REQ-FUNC-032
- REQ-FUNC-080

## Screen / Route / Page Entry

- Screen: SCR-003
- Route: /travel-tools
- Page Entry: —

## Design Ref

- `design-reference/D-001/DESIGN.md` §6~13(Header·Footer, Search·Filter, Destination Card, Form·Tabs, Mate Post Card, Drawer·Modal, Alert·Toast 중 해당 컴포넌트 절), §1~5(Color/Typography/Spacing/Radius/Shadow 토큰)
- `design-reference/UI_CONTRACT.md`의 해당 Screen 절 '주요 Component' 목록

## Depends On

- TASK-COMP-SCR003-INTRO-TABS
- TASK-API-CONTACT-DETECTION-UTIL
- TASK-API-MATES-CRUD
- TASK-COMP-GLOBAL-TOAST
- TASK-DATA-POLICY-CONTENT

## Expected Files

- src/components/travel-tools/MateComposeForm.tsx (신규)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. 제목·국가·지역·시작일·종료일·모집 인원·선호 조건·여행 스타일·상세 설명·안전수칙 동의 체크박스를 입력받는다.
2. 필수값 누락·날짜 역전·과거 종료일은 제출을 차단한다.
3. 본문에서 전화번호·이메일·메신저 ID 패턴을 탐지하면 제출을 차단하고 수정 안내를 표시한다(UNIT-CONTACT-DETECTION로 로직 검증).
4. 안전수칙 동의 체크 없이는 게시할 수 없고, 정책 버전과 동의 시각을 저장한다(DB: MATE_POST 및 USER_PROFILE 동의 필드).
5. 게시 성공 시 Toast로 알리고 SCR-004로 이동 링크를 제공한다.

## Visual AC

1. 비-UI Task로 해당 없음

## Security/Privacy AC

1. 본문에 공개 연락처가 포함된 게시물은 저장되지 않는다.

## Test Cases

- TC-01: 제목·국가·지역·시작일·종료일·모집 인원·선호 조건·여행 스타일·상세 설명·안전수칙 동의 체크박스를 입력받는다.
- TC-02: 필수값 누락·날짜 역전·과거 종료일은 제출을 차단한다.
- TC-03: 본문에서 전화번호·이메일·메신저 ID 패턴을 탐지하면 제출을 차단하고 수정 안내를 표시한다(UNIT-CONTACT-DETECTION로 로직 검증).
- TC-04: 안전수칙 동의 체크 없이는 게시할 수 없고, 정책 버전과 동의 시각을 저장한다(DB: MATE_POST 및 USER_PROFILE 동의 필드).
- TC-05: 게시 성공 시 Toast로 알리고 SCR-004로 이동 링크를 제공한다.

## Verify

- E2E-MATE-AUTH, UNIT-CONTACT-DETECTION

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

*— TASK-COMP-SCR003-MATE-COMPOSE 끝 —*
