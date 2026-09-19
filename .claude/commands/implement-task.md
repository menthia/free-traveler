---
description: prepare-task가 READY_TO_IMPLEMENT로 판정한 Task 1개를 Expected Files 안에서 실제로 구현한다
---

`traveler-project-pipeline` Skill을 사용한다 — 아직 컨텍스트에 없다면 먼저 로드한다. 이 Command는 이 파이프라인에서 **실제 소스 코드를 작성하는 유일한 단계**다. 그만큼 범위를 벗어나지 않는 것이 가장 중요하다.

## 입력

- `WAVE_ID`, `TASK_ID`(`/prepare-task`와 동일)
- 대상 상세 파일: `TASKS/TASK-<TASK_ID>.md`

## 0. 선행 조건 — READY_TO_IMPLEMENT 확인 없이 시작하지 않는다

1. 이번 세션에서 같은 `WAVE_ID`/`TASK_ID`로 `/prepare-task`를 이미 실행해 `STATUS: READY_TO_IMPLEMENT`를 받은 적이 없다면, **먼저 `/prepare-task`를 실행한다.**
2. 결과가 `READY_TO_IMPLEMENT`가 아니면(`BLOCKED_INPUT`/`BLOCKED_DEPENDENCY`/`BLOCKED_DIRTY_TREE`/`BLOCKED_SCOPE`) 그 상태와 사유를 그대로 사용자에게 보고하고 **여기서 멈춘다.** 막힌 이유를 스스로 해결하려고 임의로 파일을 정리하거나 우회하지 않는다.
3. 동시에 여러 Task를 구현하지 않는다 — `TASK_ID` 하나만 다룬다(`CLAUDE.md` 규칙 7, Skill §10).

## 1. Task 상세를 실제로 읽는다

`TASKS/TASK-<TASK_ID>.md` 전체를 Read로 다시 읽는다(요약이나 이전 대화 기억에 의존하지 않는다). 특히 다음을 확정한다.

- `Expected Files` — 이 목록 **안에서만** 파일을 만들거나 고친다. 목록 밖 파일은 구현 중 필요성이 발견되더라도 임의로 추가하지 않고, 먼저 사용자에게 보고해 Task 상세 파일 갱신 여부를 확인받는다.
- `Functional AC`, `Visual AC`, `Security/Privacy AC` — 구현이 만족해야 하는 조건.
- `Design Ref`(`design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`) — 실제 값을 다시 확인하고 구현에 반영한다.
- `Category`(PAGE_OWNER/COMPONENT/DATA/DB/API/UNIT_TEST/E2E_TEST/CI_INFRA/MANUAL_CHECK) — §3의 카테고리별 규칙을 결정한다.
- `Test Cases`, `Verify` — 실행해야 할 검증 방법.

## 2. Expected Files 안에서만 작업한다

- "(수정)"으로 표시된 파일은 기존 내용을 먼저 Read한 뒤 고친다.
- "(신규)"로 표시된 파일만 새로 만든다.
- Expected Files에 없는 파일(설정 파일, 다른 화면의 파일, 임시 스크립트 등)은 만들거나 고치지 않는다.

## 3. Functional·Visual·Security AC를 따른다 (카테고리별 규칙)

- **PAGE_OWNER**: 이미 구현되어 있는 Component/Data/API의 결과물을 import해 실제 Page Entry(`src/app/**/page.tsx`)에서 **조립만** 한다. 이 Task 안에서 새 Component 파일을 만들지 않는다(`CLAUDE.md` 규칙 9). Depends On의 Component가 아직 구현되어 있지 않다면(코드가 없다면) 그 사실을 즉시 보고하고 멈춘다 — `/prepare-task`의 Depends On 검사를 다시 신뢰할 수 없는 상태이므로 임의로 대신 만들지 않는다.
- **SCR-001 Page Owner**: Next.js 기본 Starter 콘텐츠(로고, "Templates" 링크 등)를 제거한다(`CLAUDE.md` 규칙 10).
- **SCR-003 Page Owner**: 항공·숙소·동행 구하기 3개 탭을 실제로 조립한다. 입력값을 서버·DB·URL 쿼리·로그·분석 어디에도 보내지 않는다(`CLAUDE.md` 규칙 11·12).
- **SCR-005 Page Owner**: Guest·Member·Admin 역할별 상태를 실제로 조립하고, 역할에 없는 탭은 DOM에서부터 렌더링하지 않는다(CSS로만 숨기지 않는다).
- **DB**: Expected Files가 가리키는 스키마/RLS/Access/Seed 범위만 구현한다. `USER_PROFILE`/`MATE_POST`/`MATE_APPLICATION`/`USER_BLOCK`/`REPORT`/`OUTBOUND_LINK_SETTING` 6개 테이블 밖의 테이블을 추가하지 않는다.
- **API**: RLS를 우회하는 코드를 작성하지 않고, Service Role Key를 어떤 파일에도 하드코딩하지 않는다(`CLAUDE.md` 규칙 14·15). 필요한 값은 환경변수로 참조하되, `.env.example`에 값 없이 키 이름만 추가하는 것은 허용한다.
- **COMPONENT/DATA**: Visual AC(레이아웃·색상 토큰·반응형)와 Security/Privacy AC(예: 연락처 비노출, localStorage 범위)를 코드에 그대로 반영한다.

