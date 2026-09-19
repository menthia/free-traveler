# Free Traveler — UI Coverage Analysis (5-Screen 배치)

- **Document ID:** UICOV-TRAVEL-001
- **기반 문서:** `01_PRD.md`, `02_SRS_BASELINE.md`, `PROJECT_SCOPE.md`
- **작성일:** 2026-09-17
- **상태:** UI Coverage Baseline

---

## 1. 목적

`02_SRS_BASELINE.md`의 `REQ-FUNC-001~080`, `REQ-NF-001~034`(총 114개) 전체를 유지한 채, 각 Requirement가 어떤 성격의 요구사항인지(UI 직접/상태/비-UI/운영)를 분류하고, `PROJECT_SCOPE.md`의 구현 여부와 함께 정확히 5개의 디자인 Screen에 배치한다. 어떤 Requirement도 삭제하지 않으며, `PROJECT_SCOPE.md`에서 EXCLUDED로 결정된 항목은 이 문서에서도 EXCLUDED를 유지한다.

---

## 2. 분류 기준

| 분류 | 정의 |
|---|---|
| **UI_DIRECT** | 화면에 그려지는 구체적 요소(필드·버튼·문구·배지·목록·Drawer/Modal·탭)로 직접 표현되는 요구사항 |
| **UI_STATE** | 화면 표시 여부·전환·검증·게이팅·세션 유지·중복 방지 등 화면 뒤의 규칙/상태로 표현되는 요구사항 |
| **NON_UI** | 화면에 시각적으로 나타나지 않는 서버·보안·저장·스키마 제약(예: 서버 미저장, RLS, TLS) |
| **OPERATIONS** | 앱 UI가 아니라 콘텐츠 거버넌스·모니터링·SLA·감사·비용 등 운영 프로세스로 처리되는 요구사항 |

---

## 3. 디자인 Screen 정의 (정확히 5개)

### SCR-001 `/` 메인

| 항목 | 내용 |
|---|---|
| 사용자 목표 | 국내·해외 여행지를 탐색하고, 상세 정보와 해당 국가의 안전정보를 확인한다 |
| 주요 영역 | 국내/해외 탭, 필터(국가·도시·계절·테마·기간), 통합 키워드 검색, 여행지 카드 목록, 빈 결과 안내+초기화, 즐겨찾기 토글, 여행지 상세 **Drawer/Modal**, 안전정보 상세 **Drawer/Modal**, 전역 내비게이션·푸터 |
| 상태 | 목록 로딩 / 필터 적용 중 / 결과 없음 / 여행지 Drawer 열림 / 안전정보 Drawer 열림(및 Stale 경고) / 즐겨찾기 On·Off |
| 이동 목적지 | 여행지 Drawer → 안전정보 Drawer(같은 Screen 내 전환), SCR-003(조건 정리 CTA), SCR-002(대표 추천 여행지 진입점), SCR-005(즐겨찾기 확인을 위한 로그인 유도) |

### SCR-002 `/about` 대표 소개

| 항목 | 내용 |
|---|---|
| 사용자 목표 | `free_traveler`의 여행 경험과 편집 기준을 확인해 콘텐츠 신뢰도를 판단한다 |
| 주요 영역 | 대표 이미지+한 문장 소개, `50+ Trips`/`30+ Countries` 카드, 여행 철학·편집 원칙, 방문 국가 목록, 여행 타임라인, 추천 여행지 6개, 문의·SNS 링크 |
| 상태 | 정적 콘텐츠 기본 노출(별도 상태 적음), 추천 여행지 카드 hover/클릭 |
| 이동 목적지 | 추천 여행지 카드 → SCR-001(해당 여행지 Drawer) |

### SCR-003 `/travel-tools` 통합 여행 준비 (3개 탭)

