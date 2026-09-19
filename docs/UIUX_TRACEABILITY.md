# Free Traveler — UI/UX Traceability Matrix

- **Document ID:** UIUX-TRACE-001
- **기반 문서:** `docs/02_SRS_BASELINE.md`, `docs/PROJECT_SCOPE.md`, `docs/03_UI_COVERAGE_ANALYSIS.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`
- **작성일:** 2026-09-19
- **상태:** Traceability Baseline (구현 착수 전)

---

## 0. 문서 성격 및 중요 고지

이 문서는 `REQ-FUNC-001~080`, `REQ-NF-001~034`(총 114개) **전 항목**을 승인된 5개 Screen(SCR-001~005)의 Route·Page Entry와 연결한 추적 매트릭스다. `02_SRS_BASELINE.md`의 Requirement는 어떤 항목도 삭제·축약하지 않았다.

**이 문서 작성 시점 기준으로 실제 Next.js 코드 구현은 시작되지 않았다.** `src/app`은 여전히 `create-next-app` 기본 스타터 템플릿 상태이며, 5개 Screen은 Google Stitch에서 목업으로 설계·검증(`docs/STITCH_VALIDATION_REPORT.md` 기준 전체 PASS)되었을 뿐 실제 코드로 옮겨지지 않았다. 따라서 이 표의 `Status` 열에는 `IMPLEMENTED`, `DONE`, `PASS` 같은 "구현 완료"를 뜻하는 값을 사용하지 않는다.

### 열 정의

| 열 | 의미 |
|---|---|
| **Requirement** | `02_SRS_BASELINE.md`의 REQ ID(변경 없음) |
| **Implementation Status** | `PROJECT_SCOPE.md` 기준 구현 여부 — `IMPLEMENT` / `IMPLEMENT(변형)` / `EXCLUDED` |
| **Screen** | 배치된 승인 Screen ID(SCR-001~005), 화면이 없으면 `—`, 여러 화면에 걸치면 쉼표로 나열, 전 화면 공통이면 `공통(SCR-001~005)` |
| **Route** | 해당 Screen의 Next.js Route(`design-reference/SCREEN_ROUTE_CONTRACT.json` 기준) |
| **Page Entry** | 해당 Screen의 Page 파일 경로 |
| **Task** | 구현 작업 항목 ID. **Task가 아직 생성되지 않았으므로 EXCLUDED가 아닌 모든 행은 `PENDING_TASK_GENERATION`으로 기록한다.** EXCLUDED 행은 애초에 Task를 만들지 않으므로 `N/A_EXCLUDED`로 표기한다 |
| **Test** | `02_SRS_BASELINE.md` §5.1 관례를 따른 예정 테스트 ID(`TC-FUNC-XXX`/`TC-NF-XXX`). **아직 작성되거나 실행된 테스트가 아니라 향후 작성할 테스트의 식별자**다. EXCLUDED 행은 `N/A_EXCLUDED` |
| **Status** | 이 추적 행의 현재 생애주기 상태 — `EXCLUDED`(제외 확정) / `UI_APPROVED_PENDING_IMPLEMENTATION`(Screen 목업 PASS, 코드 미착수) / `PENDING_IMPLEMENTATION`(화면 없이 서버·스크립트·프로세스로 구현 예정, 코드 미착수) |

---

## 1. REQ-FUNC Traceability (REQ-FUNC-001 ~ 080)

### 4.1 F1. Destination Guide

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-001 | IMPLEMENT | SCR-001 | / | src/app/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-001 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-002 | IMPLEMENT | SCR-001 | / | src/app/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-002 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-003 | IMPLEMENT | SCR-001 | / | src/app/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-003 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-004 | IMPLEMENT | SCR-001 | / | src/app/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-004 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-005 | IMPLEMENT | SCR-001 | / | src/app/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-005 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-006 | IMPLEMENT | SCR-001 | / | src/app/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-006 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-007 | IMPLEMENT(변형) | SCR-001 | / | src/app/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-007 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-008 | IMPLEMENT(변형) | — | — | — | PENDING_TASK_GENERATION | TC-FUNC-008 | PENDING_IMPLEMENTATION |
| REQ-FUNC-009 | IMPLEMENT | SCR-001 | / | src/app/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-009 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-010 | EXCLUDED | — | — | — | N/A_EXCLUDED | N/A_EXCLUDED | EXCLUDED |

