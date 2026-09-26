---
description: "Wave 단위로 Task를 순차 실행한다. 형식: /run-wave WXX [--status|--dry-run|--resume]"
---

`traveler-project-pipeline` Skill을 사용한다 — 아직 컨텍스트에 없다면 먼저 로드한다. 이 Command는 `/prepare-task`와 `/implement-task`를 Wave 단위로 반복 호출하는 오케스트레이터다. **자동 Branch 생성, 자동 PR 생성, 자동 Merge를 어떤 하위 동작으로도 포함하지 않는다.**

> **버전 참고**: 이 문서는 `scripts/build_waves.py`가 실제로 생성하는 `TASKS/WAVE_PLAN.md`/`TASKS/WAVE_STATE.json` 스키마에 맞춰 다시 작성되었다. 이전 버전은 `waves.<ID>.status`가 `READY/IN_PROGRESS/DONE/BLOCKED_*` 값을 쓰는 다른 스키마를 전제했었다 — 지금은 아래 §2의 스키마가 정본이다.

## 0. 입력과 지원 형식

| 입력 | 동작 |
|---|---|
| `/run-wave WXX` | 기본 실행. `WXX`의 `pending` Task를 배열 순서대로 하나씩 `/prepare-task` → `/implement-task`로 처리한다. |
| `/run-wave WXX --status` | `WXX`(생략 시 `WAVE_STATE.json`의 `current_wave`)의 현재 상태만 보고한다. 아무것도 바꾸지 않는다. |
| `/run-wave WXX --dry-run` | 실제 구현 없이 실행될 Task·Expected Files·최소 검증·Checkpoint 필요 여부만 미리 보여준다. 아무 파일도 바꾸지 않는다. |
| `/run-wave WXX --resume` | `WXX`에서 중단된 지점(첫 `pending` 또는 `blocked` Task)부터 같은 Wave 안에서 이어서 진행한다. |

`WAVE_ID`가 없으면(`--status`에 한해) `TASKS/WAVE_STATE.json`의 `current_wave`를 사용한다. 그 밖의 형식에서 `WAVE_ID`가 없으면 `BLOCKED_INPUT`으로 멈추고 어떤 Wave인지 물어본다.

---

## 1. 정본 파일

### `TASKS/WAVE_PLAN.md` — `scripts/build_waves.py`가 생성(이 Command는 읽기만 한다)

Wave 분할·순서는 `scripts/build_waves.py`가 `TASKS/TASK_MANIFEST.csv`의 의존성을 위상 정렬해 결정한다(`docs/DECISION_LOG.md` DEC-010에 따른 Wave 단위 원칙 자체는 사람이 정했지만, 실제 배정은 스크립트가 계산한다). 이 파일이 없으면 이 Command는 **아무 Task도 임의로 Wave에 배정하지 않는다** — 먼저 `python3 scripts/build_waves.py`를 실행해 달라고 요청하고 멈춘다.

```markdown
## W05 — SCR-001 메인 Component와 Page Owner
- Tasks: COMP-SCR001-HERO-SEARCH, COMP-SCR001-DESTINATION-DIRECTORY, ..., PAGE-SCR001
- Preview Checkpoint: true
```

- `Tasks`는 `TASKS/TASK_MANIFEST.csv`의 `wave_id` 열과 일치해야 한다(불일치하면 `BLOCKED_INPUT`).
- `Preview Checkpoint: true/false` 줄은 `TASKS/WAVE_STATE.json`의 `checkpoint_required`와 같은 값이어야 한다. 이 문서에서는 사람이 **실제 브라우저로 화면을 확인**한다는 의미를 분명히 하기 위해 이 값을 **Browser Checkpoint**라고 부른다(같은 개념, 같은 Boolean).

### `TASKS/WAVE_STATE.json` — 이 Command가 갱신

```json
{
  "schema_version": "traveler-wave-state-v1",
  "generated_at": "2026-09-26T00:00:00+00:00",
  "current_wave": "W05",
  "waves": [
    {
      "wave_id": "W05",
      "title": "SCR-001 메인 Component와 Page Owner",
      "task_ids": ["COMP-SCR001-HERO-SEARCH", "...", "PAGE-SCR001"],
      "status": "in_progress",
      "checkpoint_required": true,
      "checkpoint_result": "pending",
      "tasks": {
        "COMP-SCR001-HERO-SEARCH": "done",
        "PAGE-SCR001": "pending"
      }
    }
  ]
}
```