| 항목 | 내용 |
|---|---|
| 사용자 목표 | 항공·숙소 조건을 정리하고 외부 사이트로 이동하거나, 동행 모집글을 작성한다 |
| 주요 영역 | **탭1 항공**(국가·지역·출발일·귀국일 → 검증 → 요약 → 비전달 고지 → 외부 이동), **탭2 호텔**(국가·지역·체크인·체크아웃 → 검증 → 요약 → 비전달 고지 → 외부 이동), **탭3 동행 작성**(제목·국가·지역·기간·인원·선호조건·스타일·설명·연락처 탐지·안전수칙 동의 → 게시) |
| 상태 | 입력 중 / 필드 오류 / 요약 확인 / 외부 이동 성공·실패(재시도) / 연락처 탐지 차단 / 게시 성공 / 로그인·성인 확인 필요 게이트 |
| 이동 목적지 | 항공/호텔 외부 일반 사이트(새 탭), SCR-005(로그인·성인 확인 유도), SCR-004(동행글 게시 완료 후 목록/상세 이동) |

### SCR-004 `/mates` 동행 조회 (상세 패널)

| 항목 | 내용 |
|---|---|
| 사용자 목표 | 조건이 맞는 동행 모집글을 찾아 참가를 요청하거나, 작성자로서 요청을 처리한다 |
| 주요 영역 | 필터(국가·지역·기간 겹침·연령대·성별·스타일·모집 상태), 모집글 목록, **상세 패널**(조건·설명·작성자, 참가 요청 폼, 승인·거절(작성자 뷰), 신고·차단 버튼) |
| 상태 | 목록 로딩 / 필터 적용 / 상세 패널 열림 / 참가 요청 제출(PENDING) / 중복 요청 차단 / 승인·거절 처리 / 신고 접수 / 차단 완료 / 자동 마감(조회 시 CLOSED 계산) |
| 이동 목적지 | SCR-003(새 동행글 작성 탭), SCR-005(로그인·성인 확인 유도, 내 활동에서 요청 상태 확인) |

### SCR-005 `/account` 계정·관리 (4개 탭)

| 항목 | 내용 |
|---|---|
| 사용자 목표 | 계정을 관리하고 내 활동(글·요청·차단)을 확인하며, 운영 권한자는 신고와 외부 URL을 관리한다 |
| 주요 영역 | **탭1 로그인/가입**(이메일 인증·로그아웃·재설정), **탭2 프로필**(닉네임·연령대·성별·스타일·자기소개·성인 확인), **탭3 내 활동**(내 모집글 관리, 참가 요청 상태, 차단 목록, 즐겨찾기 목록), **탭4 관리자**(신고 상태 처리, 외부 URL 설정 — Moderator/Admin에게만 노출) |
| 상태 | 비로그인 / 로그인 / 성인 확인 미완료·완료 / 일반회원 뷰 / 모더레이터·관리자 뷰 |
| 이동 목적지 | SCR-003(동행 작성으로 이동), SCR-004(내 글 상세로 이동), SCR-001(즐겨찾기 여행지 상세로 이동) |

### 디자인 Screen이 아닌 기술 Route

다음은 사용자가 직접 탐색하는 디자인 Screen이 아니라 기술적으로만 존재하는 Route이며, 5개 Screen 수에 포함하지 않는다.

| Route 유형 | 예시 | 관련 Requirement |
|---|---|---|
| API Route | `/api/destinations`, `/api/mates`, `/api/mates/[id]/applications`, `/api/reports`, `/api/admin/*` 등 | REQ-FUNC-017/025/033/035/044, REQ-NF-012~017 |
| 인증 Callback | Supabase Auth 이메일 인증/재설정 콜백 | REQ-FUNC-066 |
| 오류 처리 Route | 404 · 500 · 권한 없음 · 외부 연결 실패 | REQ-FUNC-078 |

---

## 4. REQ-FUNC Requirement 매핑 (REQ-FUNC-001 ~ 080)

