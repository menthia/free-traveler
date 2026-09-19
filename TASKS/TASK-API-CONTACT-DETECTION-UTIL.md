# TASK-API-CONTACT-DETECTION-UTIL: 연락처 패턴 탐지 유틸

- **Seq:** 49
- **Category:** API / Backend (`API`)
- **Implementation Status:** IMPLEMENT
- **Priority:** Must

---

## Context

'연락처 패턴 탐지 유틸'을 제공하는 서버 측 로직/Route Handler를 구현하는 Task다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다.

## Requirement Ref

- REQ-FUNC-032

## Screen / Route / Page Entry

- Screen: —
- Route: —
- Page Entry: —

## Design Ref

- `docs/02_SRS_BASELINE.md` §6.1(Internal API and Server Actions) 중 해당 엔드포인트
- `docs/PROJECT_SCOPE.md`의 관련 REQ-FUNC 처리 방법 절

## Depends On

- 없음(선행 Task 없이 시작 가능)

## Expected Files

- src/lib/contact-detection.ts (신규)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. 전화번호, 이메일, 카카오톡/텔레그램 등 메신저 ID 패턴을 정규식 기반으로 탐지한다.
2. 기준 테스트셋 기준 탐지율 95% 이상, 오탐 5% 이하를 목표로 한다(UNIT-CONTACT-DETECTION).

## Visual AC

1. 비-UI Task로 해당 없음

## Security/Privacy AC

1. 해당 없음

## Test Cases

- TC-01: 전화번호, 이메일, 카카오톡/텔레그램 등 메신저 ID 패턴을 정규식 기반으로 탐지한다.
- TC-02: 기준 테스트셋 기준 탐지율 95% 이상, 오탐 5% 이하를 목표로 한다(UNIT-CONTACT-DETECTION).

## Verify

- UNIT-CONTACT-DETECTION

## Definition of Done

- [ ] 위 Expected Files가 모두 생성/수정되어 있고 그 밖의 파일 변경이 없다.
- [ ] Functional AC, Visual AC, Security/Privacy AC를 모두 충족한다.
- [ ] Test Cases가 Verify에 명시된 방법으로 확인 가능하다.
- [ ] Depends On에 나열된 모든 Task가 먼저 완료되어 있다.

## Forbidden

- **Expected Files 목록 밖의 어떤 파일도 생성·수정하지 않는다.**
- 이 Task 수행 중 실제 구현 코드 실행 결과 커밋, Git Branch 생성, Pull Request 생성을 하지 않는다(이 문서는 계획/명세 파일이다).

---

*— TASK-API-CONTACT-DETECTION-UTIL 끝 —*
