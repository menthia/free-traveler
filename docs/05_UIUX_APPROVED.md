# Free Traveler — UI/UX Approved Baseline

- **Document ID:** UIUX-APPROVED-001
- **기반 문서:** `docs/02_SRS_BASELINE.md`, `docs/PROJECT_SCOPE.md`, `docs/03_UI_COVERAGE_ANALYSIS.md`, `docs/04_UIUX_PLAN.md`, `docs/STITCH_VALIDATION_REPORT.md`, `design-reference/D-001/DESIGN.md`, `design-reference/DESIGN_MANIFEST.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`
- **작성일:** 2026-09-19
- **상태:** UI/UX Approved (설계 승인, 코드 구현 착수 전)

---

## 1. 목적

이 문서는 `02_SRS_BASELINE.md`가 원래 정의했던 다수의 공개 Route(사이트맵)를, 실제로 Stitch에서 목업 제작 후 검증을 통과한 **5개 디자인 Screen(SCR-001~005)** 구조로 확정·승인한 기록이다. `02_SRS_BASELINE.md`의 `REQ-FUNC-001~080`, `REQ-NF-001~034`는 이 문서에서도 어떤 항목도 삭제하지 않으며, 각 Requirement의 최신 화면 배치는 `docs/UIUX_TRACEABILITY.md`에서 전수 추적한다.

**중요 고지:** 이 문서는 UI/UX **설계**가 승인되었음을 기록하는 문서다. 승인된 것은 Google Stitch에서 제작한 목업(HTML)이며, `src/app` 아래의 실제 Next.js 코드는 이 시점까지 구현되지 않았다(현재 `src/app/page.tsx`는 `create-next-app` 기본 스타터 템플릿). 코드 구현 여부는 `docs/UIUX_TRACEABILITY.md`의 `Status` 열에서 별도로 추적한다.

---

## 2. 승인 근거

| 근거 | 내용 |
|---|---|
| 디자인 시스템 | `design-reference/D-001/DESIGN.md` — `Status: LOCKED` (`design-reference/DESIGN_MANIFEST.md`) |
| 화면 검증 | `docs/STITCH_VALIDATION_REPORT.md` — 최종 판정 `STITCH_VALIDATION_PASS`, SCR-001~005 및 Mobile 변형(SCR-001, SCR-003) 전체 PASS |
| 구현 계약 | `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json` — Screen ID·Route·Page Entry·영역 순서·금지 기능 고정 |
| Stitch Project | `projects/16339559805993473633`("Free Traveler"), Design System `assets/2298874084718831656` |

---

## 3. 기존 Route → 승인 Screen 통합 매핑

`02_SRS_BASELINE.md` §3.5(Page and Route Inventory)가 정의했던 다수의 공개 Route는 신규 Route를 추가로 만들지 않고 아래와 같이 **5개 디자인 Screen의 탭·패널·모달로 통합**한다. 통합된 옛 Route는 별도의 Next.js 페이지 파일을 갖지 않는다.