### 4.1 F1. Destination Guide

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE 분류 | Screen 배치 |
|---|---|---|---|---|
| REQ-FUNC-001 | 국내·해외 여행지 목록 구분 | UI_DIRECT | IMPLEMENT | SCR-001 (탭) |
| REQ-FUNC-002 | 국가·도시·계절·테마·기간 필터 | UI_DIRECT | IMPLEMENT | SCR-001 |
| REQ-FUNC-003 | 키워드 검색 | UI_DIRECT | IMPLEMENT | SCR-001 |
| REQ-FUNC-004 | 상세 필수 콘텐츠 항목 표시 | UI_DIRECT | IMPLEMENT | SCR-001 (여행지 Drawer/Modal) |
| REQ-FUNC-005 | 결과 없음 안내·초기화 | UI_DIRECT | IMPLEMENT | SCR-001 |
| REQ-FUNC-006 | 해외 상세 → 안전정보 연결 | UI_DIRECT | IMPLEMENT | SCR-001 (안전정보 Drawer/Modal 전환) |
| REQ-FUNC-007 | 대표 이미지 alt·출처 | UI_DIRECT | IMPLEMENT(변형) | SCR-001 |
| REQ-FUNC-008 | 게시 수량 기준(국내10+/해외15개국30도시+) 검증 | OPERATIONS | IMPLEMENT(변형) | — (콘텐츠 검증 스크립트, 비-UI) |
| REQ-FUNC-009 | 관련 여행지 최대 6개 추천 | UI_DIRECT | IMPLEMENT | SCR-001 |
| REQ-FUNC-010 | 필터 상태 URL query 반영 | UI_STATE | EXCLUDED | — (제외, 해당 시 SCR-001 예정지였음) |

### 4.2 F2. Flight Link-out

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE 분류 | Screen 배치 |
|---|---|---|---|---|
| REQ-FUNC-011 | 항공 필수 입력 4필드 | UI_DIRECT | IMPLEMENT | SCR-003 (항공 탭) |
| REQ-FUNC-012 | 국가별 지역 옵션 한정·초기화 | UI_STATE | IMPLEMENT | SCR-003 (항공 탭) |
| REQ-FUNC-013 | 과거·역전 날짜 제출 차단 | UI_STATE | IMPLEMENT | SCR-003 (항공 탭) |
| REQ-FUNC-014 | 입력 요약 단계 표시 | UI_DIRECT | IMPLEMENT | SCR-003 (항공 탭) |
| REQ-FUNC-015 | 입력값 비전달 고지 | UI_DIRECT | IMPLEMENT | SCR-003 (항공 탭) |
| REQ-FUNC-016 | 새 탭 외부 이동(noopener, query 없음) | UI_STATE | IMPLEMENT | SCR-003 (항공 탭) |
| REQ-FUNC-017 | 항공 입력값 서버 미저장 | NON_UI | IMPLEMENT | — |
| REQ-FUNC-018 | URL 오류 시 이동 차단·재시도 | UI_STATE | IMPLEMENT | SCR-003 (항공 탭) |

### 4.3 F3. Hotel Link-out

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE 분류 | Screen 배치 |
|---|---|---|---|---|
| REQ-FUNC-019 | 호텔 필수 입력 4필드 | UI_DIRECT | IMPLEMENT | SCR-003 (호텔 탭) |
| REQ-FUNC-020 | 국가별 지역 옵션 한정·초기화 | UI_STATE | IMPLEMENT | SCR-003 (호텔 탭) |
| REQ-FUNC-021 | 과거·역전 날짜 제출 차단 | UI_STATE | IMPLEMENT | SCR-003 (호텔 탭) |
| REQ-FUNC-022 | 입력 요약 표시 | UI_DIRECT | IMPLEMENT | SCR-003 (호텔 탭) |
| REQ-FUNC-023 | 입력값 비전달 고지 | UI_DIRECT | IMPLEMENT | SCR-003 (호텔 탭) |
| REQ-FUNC-024 | 새 탭 외부 이동(noopener, query 없음) | UI_STATE | IMPLEMENT | SCR-003 (호텔 탭) |
| REQ-FUNC-025 | 호텔 입력값 서버 미저장 | NON_UI | IMPLEMENT | — |
| REQ-FUNC-026 | URL 오류 시 이동 차단·재시도 | UI_STATE | IMPLEMENT | SCR-003 (호텔 탭) |

