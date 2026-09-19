---
description: 릴리스 전 최종 게이트. Task/Wave 완료, CI, Playwright, Supabase, Vercel Preview, EXCLUDED 목록을 확인해 RELEASE_READY/RELEASE_BLOCKED를 판정한다(코드 수정 없음)
---

`traveler-project-pipeline` Skill을 사용한다 — 아직 컨텍스트에 없다면 먼저 로드한다. 이 Command는 **판정만** 한다. 실패한 검사를 통과시키려고 코드·설정·인프라를 고치지 않는다. `/prepare-task`·`/run-wave`가 계획과 진행을 다뤘다면, 이 Command는 **"지금 배포해도 되는가"**만 확인한다.

## 0. 원칙

- 모든 판단은 실제로 존재하는 파일과 실제로 실행한 명령의 결과에만 근거한다. 이전 대화에서 통과했다고 언급된 적이 있어도, 이번에 다시 확인하지 않은 것은 통과로 치지 않는다.
- 확인할 방법 자체가 없으면(예: CI가 아직 구성되어 있지 않음) **"확인 불가"를 "PASS"로 취급하지 않는다** — `RELEASE_BLOCKED`로 판정하고 이유를 명시한다.
- 이 Command는 Task 상세 파일, `TASKS/00_TASK_LIST.md`, `TASKS/WAVE_STATE.json`, 소스 코드, CI 설정, 배포 설정 어느 것도 수정하지 않는다.

## 1. 검사 7개

### 1.1 Task·Wave 상태

- `TASKS/WAVE_STATE.json`을 Read한다. 없으면 이 검사부터 `RELEASE_BLOCKED`(Wave가 한 번도 실행되지 않음).
- `TASKS/TASK_MANIFEST.csv`의 전체 Task ID와 `TASKS/WAVE_STATE.json`에 기록된 Task 상태를 대조한다.
- 모든 Wave의 모든 Task가 `DONE`이어야 한다. 하나라도 `READY`/`IN_PROGRESS`/`BLOCKED_*`/`FAILED`이면 그 Task ID와 상태를 그대로 보고하고 이 검사는 실패.
- `TASKS/WAVE_STATE.json`에 없는(=한 번도 시도되지 않은) Task가 `TASKS/TASK_MANIFEST.csv`에 있으면 같은 이유로 실패.

### 1.2 5개 Page Owner DONE

- `PAGE-SCR001`, `PAGE-SCR002`, `PAGE-SCR003`, `PAGE-SCR004`, `PAGE-SCR005` 5개가 `TASKS/WAVE_STATE.json`에서 모두 `DONE`인지 확인한다.
- 이 검사는 1.1의 부분집합이지만, 5개 Screen이 실제로 조립되었는지는 릴리스 판정에서 특히 중요하므로 별도 항목으로 명시해 보고한다.
- 5개 Page Entry(`src/app/page.tsx`, `src/app/about/page.tsx`, `src/app/travel-tools/page.tsx`, `src/app/mates/page.tsx`, `src/app/account/page.tsx`)가 실제로 존재하는지 파일 시스템에서도 다시 확인한다(상태 값만 믿지 않는다).

### 1.3 CI PASS

- `.github/workflows/*.yml`이 존재하는지 먼저 확인한다. 없으면 즉시 실패("CI 파이프라인 미구성").
- `gh` CLI가 사용 가능하면 현재 브랜치(또는 release 대상 브랜치)의 최신 워크플로 실행 결과를 조회한다(예: `gh run list --branch <branch> --limit 1`, `gh run view <run-id>`).
- `gh`를 쓸 수 없거나 원격 저장소에 실행 이력이 없으면, 로컬에서 CI가 수행하는 것과 동일한 명령(`tsc --noEmit`, `next lint`, Vitest)을 직접 실행해 전부 통과하는지 확인한다. 이 경우 "로컬 재현으로 확인했으며 원격 CI 기록은 별도 확인 필요"라고 명시한다.
- 어느 방법으로도 확인하지 못하면 실패로 처리한다(확인 불가 = 통과 아님).

### 1.4 Playwright Smoke PASS

- `TASKS/WAVE_STATE.json`에서 `E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH` 3개가 `DONE`인지 먼저 확인한다.
- 그 위에 **이번 판정 시점에 다시 한번 실행**한다(예: `npx playwright test --project=chromium`). 이전에 통과했더라도 릴리스 시점 코드 기준으로 다시 확인한다.
- Chromium 외 다른 브라우저 프로젝트를 추가로 실행하지 않는다(`CLAUDE.md` 규칙 18).
- 재실행 결과가 실패하면, `TASKS/WAVE_STATE.json`상 `DONE`이었더라도 이 검사는 실패로 판정하고 "회귀 발생 가능성"으로 표시한다(상태 파일 값보다 지금 실행 결과를 우선한다).

### 1.5 Supabase 6개 Table·기본 RLS 확인 기록

