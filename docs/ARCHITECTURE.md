# Free Traveler — Architecture

- **Document ID:** ARCH-TRAVEL-001
- **기반 문서:** `package.json`, `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`, `design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`, `TASKS/TASK_MANIFEST.csv`
- **작성일:** 2026-09-20
- **상태:** Architecture Baseline — 구현 경계 정의(코드 작성 아님)

---

## 1. 목적과 범위

이 문서는 Free Traveler(`app/`)가 **무엇으로 만들어지고 무엇으로 만들어지지 않는지**를 확정한다. 기능 요구사항(`docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`)과 승인된 UI/UX 계약(`design-reference/`), 그리고 실제 Task 목록(`TASKS/TASK_MANIFEST.csv`)이 이미 정의한 경계를 하나의 아키텍처 문서로 통합한다. 이 문서는 구현 코드를 작성하지 않으며, 새로운 기능·화면·요구사항을 추가하지 않는다.

---

## 2. 기술 스택

`package.json` 기준 현재 스택은 다음과 같다.

| 영역 | 기술 | 근거 |
|---|---|---|
| 프레임워크 | **Next.js 16 (App Router)** | `package.json` dependencies: `next` |
| 언어 | **TypeScript** | `package.json` devDependencies: `typescript`, `tsconfig.json` |
| UI 런타임 | React 19 | `package.json` dependencies: `react`, `react-dom` |
| 스타일 | Tailwind CSS 4 | `package.json` devDependencies: `tailwindcss`, `@tailwindcss/postcss` |
| Lint | ESLint 9 | `package.json` devDependencies: `eslint`, `eslint-config-next` |

App Router를 사용하므로 모든 화면은 `src/app/**/page.tsx` 파일로 라우팅되며, `pages/` 디렉터리 기반 라우팅은 사용하지 않는다.

---

## 3. 화면 구조: 핵심 4개 · 보조 1개

`design-reference/UI_CONTRACT.md` §0과 `design-reference/SCREEN_ROUTE_CONTRACT.json`의 `screen_role_summary`(core_count=4, supporting_count=1)를 그대로 따른다.

