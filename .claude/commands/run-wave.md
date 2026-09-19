---
description: "Wave 단위로 Task를 순차 실행한다. 지원 형식: /run-wave WXX, /run-wave status, /run-wave resume, /run-wave dry-run WXX"
---

`traveler-project-pipeline` Skill을 사용한다 — 아직 컨텍스트에 없다면 먼저 로드한다. 이 Command는 `/prepare-task`와 `/implement-task`를 Wave 단위로 반복 호출하는 오케스트레이터다. **자동 Branch 생성, 자동 PR 생성, 자동 Merge를 어떤 하위 동작으로도 포함하지 않는다.**

## 지원 명령

| 명령 | 동작 |
|---|---|
| `/run-wave W03` | W03의 READY Task를 순서대로 하나씩 구현 |
| `/run-wave status` | 현재 Wave 진행 상태만 읽어서 보고(부작용 없음) |
| `/run-wave resume` | 중단된 지점 또는 Preview 대기 지점에서 이어서 진행 |
| `/run-wave dry-run W03` | 실제 구현 없이 W03의 Task별 `/prepare-task` 판정만 미리 확인 |

---

## 0. WAVE_PLAN과 WAVE_STATE

### WAVE_PLAN — `TASKS/WAVE_PLAN.md` (사람이 작성, 이 Command는 읽기만 한다)

Wave 분할은 `docs/DECISION_LOG.md` DEC-010에 따라 사람이 결정한다. 이 파일이 없으면 **어떤 하위 명령도 Task를 임의로 Wave에 배정하지 않는다** — 대신 다음 형식으로 먼저 만들어 달라고 요청하고 멈춘다.

```markdown
# Wave Plan

## W01
- Tasks: COMP-GLOBAL-SHELL, COMP-GLOBAL-SEO-METADATA, COMP-GLOBAL-TOAST
- Preview Checkpoint: true

## W02
- Tasks: DATA-DESTINATIONS, DATA-SAFETY, DATA-REPRESENTATIVE, DATA-POLICY-CONTENT, DB-SCHEMA-BASE, DB-RLS-BASE, DB-ACCESS, DB-SEED-BASE
- Preview Checkpoint: false

## W03
- Tasks: COMP-SCR001-HERO-SEARCH, COMP-SCR001-DESTINATION-DIRECTORY, ..., PAGE-SCR001
- Preview Checkpoint: true
```

- `Tasks`는 `TASKS/TASK_MANIFEST.csv`에 실재하는 Task ID만 나열한다(존재하지 않는 ID가 있으면 dry-run/실행 모두 `BLOCKED_INPUT`으로 멈춘다).
- `Preview Checkpoint: true`가 기본값이다(`CLAUDE.md` 규칙 22 — Wave 완료 후 사람 확인 없이 다음 Wave로 진행하지 않는다). `false`는 해당 Wave에 화면 산출물이 없어 Preview가 의미 없을 때만(예: DB/DATA만으로 구성된 Wave) 사람이 명시적으로 지정한다.

### WAVE_STATE — `TASKS/WAVE_STATE.json` (이 Command가 갱신)

```json
{
  "current_wave": "W03",
  "updated_at": "2026-09-20T12:00:00+09:00",
  "waves": {
    "W01": { "status": "DONE", "preview_checkpoint": "CONFIRMED",
      "tasks": { "COMP-GLOBAL-SHELL": "DONE" } },
    "W03": { "status": "IN_PROGRESS", "preview_checkpoint": "PENDING",
      "tasks": { "COMP-SCR001-HERO-SEARCH": "DONE", "PAGE-SCR001": "READY" } }
  }
}
```

