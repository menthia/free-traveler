---
description: Traveler 5-Screen 구현 Task List(TASKS/00_TASK_LIST.md)를 생성하거나 갱신한다
---

`traveler-project-pipeline` Skill을 사용한다 — 아직 컨텍스트에 없다면 먼저 로드한다. 이 Command는 **계획 문서(Task List)만** 만든다. 구현 코드(`.ts`/`.tsx` 등)는 어떤 경우에도 작성하지 않는다.

## 0. 항상 실제 파일을 읽는다

이 Command를 실행하는 동안 아래 문서의 내용을 **캐시나 기억에 의존하지 않고 매번 Read로 다시 읽는다.** 이전 대화에서 본 내용과 실제 파일이 다를 수 있다.

- `docs/06_SRS_UIUX_REVISED.md`(SRS 정본)
- `docs/PROJECT_SCOPE.md`(Scope 정본)
- `docs/UIUX_TRACEABILITY.md`(114개 Requirement ↔ Screen 추적표)
- `design-reference/D-001/DESIGN.md`(디자인 정본), `design-reference/UI_CONTRACT.md`
- `design-reference/SCREEN_ROUTE_CONTRACT.json`(Screen 정본)
- `TASKS/00_TASK_LIST.md`(존재하면 — 이번이 신규 생성인지 갱신인지 판단하는 기준)
- 현재 `src/app`, `src/data` 파일 트리(실제로 무엇이 있고 없는지)

## 1. 입력 검증을 먼저 실행한다

```
python3 scripts/validate_inputs.py
```

종료 코드가 0이 아니면 출력된 오류 목록을 그대로 사용자에게 보고하고 여기서 멈춘다. 오류를 임의로 해석해 넘어가거나 진행하지 않는다.

## 2. 신규 생성인지 갱신인지 판단한다

- `TASKS/00_TASK_LIST.md`가 **없으면**: §3~4에 따라 새로 만든다.
- `TASKS/00_TASK_LIST.md`가 **있으면**: 먼저 전체를 Read하고, 위 정본 문서와 대조해 달라진 부분만 갱신한다.
  - 이미 `TASKS/TASK-<ID>.md` 상세 파일이 있는 Task ID는 **임의로 삭제하거나 ID를 바꾸지 않는다.** Scope가 바뀌어 더 이상 필요 없다고 판단되면, 삭제 대신 사용자에게 보고하고 지시를 받는다(고아 상세 파일이 생기는 것을 방지).
  - Requirement 상태가 `docs/PROJECT_SCOPE.md`에서 바뀌었으면(IMPLEMENT↔EXCLUDED) 해당 Requirement Ref와 NON_IMPLEMENTATION 표를 함께 갱신한다.

## 3. Task 설계 규칙 (Skill 참고)

- SCR-001~005 각각에 `PAGE_OWNER` Task를 **정확히 1개**씩 둔다(Skill §5).
- 각 Page Owner는 같은 Screen의 `COMPONENT` Task 최소 1개에 `Depends On`으로 의존한다(Skill §5).
- 여행지·안전정보·대표 소개는 `DATA` Task로 만들고 DB 테이블을 쓰지 않는다(Skill §6).
- `DB` Task는 Skill §6의 6개 테이블(`USER_PROFILE`/`MATE_POST`/`MATE_APPLICATION`/`USER_BLOCK`/`REPORT`/`OUTBOUND_LINK_SETTING`) 범위 안에서만 만든다.
- `E2E_TEST` Task는 Chromium Smoke 2~3개로만 구성한다(Skill §9).
- EC2·AWS·자동 Merge에 해당하는 Task는 만들지 않는다(Skill §12).
- 114개 Requirement 전부에 `IMPLEMENT`/`IMPLEMENT(변형)`/`EXCLUDED` 상태가 있어야 하며, `EXCLUDED` Requirement는 어떤 Task의 Requirement Ref에도 넣지 않고 NON_IMPLEMENTATION 표에만 기록한다(Skill §3, §11).

## 4. 파일 작성

`TASKS/00_TASK_LIST.md`를 다음 형식 그대로(신규/갱신 모두) 작성한다 — 실제 현재 파일이 있다면 그 형식을 그대로 유지한다.

- 상단 요약(총 Task 수, Category별 개수, Requirement 커버리지 요약, COMPLETION STATUS)
- Category별 **A. 개요** 표: `Seq | Task ID | 제목 | Implementation Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Priority`
- Category별 **B. 상세** 표: `Task ID | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify`
- 문서 끝 **NON_IMPLEMENTATION** 표: `Requirement | 근거(제외 사유) | 후속 방향`

Task 상세 파일(`TASKS/TASK-<ID>.md`)은 이 단계에서 만들지 않는다 — `/gen-task-details`가 담당한다.

## 5. 완료 보고

- 총 Task 수, Category별 개수, Screen별 Task 수
- 5개 Page Owner Task ID
- 114개 Requirement 중 몇 개가 Task에 링크되었고 몇 개가 NON_IMPLEMENTATION으로 남았는지(0개 누락이어야 함)
- 신규 생성인지 갱신인지, 갱신이면 무엇이 바뀌었는지
- Task 개수(약 45~65개 참고치)는 통과/실패 기준이 아님을 재확인

이 Command 단독으로는 감사(`scripts/audit_tasks.py`)를 실행하지 않는다 — `/gen-task-details` 또는 `/audit-tasks`에서 수행한다.
