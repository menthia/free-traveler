# Free Traveler — Project State

- **Document ID:** STATE-TRAVEL-001
- **최종 갱신일:** 2026-09-20
- **갱신 주체:** 이 문서는 살아있는 상태 파일이다. `/run-wave`, `/release-check` 등 파이프라인 Command가 진행 상황을 갱신할 때마다 이 문서의 해당 필드를 함께 고친다(값만 갱신하고 필드 구조·순서는 바꾸지 않는다).

---

## Harness Schema

```
traveler-screen-route-v1
```

`design-reference/SCREEN_ROUTE_CONTRACT.json`의 `schema_version`, `CLAUDE.md`의 `HARNESS_SCHEMA` 마커와 동일함을 확인함(2026-09-20).

## Design Version

```
D-001 (Status: LOCKED)
```

정본: `design-reference/D-001/DESIGN.md`, `design-reference/DESIGN_MANIFEST.md`. `D-002` 등 새 버전이 만들어지기 전까지 이 값은 바뀌지 않는다.

## Scope Mode

```
BASELINE_LOCKED
```

`docs/PROJECT_SCOPE.md`가 REQ-FUNC-001~080·REQ-NF-001~034 114개 전부의 IMPLEMENT/EXCLUDED 분류 정본이며, 이번 릴리스 주기 동안 이 분류를 임의로 바꾸지 않는다(`CLAUDE.md` 규칙 3, `docs/DECISION_LOG.md` DEC-014). IMPLEMENT 84개 / EXCLUDED 30개.

## Current Wave

```
NOT_DEFINED
```

`TASKS/WAVE_PLAN.md`가 아직 생성되지 않았다(2026-09-20 기준 저장소에 없음 — 파일 존재 확인 완료). Wave 구성은 `docs/DECISION_LOG.md` DEC-010에 따라 사람이 정의해야 하며, `/run-wave`가 이 문서를 대신 만들지 않는다. `TASKS/WAVE_PLAN.md`가 만들어지면 이 필드는 첫 Wave ID(예: `W01`)로 갱신된다.

## Current Task

```
N/A
```

Current Wave가 정의되지 않아 진행 중인 Task가 없다. `/run-wave <WAVE_ID>`가 처음 실행되면 이 필드는 그 시점에 구현 중인 `TASK_ID`로 갱신된다.

## Completed Tasks

```
0 / 73 DONE
```

`TASKS/TASK_MANIFEST.csv` 기준 전체 Task 73개 중 `TASKS/WAVE_STATE.json`에서 `DONE`으로 확인된 Task는 없다(`TASKS/WAVE_STATE.json` 자체가 아직 생성되지 않음). Wave가 진행되면 `/run-wave`가 Task를 완료할 때마다 이 분자를 갱신한다.

## Blocked Tasks

```
0 / 73 attempted — Wave 실행 자체가 아직 시작되지 않음
```

"차단된 Task가 0개"가 아니라 "아직 어떤 Task도 `/prepare-task`로 시도되지 않아 차단 여부를 알 수 없다"는 뜻이다. `BLOCKED_INPUT`/`BLOCKED_DEPENDENCY`/`BLOCKED_DIRTY_TREE`/`BLOCKED_SCOPE`로 판정된 Task가 생기면 여기에 Task ID와 상태를 나열한다.

## Latest CI

```
NOT_CONFIGURED
```

`.github/workflows/`가 저장소에 없음을 확인함(2026-09-20). `TASK-CI-PIPELINE`이 완료되면 최신 워크플로 실행 결과(성공/실패, 실행 시각, 커밋 SHA)로 갱신한다.

## Supabase State

```
NOT_PROVISIONED
```

`supabase/`(config.toml, migrations, seed.sql)와 `.env.example`이 저장소에 없고, Supabase 프로젝트 생성·연결 여부를 확인할 근거가 없음을 확인함(2026-09-20). `TASK-INFRA-SUPABASE-PROJECT` → `TASK-DB-SCHEMA-BASE` → `TASK-DB-RLS-BASE` 완료 후 프로젝트 ref와 6개 테이블·RLS 확인 상태로 갱신한다(근거: `TASKS/RELEASE_EVIDENCE.md`, 아직 없음).

## Vercel Preview URL

```
N/A
```

`vercel.json`이 없고 배포 이력을 확인할 근거가 없다(2026-09-20). `TASK-INFRA-VERCEL-DEPLOY` 완료 후 최신 Preview 배포 URL로 갱신한다.

## Screen Checkpoints

| Screen | Route | Checkpoint |
|---|---|---|
| SCR-001 | `/` | `PENDING` |
| SCR-002 | `/about` | `PENDING` |
| SCR-003 | `/travel-tools` | `PENDING` |
| SCR-004 | `/mates` | `PENDING` |
| SCR-005 | `/account` | `PENDING` |
| **FINAL** | — | `PENDING` |

각 Screen의 Checkpoint는 해당 `PAGE-SCR00X` Task가 `DONE`이 되고 그 Screen이 속한 Wave가 사람 Preview 확인까지 마쳤을 때(`preview_checkpoint: CONFIRMED`, `run-wave.md` §0) `CONFIRMED`로 갱신한다. `FINAL`은 5개 Screen이 모두 `CONFIRMED`이고 `/release-check`가 `RELEASE_READY`를 반환했을 때만 `CONFIRMED`로 갱신한다.

## Playwright State

```
NOT_RUN
```

`playwright.config.ts`가 저장소에 없고 실행 이력이 없음을 확인함(2026-09-20). `E2E-PUBLIC-SMOKE`/`E2E-TRAVEL-TOOLS`/`E2E-MATE-AUTH` 중 하나라도 실행되면 그 결과(PASS/FAIL, 실행 시각)로 갱신하며, Chromium 단일 브라우저 결과만 기록한다(`CLAUDE.md` 규칙 18).

## Deferred Items

```
30개 (REQ-FUNC EXCLUDED 10 + REQ-NF EXCLUDED 20)
```

전체 목록은 `TASKS/00_TASK_LIST.md`의 NON_IMPLEMENTATION 표(및 `docs/PROJECT_SCOPE.md` §5~6, `docs/DECISION_LOG.md` DEC-014)를 정본으로 한다. 이 문서에서 목록을 복제하지 않고 정본을 가리키기만 한다 — 두 곳의 내용이 어긋나면 `TASKS/00_TASK_LIST.md`가 최신이다. Scope Mode가 바뀌어 특정 항목이 IMPLEMENT로 전환되기 전까지 이 개수는 변하지 않는다.

## Next Action

```
1. 사람이 TASKS/WAVE_PLAN.md를 작성해 Wave 구성(어떤 Task를 어떤 Wave로 묶을지, Preview Checkpoint 여부)을 정의한다.
2. /run-wave dry-run W01로 첫 Wave의 Task별 준비 상태를 미리 확인한다.
3. 문제가 없으면 /run-wave W01로 실행을 시작한다.
```

Current Wave가 `NOT_DEFINED`인 한 이 필드의 1번 항목이 항상 최우선 Next Action이다. Wave 실행이 시작되면 이 필드는 `/run-wave`가 보고한 "다음 행동"(예: "Preview 확인 후 /run-wave resume 실행")으로 갱신한다.

---

*— End of STATE-TRAVEL-001 —*
