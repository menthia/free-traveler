# SRS Revision — UI/UX Consolidation (Free Traveler)

- **Document ID:** SRS-UIUX-REV-001
- **개정 대상:** `docs/02_SRS_BASELINE.md` §3.5(Page and Route Inventory), §3.6(Use Cases 화면 매핑 참고), §6.1(Internal API and Server Actions 경로 표기)
- **기반 문서:** `docs/02_SRS_BASELINE.md`(변경 없음, Baseline 유지), `docs/PROJECT_SCOPE.md`, `docs/03_UI_COVERAGE_ANALYSIS.md`, `docs/05_UIUX_APPROVED.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`
- **작성일:** 2026-09-19
- **상태:** SRS Revision Addendum — Baseline을 대체하지 않고 Route/화면 구조만 개정

---

## 0. 개정 원칙

1. **`02_SRS_BASELINE.md`의 `REQ-FUNC-001~080`, `REQ-NF-001~034`는 이 문서로 삭제·변경되지 않는다.** 원문은 `02_SRS_BASELINE.md`가 그대로 유지하며, 이 문서는 그 위에 Route/화면 구조 개정 사항만 추가한다.
2. 원래 SRS가 가정했던 다수의 개별 Route(예: `/destinations/[slug]`, `/safety/[countryCode]`, `/mates/new`, `/auth/*`, `/my/*`, `/admin/*`)는 **5개 디자인 Screen의 탭·패널·모달로 통합**되며, 이 개정 이후로는 별도 페이지 파일을 생성하지 않는다.
3. `PROJECT_SCOPE.md`에서 EXCLUDED로 결정된 기능은 이 문서에서도 **EXCLUDED**로 표기하며, 구현된 것처럼 기록하지 않는다.
4. 이 문서 작성 시점 기준 실제 코드 구현은 착수되지 않았다. 아래 모든 "구현 계약"은 **계약(설계 확정)**이지 **완료 보고**가 아니다.

---

## 1. 개정 §3.5 — Page and Route Inventory (Revised)

`02_SRS_BASELINE.md` §3.5의 Route 표는 다음으로 개정한다. 통합 근거는 `docs/05_UIUX_APPROVED.md` §3을 따른다.

| Route | Screen | Access | 비고 |
|---|---|---|---|
| `/` | SCR-001 | Public | 여행지 탐색 + 국가별 안전정보 Drawer 통합 |
| `/about` | SCR-002 | Public | 대표 소개(보조 화면) |
| `/travel-tools` | SCR-003 | Public(동행 작성 탭은 Adult Member) | 항공·숙소·동행 작성 3탭 통합 |
| `/mates` | SCR-004 | Public(참가 요청은 Adult Member) | 목록+상세 패널/Drawer 통합 |
| `/account` | SCR-005 | Public(Guest) / Adult Member / Moderator·Admin | 인증·프로필·내 활동·간단 관리자 통합 |

**폐기(별도 페이지로 생성하지 않음, 상위 Screen에 흡수):** `/destinations`, `/destinations/domestic`, `/destinations/overseas`, `/destinations/[slug]`, `/flights`, `/hotels`, `/mates/[id]`, `/mates/new`, `/safety`, `/safety/[countryCode]`, `/auth/*`, `/my/*`, `/admin/*`.

**기술 Route(디자인 Screen 수에 미포함, 유지):**

| 유형 | 경로 | 파일 |
|---|---|---|
| 인증 콜백 | `/auth/callback` | `src/app/auth/callback/route.ts` |
| API Route | `/api/destinations`, `/api/mates`, `/api/mates/[id]/applications`, `/api/applications/[id]`, `/api/blocks`, `/api/reports`, `/api/admin/reports`, `/api/admin/settings/outbound` | `src/app/api/**/route.ts` |
| 404 | — | `src/app/not-found.tsx` |
| 오류 경계 | — | `src/app/error.tsx` |

---