- **Wave 상태**(`waves[].status`): `pending`(아직 시작 안 함) / `in_progress`(진행 중) / `blocked`(Task 하나가 막혀 멈춤) / `completed`(모든 Task `done` + Checkpoint 요건 충족).
- **Checkpoint**: `checkpoint_required`(bool, `scripts/build_waves.py`가 Page Owner 포함 여부로 이미 계산해 둠) / `checkpoint_result`: `pending`(확인 대기) / `confirmed`(사람이 확인함) / `not_required`.
- **Task 상태**(`waves[].tasks.<TASK_ID>`): `pending` / `in_progress` / `blocked` / `done` / `failed`. `scripts/build_waves.py`는 `tasks` 필드를 만들지 않으므로, 이 Command가 해당 Wave에 처음 접근할 때 `task_ids` 전체를 `pending`으로 채워 넣는다(그 뒤로는 이 Command만 갱신한다).
- **`current_wave`(최상위 필드)**: `scripts/build_waves.py`가 생성하는 실제 파일에는 이 필드가 없다. 이 Command가 처음 어떤 Wave든 다루기 시작할 때 이 필드를 추가·갱신한다(`--status`에서 `WAVE_ID`를 생략할 때 이 값을 기본값으로 쓰기 위함). 아직 이 필드가 없는 상태에서 `--status`에 `WAVE_ID`도 없으면 "확인할 Wave를 지정해 주세요"라고 안내한다.
- 이 파일을 사람이 손으로 고치는 것은 막지 않지만, 이 Command는 실행할 때마다 항상 다시 Read해서 최신 상태를 신뢰한다(이전 판정을 메모리로 재사용하지 않는다).

### `TASKS/TASK_MANIFEST.csv`

`wave_id` 열로 각 Task가 어느 Wave에 속하는지, `depends_on` 열로 의존 관계를 확인한다. **Task 순서는 이 Command가 다시 계산하지 않는다** — `WAVE_STATE.json`의 `task_ids` 배열 순서를 그대로 따른다. 이 순서는 `scripts/build_waves.py`가 이미 의존성(및 파일 충돌 회피)을 지켜 정렬해 둔 결과다.

---

## 2. 공통 규칙 6가지

이 규칙은 `--status`/`--dry-run`을 포함해 이 Command의 모든 동작에 적용된다.

1. **이전 Wave가 `completed`가 아니면 시작하지 않는다.** `WAVE_STATE.json`의 `waves` 배열에서 대상 `WAVE_ID`보다 앞에 나오는 모든 Wave가 `status: completed`인지 확인한다. 하나라도 아니면 `BLOCKED_PRECEDING_WAVE`로 멈추고 어느 Wave가 막고 있는지 보고한다(`--dry-run`도 동일하게 이 시점에서 멈춘다. `--status`는 이 상태를 보고만 하고 별도로 막지 않는다).
2. **Task 하나가 `blocked`면 Wave를 `blocked`로 기록하고 멈춘다.** `/prepare-task`가 `READY_TO_IMPLEMENT`가 아닌 값을 반환하면, 그 Task를 `blocked`로, Wave 전체를 `blocked`로 기록한 뒤 **다른 Task로 건너뛰지 않고 즉시 중단**한다.
3. **Task마다 지정된 최소 검증을 실행한다.** `/implement-task`가 각 Task의 `Verify`(Unit Test/해당 시 Playwright)를 실행하고 보고한 결과를 그대로 신뢰한다. 하나라도 FAIL이면 그 Task를 `failed`로, Wave를 `blocked`로 기록하고 멈춘다(검증 실패를 무시하고 다음 Task로 넘어가지 않는다).
4. **Page Owner가 있는 Wave는 Browser Checkpoint를 요구한다.** `checkpoint_required: true`인 Wave는 모든 Task가 `done`이어도 `checkpoint_result`가 `confirmed`(또는 원래부터 `not_required`)가 되기 전까지 Wave 상태를 `completed`로 올리지 않는다.
5. **사람의 확인 전에는 다음 Wave를 자동 실행하지 않는다.** `--resume`으로 Browser Checkpoint를 확인 처리한 경우에도, 같은 호출 안에서 다음 `WAVE_ID`를 이어서 시작하지 않는다(§6에서 이전 버전과 달라진 부분 참고). 다음 Wave는 사람이 별도로 `/run-wave <다음 WAVE_ID>`를 호출해야 시작된다.
6. **자동 Commit·Push·PR·Merge를 하지 않는다.** Commit은 `/implement-task`의 규칙을 그대로 따른다 — 기본적으로 수행하지 않고, 사용자가 명시적으로 요청한 경우에만 Task 단위로 1개씩 만든다.

