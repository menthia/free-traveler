# Free Traveler — Root Agent Rules

이 파일은 `traveler/app`(실제 개발 루트, `docs/DECISION_LOG.md` DEC-001)에서 작업하는 모든 Agent가 지켜야 할 규칙을 담은 자기완결 문서다. 다른 Agent 규칙 파일을 참조하지 않는다. `AGENTS.md`는 `next dev`가 자체적으로 재생성하는 별도 파일이며, 이 문서의 규칙과 무관하게 그대로 둔다.

---

## Harness Marker

```
HARNESS_SCHEMA=traveler-screen-route-v1
DESIGN_PATH=design-reference/D-001/DESIGN.md
SCREEN_CONTRACT=design-reference/SCREEN_ROUTE_CONTRACT.json
PROJECT_SCOPE=docs/PROJECT_SCOPE.md
PLAYWRIGHT_ENABLED=true
PLAYWRIGHT_SCOPE=chromium-smoke
AUTO_MERGE=false
AWS_ENABLED=false
```

---

## 필수 규칙

1. **작업 전 확인**: 코드를 작성하기 전 `package.json`(의존성·버전)과 `node_modules/next/dist/docs/`의 현재 Next.js 문서를 확인한다. 이 저장소의 Next.js 버전은 학습 데이터와 API·컨벤션이 다를 수 있다.
2. **SRS 정본**은 `docs/06_SRS_UIUX_REVISED.md`다. `docs/02_SRS_BASELINE.md`의 Requirement는 유지되지만, Route·화면 구조는 `06_SRS_UIUX_REVISED.md`가 최신이다.
3. **Scope 분류 정본**은 `docs/PROJECT_SCOPE.md`다. 어떤 Requirement가 IMPLEMENT인지 EXCLUDED인지는 이 문서를 따른다.
4. **디자인 정본**은 `design-reference/D-001/DESIGN.md`다(`Status: LOCKED`, `design-reference/DESIGN_MANIFEST.md` 참고). `design-reference/vendor/airbnb/DESIGN.md`는 구조 참고용일 뿐 정본이 아니다.
5. **Screen 정본**은 `design-reference/SCREEN_ROUTE_CONTRACT.json`이다. Screen ID·Route·Page Entry·Section 순서가 다른 문서와 상충하면 이 JSON을 따른다.
6. **`/run-wave WXX`**를 표준 개발 명령으로 사용한다. Wave 단위 밖에서 임의로 Task를 골라 구현하지 않는다.
7. Wave 내부 Task는 `TASKS/TASK_MANIFEST.csv`의 `depends_on` 순서를 지켜 **한 번에 하나만** 구현한다. 의존 Task가 끝나지 않은 Task를 먼저 시작하지 않는다.
8. 현재 진행 중인 `TASKS/TASK-<ID>.md`의 **Expected Files 목록 밖의 파일은 수정하지 않는다.**
9. **Page Owner** Task(`PAGE-SCR001~005`)는 Page Entry(`src/app/**/page.tsx`)에서 이미 만들어진 Component/Data/API를 **실제로 조립**한다. Page Owner Task 안에서 새 Component 파일을 만들지 않는다.
10. **SCR-001** 완료 시 `src/app/page.tsx`의 Next.js 기본 Starter 콘텐츠(Next.js 로고, "Templates" 링크 등)를 제거한다.
11. **SCR-003**(`/travel-tools`)은 항공·숙소·동행 구하기 **3개 탭을 모두** 조립한다. 탭만 만들고 내용을 비워두지 않는다.
12. 항공·숙소 조건 입력값(국가·지역·날짜)은 **서버·DB·URL 쿼리·로그·분석 이벤트 어디로도 보내지 않는다.** Client Component의 일시 상태로만 유지한다.
13. Supabase 쓰기는 **Auth(회원가입·로그인·성인 확인)·동행(모집글·참가 요청·차단)·신고·외부 URL 설정** 범위로 제한한다. 그 밖의 새 쓰기 대상을 임의로 추가하지 않는다.
14. RLS를 우회하는 Client 코드를 작성하지 않는다(예: RLS 없는 테이블 직접 접근, 조건 없는 `select *` 남용).
15. **Service Role Key를 Client 코드·클라이언트 번들에 절대 포함하지 않는다.** 서버 전용 환경변수로만 사용한다(필요 시).
16. 여행지·국가별 안전정보·대표(`free_traveler`) 소개는 **`src/data`의 정적 TypeScript Data**를 사용한다. 이 콘텐츠를 위한 DB 테이블이나 관리자 CRUD 화면을 만들지 않는다.
17. **Prisma·다른 ORM·AWS·EC2를 추가하지 않는다.** Supabase JS Client(`@supabase/supabase-js`, `@supabase/ssr`)를 직접 사용한다.
18. Playwright는 **핵심 Smoke만** 작성한다(Chromium 단일 브라우저, `PLAYWRIGHT_SCOPE=chromium-smoke`). 다중 브라우저 매트릭스나 회귀 스위트를 확장하지 않는다.
19. `docs/PROJECT_SCOPE.md`·`TASKS/00_TASK_LIST.md`의 NON_IMPLEMENTATION 표에서 **EXCLUDED로 표시된 기능을 임의로 구현하지 않는다.**
20. `git reset --hard`, `git checkout -- .`, `git clean -f`, `git push --force` 등 **destructive Git 명령을 사용자 승인 없이 임의로 사용하지 않는다.**
21. **자동 PR 생성·자동 Merge를 실행하지 않는다**(`AUTO_MERGE=false`). PR과 Merge는 사람이 수행한다(`docs/DECISION_LOG.md` DEC-012).
22. 화면 하나(Wave)를 완료하면 **사람의 Preview 확인을 받은 뒤에만** 다음 화면 Wave로 진행한다. 확인 없이 연속으로 여러 Wave를 이어서 구현하지 않는다.
23. 작업 완료 시 **변경한 파일 목록, 검증 결과(Unit/Playwright/Diff), 남은 제한사항**을 보고한다. 확인하지 않은 것을 완료로 보고하지 않는다.

---

## Task 완료 순서

```
Task 읽기 → 입력 확인 → 구현 → 관련 포맷·Unit Test → 필요 시 Playwright → Diff 확인 → 완료 보고
```

1. **Task 읽기**: `TASKS/TASK-<ID>.md`의 Context, Requirement Ref, Design Ref, Depends On, Expected Files, Functional/Visual/Security AC를 모두 읽는다.
2. **입력 확인**: Depends On Task가 완료되어 있는지, 참조하는 정본 문서(Harness Marker의 `DESIGN_PATH`/`SCREEN_CONTRACT`/`PROJECT_SCOPE`)가 최신인지 확인한다.
3. **구현**: Expected Files 목록 안에서만 코드를 작성한다.
4. **관련 포맷·Unit Test**: `tsc --noEmit`, `next lint`, 해당 Task의 Test Cases에 대응하는 Vitest를 실행한다.
5. **필요 시 Playwright**: Task가 E2E 대상이면 Chromium Smoke를 실행한다(불필요하면 생략).
6. **Diff 확인**: `git status`/`git diff`로 Expected Files 밖의 변경이 없는지 확인한다.
7. **완료 보고**: 변경 파일, 테스트 결과, 남은 제한사항을 규칙 23에 따라 보고한다.
