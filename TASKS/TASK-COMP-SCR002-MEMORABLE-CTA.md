# TASK-COMP-SCR002-MEMORABLE-CTA: 기억에 남는 여행지 4개 + CTA Banner

- **Seq:** 16
- **Category:** Component (`COMPONENT`)
- **Implementation Status:** IMPLEMENT
- **Priority:** Should

---

## Context

SCR-002(`/about`, 대표 소개) 내부에서 재사용되는 UI 조각 '기억에 남는 여행지 4개 + CTA Banner'을 구현하는 Task다. 이 컴포넌트는 해당 Page Owner Task에 의해 조립되며, 페이지 라우팅이나 다른 화면의 책임을 지지 않는다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다.

## Requirement Ref

- REQ-FUNC-063

## Screen / Route / Page Entry

- Screen: SCR-002
- Route: /about
- Page Entry: —

## Design Ref

- `design-reference/D-001/DESIGN.md` §6~13(Header·Footer, Search·Filter, Destination Card, Form·Tabs, Mate Post Card, Drawer·Modal, Alert·Toast 중 해당 컴포넌트 절), §1~5(Color/Typography/Spacing/Radius/Shadow 토큰)
- `design-reference/UI_CONTRACT.md`의 해당 Screen 절 '주요 Component' 목록

## Depends On

- TASK-COMP-GLOBAL-SHELL
- TASK-DATA-REPRESENTATIVE

## Expected Files

- src/components/about/MemorableDestinationCta.tsx (신규)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. 여행지 4개 Card(선정 이유 한 줄 포함)와 `여행 준비하기`(→SCR-003)/`동행 찾기`(→SCR-004) CTA Banner를 표시한다.
2. 카드 클릭 시 SCR-001로 이동해 해당 여행지 Drawer가 열린다. 비공개 여행지는 자동 제외한다.

## Visual AC

1. 비-UI Task로 해당 없음

## Security/Privacy AC

1. 해당 없음

## Test Cases

- TC-01: 여행지 4개 Card(선정 이유 한 줄 포함)와 `여행 준비하기`(→SCR-003)/`동행 찾기`(→SCR-004) CTA Banner를 표시한다.
- TC-02: 카드 클릭 시 SCR-001로 이동해 해당 여행지 Drawer가 열린다. 비공개 여행지는 자동 제외한다.

## Verify

- E2E-PUBLIC-SMOKE

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

*— TASK-COMP-SCR002-MEMORABLE-CTA 끝 —*