- Task 상태 값: `READY`(대기) / `IN_PROGRESS`(구현 중) / `DONE`(검증 통과) / `BLOCKED_INPUT` / `BLOCKED_DEPENDENCY` / `BLOCKED_DIRTY_TREE` / `BLOCKED_SCOPE`(`/prepare-task`의 다섯 상태 중 BLOCKED 계열을 그대로 기록) / `FAILED`(구현했지만 검증 실패).
- `TASKS/WAVE_STATE.json`이 없고 `TASKS/WAVE_PLAN.md`는 있으면, WAVE_PLAN을 근거로 모든 Task를 `READY`로 초기화해 새로 만든다(이것은 사람이 정한 계획을 그대로 옮기는 것이지 Wave 구성을 대신 결정하는 것이 아니다).
- 이 파일을 사람이 직접 손으로 고치는 것은 막지 않지만, 이 Command는 항상 다시 Read해서 최신 상태를 신뢰한다.

---

## 1. `/run-wave WXX`

1. **읽기**: `TASKS/WAVE_PLAN.md`와 `TASKS/WAVE_STATE.json`을 Read한다(§0 규칙에 따라 없으면 여기서 멈춘다).
2. **Task 선택**: `WXX`에 속한 Task 중 상태가 `DONE`이 아닌 것들을, 같은 Wave 안(및 이미 다른 Wave에서 `DONE`인 의존성 포함)에서 `Depends On`이 모두 만족된 것 하나를 고른다(`TASKS/TASK_MANIFEST.csv`의 `depends_on` 기준 위상 정렬).
   - 후보가 없는데 아직 `DONE`이 아닌 Task가 남아 있다면(순환 의존 또는 Wave 밖 의존성 미완료) 실행을 멈추고 원인을 보고한다. 임의로 순서를 바꾸거나 의존성을 무시하지 않는다.
3. **검사**: 선택한 Task에 대해 `/prepare-task WXX <TASK_ID>`를 실행한다.
   - `READY_TO_IMPLEMENT`가 아니면, 그 Task의 WAVE_STATE 상태를 해당 `BLOCKED_*` 값으로 기록하고 **Wave 실행을 멈춘다.** 다른 Task로 건너뛰어 계속하지 않는다(순서 보장이 Depends On 무결성보다 중요하다).
4. **구현**: `/implement-task WXX <TASK_ID>`를 실행한다. WAVE_STATE의 해당 Task를 `IN_PROGRESS`로 표시한 뒤 진행한다.
5. **검증 판정**: `/implement-task`가 보고한 Unit Test(및 해당 시 Playwright) 결과가 전부 PASS면 WAVE_STATE의 Task 상태를 `DONE`으로 갱신한다.
   - 하나라도 FAIL이면 `FAILED`로 기록하고 **Wave 실행을 멈춘다.** 실패를 무시하고 다음 Task로 넘어가지 않는다.
6. **반복**: 5에서 `DONE`이 되었으면 2로 돌아가 같은 Wave의 다음 READY Task를 계속 처리한다.
7. **Wave 완료**: `WXX`의 모든 Task가 `DONE`이면 WAVE_STATE의 `waves.WXX.status`를 `DONE`으로 갱신한다.
   - `TASKS/WAVE_PLAN.md`에 이 Wave의 `Preview Checkpoint: true`(기본값)이면 `waves.WXX.preview_checkpoint`를 `PENDING`으로 두고 최종 상태 **`WAITING_FOR_PREVIEW`**로 종료한다. 다음 Wave로 자동 진행하지 않는다.
   - `Preview Checkpoint: false`로 명시된 Wave라면 `preview_checkpoint`를 `NOT_REQUIRED`로 기록하고 **`WAVE_COMPLETE`**로 종료한다.

## 2. `/run-wave status`

- `TASKS/WAVE_STATE.json`(없으면 `TASKS/WAVE_PLAN.md`)을 Read만 하고 아무것도 바꾸지 않는다.
- `current_wave`, 그 Wave의 Task별 상태(READY/IN_PROGRESS/DONE/BLOCKED_*/FAILED) 개수, 전체 Wave 중 완료된 Wave 수, `WAITING_FOR_PREVIEW` 여부를 보고한다.
- `TASKS/WAVE_STATE.json`이 아직 없으면 "아직 실행된 Wave가 없습니다"라고 보고하고 `TASKS/WAVE_PLAN.md` 존재 여부만 함께 알린다.

## 3. `/run-wave resume`