## 2. UI Route Contract

이 절은 `design-reference/SCREEN_ROUTE_CONTRACT.json`(정본)의 핵심 계약을 SRS 문맥에서 요약한 것이다. 값이 상충하면 JSON 파일이 우선한다.

```
schema_version: traveler-screen-route-v1
framework: nextjs-app-router
screen_count: 5 (core 4 + supporting 1)
```

| Screen ID | Route | Page Entry | Role | page_owner_task_required | preview_required | starter_template_forbidden | mobile_variant_required |
|---|---|---|---|:---:|:---:|:---:|:---:|
| SCR-001 | `/` | `src/app/page.tsx` | core | true | true | **true** | true |
| SCR-002 | `/about` | `src/app/about/page.tsx` | supporting | true | true | false | false |
| SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | core | true | true | false | true |
| SCR-004 | `/mates` | `src/app/mates/page.tsx` | core | true | true | false | false |
| SCR-005 | `/account` | `src/app/account/page.tsx` | core | true | true | false | false |

`starter_template_forbidden=true`(SCR-001)는 현재 `src/app/page.tsx`가 `create-next-app` 기본 스타터(Next.js 로고, "Templates" 링크 등)여서 부여되었으며, 실제 구현 시 이 콘텐츠를 완전히 대체해야 함을 뜻한다.

**required_navigation(요약):** 화면 간 콘텐츠 CTA 이동(예: SCR-001→SCR-003 "여행 준비 시작하기", SCR-003→SCR-004 게시 완료 이동, SCR-004↔SCR-005 로그인 게이트 등)과 전역 Header 내비게이션(5개 Screen 상호 접근 + 계정 버튼→SCR-005)을 모두 포함한다. 전체 목록은 `design-reference/SCREEN_ROUTE_CONTRACT.json`의 `required_navigation` 배열, 서술형 설명은 `design-reference/UI_CONTRACT.md` §6을 따른다.

**forbidden_features_global:** `airbnb_trademark_elements`, `purchase_reservation_checkout_ui`, `real_time_flight_hotel_price_display`, `user_rating_or_review_score`, `advertising_banner`, `dashboard_charts_or_kpi_graphs`, `lorem_ipsum_or_placeholder_text`, `empty_card_without_cta` — 5개 Screen 전체에 적용.

---

## 3. Release Acceptance Criteria

이 절은 이번 UI/UX 승인 구조를 실제 코드로 구현·릴리스할 때 통과해야 하는 조건을 정의한다. `02_SRS_BASELINE.md` §11(출시·검증 계획)의 단계 구분(Content Alpha~MVP Release)을 대체하지 않고, 그 안에서 "UI/UX 구현 완료" 판정에 필요한 세부 조건을 보탠다.