### 4.4 F4. Travel Mate

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE 분류 | Screen 배치 |
|---|---|---|---|---|
| REQ-FUNC-027 | 쓰기 작업 이메일 인증 세션 요구 | UI_STATE | IMPLEMENT | SCR-003 (동행 작성 탭 게이팅) / SCR-005 (로그인 유도) |
| REQ-FUNC-028 | 성인 확인 요구, 생년월일 미저장 | UI_STATE | IMPLEMENT | SCR-005 (성인 확인) / SCR-003 (게이팅) |
| REQ-FUNC-029 | 동행 프로필(닉네임·연령대·성별·스타일·소개) | UI_DIRECT | IMPLEMENT | SCR-005 (프로필 탭) |
| REQ-FUNC-030 | 다중 조건(국가·기간겹침·연령대·성별·스타일·상태) 필터 | UI_DIRECT | IMPLEMENT | SCR-004 |
| REQ-FUNC-031 | 모집글 작성 폼 | UI_DIRECT | IMPLEMENT | SCR-003 (동행 작성 탭) |
| REQ-FUNC-032 | 본문 연락처 패턴 탐지·제출 차단 | UI_STATE | IMPLEMENT | SCR-003 (동행 작성 탭) |
| REQ-FUNC-033 | 연락처 비노출 표시 규칙 | UI_STATE | IMPLEMENT | SCR-004 (상세 패널) |
| REQ-FUNC-034 | 참가 메시지(500자) 비공개 제출 | UI_DIRECT | IMPLEMENT | SCR-004 (상세 패널) |
| REQ-FUNC-035 | 중복 PENDING/ACCEPTED 요청 차단 | UI_STATE | IMPLEMENT | SCR-004 (상세 패널) |
| REQ-FUNC-036 | 작성자 승인·거절 처리 | UI_DIRECT | IMPLEMENT | SCR-004 (상세 패널, 작성자 뷰) / SCR-005 (내 활동 탭) |
| REQ-FUNC-037 | 종료일 경과 자동 마감(조회 시 계산) | UI_STATE | IMPLEMENT(변형) | SCR-004 |
| REQ-FUNC-038 | 작성자 수동 마감·수정·삭제 | UI_DIRECT | IMPLEMENT | SCR-005 (내 활동 탭) |
| REQ-FUNC-039 | 신고 제출(사유 코드+설명) | UI_DIRECT | IMPLEMENT | SCR-004 (상세 패널) |
| REQ-FUNC-040 | 차단·해제 | UI_DIRECT | IMPLEMENT | SCR-004 (상세 패널) / SCR-005 (내 활동 탭) |
| REQ-FUNC-041 | 관리자 신고 큐(상태별 목록) | UI_DIRECT | IMPLEMENT(변형) | SCR-005 (관리자 탭) |
| REQ-FUNC-042 | 관리자 조치(상태 변경·게시물 숨김) | UI_DIRECT | IMPLEMENT(변형) | SCR-005 (관리자 탭) |
| REQ-FUNC-043 | 접수·승인·거절·신고 알림(Toast/화면 상태) | UI_DIRECT | IMPLEMENT(변형) | SCR-004 / SCR-005 (공통 Toast) |
| REQ-FUNC-044 | RLS 기반 비공개 데이터 열람 제한 | NON_UI | IMPLEMENT | — |
| REQ-FUNC-045 | 탈퇴 시 비식별화·삭제·감사 로그 | OPERATIONS | EXCLUDED | — |

