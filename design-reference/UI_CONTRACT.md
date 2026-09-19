# Free Traveler — UI Implementation Contract

- **Document ID:** UI-CONTRACT-001
- **기반 문서:** `docs/03_UI_COVERAGE_ANALYSIS.md`, `docs/04_UIUX_PLAN.md`, `docs/STITCH_VALIDATION_REPORT.md`, `design-reference/D-001/DESIGN.md`
- **연계 파일:** `design-reference/SCREEN_ROUTE_CONTRACT.json` (기계 판독용 동일 계약)
- **작성일:** 2026-09-19
- **상태:** Implementation Contract — Next.js App Router

---

## 0. 화면 분류

| 구분 | Screen |
|---|---|
| **핵심 화면(4개)** | SCR-001(여행지 탐색), SCR-003(여행 준비), SCR-004(동행 조회), SCR-005(계정·관리) |
| **보조 화면(1개)** | SCR-002(대표 소개) |

---

## 1. SCR-001 — 여행지 탐색 메인

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-001 |
| **Route** | `/` |
| **Page Entry** | `src/app/page.tsx` |
| **영역 순서** | Header → ① 검색 Hero(560px/Mobile 420px, `/travel-tools` CTA) → ② 국내 인기 여행지 Card Grid 6 → ③ 해외 인기 여행지 Card Grid 6(배경 톤 교대) → ④ 여행 동기·테마 Chip 6 → ⑤ 국가별 주의사항 Card Grid 6(안전정보 Drawer 연결) → ⑥ 최근 동행글 Card 3 또는 완성형 Empty State → ⑦ free_traveler 요약(좌우분할) → Footer |
| **주요 Component** | Header, Footer, SearchBar(pill), DestinationCardGrid, ThemeChipFilter, SafetyCard, SafetyDrawer, DestinationDrawer, MatePreviewCard, CuratorSummaryBlock |
| **상태** | Loading(카드 스켈레톤) · Success(목록/Drawer 정상) · Empty(최근 동행글 없음 — 이용방법+CTA 포함) · Warning(안전정보 Stale 배지) · Error(목록/안전정보 로드 실패 + 재시도) |
| **사용자 행동** | 키워드 검색, 테마 Chip 선택(목록 필터링), 여행지 카드 클릭(Drawer 오픈), 안전정보 카드 클릭(Drawer 오픈), 즐겨찾기 토글, CTA 클릭(여행 준비/동행 찾기/대표 소개 이동) |
| **다른 화면으로의 이동** | → SCR-003(Hero CTA "여행 준비 시작하기"), → SCR-004(동행 CTA "동행 더 보기"/"동행 모집 글 올리기"), → SCR-002(free_traveler 요약 CTA "대표 소개 더 보기"), → SCR-005(즐겨찾기 이용 시 로그인 유도) |
| **Desktop·Mobile 규칙** | Desktop: 콘텐츠 최대 폭 1200~1280px, Card Grid 3열, Hero 560px, 안전정보/여행지 상세는 Drawer(사이드 패널). Mobile(390px): Hero 420px, Card Grid 1열, Chip 가로 스크롤, 상세는 하단 Drawer, 좌우 여백 20px |
| **금지 기능** | 실제 항공·호텔 실시간 검색·가격 비교(OS-01/OS-03), 여행지 관리자 CRUD/CMS UI(REQ-FUNC-072 EXCLUDED), 필터 상태 URL 반영(REQ-FUNC-010 EXCLUDED), URL 공유 버튼(REQ-FUNC-069 EXCLUDED), 광고 배너, 사용자 리뷰·별점, Lorem ipsum/"준비 중"/"정보 확인 필요" 문구 |

---