| # | 기준 | 근거/검증 방법 |
|---|---|---|
| AC-REL-01 | `src/app`에 정확히 5개 Screen(SCR-001~005)이 §1 표의 Route·Page Entry로 존재하고, 그 외 별도 페이지(예: `/destinations/[slug]`)가 생성되지 않았다 | `design-reference/SCREEN_ROUTE_CONTRACT.json` 대조 |
| AC-REL-02 | SCR-001의 `src/app/page.tsx`가 `create-next-app` 기본 스타터 콘텐츠(Next.js 로고, "Templates" 링크 등)를 포함하지 않는다 | 코드 리뷰 |
| AC-REL-03 | `docs/UIUX_TRACEABILITY.md`에서 `Implementation Status`가 `IMPLEMENT`/`IMPLEMENT(변형)`인 모든 행이 지정된 Screen·Route·Page Entry에 실제로 구현되어 있다 | Playwright 핵심 Smoke Test + 코드 리뷰 |
| AC-REL-04 | `EXCLUDED`로 표기된 기능(콘텐츠 CMS, 감사 로그, 실시간 성능/SLA 측정, 회원 탈퇴 지연삭제 등)이 코드베이스 어디에도 구현되어 있지 않다 | 코드 리뷰 + `design-reference/D-001/DESIGN.md` Do Not 대조 |
| AC-REL-05 | `design-reference/D-001/DESIGN.md`의 금지 목록(Airbnb 상표, 예약·결제 UI, 별점·리뷰, 실시간 가격, 대시보드 차트, Lorem ipsum/"준비 중"/"정보 확인 필요")이 실제 화면 어디에도 없다 | `docs/STITCH_VALIDATION_REPORT.md`와 동일한 방식의 코드 대상 재검사 |
| AC-REL-06 | 각 화면의 상태(Loading/Success/Empty/Error/Unauthorized 등, `design-reference/UI_CONTRACT.md` 기준)가 정의된 만큼 구현되어 있고, Empty State는 설명·이용방법·CTA 3요소를 모두 포함한다 | 수동 QA + Playwright |
| AC-REL-07 | `docs/UIUX_TRACEABILITY.md`의 `Task` 열이 `PENDING_TASK_GENERATION`에서 실제 Task ID로 전환되고, 각 Task가 완료 처리된다 | Task 관리 시스템 |
| AC-REL-08 | `docs/UIUX_TRACEABILITY.md`의 `Test` 열에 명시된 `TC-FUNC-XXX`/`TC-NF-XXX` 중 Must 우선순위 항목이 작성되어 통과한다 | Playwright/Vitest 실행 결과 |
| AC-REL-09 | Route 중복, Page Entry 중복이 없다(정적 검사) | `design-reference/SCREEN_ROUTE_CONTRACT.json`의 `completion_conditions` |
| AC-REL-10 | 핵심 화면 4개(SCR-001, 003, 004, 005)와 보조 화면 1개(SCR-002)의 구분이 문서와 실제 내비게이션 구조에서 일관된다 | `design-reference/UI_CONTRACT.md` §0 대조 |

**AC-REL-01~10 중 어느 것도 이 문서 작성 시점에 충족되지 않았다.** 이는 §0-4의 선언과 일치하며, 향후 Task 생성·구현·테스트 단계에서 하나씩 충족시킨다.

---

## 4. Requirement 보존 확인 (요약 부록)

아래는 `02_SRS_BASELINE.md`의 114개 Requirement가 이 개정에서도 전부 유지되었음을 보여주는 요약이다. `Implementation Status`와 배치된 `Screen`만 표기하며, 전체 8열(Route/Page Entry/Task/Test/Status 포함) 상세는 `docs/UIUX_TRACEABILITY.md`를 정본으로 한다.

