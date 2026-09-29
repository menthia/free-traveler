# TASK-COMP-SCR002-COUNTRY-CHIPS: 방문 국가 권역별 Chip

- **Seq:** 14
- **Category:** Component (`COMPONENT`)
- **Implementation Status:** IMPLEMENT
- **Priority:** Must

---

## Context

SCR-002(`/about`, 대표 소개) 내부에서 재사용되는 UI 조각 '방문 국가 권역별 Chip'을 구현하는 Task다. 이 컴포넌트는 해당 Page Owner Task에 의해 조립되며, 페이지 라우팅이나 다른 화면의 책임을 지지 않는다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다.

## Requirement Ref

- REQ-FUNC-059

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

- src/components/about/RegionChipGroup.tsx (신규)
- src/components/home/DestinationCardGrid.tsx (수정 — `?country=` 쿼리 파라미터로 전달된 국가의 첫 여행지 Drawer를 마운트 시 자동으로 연다)
- src/app/page.tsx (수정 — `useSearchParams`를 사용하게 된 `DestinationExplorerSection`을 `<Suspense>`로 감싼다. Next.js가 이 경계 없이는 빌드에서 `missing-suspense-with-csr-bailout` 오류를 낸다)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.** ("Chip 클릭 시 SCR-001로 이동해 해당 국가 Drawer가 열린다"는 요건은 SCR-001의 `DestinationCardGrid`가 URL 쿼리 파라미터를 읽어야만 만족되는데, 그 Component를 처음 만든 `COMP-SCR001-DESTINATION-DIRECTORY`에는 이 요건이 없었다 — 실제로 그 기능이 필요해지는 첫 지점인 여기서 추가한다.)

## Functional AC

1. 아시아/유럽/북미/오세아니아 4개 권역으로 묶어 방문 국가 30개 이상(또는 대표 샘플+‘30개국’ 총계 표기)을 Chip으로 표시한다.
2. 여행지 콘텐츠가 있는 국가 Chip 클릭 시 SCR-001로 이동해 해당 국가 Drawer가 열린다.

## Visual AC

1. 비-UI Task로 해당 없음

## Security/Privacy AC

1. 해당 없음

## Test Cases

- TC-01: 아시아/유럽/북미/오세아니아 4개 권역으로 묶어 방문 국가 30개 이상(또는 대표 샘플+‘30개국’ 총계 표기)을 Chip으로 표시한다.
- TC-02: 여행지 콘텐츠가 있는 국가 Chip 클릭 시 SCR-001로 이동해 해당 국가 Drawer가 열린다.

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

*— TASK-COMP-SCR002-COUNTRY-CHIPS 끝 —*