## 4. 관련 Unit Test 실행

- Task 상세의 `Test Cases`/`Verify`에 대응하는 **Vitest**를 실행한다.
- 이 Task가 테스트 파일 자체를 만드는 Task(`UNIT-*`, `TEST-RLS-BASIC`)라면 Expected Files에 있는 테스트 파일을 작성한 뒤 실행해 통과를 확인한다.
- 이 Task가 다른 코드를 구현하는 Task라면, 이미 존재하는 관련 Unit Test(있다면)를 재실행해 회귀가 없는지 확인한다.
- 테스트가 실패하면 구현을 고쳐 통과시킨다. 실패를 무시하고 완료로 보고하지 않는다.

## 5. Playwright Smoke — Page Owner 또는 E2E_TEST일 때만 실행

- 이번 Task의 `Category`가 **`PAGE_OWNER`** 또는 **`E2E_TEST`**일 때만 Playwright를 실행한다. 그 외 Category(COMPONENT/DATA/DB/API 등)에서는 Playwright를 실행하지 않는다.
- 실행 범위는 이 Task와 직접 관련된 Smoke 하나로 한정한다(예: SCR-001 관련 작업이면 `E2E-PUBLIC-SMOKE`). 관련 없는 전체 스위트를 함께 돌리지 않는다.
- Chromium 단일 브라우저로만 실행한다(`CLAUDE.md` 규칙 18, Skill §9).

## 6. 금지 사항

다음은 이 Task의 목적과 무관하게 **어떤 상황에서도 추가하지 않는다**(`CLAUDE.md` 규칙 17, 규칙 21).

- AWS·EC2 등 Vercel/Supabase 외의 인프라 구성
- Prisma를 포함한 어떤 ORM
- 자동 Merge/자동 PR 생성 로직이나 워크플로
- Task 상세의 `Forbidden` 절에 적힌 항목(카테고리별로 다를 수 있으므로 반드시 다시 확인한다)

## 7. 완료 후 Diff 확인과 보고

1. `git status`/`git diff`로 변경된 파일이 **정확히 Expected Files와 일치하는지** 확인한다. 일치하지 않으면 그 차이를 보고서에 명시한다(의도된 것인지, 실수인지 구분).
2. 다음을 포함해 보고한다.
   - 변경/생성한 파일 목록(Expected Files 대비 실제 결과)
   - 실행한 Unit Test 결과(통과/실패, 실패 시 무엇을 고쳐 통과시켰는지)
   - Playwright 실행 여부와 결과(Page Owner/E2E_TEST가 아니면 "해당 없음"으로 명시)
   - 아직 남은 제약이나 후속 작업이 필요한 부분(예: 이 Task가 의존하는 다음 Component가 아직 없어 임시 자리표시자로 연결한 경우 등)

## 8. Commit·Push·PR — 기본적으로 수행하지 않는다

- 이 Command는 **기본적으로 Commit, Push, Pull Request를 자동 수행하지 않는다.** 구현과 검증까지만 하고 결과를 보고한다.
- 사용자가 이 Task에 대해 명시적으로 커밋을 요청한 경우에만, **이 Task 하나에 해당하는 변경만 묶어 Commit 1개**를 만든다(`git add`는 Expected Files로 확인된 변경분만, `git add -A`/`git add .` 금지).
- 커밋 요청을 받았더라도 **Push와 PR 생성은 별도의 명시적 요청 없이는 하지 않는다** — Commit 허용이 Push/PR 허용을 의미하지 않는다(`docs/DECISION_LOG.md` DEC-012, `CLAUDE.md` 규칙 21).
- `git reset --hard`, `git checkout -- .`, `git clean -f`, `git push --force` 등 destructive 명령은 사용하지 않는다(`CLAUDE.md` 규칙 20).