## 2. SCR-002 — 대표 소개 (보조 화면)

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-002 |
| **Route** | `/about` |
| **Page Entry** | `src/app/about/page.tsx` |
| **영역 순서** | Header → ① Hero(460~480px, 대표 사진+한 줄 소개) → ② 여행 지표 Card 3(50+/30+/권역 수) → ③ 소개·철학 좌우분할(2~4문단) → ④ 여행 Timeline 6개 이상 → ⑤ 방문 국가 권역별 Chip(4개 권역, "30개국" 헤드라인) → ⑥ 여행 Gallery 8장 이상 → ⑦ 기억에 남는 여행지 Card 4 + CTA Banner → Footer |
| **주요 Component** | Header, Footer, ProfileHero, StatCardGroup, TimelineList, RegionChipGroup, GalleryGrid, MemorableDestinationCard, CTABanner |
| **상태** | Success(정적 콘텐츠 기본 노출) · Loading(Gallery 이미지 지연 로드) — Empty/Error 상태 불필요(정적 콘텐츠 상시 존재) |
| **사용자 행동** | Gallery/추천 여행지 카드 열람 및 클릭, CTA 버튼 클릭 |
| **다른 화면으로의 이동** | → SCR-001(추천 여행지 카드·방문 국가 Chip 클릭 시 해당 Drawer 자동 오픈), → SCR-003("여행 준비하기" CTA Banner), → SCR-004("동행 찾기" CTA Banner) |
| **Desktop·Mobile 규칙** | Desktop: Hero 460~480px, 지표/Gallery/추천 Card Grid 3~4열. Mobile(390px): Hero 400px대, Card Grid 1열, Gallery 가로 스크롤 허용, 좌우분할 Section은 세로 스택 |
| **금지 기능** | 미디어 업로드·라이선스 승인 워크플로 UI(REQ-FUNC-073 EXCLUDED), 대표 콘텐츠 관리자 CRUD(REQ-FUNC-072 EXCLUDED), "외교부 연계 실시간 안전 검증 완료" 류 실시간 연동 과장 문구, 광고, Lorem ipsum/"준비 중"/"정보 확인 필요" 문구 |

---

## 3. SCR-003 — 통합 여행 준비

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-003 |
| **Route** | `/travel-tools` |
| **Page Entry** | `src/app/travel-tools/page.tsx` |
| **영역 순서** | Header → ① Intro(3단계 이용 안내) → ② 탭(항공편/숙소/동행 구하기) → ③ 조건 입력 Form(항공/숙소 탭 전용, 필드는 탭별 상이) → ④ 입력 요약 + 외부 이동 Action Card(항공/숙소 탭 전용) → ⑤ 비전달 고지 + 이용 Tip 3개 → ⑥ 동행 탭 전용: 로그인·성인확인 게이트 또는 작성 Form + 안전 안내 → Footer |
| **주요 Component** | Header, Footer, StepGuideIntro, TabBar(항공편/숙소/동행 구하기), ConditionForm, DateFieldPair, SummaryList, OutboundActionCard, DisclosureBanner, TipList, LoginGateCard, MateComposeForm |
| **상태** | 탭별 독립 상태: Loading(옵션 로드/제출 중) · Success(요약 표시/외부 이동/게시 완료) · Error(날짜 검증 실패, 외부 URL 오류, 연락처 탐지 차단) · Unauthorized(동행 탭 비로그인/성인 미확인) |
| **사용자 행동** | 탭 전환, 국가·지역·날짜 입력, 유효성 검증 통과 후 요약 확인, "항공편/숙소 보러 가기" 클릭(새 탭 외부 이동), 동행 모집글 작성·안전수칙 동의·게시 |
| **다른 화면으로의 이동** | → 외부 항공/호텔 사이트(새 탭, `noopener,noreferrer`, 내부 화면 아님), → SCR-005(동행 탭 로그인·성인확인 유도), → SCR-004(동행글 게시 완료 후 이동) |
| **Desktop·Mobile 규칙** | Desktop: Form 2단(국가/지역 좌, 날짜 2개 우), 요약+Action Card 좌우분할, 탭 가로 배치. Mobile(390px): Form 1단 스택, 요약/Action Card 세로 배치, 탭 가로 스크롤, Tip 카드 세로 스택 |
| **금지 기능** | 실제 항공권/호텔 검색 결과 및 가격 비교·재고 확인(OS-01~OS-03), 예약·발권·결제·환불 UI, 입력값의 서버 저장·외부 URL 쿼리 전달(CON-01/CON-02), 광고, Lorem ipsum/"준비 중"/"정보 확인 필요" 문구 |