---

## 3. `/run-wave WXX --status`

- `TASKS/WAVE_STATE.json`(없으면 `TASKS/WAVE_PLAN.md` 존재 여부만)을 Read만 하고 아무것도 바꾸지 않는다.
- 대상 Wave의 `status`, `checkpoint_required`/`checkpoint_result`, Task별 상태(`pending`/`in_progress`/`blocked`/`done`/`failed`) 개수, 전체 Wave 중 `completed` 개수를 보고한다.
- `TASKS/WAVE_STATE.json`이 없으면 "아직 실행된 Wave가 없습니다"라고 보고한다.

## 4. `/run-wave WXX --dry-run`

- **어떤 파일도 쓰지 않는다**(`TASKS/WAVE_STATE.json`을 생성·수정하지 않는다).
- §2 규칙 1(이전 Wave `completed` 확인)을 먼저 검사한다. 걸리면 그 시점에서 멈추고 보고한다.
- `WXX`의 `task_ids` 배열 순서대로, **각 Task마다 `/prepare-task WXX <TASK_ID>`를 실행**하되 `/implement-task`는 절대 호출하지 않는다.
- Task별로 다음을 표로 보고한다: `순서 | Task ID | 예상 STATUS(READY_TO_IMPLEMENT/BLOCKED_*) | Expected Files | 최소 검증(Verify) | 이 Task 완료 후 Checkpoint 필요 여부`.
- 첫 번째 `BLOCKED_*`가 나오는 지점까지만 실제로 판정하고, 그 뒤 Task는 "선행 Task 결과에 따라 달라짐"으로 표시한다(아직 유효하지 않은 전제로 검사하지 않는다).

## 5. `/run-wave WXX` (기본 실행)

1. **선행 조건**: §2 규칙 1을 확인한다. 실패하면 `BLOCKED_PRECEDING_WAVE`로 멈춘다.
2. **읽기**: `TASKS/WAVE_PLAN.md`, `TASKS/WAVE_STATE.json`, `TASKS/TASK_MANIFEST.csv`를 Read한다. 대상 Wave가 `WAVE_STATE.json`에 아직 없으면 `task_ids`를 그대로 옮기고 `status: pending`, 모든 Task를 `pending`으로 초기화해 추가한다.
3. **Task 선택**: `task_ids` 배열에서 아직 `done`이 아닌 첫 Task 하나를 고른다(배열 순서를 그대로 따르고 재정렬하지 않는다 — §1 참고).
   - 남은 Task가 없으면 6번(Wave 완료 판정)으로 간다.
4. **검사**: 선택한 Task에 대해 `/prepare-task WXX <TASK_ID>`를 실행한다.
   - `READY_TO_IMPLEMENT`가 아니면 규칙 2에 따라 그 Task를 `blocked`, Wave를 `blocked`로 기록하고 **여기서 멈춘다.**
5. **구현과 검증**: Task를 `in_progress`로 표시하고 `/implement-task WXX <TASK_ID>`를 실행한다. 보고된 검증 결과가 전부 PASS면 규칙 3에 따라 `done`으로 기록하고 3번으로 돌아간다. 하나라도 FAIL이면 규칙 3에 따라 `failed`, Wave를 `blocked`로 기록하고 **멈춘다.**
6. **Wave 완료 판정**: 모든 Task가 `done`이면 규칙 4를 적용한다.
   - `checkpoint_required: false`(Browser Checkpoint 불필요) → `checkpoint_result: not_required`, Wave `status: completed`로 기록하고 `WAVE_COMPLETE`로 종료한다.
   - `checkpoint_required: true` → `checkpoint_result: pending`으로 두고(Wave `status`는 아직 `completed`로 올리지 않는다) `WAITING_FOR_BROWSER_CHECKPOINT`로 종료한다. 다음 Wave로 자동 진행하지 않는다(규칙 5).

