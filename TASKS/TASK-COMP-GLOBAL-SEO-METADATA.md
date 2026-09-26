# TASK-COMP-GLOBAL-SEO-METADATA: 페이지별 SEO 메타데이터 유틸

- **Seq:** 2
- **Category:** Component (`COMPONENT`)
- **Implementation Status:** IMPLEMENT
- **Priority:** Must

---

## Context

공통(5개 Screen 전체) 내부에서 재사용되는 UI 조각 '페이지별 SEO 메타데이터 유틸'을 구현하는 Task다. 이 컴포넌트는 해당 Page Owner Task에 의해 조립되며, 페이지 라우팅이나 다른 화면의 책임을 지지 않는다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다.

## Requirement Ref

- REQ-FUNC-070
- REQ-NF-030

## Screen / Route / Page Entry

- Screen: COMMON
- Route: 전체 5개 Route
- Page Entry: —

## Design Ref

- `design-reference/D-001/DESIGN.md` §6~13(Header·Footer, Search·Filter, Destination Card, Form·Tabs, Mate Post Card, Drawer·Modal, Alert·Toast 중 해당 컴포넌트 절), §1~5(Color/Typography/Spacing/Radius/Shadow 토큰)
- `design-reference/UI_CONTRACT.md`의 해당 Screen 절 '주요 Component' 목록

## Depends On

- TASK-COMP-GLOBAL-SHELL

## Expected Files

- src/lib/seo.ts (신규)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.** (각 Screen의 `page.tsx`에 실제로 `generateMetadata`를 추가하는 것은 해당 Page Owner Task — `PAGE-SCR001`~`PAGE-SCR005` — 의 책임이다. 이 Task는 그 Page Owner Task들이 import해 쓸 재사용 가능한 유틸만 만든다. `PAGE-SCR001`~`PAGE-SCR005`가 모두 이 Task를 `Depends On`에 명시하고 있으므로, 이 Task는 5개 Page Owner보다 반드시 먼저 완료되어야 한다 — Expected Files를 "각 page.tsx 수정"으로 두면 아직 존재하지 않는 4개 Screen의 Page Entry를 이 Task가 선행해서 고쳐야 하는 모순이 생겨 수정한다.)

## Functional AC

1. Screen ID(또는 route)를 입력받아 title, description, canonical, Open Graph 값을 생성하는 함수(예: `buildScreenMetadata(screenId)`)를 `src/lib/seo.ts`에 export한다. 5개 Screen(SCR-001~005) 각각에 대해 서로 다른 값을 반환하도록 5개 Screen의 설정을 유틸 내부(또는 별도 상수)에 포함한다.
2. 필수 메타 필드(title/description/canonical) 중 하나라도 빈 값이면 개발 환경에서 콘솔 경고를 출력한다.

## Visual AC

1. 비-UI Task로 해당 없음

## Security/Privacy AC

1. 해당 없음

## Test Cases

- TC-01: SCR-001~005 각 Screen ID로 유틸을 호출하면 서로 다른 title/description/canonical/OG 값을 반환한다.
- TC-02: 필수 필드(title/description/canonical) 중 하나가 빈 값인 설정으로 호출하면 콘솔 경고가 출력된다.

## Verify

- CI-PIPELINE

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

*— TASK-COMP-GLOBAL-SEO-METADATA 끝 —*