| 구분 | Screen | Route | Page Entry |
|---|---|---|---|
| 핵심 | SCR-001 | `/` | `src/app/page.tsx` |
| 보조 | SCR-002 | `/about` | `src/app/about/page.tsx` |
| 핵심 | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` |
| 핵심 | SCR-004 | `/mates` | `src/app/mates/page.tsx` |
| 핵심 | SCR-005 | `/account` | `src/app/account/page.tsx` |

5개 Page Entry 외에 여행지 상세(`/destinations/[slug]`), 안전정보 상세(`/safety/[countryCode]`), 동행 상세(`/mates/[id]`) 같은 별도 라우트는 만들지 않는다 — 각각 SCR-001의 Drawer/Modal, SCR-004의 상세 패널로 통합되어 있다(`docs/06_SRS_UIUX_REVISED.md` §1).

---

## 4. Rendering 모델: Server Component와 Client Component

기본값은 **Server Component**이며, 다음 조건 중 하나에 해당할 때만 파일 최상단에 `"use client"`를 선언해 Client Component로 만든다.

| Client Component가 필요한 경우 | 해당 영역 |
|---|---|
| 브라우저 상태(`useState`/`useReducer`)를 유지해야 하는 폼 | 항공·숙소 조건 입력 Form(§5), 동행 작성 Form |
| 사용자 인터랙션(클릭·탭 전환·Drawer 열고 닫기)을 처리해야 하는 UI | 여행지/안전정보 Drawer, SCR-003 탭바, Chip 필터 |
| `localStorage`에 접근해야 하는 UI | 즐겨찾기 토글(SCR-001), 즐겨찾기 목록(SCR-005 내 활동) |
| Supabase Browser Client로 세션을 읽어야 하는 UI | 로그인 상태에 따라 달라지는 Header 계정 버튼, SCR-005 역할별 탭 |

다음은 **Server Component**로 유지한다.

| Server Component로 유지하는 경우 | 해당 영역 |
|---|---|
| `src/data`의 정적 데이터를 읽어 렌더링만 하는 목록/상세 콘텐츠 | 여행지 Card, 안전정보 Card, 대표 소개 콘텐츠(§6) |
| 5개 `page.tsx` 자체(Page Owner) | 하위 Client Component를 조립하는 최상위 진입점 |
| Supabase Server Client로 초기 데이터를 가져오는 목록 | SCR-004 동행글 목록 초기 로드(이후 상호작용은 Client Component에 위임) |

5개 Page Entry(`page.tsx`)는 원칙적으로 Server Component로 두고, 인터랙션이 필요한 하위 조각만 Client Component로 분리해 조립한다(`design-reference/UI_CONTRACT.md`의 화면별 "주요 Component" 구성과 일치).

---

## 5. 항공·숙소 입력 폼: Client Component 일시 상태 전용

`docs/PROJECT_SCOPE.md`(CON-01/CON-02, REQ-FUNC-017/025/REQ-NF-017)와 `TASKS/TASK-COMP-SCR003-FLIGHT-FORM.md` / `TASK-COMP-SCR003-HOTEL-FORM.md`를 그대로 따른다.

- 항공·숙소 조건 입력 Form은 **Client Component**이며, 국가·지역·날짜 값은 컴포넌트의 `useState` 일시 상태로만 보관한다.
- 이 값을 다음 중 어디로도 보내지 않는다: **API Route, Server Action, DB(Supabase), 외부 URL의 쿼리·본문·쿠키, 서버 로그, 분석 이벤트.**
- 외부 이동은 `window.open(url, "_blank", "noopener,noreferrer")` 형태로만 수행하며, `url`은 관리자가 설정한 허용목록 값(§7 `OUTBOUND_LINK_SETTING`)이고 사용자가 입력한 목적지·날짜를 포함하지 않는다.
- 페이지를 벗어나거나 새로고침하면 입력값은 사라진다(서버 세션·DB 어디에도 영속화되지 않음).

이 폼을 위한 API Route는 만들지 않는다(`docs/02_SRS_BASELINE.md` §6.1의 각주와 동일: "항공·호텔 폼에는 서버 API를 만들지 않는다").

---

## 6. 콘텐츠 데이터: `src/data` 정적 데이터

여행지, 국가별 안전정보, 대표(`free_traveler`) 소개는 **Supabase 테이블이 아니라 `src/data`의 TypeScript 정적 데이터**로 관리한다(`docs/PROJECT_SCOPE.md` §3 구현 방식, `TASKS/TASK-DATA-DESTINATIONS.md` 등).

| 파일(계획) | 내용 | 대응 Screen |
|---|---|---|
| `src/data/destinations.ts` | 국내 10곳, 해외 15개국 30개 도시 | SCR-001 |
| `src/data/safety.ts` | 해외 15개국 안전정보(8개 카테고리) | SCR-001 |
| `src/data/representative.ts` | 대표 프로필·타임라인·Gallery | SCR-002 |
| `src/data/policies.ts` | 이용약관·개인정보·안전수칙·면책 정적 텍스트 | SCR-003, SCR-005 |

콘텐츠 변경은 코드 배포로만 반영하며, 이 데이터를 위한 관리자 CRUD 화면이나 CMS는 만들지 않는다(§9 제외 범위).

---

## 7. Supabase: Auth와 동행 기능 중심

Supabase는 **콘텐츠 저장소가 아니라 회원 인증과 동행(Mate) 기능 전용**으로 사용한다.

### 7.1 Browser/Server Client 분리

| Client | 사용처 | 파일(계획) |
|---|---|---|
| Browser Supabase Client | Client Component에서 로그인 상태 읽기, 클라이언트발 뮤테이션(참가 요청 제출 등 사용자 액션) | `src/lib/supabase/client.ts` |
| Server Supabase Client | Server Component/Route Handler에서 초기 데이터 조회, RLS를 우회하지 않는 서버 측 뮤테이션 | `src/lib/supabase/server.ts` |

두 Client 모두 `service_role` 키를 클라이언트 번들에 포함하지 않는다. `service_role`은 어떤 코드에도 사용하지 않는다(RLS로 충분히 방어 가능한 범위로 기능을 제한했기 때문).

### 7.2 DB Table: 정확히 6개

`TASKS/TASK-DB-SCHEMA-BASE.md`가 정의한 스키마를 그대로 따르며, 이 6개 외의 테이블을 새로 만들지 않는다.

| Table | 역할 |
|---|---|
| `USER_PROFILE` | 닉네임·연령대·성별·여행 스타일·성인 확인 여부/시각 |
| `MATE_POST` | 동행 모집글 |
| `MATE_APPLICATION` | 참가 요청과 상태(PENDING/ACCEPTED/REJECTED/WITHDRAWN) |
| `USER_BLOCK` | 사용자 차단 관계 |
| `REPORT` | 신고 대상·사유·처리 상태 |
| `OUTBOUND_LINK_SETTING` | 관리자가 설정하는 항공·숙소 외부 URL |

여행지·안전정보·대표 소개·감사 로그에 대응하는 테이블(`COUNTRY`, `DESTINATION`, `COUNTRY_SAFETY`, `MEDIA_ASSET`, `REPRESENTATIVE_PROFILE`, `AUDIT_LOG`)은 만들지 않는다 — 콘텐츠 계열은 §6의 정적 데이터로, 감사 로그는 `docs/PROJECT_SCOPE.md`의 EXCLUDED 범위로 대체한다.

### 7.3 간단한 RLS 원칙

복잡한 다단계 정책 대신 아래 3가지 원칙만 적용한다(`TASKS/TASK-DB-RLS-BASE.md`).

1. **본인 데이터만 쓰기**: `MATE_POST`/`USER_BLOCK`/`REPORT`는 `auth.uid() = owner_id`(또는 그에 준하는 소유자 컬럼)인 행만 쓸 수 있다.
2. **당사자만 비공개 열람**: `MATE_APPLICATION.message`는 신청자 본인과 해당 `MATE_POST`의 작성자만 조회할 수 있다.
3. **역할 기반 관리자 열람**: `REPORT` 상세와 `OUTBOUND_LINK_SETTING` 쓰기는 Moderator/Admin 역할에만 허용한다.

이 3원칙 밖의 세분화된 정책(예: 열람 이력 기반 정책, 시간 기반 정책)은 만들지 않는다.

### 7.4 ORM 미사용

Prisma를 포함한 어떤 ORM도 사용하지 않는다. 데이터 접근은 Supabase JS Client(`@supabase/supabase-js`, `@supabase/ssr`)의 쿼리 빌더를 `src/lib/db/*.ts`(`TASKS/TASK-DB-ACCESS.md`)에 캡슐화해 직접 호출하는 방식으로만 구현한다. `schema.prisma`, `prisma/migrations/` 같은 파일은 만들지 않는다.

---

## 8. 테스트 전략

| 계층 | 도구 | 범위 |
|---|---|---|
| Unit / Integration | **Vitest** | 날짜 검증(`UNIT-TRAVEL-DATES`), 연락처 탐지(`UNIT-CONTACT-DETECTION`), 동행 상태 전이(`UNIT-MATE-STATE`), RLS 기본 정책(`TEST-RLS-BASIC`) |
| E2E | **Playwright, Chromium 단일 브라우저** | Smoke 3개 Task(`E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH`)로 핵심 흐름만 커버 |

Playwright는 Chromium 프로젝트만 설정하고 Firefox·WebKit 매트릭스는 구성하지 않는다(`TASKS/TASK-E2E-*.md`의 Forbidden 절과 동일).

---

## 9. CI/CD와 배포 경계

| 항목 | 내용 |
|---|---|
| CI | **GitHub Actions** — `tsc --noEmit`, `next lint`, Vitest, 콘텐츠 완전성 검증 스크립트를 main 병합 전에 실행(`TASKS/TASK-CI-PIPELINE.md`) |
| 배포 | **Vercel** — Production은 main 브랜치, 그 외 브랜치/PR은 **Vercel Preview** 배포로 확인한다 |
| 병합 | 사람이 PR을 검토하고 병합한다. **자동 Merge(Merge Queue/Auto-merge Bot 등)는 사용하지 않는다.** |
| 인프라 | **Vercel + Supabase만 사용한다. AWS·EC2 등 별도 인프라는 구성하지 않는다.** |

---

## 10. 명시적 제외 범위

다음은 이 프로젝트의 아키텍처에 포함하지 않는다(`docs/PROJECT_SCOPE.md` §4와 동일하게 유지).

- **CMS**: 여행지·안전정보·대표 소개 콘텐츠 관리자 CRUD/미리보기 화면. 콘텐츠는 §6의 정적 데이터 파일을 코드 배포로 갱신한다.
- **외부 Email 공급자**: SendGrid/Postmark 등 실제 이메일 발송 연동을 만들지 않는다. 참가 요청·승인·거절·신고 알림은 화면 내 Toast/상태로 대체한다(Supabase Auth 자체의 인증 메일 발송은 Supabase 관리형 기능이며 별도 이메일 공급자 연동이 아니다).
- **Monitoring**: APM, 구조화 로그 수집, 5xx/가용성 알림, 성능(LCP/INP/CLS) 자동 측정 인프라를 구성하지 않는다(`docs/PROJECT_SCOPE.md`의 REQ-NF-001~005, 008~011, 019~020, 032~033 EXCLUDED와 동일).

---

## 11. 착수 차단(Blocking) 목록

아래 항목은 실제로 저장소에 확인한 결과 **현재 존재하지 않으며, 구현 착수 전 반드시 준비되어야 한다.** 존재 여부를 확인하지 않은 추정 항목은 포함하지 않았다.

### 11.1 누락된 파일/디렉터리

| 항목 | 확인 방법 | 현재 상태 |
|---|---|---|
| `src/app/about/`, `src/app/travel-tools/`, `src/app/mates/`, `src/app/account/` | `find src/app -type f` | 없음 — `page.tsx`, `layout.tsx`, `globals.css`, `favicon.ico`만 존재 |
| `src/data/*.ts`(destinations/safety/representative/policies) | `find src/data -type f` | `src/data` 디렉터리가 비어 있음 |
| `supabase/` (config.toml, migrations, seed.sql) | `find . -iname "supabase*"` | 없음 |
| `.github/workflows/*.yml` | `find . -path '*/.github*'` | 없음 |
| `playwright.config.ts`, `vitest.config.ts` | `find . -iname "playwright.config*" -o -iname "vitest.config*"` | 없음 |
| `.env.example`(또는 `.env.local`) | `ls -la .env*` | 없음 |

