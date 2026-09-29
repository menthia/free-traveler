# TASK-MANUAL-RESPONSIVE-CHECK: 반응형 수동 확인(320px~1440px)

- **Seq:** 70
- **Category:** Manual / Release Check (`MANUAL_CHECK`)
- **Implementation Status:** IMPLEMENT
- **Priority:** Must

---

## Context

자동화하지 않고 사람이 브라우저에서 직접 확인해야 하는 '반응형 수동 확인(320px~1440px)' Task다. 코드 산출물은 없다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다.

## Requirement Ref

- REQ-FUNC-065

## Screen / Route / Page Entry

- Screen: COMMON
- Route: 전체 5개 Route
- Page Entry: —

## Design Ref

- `design-reference/D-001/DESIGN.md` §14(Desktop·Mobile 규칙), §19(Do/Do Not)
- `docs/06_SRS_UIUX_REVISED.md` §3(Release Acceptance Criteria)

## Depends On

- TASK-PAGE-SCR001
- TASK-PAGE-SCR002
- TASK-PAGE-SCR003
- TASK-PAGE-SCR004
- TASK-PAGE-SCR005

## Expected Files

- —(코드 산출물 없음, 체크리스트: TASKS/checklists/responsive.md 신규)
- src/components/mates/MatesPageSections.tsx (수정 — 자동 사전 스캔 중 발견: `/mates`
  1128px 폭에서 목록(40%)+상세(60%) 2열 grid가 `gap-8`만큼 컨테이너 폭을 초과해 약 12px
  가로 스크롤이 발생했다(`grid-template-columns: 40% 60%`는 퍼센트 트랙이 gap을 반영하지
  않아 총합이 100%+gap이 됨). `40% 60%`를 `2fr 3fr`로 바꿔 gap이 트랙 폭에 반영되게
  고친다 — 실제 가로 스크롤 버그를 발견하고도 고치지 않은 채 이 체크리스트를 통과 처리하는
  것은 이 Task의 목적(REQ-FUNC-065)에 반하므로 최소 수정으로 반영한다)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. 실제 브라우저(Chrome DevTools 또는 실기기)에서 320px, 390px, 744px, 1128px, 1440px 5개 폭으로 5개 Screen을 열어 가로 스크롤·겹침이 없는지 확인한다.

## Visual AC

1. 비-UI Task로 해당 없음

## Security/Privacy AC

1. 해당 없음

## Test Cases

- TC-01: 실제 브라우저(Chrome DevTools 또는 실기기)에서 320px, 390px, 744px, 1128px, 1440px 5개 폭으로 5개 Screen을 열어 가로 스크롤·겹침이 없는지 확인한다.

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

*— TASK-MANUAL-RESPONSIVE-CHECK 끝 —*
