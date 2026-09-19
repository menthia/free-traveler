# TASK-COMP-SCR004-APPLICATION-FORM: 참가 요청 제출 Form

- **Seq:** 29
- **Category:** Component (`COMPONENT`)
- **Implementation Status:** IMPLEMENT
- **Priority:** Must

---

## Context

SCR-004(`/mates`, 동행 조회) 내부에서 재사용되는 UI 조각 '참가 요청 제출 Form'을 구현하는 Task다. 이 컴포넌트는 해당 Page Owner Task에 의해 조립되며, 페이지 라우팅이나 다른 화면의 책임을 지지 않는다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다.

## Requirement Ref

- REQ-FUNC-034
- REQ-FUNC-035
- REQ-FUNC-043

## Screen / Route / Page Entry

- Screen: SCR-004
- Route: /mates
- Page Entry: —

## Design Ref

- `design-reference/D-001/DESIGN.md` §6~13(Header·Footer, Search·Filter, Destination Card, Form·Tabs, Mate Post Card, Drawer·Modal, Alert·Toast 중 해당 컴포넌트 절), §1~5(Color/Typography/Spacing/Radius/Shadow 토큰)
- `design-reference/UI_CONTRACT.md`의 해당 Screen 절 '주요 Component' 목록

## Depends On

- TASK-COMP-SCR004-DETAIL-PANEL
- TASK-API-APPLICATIONS
- TASK-COMP-GLOBAL-TOAST

## Expected Files

- src/components/mates/ApplicationForm.tsx (신규)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. 최대 500자 비공개 참가 메시지를 제출하면 PENDING 상태로 저장되고 Toast로 접수를 안내한다.
2. 동일 사용자가 동일 글에 중복 PENDING/ACCEPTED 요청을 보내면 오류를 표시하고 차단한다(UNIT-MATE-STATE로 상태 전이 검증).
3. 비로그인 상태에서 제출을 시도하면 로그인 안내(→SCR-005)로 전환한다.

## Visual AC

1. 비-UI Task로 해당 없음

## Security/Privacy AC

1. 참가 메시지는 작성자와 요청자만 열람 가능(RLS로 서버 강제).

## Test Cases

- TC-01: 최대 500자 비공개 참가 메시지를 제출하면 PENDING 상태로 저장되고 Toast로 접수를 안내한다.
- TC-02: 동일 사용자가 동일 글에 중복 PENDING/ACCEPTED 요청을 보내면 오류를 표시하고 차단한다(UNIT-MATE-STATE로 상태 전이 검증).
- TC-03: 비로그인 상태에서 제출을 시도하면 로그인 안내(→SCR-005)로 전환한다.

## Verify

- E2E-MATE-AUTH, UNIT-MATE-STATE

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

*— TASK-COMP-SCR004-APPLICATION-FORM 끝 —*
