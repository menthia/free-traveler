# TASK-RELEASE-CHECK-CONTENT-GATE: 배포 전 콘텐츠 완전성 게이트 실행 확인

- **Seq:** 73
- **Category:** Manual / Release Check (`MANUAL_CHECK`)
- **Implementation Status:** IMPLEMENT(변형)
- **Priority:** Must

---

## Context

자동화하지 않고 사람이 브라우저에서 직접 확인해야 하는 '배포 전 콘텐츠 완전성 게이트 실행 확인' Task다. 코드 산출물은 없다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT(변형)**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다. 단, 원 요구사항을 그대로 만족하지 않고 단순화된 방식(§Design Ref 참고: 정적 데이터/localStorage/Toast/렌더링 시점 계산 등)으로 구현하도록 승인되어 있다 — 이 축소 범위를 임의로 되돌려 원 요구사항 전체를 구현하지 않는다.

## Requirement Ref

- REQ-FUNC-074

## Screen / Route / Page Entry

- Screen: —
- Route: —
- Page Entry: —

## Design Ref

- `design-reference/D-001/DESIGN.md` §14(Desktop·Mobile 규칙), §19(Do/Do Not)
- `docs/06_SRS_UIUX_REVISED.md` §3(Release Acceptance Criteria)

## Depends On

- TASK-DATA-CONTENT-COMPLETENESS-CHECK

## Expected Files

- —(체크리스트: TASKS/checklists/content-gate.md 신규)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. 배포 전 `scripts/validate_content.py` 실행 결과가 통과인지 사람이 최종 확인한다.

## Visual AC

1. 비-UI Task로 해당 없음

## Security/Privacy AC

1. 해당 없음

## Test Cases

- TC-01: 배포 전 `scripts/validate_content.py` 실행 결과가 통과인지 사람이 최종 확인한다.

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

*— TASK-RELEASE-CHECK-CONTENT-GATE 끝 —*