---

## 4. SCR-004 — 동행 조회

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-004 |
| **Route** | `/mates` |
| **Page Entry** | `src/app/mates/page.tsx` |
| **영역 순서** | Header → ① Intro + 글 작성 CTA → ② 검색 Filter(국가·지역·기간·모집 상태) + 결과 요약 → ③ 동행글 목록(최대 8개 Card, 없으면 완성형 Empty State) → ④ Desktop 목록+상세 좌우분할 / Mobile 목록→상세 Drawer(참가 요청·승인거절·신고·차단) → ⑤ 신청 방법 3단계 안내 → ⑥ 안전·신고·차단 안내 CTA Banner → Footer |
| **주요 Component** | Header, Footer, IntroBlock, FilterBar(국가/지역/기간/모집상태), MatePostCard, MateDetailPanel, MateDetailDrawer(Mobile), ApplicationForm, StepGuide, SafetyCTABanner |
| **상태** | Loading(목록·상세 스켈레톤) · Success(목록·상세 정상) · Empty(필터 결과 없음/전체 게시글 없음 — 문구 분리, 이용방법+CTA 포함) · Error(중복 요청, 마감글 요청, 로드 실패) · Unauthorized(비로그인 참가 요청 시도) |
| **사용자 행동** | 필터 적용/초기화, 목록 카드 클릭(상세 진입), 참가 요청 메시지 제출, 작성자 승인·거절, 신고 제출, 차단, 목록 정렬(최신순/마감임박순) |
| **다른 화면으로의 이동** | → SCR-003(동행글 작성 탭 이동), → SCR-005(로그인·성인 확인 유도, 내 활동에서 요청 상태 확인) |
| **Desktop·Mobile 규칙** | Desktop: 목록(좌 40%)+상세(우 60%) 좌우분할, 목록 Card 세로 스택. Mobile(390px): 목록 1열, 카드 탭 시 상세가 하단 Drawer로 슬라이드 업 |
| **금지 기능** | 실시간 채팅·영상통화·실시간 위치 공유(OS-04), 공개 연락처(전화번호/이메일/메신저 ID) 노출, **사용자 간 별점·평점·리뷰 기능**(SCR-004 검증 과정에서 발견되어 제거된 사례), 신원·안전 보증 표현, Lorem ipsum/"준비 중"/"정보 확인 필요" 문구 |

---

## 5. SCR-005 — 계정·관리

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-005 |
| **Route** | `/account` |
| **Page Entry** | `src/app/account/page.tsx` |
| **영역 순서** | Header → 역할별 가변 구성(현재 역할에 없는 탭·Section은 렌더링하지 않음): <br>**Guest** — 계정 기능 Intro → 로그인/가입/비밀번호 재설정 Card → 로그인 후 가능한 기능 Chip 목록 → 보안·개인정보 안내 <br>**Member(탭: 프로필/내 활동)** — 프로필·성인 확인 요약 → 정책 동의 현황 → 내 글/보낸·받은 참가 요청/차단 목록/즐겨찾기(각 Empty 시 완성형 Empty State) → 새 동행글 작성 CTA <br>**Admin(+관리자 탭)** — 관리 범위 Intro → 신고 큐(상태 필터+처리 액션) → 외부 URL 설정 Form → Footer |
| **주요 Component** | Header, Footer, AuthForm(로그인/가입/재설정), ProfileSummaryCard, AdultVerificationCard, PolicyConsentList, MyPostList, MyApplicationList, ReceivedApplicationList, BlockList, FavoriteList, AdminReportQueue, ExternalUrlForm |
| **상태** | Loading(로그인/저장 처리 중) · Success(각 탭 콘텐츠 정상) · Empty(내 글/요청/차단/즐겨찾기/신고 큐 없음 — 이용방법+CTA 포함) · Error(로그인 실패, 저장 실패, URL 형식 오류) · Unauthorized(비로그인 상태에서 Member/Admin 탭 접근 시 로그인 화면으로 유도) |
| **사용자 행동** | 로그인/가입/비밀번호 재설정, 프로필 수정, 성인 확인, 내 글 수정·마감, 참가 요청 승인·거절, 차단 해제, 즐겨찾기 이동, 신고 상태 변경(관리자), 외부 URL 저장(관리자) |
| **다른 화면으로의 이동** | → SCR-003(새 동행글 작성 탭), → SCR-004(내 글 상세로 이동), → SCR-001(즐겨찾기 여행지 상세로 이동) |
| **Desktop·Mobile 규칙** | Desktop: 탭 가로 배치, 리스트형 Card 세로 스택. Mobile(390px): 탭 가로 스크롤, 모든 Card 1열, 폼 필드 1단 |
| **금지 기능** | 콘텐츠 CMS·미디어 업로드 관리 UI(REQ-FUNC-072/073 EXCLUDED), **대시보드형 차트·그래프·KPI 통계**(관리자 탭 포함 전면 금지), 범용 감사 로그 열람 UI(REQ-FUNC-076 EXCLUDED), 신분증 기반 신원 인증 고도화, 실제 회원 탈퇴 30일 지연삭제·법적 보존 예외 처리 UI(REQ-FUNC-045 EXCLUDED), Lorem ipsum/"준비 중"/"정보 확인 필요" 문구 |