## 6. `/run-wave WXX --resume`

1. `TASKS/WAVE_STATE.json`에서 `WXX`를 찾는다. 없으면 "이어갈 상태가 없습니다. `/run-wave WXX` 또는 `/run-wave WXX --dry-run`부터 시작하세요"라고 안내하고 멈춘다.
2. `WXX`의 상태에 따라 분기한다.
   - **`status: blocked` 또는 (`in_progress`이고 아직 `done`이 아닌 Task가 있음)** — 첫 `pending` 또는 `blocked` Task부터 §5의 3번(Task 선택)부터 다시 시작한다. 이전에 `blocked`/`failed`였던 Task도 **`/prepare-task`로 처음부터 다시 검사한다**(막혔던 이유가 여전히 유효한지 확인하기 위해 이전 판정을 재사용하지 않는다).
   - **모든 Task가 `done`이고 `checkpoint_required: true`이고 `checkpoint_result: pending`** — 사람이 `--resume`을 직접 호출했다는 것 자체를 **Browser Checkpoint 확인 완료 신호**로 간주해 `checkpoint_result: confirmed`, Wave `status: completed`로 갱신한다. **여기서 멈춘다** — 규칙 5에 따라 다음 Wave를 이어서 실행하지 않는다. 종료 보고의 "다음에 입력할 명령"에 다음 `WAVE_ID`로 `/run-wave <다음 WAVE_ID>`를 직접 호출하라고 안내한다.
   - **이미 `status: completed`** — "이미 완료된 Wave입니다"라고 보고하고, `TASKS/WAVE_PLAN.md` 순서상 다음 `WAVE_ID`를 안내한 뒤 멈춘다.

> 이전 버전과의 차이: 이전 `run-wave.md`는 Checkpoint 확인 직후 같은 호출 안에서 다음 Wave를 자동으로 이어 실행했다. 규칙 5("사람의 확인 전에는 다음 Wave를 자동 실행하지 않는다")를 문자 그대로 지키기 위해 이번 버전은 **Checkpoint를 확인하는 호출과 다음 Wave를 시작하는 호출을 항상 분리**한다.

---

## 7. 공통 금지 사항

- **자동 Branch 생성, 자동 PR 생성, 자동 Merge는 어떤 하위 단계에도 포함하지 않는다**(`CLAUDE.md` 규칙 21, `AUTO_MERGE=false`).
- `--resume`으로 Checkpoint를 확인 처리하더라도 같은 호출에서 다음 Wave를 시작하지 않는다(규칙 5, §6 참고).
- destructive Git 명령(`git reset --hard`, `git checkout -- .`, `git clean -f`, `git push --force`)을 사용하지 않는다(`CLAUDE.md` 규칙 20).
- `--dry-run`/`--status`는 `TASKS/WAVE_STATE.json`을 포함해 어떤 파일도 수정하지 않는다.

## 8. 종료 보고 형식

```
COMMAND: /run-wave <입력>
RESULT: <WAITING_FOR_BROWSER_CHECKPOINT | WAVE_COMPLETE | BLOCKED_PRECEDING_WAVE | BLOCKED_INPUT | BLOCKED_* | (status/dry-run 전용 요약)>
WAVE: <WAVE_ID>

[완료 Task]
<이번 호출에서 done으로 바뀐 Task ID 목록>

[변경 파일]
<이번 호출에서 실제로 생성·수정된 파일 목록 — 각 Task의 Expected Files를 합친 것, git status로 재확인>

[통과한 검사]
<각 Task의 Verify 항목과 결과(PASS) — 예: "PAGE-SCR001: E2E-PUBLIC-SMOKE PASS, MANUAL-RESPONSIVE-CHECK PASS(사람 확인 필요)">

[남은 수동 Browser 확인]
<checkpoint_required: true이며 아직 confirmed되지 않은 Wave와 그 이유 — 없으면 "없음">

[다음에 입력할 명령]
<사람이 다음에 입력해야 할 명령 한 줄 — 예: "/run-wave W05 --resume" 또는 "/run-wave W06">
```