### 4.2 F2. Flight Link-out

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-011 | IMPLEMENT | SCR-003 | /travel-tools | src/app/travel-tools/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-011 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-012 | IMPLEMENT | SCR-003 | /travel-tools | src/app/travel-tools/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-012 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-013 | IMPLEMENT | SCR-003 | /travel-tools | src/app/travel-tools/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-013 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-014 | IMPLEMENT | SCR-003 | /travel-tools | src/app/travel-tools/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-014 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-015 | IMPLEMENT | SCR-003 | /travel-tools | src/app/travel-tools/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-015 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-016 | IMPLEMENT | SCR-003 | /travel-tools | src/app/travel-tools/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-016 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-017 | IMPLEMENT | — | — | — | PENDING_TASK_GENERATION | TC-FUNC-017 | PENDING_IMPLEMENTATION |
| REQ-FUNC-018 | IMPLEMENT | SCR-003 | /travel-tools | src/app/travel-tools/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-018 | UI_APPROVED_PENDING_IMPLEMENTATION |

### 4.3 F3. Hotel Link-out

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-019 | IMPLEMENT | SCR-003 | /travel-tools | src/app/travel-tools/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-019 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-020 | IMPLEMENT | SCR-003 | /travel-tools | src/app/travel-tools/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-020 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-021 | IMPLEMENT | SCR-003 | /travel-tools | src/app/travel-tools/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-021 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-022 | IMPLEMENT | SCR-003 | /travel-tools | src/app/travel-tools/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-022 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-023 | IMPLEMENT | SCR-003 | /travel-tools | src/app/travel-tools/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-023 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-024 | IMPLEMENT | SCR-003 | /travel-tools | src/app/travel-tools/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-024 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-025 | IMPLEMENT | — | — | — | PENDING_TASK_GENERATION | TC-FUNC-025 | PENDING_IMPLEMENTATION |
| REQ-FUNC-026 | IMPLEMENT | SCR-003 | /travel-tools | src/app/travel-tools/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-026 | UI_APPROVED_PENDING_IMPLEMENTATION |

### 4.4 F4. Travel Mate

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-027 | IMPLEMENT | SCR-003, SCR-005 | /travel-tools, /account | src/app/travel-tools/page.tsx, src/app/account/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-027 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-028 | IMPLEMENT | SCR-005, SCR-003 | /account, /travel-tools | src/app/account/page.tsx, src/app/travel-tools/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-028 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-029 | IMPLEMENT | SCR-005 | /account | src/app/account/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-029 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-030 | IMPLEMENT | SCR-004 | /mates | src/app/mates/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-030 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-031 | IMPLEMENT | SCR-003 | /travel-tools | src/app/travel-tools/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-031 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-032 | IMPLEMENT | SCR-003 | /travel-tools | src/app/travel-tools/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-032 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-033 | IMPLEMENT | SCR-004 | /mates | src/app/mates/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-033 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-034 | IMPLEMENT | SCR-004 | /mates | src/app/mates/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-034 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-035 | IMPLEMENT | SCR-004 | /mates | src/app/mates/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-035 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-036 | IMPLEMENT | SCR-004, SCR-005 | /mates, /account | src/app/mates/page.tsx, src/app/account/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-036 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-037 | IMPLEMENT(변형) | SCR-004 | /mates | src/app/mates/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-037 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-038 | IMPLEMENT | SCR-005 | /account | src/app/account/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-038 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-039 | IMPLEMENT | SCR-004 | /mates | src/app/mates/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-039 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-040 | IMPLEMENT | SCR-004, SCR-005 | /mates, /account | src/app/mates/page.tsx, src/app/account/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-040 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-041 | IMPLEMENT(변형) | SCR-005 | /account | src/app/account/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-041 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-042 | IMPLEMENT(변형) | SCR-005 | /account | src/app/account/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-042 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-043 | IMPLEMENT(변형) | SCR-004, SCR-005 | /mates, /account | src/app/mates/page.tsx, src/app/account/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-043 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-044 | IMPLEMENT | — | — | — | PENDING_TASK_GENERATION | TC-FUNC-044 | PENDING_IMPLEMENTATION |
| REQ-FUNC-045 | EXCLUDED | — | — | — | N/A_EXCLUDED | N/A_EXCLUDED | EXCLUDED |