---

## 6. 화면 간 이동 관계 요약

| From | To | 트리거 |
|---|---|---|
| SCR-001 | SCR-002 | Hero/요약 CTA "대표 소개 더 보기" |
| SCR-001 | SCR-003 | Hero CTA "여행 준비 시작하기" |
| SCR-001 | SCR-004 | "동행 더 보기" / "동행 모집 글 올리기" |
| SCR-001 | SCR-005 | 즐겨찾기 이용 시 로그인 유도 |
| SCR-002 | SCR-001 | 추천 여행지 카드·방문 국가 Chip 클릭(Drawer 자동 오픈) |
| SCR-002 | SCR-003 | CTA Banner "여행 준비하기" |
| SCR-002 | SCR-004 | CTA Banner "동행 찾기" |
| SCR-003 | (외부 사이트) | "항공편/숙소 보러 가기"(내부 화면 아님, 새 탭) |
| SCR-003 | SCR-004 | 동행글 게시 완료 후 이동 |
| SCR-003 | SCR-005 | 동행 탭 로그인·성인확인 게이트 |
| SCR-004 | SCR-003 | "동행글 작성하기" |
| SCR-004 | SCR-005 | 로그인 유도, 내 활동에서 요청 상태 확인 |
| SCR-005 | SCR-001 | 즐겨찾기 여행지 바로가기 |
| SCR-005 | SCR-003 | 새 동행글 작성 CTA |
| SCR-005 | SCR-004 | 내 글 상세로 이동 |
| (전 화면 공통) | SCR-001, SCR-002, SCR-003, SCR-004 | Header 내비게이션 링크(모든 화면에서 상시 접근) |
| (전 화면 공통) | SCR-005 | Header 계정 버튼(모든 화면에서 상시 접근) |

---

## 7. 기술 Route(디자인 Screen 수에 미포함)

| 유형 | 예시 경로 | 비고 |
|---|---|---|
| 인증 콜백 | `src/app/auth/callback/route.ts` | Supabase Auth 이메일 인증/재설정 콜백. SCR-005 Guest 흐름에서 발생하지만 별도 화면이 아닌 Route Handler |
| API Route | `src/app/api/destinations/route.ts`, `src/app/api/mates/route.ts`, `src/app/api/mates/[id]/applications/route.ts`, `src/app/api/applications/[id]/route.ts`, `src/app/api/blocks/route.ts`, `src/app/api/reports/route.ts`, `src/app/api/admin/reports/route.ts`, `src/app/api/admin/settings/outbound/route.ts` | 데이터 조회/쓰기 전용, UI Screen 아님 |
| 404 | `src/app/not-found.tsx` | REQ-FUNC-078 복구 행동(홈/이전/재시도) 포함 |
| 500/오류 경계 | `src/app/error.tsx` | REQ-FUNC-078 복구 행동 포함 |

---

*— End of UI-CONTRACT-001 —*
