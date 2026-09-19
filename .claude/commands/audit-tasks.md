---
description: Task List와 상세 파일의 정합성·Skill 규칙 준수를 감사하고 리포트를 출력한다(18개 검사)
---

`traveler-project-pipeline` Skill을 사용한다 — 아직 컨텍스트에 없다면 먼저 로드한다. 이 Command는 **감사만** 수행한다. 구현 코드는 물론, Task List나 Task 상세 파일도 이 Command 안에서 직접 고치지 않는다(FAIL을 통과시키려고 파일을 수정하지 않는다).

## 1. 실제 산출물을 읽고 감사를 실행한다

```
python3 scripts/audit_tasks.py
```

- 실행 전 `TASKS/00_TASK_LIST.md` 존재 여부를 확인한다. **없으면** 스크립트가 "아직 Task List가 생성되지 않았습니다" 안내만 출력하고 종료 코드 0으로 끝난다 — 이것은 감사 통과가 아니라 **감사 대상이 없다는 뜻**이다. 이 경우 `AUDIT_PASS`로 보고하지 말고, 사용자에게 `/gen-tasklist`부터 실행하라고 안내한 뒤 멈춘다.
- `TASKS/00_TASK_LIST.md`와 `TASKS/TASK-*.md`는 스크립트가 직접 다시 읽으므로, 이 Command를 실행하는 Agent도 스크립트 출력만 보지 말고 실패가 보고된 파일은 실제로 Read해서 맥락을 확인한다.

## 2. 18개 검사 항목

스크립트 출력을 그대로 사용자에게 보여주고, 아래 대응표로 각 번호가 무엇을 검사하는지 설명을 덧붙인다.

| # | 검사 |
|---|---|
| 1 | Task List 구현 ID와 상세 Task 파일 1:1 |
| 2 | 중복 Task ID 0 |
| 3 | Depends On 누락(존재하지 않는 Task 참조) 0 |
| 4 | Dependency Cycle 0 |
| 5 | Screen 5개(SCR-001~005) 모두 Page Owner 정확히 1개 |
| 6 | Page Owner의 Route·Page Entry·Expected Files가 SCREEN_ROUTE_CONTRACT.json과 일치 |
| 7 | Component-only Screen 0(Page Owner 없이 Component만 있는 Screen 없음) |
| 8 | SCR-001 Starter 제거 AC 존재 |
| 9 | SCR-003 세 탭(항공·숙소·동행) 조립 AC 존재 |
| 10 | SCR-005 역할별(Guest·Member·Admin) 상태 조립 AC 존재 |
| 11 | DB Schema·RLS·Access·Seed Task 존재 |
| 12 | DB Table 범위가 기본 테이블 집합을 크게 넘지 않음 |
| 13 | 외부 입력(항공·숙소) 비저장 AC 존재 |
| 14 | Auth·성인 확인·기본 RLS AC 존재 |
| 15 | Playwright Chromium Smoke Task 존재 |
| 16 | AWS·EC2·자동 Merge를 활성 구현 대상으로 삼는 Task 0 |
| 17 | REQ-FUNC 80개 + REQ-NF 34개 전부가 Task 또는 NON_IMPLEMENTATION 표에 존재 |
| 18 | EXCLUDED Requirement에 대한 상세 구현 파일 미생성 |

## 3. FAIL 처리 — 실패를 무시하지 않는다

- `FAIL`이 하나라도 있으면 **절대 "감사 통과"나 "완료"로 보고하지 않는다.**
- 각 FAIL 메시지가 가리키는 정확한 Task ID와 상세 파일 경로(`TASKS/TASK-<ID>.md`, 필요하면 `TASKS/00_TASK_LIST.md`의 해당 행)를 사용자에게 짚어준다.
- 이 Command 자체는 파일을 고치지 않는다 — 수정은 `/gen-task-details`를 다시 실행하거나 사람이 직접 해당 파일을 고치도록 안내한다.
- 같은 FAIL이 반복되면(예: 이전에도 동일 항목이 실패했는데 그대로라면) 그 사실을 명시적으로 알린다 — 조용히 재확인만 반복하지 않는다.

## 4. PASS 처리

- FAIL 없이 종료 코드 0(`AUDIT_PASS (검사 수: 18)`)일 때만 "Task 생성 Pipeline 감사 통과"를 선언한다.
- `TASKS/TASK_MANIFEST.csv`(전체 Task 평탄화 목록)와 `TASKS/TASK_AUDIT_REPORT.md`(이번 감사 리포트)가 갱신되었음을 안내한다.
- 다음 단계로 Wave 단위 구현 착수(`CLAUDE.md` 규칙 6 `/run-wave WXX`, Skill §10)를 제안한다 — 이 Command가 구현을 대신 시작하지는 않는다.