### 4.5 F5. Country Safety

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-046 | IMPLEMENT | — | — | — | PENDING_TASK_GENERATION | TC-FUNC-046 | PENDING_IMPLEMENTATION |
| REQ-FUNC-047 | IMPLEMENT | SCR-001 | / | src/app/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-047 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-048 | IMPLEMENT | SCR-001 | / | src/app/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-048 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-049 | IMPLEMENT | SCR-001 | / | src/app/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-049 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-050 | IMPLEMENT(변형) | SCR-001 | / | src/app/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-050 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-051 | IMPLEMENT | SCR-001 | / | src/app/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-051 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-052 | IMPLEMENT | SCR-001 | / | src/app/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-052 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-053 | IMPLEMENT | SCR-001 | / | src/app/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-053 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-054 | IMPLEMENT | SCR-001, SCR-003 | /, /travel-tools | src/app/page.tsx, src/app/travel-tools/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-054 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-055 | EXCLUDED | — | — | — | N/A_EXCLUDED | N/A_EXCLUDED | EXCLUDED |
| REQ-FUNC-056 | EXCLUDED | — | — | — | N/A_EXCLUDED | N/A_EXCLUDED | EXCLUDED |

### 4.6 F6. About free_traveler

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-057 | IMPLEMENT | SCR-002 | /about | src/app/about/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-057 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-058 | IMPLEMENT | SCR-002 | /about | src/app/about/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-058 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-059 | IMPLEMENT | SCR-002 | /about | src/app/about/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-059 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-060 | IMPLEMENT | SCR-002 | /about | src/app/about/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-060 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-061 | IMPLEMENT(변형) | SCR-002 | /about | src/app/about/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-061 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-062 | IMPLEMENT(변형) | SCR-002 | /about | src/app/about/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-062 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-063 | IMPLEMENT | SCR-002 | /about | src/app/about/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-063 | UI_APPROVED_PENDING_IMPLEMENTATION |

### 4.7 F7. Common, Admin, Governance

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-064 | IMPLEMENT | 공통(SCR-001~005) | 전체 5개 Route | src/app/layout.tsx | PENDING_TASK_GENERATION | TC-FUNC-064 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-065 | IMPLEMENT | 공통(SCR-001~005) | 전체 5개 Route | src/app/layout.tsx | PENDING_TASK_GENERATION | TC-FUNC-065 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-066 | IMPLEMENT | SCR-005 | /account | src/app/account/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-066 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-067 | IMPLEMENT | SCR-001 | / | src/app/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-067 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-068 | IMPLEMENT(변형) | SCR-001, SCR-005 | /, /account | src/app/page.tsx, src/app/account/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-068 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-069 | EXCLUDED | — | — | — | N/A_EXCLUDED | N/A_EXCLUDED | EXCLUDED |
| REQ-FUNC-070 | IMPLEMENT | — | — | — | PENDING_TASK_GENERATION | TC-FUNC-070 | PENDING_IMPLEMENTATION |
| REQ-FUNC-071 | EXCLUDED | — | — | — | N/A_EXCLUDED | N/A_EXCLUDED | EXCLUDED |
| REQ-FUNC-072 | EXCLUDED | — | — | — | N/A_EXCLUDED | N/A_EXCLUDED | EXCLUDED |
| REQ-FUNC-073 | EXCLUDED | — | — | — | N/A_EXCLUDED | N/A_EXCLUDED | EXCLUDED |
| REQ-FUNC-074 | IMPLEMENT(변형) | — | — | — | PENDING_TASK_GENERATION | TC-FUNC-074 | PENDING_IMPLEMENTATION |
| REQ-FUNC-075 | EXCLUDED | — | — | — | N/A_EXCLUDED | N/A_EXCLUDED | EXCLUDED |
| REQ-FUNC-076 | EXCLUDED | — | — | — | N/A_EXCLUDED | N/A_EXCLUDED | EXCLUDED |
| REQ-FUNC-077 | IMPLEMENT | SCR-005 | /account | src/app/account/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-077 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-078 | IMPLEMENT | — (기술 Route) | not-found / error boundary | src/app/not-found.tsx, src/app/error.tsx | PENDING_TASK_GENERATION | TC-FUNC-078 | PENDING_IMPLEMENTATION |
| REQ-FUNC-079 | IMPLEMENT | 공통(SCR-001~005) | 전체 5개 Route | src/app/layout.tsx | PENDING_TASK_GENERATION | TC-FUNC-079 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-FUNC-080 | IMPLEMENT(변형) | SCR-003, SCR-005 | /travel-tools, /account | src/app/travel-tools/page.tsx, src/app/account/page.tsx | PENDING_TASK_GENERATION | TC-FUNC-080 | UI_APPROVED_PENDING_IMPLEMENTATION |


