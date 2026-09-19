# TASK-COMP-GLOBAL-TOAST: 전역 Toast/화면 상태 알림 컴포넌트

- **Seq:** 3
- **Category:** Component (`COMPONENT`)
- **Implementation Status:** IMPLEMENT(변형)
- **Priority:** Must

---

## Context

공통(5개 Screen 전체) 내부에서 재사용되는 UI 조각 '전역 Toast/화면 상태 알림 컴포넌트'을 구현하는 Task다. 이 컴포넌트는 해당 Page Owner Task에 의해 조립되며, 페이지 라우팅이나 다른 화면의 책임을 지지 않는다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT(변형)**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다. 단, 원 요구사항을 그대로 만족하지 않고 단순화된 방식(§Design Ref 참고: 정적 데이터/localStorage/Toast/렌더링 시점 계산 등)으로 구현하도록 승인되어 있다 — 이 축소 범위를 임의로 되돌려 원 요구사항 전체를 구현하지 않는다.

## Requirement Ref

- REQ-FUNC-043

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

- src/components/ui/Toast.tsx (신규)
- src/lib/toast-context.tsx (신규)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. 실제 이메일 발송 없이 참가 요청 접수/승인/거절/신고 접수 결과를 화면 내 Toast 또는 상태 배지로 표시한다(구현 방식: PROJECT_SCOPE.md §3 Toast/화면 상태).
2. Toast는 success/error/info/warning 4개 semantic color(D-001 §1) 중 하나 + 텍스트 라벨을 함께 표시한다(색상 단독 사용 금지).

## Visual AC

1. Tier-1 그림자(D-001 §5)만 사용, 3~5초 후 자동 소멸 또는 수동 닫기.

## Security/Privacy AC

1. 해당 없음

## Test Cases

- TC-01: 실제 이메일 발송 없이 참가 요청 접수/승인/거절/신고 접수 결과를 화면 내 Toast 또는 상태 배지로 표시한다(구현 방식: PROJECT_SCOPE.md §3 Toast/화면 상태).
- TC-02: Toast는 success/error/info/warning 4개 semantic color(D-001 §1) 중 하나 + 텍스트 라벨을 함께 표시한다(색상 단독 사용 금지).

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

---

*— TASK-COMP-GLOBAL-TOAST 끝 —*
