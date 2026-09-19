# TASK-COMP-SCR005-MY-ACTIVITY: 내 활동(글/요청/차단/즐겨찾기)

- **Seq:** 35
- **Category:** Component (`COMPONENT`)
- **Implementation Status:** IMPLEMENT
- **Priority:** Must

---

## Context

SCR-005(`/account`, 계정·관리) 내부에서 재사용되는 UI 조각 '내 활동(글/요청/차단/즐겨찾기)'을 구현하는 Task다. 이 컴포넌트는 해당 Page Owner Task에 의해 조립되며, 페이지 라우팅이나 다른 화면의 책임을 지지 않는다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다.

## Requirement Ref

- REQ-FUNC-036
- REQ-FUNC-038
- REQ-FUNC-040
- REQ-FUNC-043
- REQ-FUNC-068

## Screen / Route / Page Entry

- Screen: SCR-005
- Route: /account
- Page Entry: —

## Design Ref

- `design-reference/D-001/DESIGN.md` §6~13(Header·Footer, Search·Filter, Destination Card, Form·Tabs, Mate Post Card, Drawer·Modal, Alert·Toast 중 해당 컴포넌트 절), §1~5(Color/Typography/Spacing/Radius/Shadow 토큰)
- `design-reference/UI_CONTRACT.md`의 해당 Screen 절 '주요 Component' 목록

## Depends On

- TASK-COMP-SCR005-GUEST-AUTH
- TASK-API-MATES-CRUD
- TASK-API-APPLICATIONS
- TASK-API-BLOCKS
- TASK-COMP-GLOBAL-TOAST

## Expected Files

- src/components/account/MyActivityLists.tsx (신규)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. 내가 쓴 동행글(상태 배지+수정/마감/삭제), 내가 보낸/받은 참가 요청(대기/승인/거절, 작성자는 여기서도 승인·거절 가능), 차단 목록(해제 버튼), 즐겨찾기(localStorage 기반)를 각각 목록으로 표시한다.
2. 각 목록이 비어 있으면 설명+CTA를 포함한 완성형 Empty State를 표시한다(예: 즐겨찾기 없음 → '메인 화면에서 저장해보세요' + `여행지 보러 가기`).
3. 새 동행글 작성 CTA(→SCR-003)를 제공한다.

## Visual AC

1. 비-UI Task로 해당 없음

## Security/Privacy AC

1. 본인 데이터만 조회되도록 RLS로 서버에서 강제한다.

## Test Cases

- TC-01: 내가 쓴 동행글(상태 배지+수정/마감/삭제), 내가 보낸/받은 참가 요청(대기/승인/거절, 작성자는 여기서도 승인·거절 가능), 차단 목록(해제 버튼), 즐겨찾기(localStorage 기반)를 각각 목록으로 표시한다.
- TC-02: 각 목록이 비어 있으면 설명+CTA를 포함한 완성형 Empty State를 표시한다(예: 즐겨찾기 없음 → '메인 화면에서 저장해보세요' + `여행지 보러 가기`).
- TC-03: 새 동행글 작성 CTA(→SCR-003)를 제공한다.

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
- 차트·그래프·KPI 대시보드를 추가하지 않는다(간단한 카드·리스트만 사용).

---

*— TASK-COMP-SCR005-MY-ACTIVITY 끝 —*