---

## 2. REQ-NF Traceability (REQ-NF-001 ~ 034)

### 5.1 Performance

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-001 | EXCLUDED | — | — | — | N/A_EXCLUDED | N/A_EXCLUDED | EXCLUDED |
| REQ-NF-002 | EXCLUDED | — | — | — | N/A_EXCLUDED | N/A_EXCLUDED | EXCLUDED |
| REQ-NF-003 | EXCLUDED | — | — | — | N/A_EXCLUDED | N/A_EXCLUDED | EXCLUDED |
| REQ-NF-004 | EXCLUDED | — | — | — | N/A_EXCLUDED | N/A_EXCLUDED | EXCLUDED |
| REQ-NF-005 | EXCLUDED | — | — | — | N/A_EXCLUDED | N/A_EXCLUDED | EXCLUDED |
| REQ-NF-006 | IMPLEMENT | — | — | — | PENDING_TASK_GENERATION | TC-NF-006 | PENDING_IMPLEMENTATION |
| REQ-NF-007 | EXCLUDED | — | — | — | N/A_EXCLUDED | N/A_EXCLUDED | EXCLUDED |

### 5.2 Reliability and Recovery

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-008 | EXCLUDED | — | — | — | N/A_EXCLUDED | N/A_EXCLUDED | EXCLUDED |
| REQ-NF-009 | EXCLUDED | — | — | — | N/A_EXCLUDED | N/A_EXCLUDED | EXCLUDED |
| REQ-NF-010 | EXCLUDED | — | — | — | N/A_EXCLUDED | N/A_EXCLUDED | EXCLUDED |
| REQ-NF-011 | EXCLUDED | — | — | — | N/A_EXCLUDED | N/A_EXCLUDED | EXCLUDED |

### 5.3 Security and Privacy

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-012 | IMPLEMENT | — | — | — | PENDING_TASK_GENERATION | TC-NF-012 | PENDING_IMPLEMENTATION |
| REQ-NF-013 | IMPLEMENT | — | — | — | PENDING_TASK_GENERATION | TC-NF-013 | PENDING_IMPLEMENTATION |
| REQ-NF-014 | IMPLEMENT | — | — | — | PENDING_TASK_GENERATION | TC-NF-014 | PENDING_IMPLEMENTATION |
| REQ-NF-015 | IMPLEMENT | — | — | — | PENDING_TASK_GENERATION | TC-NF-015 | PENDING_IMPLEMENTATION |
| REQ-NF-016 | IMPLEMENT | — | — | — | PENDING_TASK_GENERATION | TC-NF-016 | PENDING_IMPLEMENTATION |
| REQ-NF-017 | IMPLEMENT | — | — | — | PENDING_TASK_GENERATION | TC-NF-017 | PENDING_IMPLEMENTATION |
| REQ-NF-018 | EXCLUDED | — | — | — | N/A_EXCLUDED | N/A_EXCLUDED | EXCLUDED |

### 5.4 Safety and Moderation

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-019 | EXCLUDED | — | — | — | N/A_EXCLUDED | N/A_EXCLUDED | EXCLUDED |
| REQ-NF-020 | EXCLUDED | — | — | — | N/A_EXCLUDED | N/A_EXCLUDED | EXCLUDED |
| REQ-NF-021 | EXCLUDED | — | — | — | N/A_EXCLUDED | N/A_EXCLUDED | EXCLUDED |
| REQ-NF-022 | EXCLUDED | — | — | — | N/A_EXCLUDED | N/A_EXCLUDED | EXCLUDED |