### 4.5 F5. Country Safety

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE 분류 | Screen 배치 |
|---|---|---|---|---|
| REQ-FUNC-046 | 게시 해외국가 안전 페이지 커버리지 100% | OPERATIONS | IMPLEMENT | — (콘텐츠 커버리지 검증, 비-UI) |
| REQ-FUNC-047 | 8개 필수 안전 카테고리 표시 | UI_DIRECT | IMPLEMENT | SCR-001 (안전정보 Drawer/Modal) |
| REQ-FUNC-048 | 출처·확인일·편집자 메타 표시 | UI_DIRECT | IMPLEMENT | SCR-001 |
| REQ-FUNC-049 | 외교부 원문 링크(새 탭) | UI_DIRECT | IMPLEMENT | SCR-001 |
| REQ-FUNC-050 | 7일 초과 Stale 경고(렌더 시 계산) | UI_STATE | IMPLEMENT(변형) | SCR-001 |
| REQ-FUNC-051 | 중대 경보 상단 텍스트 표시 | UI_DIRECT | IMPLEMENT | SCR-001 |
| REQ-FUNC-052 | 국가·지역 경보 범위 구분 표시 | UI_DIRECT | IMPLEMENT | SCR-001 |
| REQ-FUNC-053 | 긴급연락처·영사콜센터 표시 | UI_DIRECT | IMPLEMENT | SCR-001 |
| REQ-FUNC-054 | 공식 판단 대체 불가 고지 | UI_DIRECT | IMPLEMENT | SCR-001 (및 SCR-003 항공 요약) |
| REQ-FUNC-055 | Editor/Admin 안전 콘텐츠 작성·검수 워크플로 | OPERATIONS | EXCLUDED | — |
| REQ-FUNC-056 | 안전정보 변경 이력 보존 | OPERATIONS | EXCLUDED | — |

### 4.6 F6. About free_traveler

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE 분류 | Screen 배치 |
|---|---|---|---|---|
| REQ-FUNC-057 | 대표명·`50+ Trips`·`30+ Countries` 표시 | UI_DIRECT | IMPLEMENT | SCR-002 |
| REQ-FUNC-058 | 소개문·철학·편집 원칙 표시 | UI_DIRECT | IMPLEMENT | SCR-002 |
| REQ-FUNC-059 | 방문 국가 30개 이상 목록/지도 | UI_DIRECT | IMPLEMENT | SCR-002 |
| REQ-FUNC-060 | 여행 타임라인 | UI_DIRECT | IMPLEMENT | SCR-002 |
| REQ-FUNC-061 | 대표 이미지 alt·출처 | UI_DIRECT | IMPLEMENT(변형) | SCR-002 |
| REQ-FUNC-062 | 문의·SNS 링크 | UI_DIRECT | IMPLEMENT(변형) | SCR-002 |
| REQ-FUNC-063 | 추천 여행지 6개 연결 | UI_DIRECT | IMPLEMENT | SCR-002 → SCR-001 |

### 4.7 F7. Common, Admin, Governance

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE 분류 | Screen 배치 |
|---|---|---|---|---|
| REQ-FUNC-064 | 전역 내비게이션·푸터 | UI_DIRECT | IMPLEMENT | 공통(전 Screen) |
| REQ-FUNC-065 | 320px~데스크톱 반응형 | UI_STATE | IMPLEMENT | 공통(전 Screen) |
| REQ-FUNC-066 | 이메일 가입·인증·로그인·로그아웃·재설정 | UI_DIRECT | IMPLEMENT | SCR-005 (로그인 탭) |
| REQ-FUNC-067 | 여행지·안전정보 통합 검색 | UI_DIRECT | IMPLEMENT | SCR-001 |
| REQ-FUNC-068 | 여행지 즐겨찾기(localStorage) | UI_DIRECT | IMPLEMENT(변형) | SCR-001 (토글) / SCR-005 (내 활동 목록) |
| REQ-FUNC-069 | 공개 페이지 URL 공유 | UI_DIRECT | EXCLUDED | — (제외, 해당 시 전 Screen 공통 예정지였음) |
| REQ-FUNC-070 | 페이지별 SEO 메타데이터 | NON_UI | IMPLEMENT | — |
| REQ-FUNC-071 | 행동 분석 이벤트 기록 | NON_UI | EXCLUDED | — |
| REQ-FUNC-072 | Editor/Admin 콘텐츠 CRUD·미리보기 | OPERATIONS | EXCLUDED | — |
| REQ-FUNC-073 | 미디어 업로드 시 라이선스 메타 필수 입력 | OPERATIONS | EXCLUDED | — |
| REQ-FUNC-074 | 게시 전 완전성 게이트 | OPERATIONS | IMPLEMENT(변형) | — (검증 스크립트, 비-UI) |
| REQ-FUNC-075 | Stale 현황·담당자 대시보드 | OPERATIONS | EXCLUDED | — |
| REQ-FUNC-076 | 관리자 변경·신고 처리 감사 로그 | OPERATIONS | EXCLUDED | — |
| REQ-FUNC-077 | 항공·호텔 외부 URL 허용목록 관리 | UI_DIRECT | IMPLEMENT | SCR-005 (관리자 탭) |
| REQ-FUNC-078 | 404·500·권한없음·외부연결실패 복구 행동 | UI_DIRECT | IMPLEMENT | — (기술 Route, 디자인 Screen 아님) |
| REQ-FUNC-079 | 폼·모달·탭·알림 ARIA/시맨틱 | UI_STATE | IMPLEMENT | 공통(전 Screen) |
| REQ-FUNC-080 | 약관·정책·안전수칙 동의 기록 | UI_DIRECT | IMPLEMENT(변형) | SCR-003 (동행 작성 탭 동의) / SCR-005 (정책 열람) |

