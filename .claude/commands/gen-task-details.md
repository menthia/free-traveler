---
description: TASKS/00_TASK_LIST.md의 각 Task에 대해 1:1 상세 파일(TASKS/TASK-<ID>.md)을 생성·갱신하고 자동 감사를 실행한다
---

`traveler-project-pipeline` Skill을 사용한다 — 아직 컨텍스트에 없다면 먼저 로드한다. 이 Command는 **계획 문서(Task 상세)만** 만든다. 구현 코드(`.ts`/`.tsx` 등)는 어떤 경우에도 작성하지 않는다.

## 0. 전제 조건

`TASKS/00_TASK_LIST.md`가 없으면 먼저 `/gen-tasklist`를 실행하라고 안내하고 멈춘다.

## 1. 실제 파일을 읽는다

- `TASKS/00_TASK_LIST.md`를 Read로 전체를 다시 읽어 Task ID·Category·Requirement Ref·Screen/Route/Page Entry·Depends On·Expected Files·AC·Verify를 파악한다(기억이나 이전 대화 요약에 의존하지 않는다).
- 현재 `src/app`, `src/data`, `supabase/` 등 실제 파일 트리를 다시 스캔한다(`python3 scripts/validate_inputs.py` 재실행으로 확인 가능). 이미 존재하는 파일은 Expected Files에 "(수정)", 없는 파일은 "(신규)"로 표기한다 — 스냅샷이 오래되었을 수 있으므로 추정하지 않는다.
- 각 Task ID에 대해 `TASKS/TASK-<ID>.md`가 이미 있는지 확인한다. **있으면 그 내용을 먼저 Read한다.**

## 2. 신규 생성 vs 갱신

- `TASKS/TASK-<ID>.md`가 **없으면**: §3의 14개 절 형식으로 새로 만든다.
- `TASKS/TASK-<ID>.md`가 **이미 있으면**: 같은 ID로 중복 파일을 만들지 않는다. `TASKS/00_TASK_LIST.md`의 해당 행(Requirement Ref, AC, Depends On 등)과 비교해 내용이 일치하면 그대로 두고, 달라졌으면 기존 파일을 갱신한다(전체 재작성이 아니라 바뀐 절만 고치는 것을 우선한다).

## 3. Task 상세 파일 형식 (14개 절, 이 순서)

```
Context / Project Scope / Requirement Ref / Screen · Route · Page Entry / Design Ref /
Depends On / Expected Files / Functional AC / Visual AC / Security-Privacy AC /
Test Cases / Verify / Definition of Done / Forbidden
```

- `Expected Files` 목록 밖의 파일은 언급하지 않는다. `Forbidden` 절에 "Expected Files 밖 파일 생성·수정 금지"와 "구현 코드 실행 결과 커밋/Branch/PR 생성 금지"를 반드시 포함한다.
- `Category`가 `DB`인 Task는 Skill §6의 6개 테이블 범위를 벗어나는 테이블명을 적지 않는다.
- `Category`가 `E2E_TEST`인 Task는 "Chromium"을 명시하고 Firefox/WebKit을 활성 대상으로 언급하지 않는다(Skill §9).

### Page Owner Task(5개) 작성 시 반드시 지킬 것 (Skill §5)

- Acceptance Criteria에 `design-reference/SCREEN_ROUTE_CONTRACT.json`의 해당 Screen `sections_order`를 순서 그대로 옮겨 적는다.
- Acceptance Criteria에 `design-reference/D-001/DESIGN.md` §17 기준 Section별 최소 콘텐츠 수를 명시한다.
- 큰 빈 영역과 Lorem ipsum/"준비 중"/"정보 확인 필요" 금지, 데이터 없음 상태에서도 설명+이용 방법+CTA를 갖춘 완성형 Empty State를 요구하는 AC를 최소 1개 포함한다.
- Expected Files는 해당 Page Entry(`src/app/**/page.tsx`) 자신으로 한정한다 — 하위 Component 파일을 새로 만든다고 적지 않는다(Page Owner는 조립만 한다).
- **SCR-001** Owner: Next.js Starter 콘텐츠 제거 AC 포함.
- **SCR-003** Owner: 항공·숙소·동행 3탭을 실제로 조립하는 AC 포함, 입력값을 서버·DB·URL·로그·분석으로 보내지 않는다는 제약 명시(Skill §7).
- **SCR-005** Owner: Guest·Member·Admin 3역할 상태를 실제로 조립하고 역할에 없는 탭은 렌더링하지 않는다는 AC 포함.

## 4. 작성 직후 자동 감사 실행 — 실패를 무시하지 않는다

모든 상세 파일을 쓰거나 갱신한 직후 반드시 실행한다.

```
python3 scripts/audit_tasks.py
```

- 종료 코드 1(`AUDIT_FAIL`)이면, 리포트의 각 `[FAIL]` 항목이 가리키는 정확한 `TASKS/TASK-<ID>.md`를 찾아 수정하고 **통과할 때까지 재실행한다.** FAIL을 "나중에 고치겠다"며 넘어가거나, 완료로 보고하지 않는다.
- 종료 코드 0(`AUDIT_PASS`)이 될 때까지 이 단계를 반복한다.
- 리포트는 `TASKS/TASK_AUDIT_REPORT.md`에, 평탄화 목록은 `TASKS/TASK_MANIFEST.csv`에 자동 저장된다 — 두 파일을 직접 편집하지 않는다.

## 5. 완료 보고

- 생성/갱신한 상세 파일 수(= `TASKS/00_TASK_LIST.md` 행 수와 정확히 일치해야 함)
- `scripts/audit_tasks.py` 최종 결과: `AUDIT_PASS (검사 수: 18)` 여부, 실패했다가 고쳐서 통과했다면 어떤 항목을 고쳤는지
- 이번 실행이 신규 생성인지 일부 갱신인지, 갱신이라면 어떤 Task ID가 바뀌었는지
