# TASK-MANUAL-A11Y-CHECK: 핵심 흐름 키보드·스크린리더 수동 확인

- **Seq:** 71
- **Category:** Manual / Release Check (`MANUAL_CHECK`)
- **Implementation Status:** IMPLEMENT(변형)
- **Priority:** Should

---

## Context

자동화하지 않고 사람이 브라우저에서 직접 확인해야 하는 '핵심 흐름 키보드·스크린리더 수동 확인' Task다. 코드 산출물은 없다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT(변형)**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다. 단, 원 요구사항을 그대로 만족하지 않고 단순화된 방식(§Design Ref 참고: 정적 데이터/localStorage/Toast/렌더링 시점 계산 등)으로 구현하도록 승인되어 있다 — 이 축소 범위를 임의로 되돌려 원 요구사항 전체를 구현하지 않는다.

## Requirement Ref

- REQ-NF-023

## Screen / Route / Page Entry

- Screen: COMMON
- Route: 전체 5개 Route
- Page Entry: —

## Design Ref

- `design-reference/D-001/DESIGN.md` §14(Desktop·Mobile 규칙), §19(Do/Do Not)
- `docs/06_SRS_UIUX_REVISED.md` §3(Release Acceptance Criteria)

## Depends On

- TASK-E2E-PUBLIC-SMOKE
- TASK-E2E-TRAVEL-TOOLS
- TASK-E2E-MATE-AUTH

## Expected Files

- —(체크리스트: TASKS/checklists/a11y.md 신규)
- src/components/home/DestinationDrawer.tsx, src/components/home/SafetyDrawer.tsx,
  src/components/mates/MateDetailDrawer.tsx (수정 — 키보드 확인 중 발견:
  `design-reference/D-001/DESIGN.md` §11이 요구하는 "Esc로 닫기"가 세 Drawer 모두
  구현되어 있지 않았다. Esc 키 입력 시 `onClose`를 호출하는 최소한의 keydown 핸들러만
  추가한다(포커스 트랩·포커스 복귀까지의 전체 구현은 이 Task의 IMPLEMENT(변형) 승인
  범위를 넘으므로 하지 않는다 — 닫기 버튼을 Tab으로 찾아 닫는 것은 이미 가능하다).
- src/components/home/DestinationCardGrid.tsx (수정 — 사용자가 직접 확인하다 발견: 여행지
  Card를 Tab으로 포커스해도 포커스 링이 전혀 보이지 않았다. Card 바깥 wrapper에
  `overflow-hidden`이 있어 안쪽 버튼의 `outline-offset-2`(바깥으로 튀어나오는 링)가 잘려
  보이지 않던 것이 원인이다. `outline-offset-2`를 `-outline-offset-2`(안쪽 인셋 링)로
  바꿔 잘리지 않게 고친다.

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. 핵심 흐름(검색, 폼 입력, 모달/Drawer 닫기, 참가 요청 제출)을 키보드만으로 완료할 수 있는지 확인한다.
2. 전체 Use Case에 대한 정식 스크린리더 QA는 범위 밖이며(REQ-NF-025 EXCLUDED), 핵심 흐름만 확인한다.

## Visual AC

1. 비-UI Task로 해당 없음

## Security/Privacy AC

1. 해당 없음

## Test Cases

- TC-01: 핵심 흐름(검색, 폼 입력, 모달/Drawer 닫기, 참가 요청 제출)을 키보드만으로 완료할 수 있는지 확인한다.
- TC-02: 전체 Use Case에 대한 정식 스크린리더 QA는 범위 밖이며(REQ-NF-025 EXCLUDED), 핵심 흐름만 확인한다.

## Verify

- 사람이 직접 실행

## Definition of Done

- [ ] 위 Expected Files가 모두 생성/수정되어 있고 그 밖의 파일 변경이 없다.
- [ ] Functional AC, Visual AC, Security/Privacy AC를 모두 충족한다.
- [ ] Test Cases가 Verify에 명시된 방법으로 확인 가능하다.
- [ ] Depends On에 나열된 모든 Task가 먼저 완료되어 있다.

## Forbidden

- **Expected Files 목록 밖의 어떤 파일도 생성·수정하지 않는다.**
- 이 Task 수행 중 실제 구현 코드 실행 결과 커밋, Git Branch 생성, Pull Request 생성을 하지 않는다(이 문서는 계획/명세 파일이다).

---

*— TASK-MANUAL-A11Y-CHECK 끝 —*
