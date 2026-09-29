# TASK-E2E-PUBLIC-SMOKE: Playwright 공개 화면 Smoke(비로그인)

- **Seq:** 64
- **Category:** E2E Test (Playwright) (`E2E_TEST`)
- **Implementation Status:** IMPLEMENT
- **Priority:** Must

---

## Context

Playwright Chromium 기반으로 'Playwright 공개 화면 Smoke(비로그인)'을 검증하는 End-to-End 테스트를 작성하는 Task다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다.

## Requirement Ref

- REQ-FUNC-001
- REQ-FUNC-002
- REQ-FUNC-004
- REQ-FUNC-006
- REQ-FUNC-057
- REQ-NF-024

## Screen / Route / Page Entry

- Screen: SCR-001, SCR-002
- Route: /, /about
- Page Entry: —

## Design Ref

- `docs/02_SRS_BASELINE.md` §6.8(Validation Plan) 및 Critical Test Scenarios
- `design-reference/D-001/DESIGN.md` §19 Do Not(광고·별점·실시간 가격·Airbnb 상표 등 금지 확인 대상)

## Depends On

- TASK-PAGE-SCR001
- TASK-PAGE-SCR002
- TASK-API-ERROR-PAGES

## Expected Files

- tests/e2e/public-smoke.spec.ts (신규 — 이미 존재하는 경우 이 Task가 요구하는 흐름/axe-core
  검사를 추가하는 수정)
- package.json, package-lock.json (수정 — AC2의 axe-core 자동 접근성 검사를 실행하려면
  Playwright용 axe 통합 패키지 `@axe-core/playwright`가 필요한데 devDependencies에 없었다.
  devDependency로 추가한다. Prisma/AWS 등 금지된 인프라 추가가 아니라 테스트 전용
  패키지다)
- src/lib/toast-context.tsx (수정 — axe-core 실행 중 발견: Toast 목록 컨테이너
  `<div aria-label="알림 목록">`이 유효한 role 없이 aria-label만 가진 채 렌더링되어
  `aria-prohibited-attr` 위반(serious)이 발생했다. `role="region"`을 추가해 aria-label이
  허용되는 요소로 만든다)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. 흐름 1: SCR-001 진입→필터 적용→여행지 Drawer 열람. 흐름 2: 해외 상세→안전정보 Drawer 전환. 흐름 3: SCR-002 진입→Gallery/Timeline 노출 확인. 흐름 4: 404 페이지 복구 행동 확인.
2. axe-core 자동 접근성 검사에서 serious/critical 위반 0건(REQ-NF-024).

## Visual AC

1. 비-UI Task로 해당 없음

## Security/Privacy AC

1. 해당 없음

## Test Cases

- TC-01: 흐름 1: SCR-001 진입→필터 적용→여행지 Drawer 열람. 흐름 2: 해외 상세→안전정보 Drawer 전환. 흐름 3: SCR-002 진입→Gallery/Timeline 노출 확인. 흐름 4: 404 페이지 복구 행동 확인.
- TC-02: axe-core 자동 접근성 검사에서 serious/critical 위반 0건(REQ-NF-024).

## Verify

- —

## Definition of Done

- [ ] 위 Expected Files가 모두 생성/수정되어 있고 그 밖의 파일 변경이 없다.
- [ ] Functional AC, Visual AC, Security/Privacy AC를 모두 충족한다.
- [ ] Test Cases가 Verify에 명시된 방법으로 확인 가능하다.
- [ ] Depends On에 나열된 모든 Task가 먼저 완료되어 있다.

## Forbidden

- **Expected Files 목록 밖의 어떤 파일도 생성·수정하지 않는다.**
- 이 Task 수행 중 실제 구현 코드 실행 결과 커밋, Git Branch 생성, Pull Request 생성을 하지 않는다(이 문서는 계획/명세 파일이다).
- Chromium 외 다른 브라우저(Firefox/WebKit) 매트릭스를 추가하지 않는다.

---

*— TASK-E2E-PUBLIC-SMOKE 끝 —*