1. `TASKS/WAVE_STATE.json`을 Read한다. 없으면 "이어갈 상태가 없습니다. `/run-wave <WAVE_ID>` 또는 `/run-wave dry-run <WAVE_ID>`부터 시작하세요"라고 안내하고 멈춘다.
2. `current_wave`의 상태를 확인한다.
   - Wave 상태가 `IN_PROGRESS`이고 아직 `DONE`이 아닌 Task가 있으면(중단된 지점) — §1의 2번(Task 선택)부터 다시 시작해 이어서 진행한다. 이때 멈췄던 이유가 여전히 유효한지 `/prepare-task`로 **다시 검사한다**(이전 판정을 그대로 재사용하지 않는다).
   - Wave 상태가 `DONE`이고 `preview_checkpoint`가 `PENDING`(`WAITING_FOR_PREVIEW`로 종료됐던 경우) — `resume`을 사람이 직접 호출했다는 것 자체를 **Preview 확인 완료 신호**로 간주해 `preview_checkpoint`를 `CONFIRMED`로 갱신하고, `TASKS/WAVE_PLAN.md`에서 다음 Wave ID를 찾아 `/run-wave <다음 WAVE_ID>`를 그대로 실행한다.
   - 다음 Wave가 없으면(마지막 Wave) "모든 Wave가 완료되었습니다"라고 보고하고 멈춘다.

## 4. `/run-wave dry-run WXX`

- **파일을 쓰지 않는다**(`TASKS/WAVE_STATE.json`을 생성·수정하지 않는다).
- `TASKS/WAVE_PLAN.md`에서 `WXX`의 Task 목록을 읽고, 현재 실제 상태(WAVE_STATE가 있으면 참고, 없으면 전부 READY로 가정) 기준으로 Depends On 순서를 계산한다.
- 그 순서대로 **각 Task마다 `/prepare-task WXX <TASK_ID>`를 실행**하되, 구현(`/implement-task`)은 절대 실행하지 않는다.
- 결과를 표로 보고한다: `순서 | Task ID | 예상 STATUS(READY_TO_IMPLEMENT/BLOCKED_*) | 사유`.
- 첫 번째로 `BLOCKED_*`가 나오는 지점까지만 "지금 실행하면 여기서 멈춘다"고 명확히 알린다(그 뒤 Task들은 "선행 Task 결과에 따라 달라짐"으로 표시하고 개별 사전 판정을 강행하지 않는다 — 순서상 아직 유효하지 않은 전제로 검사하지 않기 위함).

---

## 5. 공통 금지 사항

- **자동 Branch 생성, 자동 PR 생성, 자동 Merge는 `/run-wave`의 어떤 하위 단계에도 포함하지 않는다**(`CLAUDE.md` 규칙 21, `AUTO_MERGE=false`).
- Commit은 `implement-task`의 규칙을 그대로 따른다 — 기본적으로 수행하지 않고, 사용자가 명시적으로 요청한 경우에만 Task 단위로 1개씩 만든다. `/run-wave` 자체가 여러 Task를 연속 처리한다고 해서 자동으로 여러 커밋을 쌓지 않는다.
- `WAITING_FOR_PREVIEW`로 끝난 뒤에는 사람이 `/run-wave resume`(또는 명시적으로 다음 `/run-wave <다음 WAVE_ID>`)을 호출하기 전까지 다음 Wave를 시작하지 않는다.
- destructive Git 명령(`git reset --hard`, `git checkout -- .`, `git clean -f`, `git push --force`)을 사용하지 않는다(`CLAUDE.md` 규칙 20).

## 6. 완료/중단 보고 형식

```
COMMAND: /run-wave <입력>
RESULT: <WAITING_FOR_PREVIEW | WAVE_COMPLETE | BLOCKED_* | (status/resume/dry-run 전용 요약)>
WAVE: <WAVE_ID>
TASKS THIS RUN: <이번 호출에서 DONE으로 바뀐 Task ID 목록>
REMAINING IN WAVE: <아직 DONE이 아닌 Task ID 목록>
NEXT ACTION: <사람이 다음에 해야 할 일 한두 줄 — 예: "Preview 확인 후 /run-wave resume 실행">
```