### 5.5 Accessibility

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-023 | IMPLEMENT | 공통(SCR-001~005) | 전체 5개 Route | src/app/layout.tsx | PENDING_TASK_GENERATION | TC-NF-023 | UI_APPROVED_PENDING_IMPLEMENTATION |
| REQ-NF-024 | IMPLEMENT | — | — | — | PENDING_TASK_GENERATION | TC-NF-024 | PENDING_IMPLEMENTATION |
| REQ-NF-025 | EXCLUDED | — | — | — | N/A_EXCLUDED | N/A_EXCLUDED | EXCLUDED |

### 5.6 Content, Freshness, SEO, Copyright

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-026 | IMPLEMENT(변형) | — | — | — | PENDING_TASK_GENERATION | TC-NF-026 | PENDING_IMPLEMENTATION |
| REQ-NF-027 | IMPLEMENT | — | — | — | PENDING_TASK_GENERATION | TC-NF-027 | PENDING_IMPLEMENTATION |
| REQ-NF-028 | EXCLUDED | — | — | — | N/A_EXCLUDED | N/A_EXCLUDED | EXCLUDED |
| REQ-NF-029 | EXCLUDED | — | — | — | N/A_EXCLUDED | N/A_EXCLUDED | EXCLUDED |
| REQ-NF-030 | IMPLEMENT | — | — | — | PENDING_TASK_GENERATION | TC-NF-030 | PENDING_IMPLEMENTATION |

### 5.7 Maintainability, Monitoring, Cost

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-031 | IMPLEMENT | — | — | — | PENDING_TASK_GENERATION | TC-NF-031 | PENDING_IMPLEMENTATION |
| REQ-NF-032 | EXCLUDED | — | — | — | N/A_EXCLUDED | N/A_EXCLUDED | EXCLUDED |
| REQ-NF-033 | EXCLUDED | — | — | — | N/A_EXCLUDED | N/A_EXCLUDED | EXCLUDED |
| REQ-NF-034 | IMPLEMENT | — | — | — | PENDING_TASK_GENERATION | TC-NF-034 | PENDING_IMPLEMENTATION |

---

## 3. 집계

### 3.1 Requirement 총수 확인

| 구분 | 개수 |
|---|---:|
| REQ-FUNC-001~080 | 80 |
| REQ-NF-001~034 | 34 |
| **총합** | **114** |

### 3.2 Implementation Status별 개수

| Implementation Status | 개수 |
|---|---:|
| IMPLEMENT | 71 |
| IMPLEMENT(변형) | 13 |
| EXCLUDED | 30 |
| **합계** | **114** |

### 3.3 Status(생애주기)별 개수

| Status | 개수 | 의미 |
|---|---:|---|
| UI_APPROVED_PENDING_IMPLEMENTATION | 63 | Screen 목업이 Stitch에서 PASS로 승인되었으나 코드 구현은 아직 시작하지 않음 |
| PENDING_IMPLEMENTATION | 21 | 화면 없이(서버/스크립트/CI 등) 구현할 예정이며 아직 시작하지 않음 |
| EXCLUDED | 30 | `PROJECT_SCOPE.md` 기준 이번 MVP 범위에서 제외 확정 |
| **합계** | **114** | |

### 3.4 Task / Test 상태

| 열 | 값 | 개수 |
|---|---|---:|
| Task | `PENDING_TASK_GENERATION` | 84 (EXCLUDED 제외 전체) |
| Task | `N/A_EXCLUDED` | 30 |
| Test | `TC-FUNC-XXX` / `TC-NF-XXX`(예정 ID) | 84 |
| Test | `N/A_EXCLUDED` | 30 |

이 문서의 어떤 행도 Task가 실제로 생성되었거나 Test가 실제로 작성·실행되었음을 의미하지 않는다. Task 생성과 테스트 작성은 이 문서 이후 별도 단계에서 진행한다.

---

*— End of UIUX-TRACE-001 —*
