# TASK-COMP-SCR001-DESTINATION-DIRECTORY: 국내/해외 여행지 Card Grid + 상세 Drawer

- **Seq:** 5
- **Category:** Component (`COMPONENT`)
- **Implementation Status:** IMPLEMENT(변형)
- **Priority:** Must

---

## Context

SCR-001(`/`, 여행지 탐색) 내부에서 재사용되는 UI 조각 '국내/해외 여행지 Card Grid + 상세 Drawer'을 구현하는 Task다. 이 컴포넌트는 해당 Page Owner Task에 의해 조립되며, 페이지 라우팅이나 다른 화면의 책임을 지지 않는다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT(변형)**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다. 단, 원 요구사항을 그대로 만족하지 않고 단순화된 방식(§Design Ref 참고: 정적 데이터/localStorage/Toast/렌더링 시점 계산 등)으로 구현하도록 승인되어 있다 — 이 축소 범위를 임의로 되돌려 원 요구사항 전체를 구현하지 않는다.

## Requirement Ref

- REQ-FUNC-001
- REQ-FUNC-002
- REQ-FUNC-004
- REQ-FUNC-005
- REQ-FUNC-006
- REQ-FUNC-007
- REQ-FUNC-009
- REQ-FUNC-068

## Screen / Route / Page Entry

- Screen: SCR-001
- Route: /
- Page Entry: —

## Design Ref

- `design-reference/D-001/DESIGN.md` §6~13(Header·Footer, Search·Filter, Destination Card, Form·Tabs, Mate Post Card, Drawer·Modal, Alert·Toast 중 해당 컴포넌트 절), §1~5(Color/Typography/Spacing/Radius/Shadow 토큰)
- `design-reference/UI_CONTRACT.md`의 해당 Screen 절 '주요 Component' 목록

## Depends On

- TASK-COMP-GLOBAL-SHELL
- TASK-DATA-DESTINATIONS
- TASK-DATA-SAFETY

## Expected Files

- src/components/home/DestinationCardGrid.tsx (신규)
- src/components/home/DestinationDrawer.tsx (신규)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. 국내 6개, 해외 6개를 각각 별도 Card Grid로 표시하고(D-001 §17), 국가·도시·계절·테마·기간 필터를 AND 조건으로 적용한다.
2. 필터 결과가 없으면 300ms 이내 안내 문구+전체 초기화 버튼을 표시한다(빈 화면 금지).
3. 카드 클릭 시 같은 화면 안에서 상세 Drawer를 열고, 소개 300자 이상·명소 5개 이상·1일/3일 일정·예산·교통·음식 3개 이상·에티켓·출처·수정일을 표시한다.
4. 해외 여행지 상세에서 안전정보 Drawer로 전환할 수 있다(REQ-FUNC-006).
5. 즐겨찾기 토글은 `localStorage`에 저장하고 새로고침 후에도 유지된다(구현 방식: PROJECT_SCOPE.md §3 localStorage, 중복 즐겨찾기 방지).
6. 이미지에는 실제 장소를 설명하는 alt 텍스트와 출처 URL을 기록한다(라이선스·작가 메타데이터는 관리하지 않음, REQ-FUNC-007 변형).

## Visual AC

1. Card radius 16px, Desktop 3열/Mobile 1열, Card 간격 Desktop 24px/Mobile 16px.

## Security/Privacy AC

1. 해당 없음

## Test Cases

- TC-01: 국내 6개, 해외 6개를 각각 별도 Card Grid로 표시하고(D-001 §17), 국가·도시·계절·테마·기간 필터를 AND 조건으로 적용한다.
- TC-02: 필터 결과가 없으면 300ms 이내 안내 문구+전체 초기화 버튼을 표시한다(빈 화면 금지).
- TC-03: 카드 클릭 시 같은 화면 안에서 상세 Drawer를 열고, 소개 300자 이상·명소 5개 이상·1일/3일 일정·예산·교통·음식 3개 이상·에티켓·출처·수정일을 표시한다.
- TC-04: 해외 여행지 상세에서 안전정보 Drawer로 전환할 수 있다(REQ-FUNC-006).
- TC-05: 즐겨찾기 토글은 `localStorage`에 저장하고 새로고침 후에도 유지된다(구현 방식: PROJECT_SCOPE.md §3 localStorage, 중복 즐겨찾기 방지).
- TC-06: 이미지에는 실제 장소를 설명하는 alt 텍스트와 출처 URL을 기록한다(라이선스·작가 메타데이터는 관리하지 않음, REQ-FUNC-007 변형).

## Verify

- E2E-PUBLIC-SMOKE, UNIT-CONTACT-DETECTION(해당없음)

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

*— TASK-COMP-SCR001-DESTINATION-DIRECTORY 끝 —*