| 기존 Route(`02_SRS_BASELINE.md` §3.5) | 통합 방식 | 승인 Screen |
|---|---|---|
| `/` | 유지 | **SCR-001** |
| `/destinations` | 통합 — 여행지 목록 Card Grid로 흡수 | **SCR-001** |
| `/destinations/domestic` | 통합 — 국내 탭/Section으로 흡수 | **SCR-001** |
| `/destinations/overseas` | 통합 — 해외 탭/Section으로 흡수 | **SCR-001** |
| `/destinations/[slug]` | 통합 — 여행지 상세 **Drawer/Modal**로 흡수, 별도 페이지 파일 없음 | **SCR-001** |
| `/flights` | 통합 — `항공편` **탭**으로 흡수 | **SCR-003** |
| `/hotels` | 통합 — `숙소` **탭**으로 흡수 | **SCR-003** |
| `/mates` | 유지(내용 확장) | **SCR-004** |
| `/mates/[id]` | 통합 — 상세 **패널/Drawer**로 흡수, 별도 페이지 파일 없음 | **SCR-004** |
| `/mates/new` | 통합 — `동행 구하기` **탭**의 작성 Form으로 흡수 | **SCR-003** |
| `/safety` | 통합 — 국가별 주의사항 Card Grid로 흡수 | **SCR-001** |
| `/safety/[countryCode]` | 통합 — 안전정보 상세 **Drawer/Modal**로 흡수, 별도 페이지 파일 없음 | **SCR-001** |
| `/about` | 유지 | **SCR-002** |
| `/auth/*`(로그인·가입·성인확인) | 통합 — Guest **탭**(로그인/가입/비밀번호 재설정)으로 흡수 | **SCR-005** |
| `/my/*`(내 글·참가요청·차단) | 통합 — Member **탭**(내 활동)으로 흡수 | **SCR-005** |
| `/admin/*`(콘텐츠·신고·설정) | 통합·**축소** — Admin **탭**(신고 처리 + 외부 URL 설정만)으로 흡수. 콘텐츠 CRUD·감사 로그 등은 `PROJECT_SCOPE.md` 기준 EXCLUDED | **SCR-005** |

---

## 4. 승인된 5개 Screen 요약

| Screen | Route | Page Entry | 역할 |
|---|---|---|---|
| SCR-001 | `/` | `src/app/page.tsx` | 핵심 — 여행지 탐색 + 안전정보 Drawer |
| SCR-002 | `/about` | `src/app/about/page.tsx` | 보조 — 대표(`free_traveler`) 소개 |
| SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | 핵심 — 항공·숙소·동행 작성 통합 탭 |
| SCR-004 | `/mates` | `src/app/mates/page.tsx` | 핵심 — 동행 조회(목록+상세) |
| SCR-005 | `/account` | `src/app/account/page.tsx` | 핵심 — 인증·프로필·내 활동·간단 관리자 |

세부 Section 순서, 주요 Component, 상태, 사용자 행동, 화면 간 이동, Desktop/Mobile 규칙, 금지 기능은 `design-reference/UI_CONTRACT.md`를 정본으로 한다.

---

## 5. 제외 기능 고지

다음은 이번 승인 범위에 포함되지 않으며, 5개 Screen 어디에도 구현하지 않는다(`PROJECT_SCOPE.md` 기준 **EXCLUDED**, 전체 목록은 `docs/UIUX_TRACEABILITY.md` 참고):

- 여행지·안전정보 콘텐츠 관리자 CRUD/CMS(REQ-FUNC-072, 073, 055)
- Stale 현황 대시보드, 범용 감사 로그(REQ-FUNC-075, 076, REQ-NF-022, 032)
- 회원 탈퇴 30일 지연삭제·법적 보존 예외 처리(REQ-FUNC-045, REQ-NF-018)
- 필터 상태 URL 반영, 공개 페이지 URL 공유, 행동 분석 이벤트(REQ-FUNC-010, 069, 071)
- 성능·가용성·SLA 자동 측정 인프라(REQ-NF-001~005, 007~011, 019~021, 025, 028~029, 033)

이 항목들은 `docs/06_SRS_UIUX_REVISED.md`와 `docs/UIUX_TRACEABILITY.md`에서도 동일하게 `EXCLUDED`로 표기한다.

---

## 6. 승인 상태 선언

| 항목 | 상태 |
|---|---|
| UI/UX 설계(Stitch 목업) | **승인(PASS)** — `docs/STITCH_VALIDATION_REPORT.md` |
| 디자인 시스템(D-001) | **LOCKED** — `design-reference/DESIGN_MANIFEST.md` |
| Next.js 코드 구현 | **미착수** — `src/app`은 기본 스타터 템플릿 상태 |
| Requirement ↔ Screen 추적 | `docs/UIUX_TRACEABILITY.md` 참고(114개 전항목) |

---

*— End of UIUX-APPROVED-001 —*
