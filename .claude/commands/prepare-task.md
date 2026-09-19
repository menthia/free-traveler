---
description: WAVE_ID/TASK_ID를 받아 구현 착수 가능 여부를 8개 항목으로 점검하고 단일 상태 코드로 판정한다(코드 수정 없음)
---

`traveler-project-pipeline` Skill을 사용한다 — 아직 컨텍스트에 없다면 먼저 로드한다. 이 Command는 **판정만** 한다. 어떤 이유로도 소스 코드(`.ts`/`.tsx` 등)나 `TASKS/00_TASK_LIST.md`/`TASKS/TASK-<ID>.md`를 고치지 않는다. 검사 중 발견한 문제를 자동으로 고쳐서 통과시키지 않는다.

## 입력

- `WAVE_ID` — 예: `W01`
- `TASK_ID` — 예: `PAGE-SCR001`
- 선택된 상세 Task 파일 — `TASKS/TASK-<TASK_ID>.md`(입력에 경로가 따로 주어지지 않으면 이 규칙으로 유도한다)

세 입력 중 하나라도 없으면 그 자체로 `BLOCKED_INPUT`이다(§2 참고).

## 0. 항상 실제 파일을 읽는다

`TASKS/00_TASK_LIST.md`, `TASKS/TASK-<TASK_ID>.md`, `TASKS/TASK_MANIFEST.csv`, `docs/PROJECT_SCOPE.md`, `docs/06_SRS_UIUX_REVISED.md`, `design-reference/D-001/DESIGN.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`, 그리고 Wave 정의 자료(있다면)를 매번 Read/Bash로 다시 확인한다. 이전 대화 요약이나 기억으로 판정하지 않는다.

## 1. 검사 8개와 판정 우선순위

아래 순서대로 검사하고, **가장 먼저 실패하는 항목의 상태를 최종 출력으로 확정한다**(뒤 항목은 참고용으로 계속 점검해 보고서에는 함께 남기되, 상태 값 자체는 하나만 낸다).

| 순서 | 검사 | 실패 시 상태 |
|---|---|---|
| 1 | 입력 유효성(WAVE_ID·TASK_ID·상세 파일 존재) | `BLOCKED_INPUT` |
| 2 | Task가 현재 Wave(WAVE_ID)에 포함되는지 | `BLOCKED_INPUT` |
| 3 | Working Tree 상태 | `BLOCKED_DIRTY_TREE` |
| 4 | Depends On 완료 여부 | `BLOCKED_DEPENDENCY` |
| 5 | Expected Files 정합성 | `BLOCKED_INPUT` |
| 6 | SRS·Scope·Design·Screen Ref 유효성 | `BLOCKED_INPUT` |
| 7 | EXCLUDED 범위 침범 여부 | `BLOCKED_SCOPE` |
| 8 | 환경변수·Secret 위험(정보성, 단독으로 차단하지 않음 — 예외는 §1.7) | 상태에 부기 |

### 1.1 입력 유효성

- `TASKS/00_TASK_LIST.md`와 `TASKS/TASK-<TASK_ID>.md`가 실제로 존재하는지 확인한다.
- `TASK_ID`가 `TASKS/00_TASK_LIST.md`의 A.개요 표에 실제로 있는지 확인한다.
- 형식이 어긋나거나(예: `TASK_ID`가 `TASK-` 접두사를 이중으로 포함) 파일이 없으면 `BLOCKED_INPUT`.

### 1.2 Wave 포함 여부

- Wave 정의 자료(`TASKS/WAVE_PLAN.md` — `/run-wave` Command가 정의하는 정본 형식)를 찾는다.
- `TASKS/WAVE_PLAN.md` 자체가 없으면 — 임의로 "포함된다"고 가정하지 않는다. **`BLOCKED_INPUT`**으로 판정하고, "WAVE_ID의 Task 구성을 `TASKS/WAVE_PLAN.md`에 먼저 정의해야 한다"고 보고한다.
- `TASKS/WAVE_PLAN.md`가 있으면 `TASK_ID`가 `WAVE_ID`의 `Tasks` 목록에 포함되는지 확인한다. 포함되지 않으면 `BLOCKED_INPUT`(잘못된 Wave/Task 조합).
- `TASKS/WAVE_STATE.json`이 있으면 함께 Read해 이 Task의 현재 상태를 보고에 참고 정보로 덧붙인다(이 Command는 WAVE_STATE를 갱신하지 않는다 — 갱신은 `/run-wave`의 책임이다).