---

## 5. REQ-NF Requirement 매핑 (REQ-NF-001 ~ 034)

### 5.1 Performance

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE 분류 | Screen 배치 |
|---|---|---|---|---|
| REQ-NF-001 | LCP p75 ≤2.5s | OPERATIONS | EXCLUDED | — |
| REQ-NF-002 | INP p75 ≤200ms | OPERATIONS | EXCLUDED | — |
| REQ-NF-003 | CLS p75 ≤0.1 | OPERATIONS | EXCLUDED | — |
| REQ-NF-004 | 필터 응답 p95 ≤1s | OPERATIONS | EXCLUDED | — |
| REQ-NF-005 | 쓰기 API 응답 p95 ≤3s | OPERATIONS | EXCLUDED | — |
| REQ-NF-006 | 이미지 반응형·lazy load | NON_UI | IMPLEMENT | — (전역 이미지 구현 방식) |
| REQ-NF-007 | Lighthouse 성능 예산 CI | OPERATIONS | EXCLUDED | — |

### 5.2 Reliability and Recovery

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE 분류 | Screen 배치 |
|---|---|---|---|---|
| REQ-NF-008 | 월간 가용성 ≥99.5% | OPERATIONS | EXCLUDED | — |
| REQ-NF-009 | 내부 API 5xx ≤0.5% | OPERATIONS | EXCLUDED | — |
| REQ-NF-010 | DB 백업 RPO/RTO | OPERATIONS | EXCLUDED | — |
| REQ-NF-011 | 외부/공식 출처 링크 주간 자동 검사 | OPERATIONS | EXCLUDED | — |

### 5.3 Security and Privacy

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE 분류 | Screen 배치 |
|---|---|---|---|---|
| REQ-NF-012 | TLS 1.2 이상 | NON_UI | IMPLEMENT | — |
| REQ-NF-013 | 인증·역할·RLS 서버 검증 | NON_UI | IMPLEMENT | — |
| REQ-NF-014 | CSRF 방어·SameSite 쿠키 | NON_UI | IMPLEMENT | — |
| REQ-NF-015 | 입력 검증·저장 XSS 차단 | NON_UI | IMPLEMENT | — |
| REQ-NF-016 | 비밀키 환경변수 관리 | NON_UI | IMPLEMENT | — |
| REQ-NF-017 | 항공·호텔 원시 입력값 미보존 | NON_UI | IMPLEMENT | — |
| REQ-NF-018 | 개인정보 내보내기·탈퇴·삭제 요청 | OPERATIONS | EXCLUDED | — |

### 5.4 Safety and Moderation

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE 분류 | Screen 배치 |
|---|---|---|---|---|
| REQ-NF-019 | 신고 접수 응답 p95 ≤3s | OPERATIONS | EXCLUDED | — |
| REQ-NF-020 | 신고 1차 검토 24h 이내 90% | OPERATIONS | EXCLUDED | — |
| REQ-NF-021 | 사용자별 요청 속도 제한(429) | NON_UI | EXCLUDED | — |
| REQ-NF-022 | Moderator 조치 추적 가능성(감사 로그) | OPERATIONS | EXCLUDED | — |