### 11.2 누락된 의존성(`package.json`에 없음)

| 의존성 | 용도 |
|---|---|
| `@supabase/supabase-js`, `@supabase/ssr` | Browser/Server Supabase Client(§7.1) |
| `vitest` | Unit/Integration Test(§8) |
| `@playwright/test` | E2E Test(§8) |

### 11.3 누락된 환경변수

`.env.example`이 없으므로 다음 환경변수가 어디에도 정의되어 있지 않다. Supabase 프로젝트 생성(`TASK-INFRA-SUPABASE-PROJECT`)과 Vercel 설정(`TASK-INFRA-VERCEL-DEPLOY`) 완료 후 값을 채워야 한다.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — §7.1 원칙상 애플리케이션 코드에서는 사용하지 않지만, Supabase 프로젝트 자체 관리 목적으로 Vercel 환경변수에는 등록이 필요할 수 있다(사용 여부는 §7.1 원칙을 우선한다).
- `FLIGHT_OUTBOUND_URL`(기본값 후보: `https://www.google.com/travel/flights`)
- `HOTEL_OUTBOUND_URL`(기본값 후보: `https://www.booking.com/`)

위 목록 외에 이 문서 작성 시점에 실재가 확인되지 않은 차단 사유(예: 조직 정책, 라이선스 승인 등)는 추측해 기록하지 않는다.

---

*— End of ARCH-TRAVEL-001 —*