### 1.3 Working Tree 상태

```
git status --porcelain
```

- 출력이 비어 있지 않으면(추적되지 않은 파일 포함) 원칙적으로 `BLOCKED_DIRTY_TREE`다.
- 예외: `TASKS/00_TASK_LIST.md`, `TASKS/TASK-*.md`, `TASKS/TASK_MANIFEST.csv`, `TASKS/TASK_AUDIT_REPORT.md`처럼 파이프라인 자체가 만든 계획 문서만 변경되어 있는 경우는 dirty로 보지 않는다(코드 변경 없음이 확인되면 통과).
- 이 Task와 무관한 코드 변경이 남아 있으면 어떤 이전 작업의 흔적인지 사용자에게 보고하고 `BLOCKED_DIRTY_TREE`로 판정한다. 이 Command가 임의로 `git stash`/`git checkout`/`git reset` 등으로 정리하지 않는다.

### 1.4 Depends On 완료 여부

- `TASKS/TASK-<TASK_ID>.md`의 `Depends On` 절에 나열된 각 Task ID에 대해, 그 Task의 `TASKS/TASK-<DEP_ID>.md` `Expected Files` 절에 적힌 파일들이 실제로 존재하는지 확인한다(현재 이 저장소에 별도의 Task 완료 상태 원장이 없으므로, Expected Files 실재 여부를 완료의 대리 지표로 사용한다).
- 하나라도 Expected Files가 존재하지 않으면 그 의존 Task는 미완료로 보고 `BLOCKED_DEPENDENCY`.
- Depends On이 `—`(없음)이면 이 검사는 통과로 간주한다.

### 1.5 Expected Files 정합성

- 대상 Task의 `Expected Files`를 읽고, "(신규)" 표시 파일이 이미 존재한다면(이미 다른 작업으로 채워졌을 가능성) 경고로 보고한다.
- "(수정)" 표시 파일이 존재하지 않으면 전제가 어긋난 것이므로 `BLOCKED_INPUT`으로 판정하고 어떤 선행 Task가 먼저 그 파일을 만들어야 하는지 안내한다.
- Expected Files 목록이 비어 있으면 `BLOCKED_INPUT`.

### 1.6 SRS·Scope·Design·Screen Ref 유효성

- `Requirement Ref`에 적힌 REQ ID가 `docs/06_SRS_UIUX_REVISED.md`/`docs/PROJECT_SCOPE.md`에 실제로 존재하는지 확인한다.
- `Screen / Route / Page Entry`가 `design-reference/SCREEN_ROUTE_CONTRACT.json`의 값과 일치하는지 확인한다(Page Owner Task는 완전 일치, Component/기타 Task는 Screen 값만 확인).
- `Design Ref`가 가리키는 절(`design-reference/D-001/DESIGN.md` §번호 등)이 실제로 그 문서에 존재하는지 확인한다.
- 하나라도 존재하지 않거나 다른 값으로 바뀌어 있으면(정본 문서가 먼저 개정된 경우) `BLOCKED_INPUT`으로 판정하고, Task 상세 파일을 `/gen-task-details`로 먼저 갱신해야 한다고 안내한다.

### 1.7 EXCLUDED 범위 침범 여부

- `Requirement Ref`의 REQ ID 중 `docs/PROJECT_SCOPE.md` 기준 `EXCLUDED`인 것이 있으면 `BLOCKED_SCOPE`.
- Functional AC/Expected Files가 알려진 EXCLUDED 범위(CMS 관리자 CRUD, 감사 로그, 실시간 성능/SLA 측정, EC2·AWS, 자동 Merge, Prisma/ORM 등 `CLAUDE.md` 규칙 16·17·19)에 해당하는 내용을 새로 요구하면 `BLOCKED_SCOPE`.
- `TASKS/00_TASK_LIST.md`의 NON_IMPLEMENTATION 표에 있는 REQ ID가 이 Task의 Requirement Ref에 등장하면 즉시 `BLOCKED_SCOPE`.