### 5.5 Accessibility

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE 분류 | Screen 배치 |
|---|---|---|---|---|
| REQ-NF-023 | WCAG 2.2 Level AA 목표 | UI_STATE | IMPLEMENT | 공통(전 Screen) |
| REQ-NF-024 | 자동 접근성 검사(axe) | OPERATIONS | IMPLEMENT | — (테스트 프로세스, 비-UI) |
| REQ-NF-025 | 전체 UC 키보드·스크린리더 수동 검사 | OPERATIONS | EXCLUDED | — |

### 5.6 Content, Freshness, SEO, Copyright

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE 분류 | Screen 배치 |
|---|---|---|---|---|
| REQ-NF-026 | 여행지 콘텐츠 완전성 100% | OPERATIONS | IMPLEMENT(변형) | — |
| REQ-NF-027 | 해외 안전정보 커버리지 100% | OPERATIONS | IMPLEMENT | — |
| REQ-NF-028 | 안전정보 7일 이내 확인 95% | OPERATIONS | EXCLUDED | — |
| REQ-NF-029 | 미디어 라이선스 메타데이터 100% | OPERATIONS | EXCLUDED | — |
| REQ-NF-030 | 공개 페이지 SEO 메타데이터 누락 0건 | NON_UI | IMPLEMENT | — |

### 5.7 Maintainability, Monitoring, Cost

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE 분류 | Screen 배치 |
|---|---|---|---|---|
| REQ-NF-031 | TypeScript strict·lint·unit test | OPERATIONS | IMPLEMENT | — |
| REQ-NF-032 | 구조화 로그 | OPERATIONS | EXCLUDED | — |
| REQ-NF-033 | 핵심 오류 5분 이내 알림 | OPERATIONS | EXCLUDED | — |
| REQ-NF-034 | 월 인프라 비용 목표 | OPERATIONS | IMPLEMENT | — |

---

## 6. 집계

### 6.1 Requirement 총수 확인

| 구분 | 개수 |
|---|---:|
| REQ-FUNC-001~080 | 80 |
| REQ-NF-001~034 | 34 |
| **총합** | **114** |

### 6.2 UI 분류별 개수

| 분류 | FUNC | NF | 합계 |
|---|---:|---:|---:|
| UI_DIRECT | 47 | 0 | 47 |
| UI_STATE | 18 | 1 | 19 |
| NON_UI | 5 | 9 | 14 |
| OPERATIONS | 10 | 24 | 34 |
| **합계** | **80** | **34** | **114** |

### 6.3 PROJECT_SCOPE 분류별 개수

| 분류 | FUNC | NF | 합계 |
|---|---:|---:|---:|
| IMPLEMENT(변형 포함) | 70 | 14 | 84 |
| EXCLUDED | 10 | 20 | 30 |
| **합계** | **80** | **34** | **114** |

### 6.4 Screen별 배치 Requirement 수 (UI_DIRECT·UI_STATE 중 EXCLUDED 제외)

| Screen | 주로 배치된 Requirement (대표 ID) | 비고 |
|---|---|---|
| SCR-001 `/` | 001~007, 009, 047~049, 051~054, 067, 068 등 | 여행지·안전정보 Drawer/Modal 포함 |
| SCR-002 `/about` | 057~063 | 정적 대표 소개 |
| SCR-003 `/travel-tools` | 011~016, 018~024, 026, 027~028, 031~032, 080 등 | 항공·호텔·동행작성 3탭 |
| SCR-004 `/mates` | 030, 033~037, 039~040 | 상세 패널 포함 |
| SCR-005 `/account` | 027~029, 036, 038, 040~043, 066, 077 | 로그인·프로필·내활동·관리자 4탭 |
| 공통(전 Screen) | 064, 065, 079, REQ-NF-023 | 내비게이션·반응형·접근성 |
| 디자인 Screen 아님(기술 Route) | REQ-FUNC-078 및 API/인증 콜백 관련 항목 | §3 "디자인 Screen이 아닌 기술 Route" 참고 |

디자인 Screen은 SCR-001~005 정확히 5개이며, 그 외 배치는 모두 "공통" 또는 "기술 Route"로 한정한다.

---

*— End of UICOV-TRAVEL-001 —*