| Requirement | Implementation Status | Screen |
|---|---|---|
| **F1. Destination Guide** | | |
| REQ-FUNC-001 | IMPLEMENT | SCR-001 |
| REQ-FUNC-002 | IMPLEMENT | SCR-001 |
| REQ-FUNC-003 | IMPLEMENT | SCR-001 |
| REQ-FUNC-004 | IMPLEMENT | SCR-001 |
| REQ-FUNC-005 | IMPLEMENT | SCR-001 |
| REQ-FUNC-006 | IMPLEMENT | SCR-001 |
| REQ-FUNC-007 | IMPLEMENT(변형) | SCR-001 |
| REQ-FUNC-008 | IMPLEMENT(변형) | — |
| REQ-FUNC-009 | IMPLEMENT | SCR-001 |
| REQ-FUNC-010 | EXCLUDED | — |
| **F2. Flight Link-out** | | |
| REQ-FUNC-011 | IMPLEMENT | SCR-003 |
| REQ-FUNC-012 | IMPLEMENT | SCR-003 |
| REQ-FUNC-013 | IMPLEMENT | SCR-003 |
| REQ-FUNC-014 | IMPLEMENT | SCR-003 |
| REQ-FUNC-015 | IMPLEMENT | SCR-003 |
| REQ-FUNC-016 | IMPLEMENT | SCR-003 |
| REQ-FUNC-017 | IMPLEMENT | — |
| REQ-FUNC-018 | IMPLEMENT | SCR-003 |
| **F3. Hotel Link-out** | | |
| REQ-FUNC-019 | IMPLEMENT | SCR-003 |
| REQ-FUNC-020 | IMPLEMENT | SCR-003 |
| REQ-FUNC-021 | IMPLEMENT | SCR-003 |
| REQ-FUNC-022 | IMPLEMENT | SCR-003 |
| REQ-FUNC-023 | IMPLEMENT | SCR-003 |
| REQ-FUNC-024 | IMPLEMENT | SCR-003 |
| REQ-FUNC-025 | IMPLEMENT | — |
| REQ-FUNC-026 | IMPLEMENT | SCR-003 |
| **F4. Travel Mate** | | |
| REQ-FUNC-027 | IMPLEMENT | SCR-003, SCR-005 |
| REQ-FUNC-028 | IMPLEMENT | SCR-005, SCR-003 |
| REQ-FUNC-029 | IMPLEMENT | SCR-005 |
| REQ-FUNC-030 | IMPLEMENT | SCR-004 |
| REQ-FUNC-031 | IMPLEMENT | SCR-003 |
| REQ-FUNC-032 | IMPLEMENT | SCR-003 |
| REQ-FUNC-033 | IMPLEMENT | SCR-004 |
| REQ-FUNC-034 | IMPLEMENT | SCR-004 |
| REQ-FUNC-035 | IMPLEMENT | SCR-004 |
| REQ-FUNC-036 | IMPLEMENT | SCR-004, SCR-005 |
| REQ-FUNC-037 | IMPLEMENT(변형) | SCR-004 |
| REQ-FUNC-038 | IMPLEMENT | SCR-005 |
| REQ-FUNC-039 | IMPLEMENT | SCR-004 |
| REQ-FUNC-040 | IMPLEMENT | SCR-004, SCR-005 |
| REQ-FUNC-041 | IMPLEMENT(변형) | SCR-005 |
| REQ-FUNC-042 | IMPLEMENT(변형) | SCR-005 |
| REQ-FUNC-043 | IMPLEMENT(변형) | SCR-004, SCR-005 |
| REQ-FUNC-044 | IMPLEMENT | — |
| REQ-FUNC-045 | EXCLUDED | — |
| **F5. Country Safety** | | |
| REQ-FUNC-046 | IMPLEMENT | — |
| REQ-FUNC-047 | IMPLEMENT | SCR-001 |
| REQ-FUNC-048 | IMPLEMENT | SCR-001 |
| REQ-FUNC-049 | IMPLEMENT | SCR-001 |
| REQ-FUNC-050 | IMPLEMENT(변형) | SCR-001 |
| REQ-FUNC-051 | IMPLEMENT | SCR-001 |
| REQ-FUNC-052 | IMPLEMENT | SCR-001 |
| REQ-FUNC-053 | IMPLEMENT | SCR-001 |
| REQ-FUNC-054 | IMPLEMENT | SCR-001, SCR-003 |
| REQ-FUNC-055 | EXCLUDED | — |
| REQ-FUNC-056 | EXCLUDED | — |
| **F6. About free_traveler** | | |
| REQ-FUNC-057 | IMPLEMENT | SCR-002 |
| REQ-FUNC-058 | IMPLEMENT | SCR-002 |
| REQ-FUNC-059 | IMPLEMENT | SCR-002 |
| REQ-FUNC-060 | IMPLEMENT | SCR-002 |
| REQ-FUNC-061 | IMPLEMENT(변형) | SCR-002 |
| REQ-FUNC-062 | IMPLEMENT(변형) | SCR-002 |
| REQ-FUNC-063 | IMPLEMENT | SCR-002 |
| **F7. Common, Admin, Governance** | | |
| REQ-FUNC-064 | IMPLEMENT | 공통(SCR-001~005) |
| REQ-FUNC-065 | IMPLEMENT | 공통(SCR-001~005) |
| REQ-FUNC-066 | IMPLEMENT | SCR-005 |
| REQ-FUNC-067 | IMPLEMENT | SCR-001 |
| REQ-FUNC-068 | IMPLEMENT(변형) | SCR-001, SCR-005 |
| REQ-FUNC-069 | EXCLUDED | — |
| REQ-FUNC-070 | IMPLEMENT | — |
| REQ-FUNC-071 | EXCLUDED | — |
| REQ-FUNC-072 | EXCLUDED | — |
| REQ-FUNC-073 | EXCLUDED | — |
| REQ-FUNC-074 | IMPLEMENT(변형) | — |
| REQ-FUNC-075 | EXCLUDED | — |
| REQ-FUNC-076 | EXCLUDED | — |
| REQ-FUNC-077 | IMPLEMENT | SCR-005 |
| REQ-FUNC-078 | IMPLEMENT | — (기술 Route) |
| REQ-FUNC-079 | IMPLEMENT | 공통(SCR-001~005) |
| REQ-FUNC-080 | IMPLEMENT(변형) | SCR-003, SCR-005 |
| **NF Performance** | | |
| REQ-NF-001 | EXCLUDED | — |
| REQ-NF-002 | EXCLUDED | — |
| REQ-NF-003 | EXCLUDED | — |
| REQ-NF-004 | EXCLUDED | — |
| REQ-NF-005 | EXCLUDED | — |
| REQ-NF-006 | IMPLEMENT | — |
| REQ-NF-007 | EXCLUDED | — |
| **NF Reliability** | | |
| REQ-NF-008 | EXCLUDED | — |
| REQ-NF-009 | EXCLUDED | — |
| REQ-NF-010 | EXCLUDED | — |
| REQ-NF-011 | EXCLUDED | — |
| **NF Security/Privacy** | | |
| REQ-NF-012 | IMPLEMENT | — |
| REQ-NF-013 | IMPLEMENT | — |
| REQ-NF-014 | IMPLEMENT | — |
| REQ-NF-015 | IMPLEMENT | — |
| REQ-NF-016 | IMPLEMENT | — |
| REQ-NF-017 | IMPLEMENT | — |
| REQ-NF-018 | EXCLUDED | — |
| **NF Safety/Moderation** | | |
| REQ-NF-019 | EXCLUDED | — |
| REQ-NF-020 | EXCLUDED | — |
| REQ-NF-021 | EXCLUDED | — |
| REQ-NF-022 | EXCLUDED | — |
| **NF Accessibility** | | |
| REQ-NF-023 | IMPLEMENT | 공통(SCR-001~005) |
| REQ-NF-024 | IMPLEMENT | — |
| REQ-NF-025 | EXCLUDED | — |
| **NF Content/SEO/Copyright** | | |
| REQ-NF-026 | IMPLEMENT(변형) | — |
| REQ-NF-027 | IMPLEMENT | — |
| REQ-NF-028 | EXCLUDED | — |
| REQ-NF-029 | EXCLUDED | — |
| REQ-NF-030 | IMPLEMENT | — |
| **NF Maintainability/Monitoring/Cost** | | |
| REQ-NF-031 | IMPLEMENT | — |
| REQ-NF-032 | EXCLUDED | — |
| REQ-NF-033 | EXCLUDED | — |
| REQ-NF-034 | IMPLEMENT | — |

---

## 5. 집계 확인

| 구분 | 개수 |
|---|---:|
| REQ-FUNC-001~080 | 80 |
| REQ-NF-001~034 | 34 |
| **총합(개정 전후 동일)** | **114** |
| IMPLEMENT(변형 포함) | 84 |
| EXCLUDED | 30 |

---

*— End of SRS-UIUX-REV-001 —*