### 1.8 환경변수·Secret 위험(정보성)

- Task 설명·AC·Expected Files에서 필요한 환경변수 이름을 추출한다(예: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `FLIGHT_OUTBOUND_URL`, `HOTEL_OUTBOUND_URL` — `docs/ARCHITECTURE.md` §11.3 참고).
- `.env.example`/`.env.local` 존재 여부와 위 변수들이 실제로 정의되어 있는지 확인한다. 없으면 목록으로 보고한다(차단 사유는 아니다. 단, Task가 해당 값 없이는 최소 동작조차 검증할 수 없다고 판단되면 §1.1 수준으로 올려 `BLOCKED_INPUT`으로 승격할 수 있다 — 이 경우 왜 승격했는지 명시한다).
- `SUPABASE_SERVICE_ROLE_KEY`가 Client Component/브라우저 번들 코드 경로(Expected Files 중 `"use client"` 대상 파일)에 필요하다고 적혀 있으면 이는 `CLAUDE.md` 규칙 15 위반 소지이므로 **즉시 `BLOCKED_SCOPE`**로 판정한다.
- 기존 저장소에 이미 하드코딩된 것으로 보이는 비밀값 패턴(예: `sk_live_`, `eyJhbGciOi` 형태의 JWT 원문, `service_role`과 함께 등장하는 실제 키 문자열)이 이 Task가 손댈 Expected Files 안에 이미 존재하면, 정보성에 머무르지 않고 **`BLOCKED_INPUT`**으로 승격해 그 파일과 라인을 정확히 짚어 보고한다.

## 2. 출력 — 다섯 상태 중 정확히 하나

```
READY_TO_IMPLEMENT
BLOCKED_INPUT
BLOCKED_DEPENDENCY
BLOCKED_DIRTY_TREE
BLOCKED_SCOPE
```

- 8개 검사를 모두 마친 뒤, §1 표의 우선순위에 따라 **가장 먼저 발생한 실패 하나만** 최종 상태로 낸다. 여러 검사가 동시에 실패해도 상태 값은 하나다(단, 보고서에는 발견한 모든 문제를 함께 적는다).
- 모든 검사를 통과하면 `READY_TO_IMPLEMENT`. 이때도 §1.8에서 발견한 필요 환경변수 목록·주의사항은 함께 보고한다(구현을 막지는 않되 반드시 알린다).

## 3. 보고 형식

```
STATUS: <다섯 상태 중 하나>
WAVE_ID: <입력값>
TASK_ID: <입력값>
DETAIL_FILE: TASKS/TASK-<TASK_ID>.md

[검사 결과]
1. Working Tree: <PASS|FAIL 사유>
2. Wave 포함: <PASS|FAIL 사유>
3. Depends On: <PASS|FAIL 사유 — 미완료 Task ID 목록>
4. Expected Files: <PASS|FAIL 사유>
5. SRS/Scope/Design/Screen Ref: <PASS|FAIL 사유>
6. 필요 환경변수: <목록, 정의 여부>
7. Secret 위험: <발견 없음 | 발견 내용과 위치>
8. EXCLUDED 범위: <PASS|FAIL 사유 — 침범 REQ ID>

[다음 행동]
<STATUS별로 사람이 취해야 할 다음 행동 한두 줄>
```

`BLOCKED_*` 상태일 때 "다음 행동"에는 반드시 무엇을 먼저 해결해야 `READY_TO_IMPLEMENT`가 되는지(예: 어떤 선행 Task를 끝내야 하는지, 어떤 파일을 커밋/정리해야 하는지, Wave 정의를 어디에 추가해야 하는지) 구체적으로 적는다. 이 Command가 그 해결을 대신 수행하지 않는다.
