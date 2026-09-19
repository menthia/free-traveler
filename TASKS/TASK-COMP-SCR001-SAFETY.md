# TASK-COMP-SCR001-SAFETY: 국가별 주의사항 Card Grid + 안전정보 Drawer

- **Seq:** 7
- **Category:** Component (`COMPONENT`)
- **Implementation Status:** IMPLEMENT(변형)
- **Priority:** Must

---

## Context

SCR-001(`/`, 여행지 탐색) 내부에서 재사용되는 UI 조각 '국가별 주의사항 Card Grid + 안전정보 Drawer'을 구현하는 Task다. 이 컴포넌트는 해당 Page Owner Task에 의해 조립되며, 페이지 라우팅이나 다른 화면의 책임을 지지 않는다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT(변형)**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다. 단, 원 요구사항을 그대로 만족하지 않고 단순화된 방식(§Design Ref 참고: 정적 데이터/localStorage/Toast/렌더링 시점 계산 등)으로 구현하도록 승인되어 있다 — 이 축소 범위를 임의로 되돌려 원 요구사항 전체를 구현하지 않는다.

## Requirement Ref

- REQ-FUNC-047
- REQ-FUNC-048
- REQ-FUNC-049
- REQ-FUNC-050
- REQ-FUNC-051
- REQ-FUNC-052
- REQ-FUNC-053
- REQ-FUNC-054

## Screen / Route / Page Entry

- Screen: SCR-001
- Route: /
- Page Entry: —

## Design Ref

- `design-reference/D-001/DESIGN.md` §6~13(Header·Footer, Search·Filter, Destination Card, Form·Tabs, Mate Post Card, Drawer·Modal, Alert·Toast 중 해당 컴포넌트 절), §1~5(Color/Typography/Spacing/Radius/Shadow 토큰)
- `design-reference/UI_CONTRACT.md`의 해당 Screen 절 '주요 Component' 목록

## Depends On

- TASK-COMP-GLOBAL-SHELL
- TASK-DATA-SAFETY

## Expected Files

- src/components/home/CountrySafetyCardGrid.tsx (신규)
- src/components/home/SafetyDrawer.tsx (신규)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. 국가별 주의사항 Card 6개를 표시하고, 최종 확인일 기준 7일 초과 시 렌더링 시점에 계산해 Stale 경고 배지(경고색+텍스트)를 표시한다(구현 방식: PROJECT_SCOPE.md §3 stale 렌더링 계산).
2. Drawer에는 치안·사기·법규·교통·재난·보건·문화·긴급연락처 8개 카테고리, 출처명·URL·확인일·편집자, 외교부 새 탭 링크(noopener,noreferrer)를 표시한다.
3. 중대 경보(여행금지·특별여행주의보 등)는 색상만이 아닌 텍스트 라벨로 상단에 표시한다.
4. 국가 전체 경보와 지역 경보의 범위를 텍스트로 구분 표시한다.
5. 공식 판단을 대체하지 않는다는 고지 문구를 표시한다.

## Visual AC

1. 경고 배지는 D-001 §1 warning 토큰(#9A5B12/#FFF3E1)만 사용, 코랄과 혼용하지 않는다.

## Security/Privacy AC

1. 해당 없음

## Test Cases

- TC-01: 국가별 주의사항 Card 6개를 표시하고, 최종 확인일 기준 7일 초과 시 렌더링 시점에 계산해 Stale 경고 배지(경고색+텍스트)를 표시한다(구현 방식: PROJECT_SCOPE.md §3 stale 렌더링 계산).
- TC-02: Drawer에는 치안·사기·법규·교통·재난·보건·문화·긴급연락처 8개 카테고리, 출처명·URL·확인일·편집자, 외교부 새 탭 링크(noopener,noreferrer)를 표시한다.
- TC-03: 중대 경보(여행금지·특별여행주의보 등)는 색상만이 아닌 텍스트 라벨로 상단에 표시한다.
- TC-04: 국가 전체 경보와 지역 경보의 범위를 텍스트로 구분 표시한다.
- TC-05: 공식 판단을 대체하지 않는다는 고지 문구를 표시한다.

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

*— TASK-COMP-SCR001-SAFETY 끝 —*