- `TASKS/WAVE_STATE.json`에서 `DB-SCHEMA-BASE`, `DB-RLS-BASE`가 `DONE`인지 확인한다.
- 이 Command는 Supabase 프로젝트에 직접 접속해 실시간으로 테이블을 조회하지 않는다(그럴 도구나 자격증명이 이 환경에 없을 수 있음을 가정). 대신 **사람이 남긴 확인 기록**을 확인한다: `TASKS/RELEASE_EVIDENCE.md`에 아래 두 항목이 날짜·확인자와 함께 기록되어 있는지 본다.
  - Supabase 대시보드(또는 `supabase db diff`/`psql`)로 테이블이 정확히 6개(`USER_PROFILE`, `MATE_POST`, `MATE_APPLICATION`, `USER_BLOCK`, `REPORT`, `OUTBOUND_LINK_SETTING`)임을 확인한 기록
  - 기본 RLS 3원칙(본인 데이터만 쓰기 / 당사자만 비공개 열람 / 역할 기반 관리자 열람, `docs/ARCHITECTURE.md` §7.3)에 대한 부정 접근 테스트(`TEST-RLS-BASIC`) 실행 결과가 통과했다는 기록
- `TASKS/RELEASE_EVIDENCE.md` 자체가 없거나 위 두 항목 중 하나라도 없으면 실패로 처리한다. 이 Command가 대신 항목을 채우거나 추정해서 통과시키지 않는다.

### 1.6 Vercel Preview Checkpoint

- `TASKS/WAVE_STATE.json`의 모든 Wave에 대해 `preview_checkpoint`가 `CONFIRMED` 또는 `NOT_REQUIRED`인지 확인한다. 하나라도 `PENDING`이면 실패("Wave WXX가 사람 Preview 확인을 기다리는 중").
- `vercel` CLI 또는 `gh`로 최신 Preview 배포 URL을 확인할 수 있으면 함께 표시한다(정보 제공 목적, 판정 자체는 `preview_checkpoint` 필드를 기준으로 한다).
- Preview 배포 자체가 확인되지 않으면(배포 이력 없음) 마찬가지로 실패 처리한다.

### 1.7 EXCLUDED 목록

- `python3 scripts/audit_tasks.py`를 실행해 특히 검사 17(114개 Requirement 전부가 Task 또는 NON_IMPLEMENTATION 표에 존재)과 18(EXCLUDED가 구현 Task/상세 파일에 없음)이 `PASS`인지 확인한다. 그 두 항목이 아니어도 스크립트 전체가 `AUDIT_FAIL`이면 이 검사도 실패로 본다.
- `TASKS/00_TASK_LIST.md`의 NON_IMPLEMENTATION 표를 그대로 읽어 **현재 EXCLUDED 목록 전체를 릴리스 보고서에 함께 표시**한다(무엇을 의도적으로 만들지 않았는지 릴리스 커뮤니케이션에 필요하므로) — 이 표를 이유 없이 요약·생략하지 않는다.
- 이 검사는 "EXCLUDED가 있으면 실패"가 아니라 "EXCLUDED 처리가 규칙(`docs/DECISION_LOG.md` DEC-014)대로 삭제 없이 보존되고 구현되지 않았는지"를 확인하는 것이다.

## 2. 판정

- 위 7개 검사가 **전부** 통과해야 `RELEASE_READY`.
- 하나라도 실패하면 `RELEASE_BLOCKED`다. 여러 개가 동시에 실패해도 상태 값은 `RELEASE_BLOCKED` 하나이며, 실패한 검사 전부를 보고서에 나열한다(하나만 짚고 멈추지 않는다 — release-check는 전체 그림을 한 번에 보여주는 것이 목적이다).

```
RELEASE_READY
RELEASE_BLOCKED
```

## 3. 보고 형식

```
STATUS: <RELEASE_READY | RELEASE_BLOCKED>
CHECKED_AT: <실행 시각>

[검사 결과]
1. Task·Wave 상태:            <PASS|FAIL 사유>
2. 5개 Page Owner DONE:        <PASS|FAIL — 미완료 Screen 목록>
3. CI PASS:                    <PASS|FAIL — 확인 방법(gh 조회/로컬 재현)과 근거>
4. Playwright Smoke PASS:      <PASS|FAIL — 이번 재실행 결과>
5. Supabase 6Table·RLS 확인 기록: <PASS|FAIL — TASKS/RELEASE_EVIDENCE.md 기준>
6. Vercel Preview Checkpoint:  <PASS|FAIL — Wave별 preview_checkpoint 값>
7. EXCLUDED 목록:               <PASS|FAIL — audit_tasks.py 17/18, 전체 EXCLUDED 목록>

[EXCLUDED 전체 목록]
<TASKS/00_TASK_LIST.md NON_IMPLEMENTATION 표 그대로 또는 요약 없이 전체 나열>

[다음 행동]
<RELEASE_BLOCKED면 무엇을 먼저 해결해야 하는지 검사 번호별로 구체적으로 안내>
```

`RELEASE_BLOCKED`일 때 이 Command가 대신 CI를 구성하거나, Supabase에 접속해 확인하거나, Vercel Preview를 승인하지 않는다 — 각 항목의 책임 소재(사람 확인 필요/별도 Task 필요)를 분명히 하고 멈춘다.
