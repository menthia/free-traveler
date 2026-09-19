# Free Traveler — Project Scope (MVP 구현 범위 정의)

- **Document ID:** SCOPE-TRAVEL-001
- **기반 문서:** `01_PRD.md`, `02_SRS_BASELINE.md`
- **작성일:** 2026-09-17
- **상태:** Implementation Scope Baseline

---

## 1. 문서 목적

본 문서는 `01_PRD.md`와 `02_SRS_BASELINE.md`에 정의된 요구사항 중 이 저장소(`app/`)에서 실제로 구현할 범위와 방식을 확정한다. 모든 `REQ-FUNC-001~080`, `REQ-NF-001~034`에 대해 **IMPLEMENT**(구현하고 테스트) 또는 **EXCLUDED**(만들지 않으며 제외 이유를 기록)로 분류하고, 각 항목의 처리 방법과 확인 방법을 기록한다. 어떤 Requirement도 표에서 삭제하지 않는다.

---

## 2. 화면 구조

| 구분 | 화면 | 대응 라우트(예정) |
|---|---|---|
| 핵심 화면 1 | 여행지 목록/상세(국내·해외, 필터) | `/destinations`, `/destinations/[slug]` |
| 핵심 화면 2 | 항공·숙소 조건 입력·요약·외부 이동 | `/flights`, `/hotels` |
| 핵심 화면 3 | 동행 찾기(목록·상세·작성·참가 요청) | `/mates`, `/mates/[id]`, `/mates/new` |
| 핵심 화면 4 | 내 활동(내 글·요청·차단)과 간단 관리자 탭 | `/my/*`, `/admin/*` |
| 보조 화면 | 국가별 안전정보 및 대표(`free_traveler`) 소개 | `/safety/[countryCode]`, `/about` |

인증(`/auth/*`)은 핵심 화면 3·4에 종속된 흐름으로 별도 화면군에 포함하지 않는다.

---

## 3. 구현 방식 요약

| 영역 | 방식 | 비고 |
|---|---|---|
| 여행지·안전정보·대표 콘텐츠 | `src/data`의 정적 데이터(TypeScript/JSON) | 관리자 CRUD 화면 없음, 콘텐츠 변경은 코드 배포로 반영 |
| 즐겨찾기 | 브라우저 `localStorage` | 서버 영속화·계정 간 동기화 없음 |
| 참가 요청·신고·상태 알림 | 화면 내 Toast 및 페이지 상태 표시 | 실제 이메일 발송 없음 |
| 동행글 자동 마감 | 조회 시점에 `end_date` 경과 여부를 계산해 표시 | 배치 잡·크론 없음 |
| 안전정보 최신성(Stale) | 렌더링 시점에 `verified_at` 대비 경과일 계산 | 별도 배치·알림 없음 |
| 이미지 | 일반 인터넷 이미지 URL + `alt` 텍스트만 사용 | 라이선스·작가·업로드 메타데이터 관리 없음 |
| 관리자 기능 | 신고 상태 처리와 외부 URL(항공/호텔) 설정만 제공 | 콘텐츠 CRUD, 감사 로그, stale 대시보드 없음 |

---

## 4. 공통 제외 범위와 이유

| 제외 항목 | 이유 |
|---|---|
| 전체 콘텐츠 CMS(여행지·안전정보 관리자 CRUD·게시 상태 워크플로) | 콘텐츠를 `src/data` 정적 데이터로 관리하기로 결정, 별도 편집 UI 불필요 |
| 미디어 업로드·라이선스 승인 워크플로 | 이미지 정책을 "일반 URL + alt 텍스트"로 단순화, 업로드·라이선스 심사 불필요 |
| 범용 감사 로그(Audit Log) | 운영 인력·기간이 짧은 MVP 특성상 별도 이력 시스템 대신 git 이력으로 대체 |
| 자동 백업·장애 알림·부하 테스트 | 인프라 운영·모니터링 체계는 이 프로젝트 범위 밖(Vercel/Supabase 기본 제공에 의존) |
| 외부 이메일 사업자 연동 | 실제 발송 인프라 없이 Toast/화면 상태로 대체 |
| EC2·AWS 인프라 | Vercel 배포로 한정 |
| 무인 자동 Merge Runner | 코드 변경 승인은 사람이 수행 |

이 표에서 제외로 결정된 사유는 아래 4·5절의 개별 Requirement 표에서 반복 인용한다.

---

## 5. REQ-FUNC Traceability (REQ-FUNC-001 ~ 080)

### 5.1 F1. Destination Guide

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-001 | IMPLEMENT | 정적 데이터의 `scope`(DOMESTIC/OVERSEAS) 필드로 탭 분리 | Playwright: 탭 전환 시 목록 구분 확인 |
| REQ-FUNC-002 | IMPLEMENT | 국가·도시·계절·테마·기간 필터를 클라이언트에서 AND 조건으로 적용 | Playwright: 복합 필터 결과 검증 |
| REQ-FUNC-003 | IMPLEMENT | 클라이언트 부분 일치 키워드 검색 | Playwright: 키워드 검색·결과 없음 케이스 |
| REQ-FUNC-004 | IMPLEMENT | 여행지 콘텐츠 스키마에 소개·명소·시기·일정·예산·교통·음식·에티켓·출처·수정일 필드 정의 | 데이터 스키마 검증 스크립트 + 상세 페이지 렌더 테스트 |
| REQ-FUNC-005 | IMPLEMENT | 결과 없음 안내 문구와 필터 초기화 버튼 제공 | Playwright: 빈 결과 유도 후 안내·초기화 확인 |
| REQ-FUNC-006 | IMPLEMENT | 해외 여행지의 `countryCode`로 안전정보 라우트 연결 | Playwright: 해외 상세 → 안전정보 링크 이동 확인 |
| REQ-FUNC-007 | IMPLEMENT(변형) | 이미지 정책 단순화로 `alt` 텍스트와 출처 URL만 기록, 작가·라이선스 메타데이터 관리는 미제공 | 데이터 스키마 검증 스크립트(alt/URL 필수값) |
| REQ-FUNC-008 | IMPLEMENT | 정적 데이터 개수(국내 10+, 해외 15개국 30도시+)를 검증하는 스크립트 작성 | 빌드/테스트 단계 검증 스크립트 |
| REQ-FUNC-009 | IMPLEMENT | 동일 국가·테마 기준 관련 여행지 최대 6개 추천 로직 | Playwright: 상세 하단 추천 목록 노출 확인 |
| REQ-FUNC-010 | EXCLUDED | 필수 구현 범위(핵심 화면·안전정보·항공·호텔·동행·인증·신고·차단·관리자·테스트·배포) 밖의 UX 고도화이며 정적 데이터 규모상 필요성이 낮음 | 해당 없음 |

### 5.2 F2. Flight Link-out

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-011 | IMPLEMENT | 국가·지역·출발일·귀국일 4개 필수 필드와 라벨·오류 영역 구현 | Playwright: 필수값 누락 시 이동 버튼 비활성 확인 |
| REQ-FUNC-012 | IMPLEMENT | 국가 선택값 기준으로 지역 옵션 필터링, 국가 변경 시 지역값 초기화 | Playwright: 국가 변경 후 지역값 리셋 확인 |
| REQ-FUNC-013 | IMPLEMENT | 과거 출발일·역전된 귀국일 클라이언트 검증 | Playwright: 경계값 날짜 제출 차단 확인 |
| REQ-FUNC-014 | IMPLEMENT | 유효 입력 후 요약 단계 표시, 브라우저 상태(useState/세션)로 값 유지 | Playwright: 수정 후 폼 복귀 시 값 유지 확인 |
| REQ-FUNC-015 | IMPLEMENT | 폼·요약에 "입력값은 외부 사이트로 전달되지 않습니다" 문구 고정 노출 | Playwright: 문구 존재 확인 |
| REQ-FUNC-016 | IMPLEMENT | 환경변수 기반 항공 URL을 `window.open`으로 새 탭, `noopener,noreferrer` 적용, query 미부착 | Playwright: 새 탭 URL에 query 없음 확인 |
| REQ-FUNC-017 | IMPLEMENT | 항공 입력값은 컴포넌트 로컬 상태로만 유지, 서버 API·로그 미전송 | 네트워크 탭/코드 리뷰로 서버 전송 부재 확인 |
| REQ-FUNC-018 | IMPLEMENT | 외부 URL 미설정·허용목록 밖일 때 이동 차단과 재시도 UI 제공 | Playwright: URL 미설정 상태 오류 노출 확인 |

### 5.3 F3. Hotel Link-out

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-019 | IMPLEMENT | 국가·지역·체크인·체크아웃 4개 필수 필드 구현 | Playwright: 필수값 누락 시 이동 버튼 비활성 확인 |
| REQ-FUNC-020 | IMPLEMENT | 국가별 지역 옵션 필터링·초기화 | Playwright: 국가 변경 후 지역값 리셋 확인 |
| REQ-FUNC-021 | IMPLEMENT | 과거 체크인, 체크아웃≤체크인 검증 | Playwright: 경계값 날짜 제출 차단 확인 |
| REQ-FUNC-022 | IMPLEMENT | 요약 화면에 입력값 그대로 표시 | Playwright: 폼-요약 값 일치 확인 |
| REQ-FUNC-023 | IMPLEMENT | 비전달 고지 문구 표시 | Playwright: 문구 존재 확인 |
| REQ-FUNC-024 | IMPLEMENT | 환경변수 기반 호텔 URL을 새 탭·`noopener,noreferrer`로 오픈 | Playwright: 새 탭 URL에 query 없음 확인 |
| REQ-FUNC-025 | IMPLEMENT | 호텔 입력값 서버 미전송·미저장 | 네트워크 탭/코드 리뷰 확인 |
| REQ-FUNC-026 | IMPLEMENT | URL 오류 시 이동 차단·재시도 제공, 현재 입력 유지 | Playwright: 오류 상태에서 입력 유지 확인 |

### 5.4 F4. Travel Mate

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-027 | IMPLEMENT | Supabase Auth 세션 필요, 비회원 쓰기 요청 차단 | Playwright: 비로그인 상태 글쓰기 접근 시 로그인 이동 확인 |
| REQ-FUNC-028 | IMPLEMENT | `is_adult`, `adult_verified_at`만 저장, 생년월일 미저장 | 테이블 스키마 검증 + 성인 확인 플로우 테스트 |
| REQ-FUNC-029 | IMPLEMENT | 닉네임(필수)·연령대(필수)·성별(선택)·여행 스타일(필수)·자기소개 폼 구현 | Playwright: 프로필 등록 폼 필수값 검증 |
| REQ-FUNC-030 | IMPLEMENT | 국가·지역·기간 겹침·연령대·성별·스타일·모집 상태 필터, 차단 사용자 글 제외 | Playwright: 필터 결과 및 차단 사용자 제외 확인 |
| REQ-FUNC-031 | IMPLEMENT | 모집글 작성 폼(제목·국가·지역·기간·인원·조건·스타일·설명·안전수칙 동의) 구현 및 검증 | Playwright: 필수값 누락·날짜 역전 차단 확인 |
| REQ-FUNC-032 | IMPLEMENT | 정규식 기반 전화번호·이메일·메신저 ID 패턴 탐지 후 제출 차단 | 단위 테스트: 탐지 패턴 케이스셋 |
| REQ-FUNC-033 | IMPLEMENT | 모집글 응답에서 이메일·전화번호 등 연락처 필드 제외 | Playwright/API 응답 검사: 연락처 미노출 확인 |
| REQ-FUNC-034 | IMPLEMENT | 500자 이하 비공개 참가 메시지 제출, `PENDING` 저장 | Playwright: 참가 요청 제출·상태 확인 |
| REQ-FUNC-035 | IMPLEMENT | 동일 사용자·동일 글 중복 PENDING/ACCEPTED 요청 차단(DB unique + UI 오류) | 단위/통합 테스트: 중복 요청 차단 |
| REQ-FUNC-036 | IMPLEMENT | 작성자만 요청 상태를 ACCEPTED/REJECTED로 변경 | Playwright: 비작성자 접근 차단, 작성자 상태 변경 확인 |
| REQ-FUNC-037 | IMPLEMENT(변형) | 배치 작업 없이 조회 시점에 `end_date` 경과를 계산해 CLOSED로 표시 | Playwright: 종료일 경과 글의 목록 제외 확인 |
| REQ-FUNC-038 | IMPLEMENT | 작성자의 수동 마감·수정·삭제 기능, 승인된 요청자가 있을 때 경고 표시 | Playwright: 수정/마감/삭제 플로우 확인 |
| REQ-FUNC-039 | IMPLEMENT | 글·사용자·요청 신고 폼(사유 코드+설명) 및 접수 결과 표시 | Playwright: 신고 제출 및 접수 ID 노출 확인 |
| REQ-FUNC-040 | IMPLEMENT | 차단·해제 기능, 차단 시 상호 노출 제한 | Playwright: 차단 후 상대 글·프로필 비노출 확인 |
| REQ-FUNC-041 | IMPLEMENT(변형) | 간단한 관리자 탭에서 신고 상태(OPEN/RESOLVED/DISMISSED)별 목록·필터만 제공, 우선순위·증거 첨부 등 고급 기능 제외 | Playwright: 관리자 신고 목록/필터 확인 |
| REQ-FUNC-042 | IMPLEMENT(변형) | 관리자가 신고 상태 변경과 대상 게시물 숨김만 수행, 경고·계정 일시 제한·감사 로그는 제외(§4 참고) | Playwright: 신고 처리 후 게시물 숨김 반영 확인 |
| REQ-FUNC-043 | IMPLEMENT(변형) | 실제 이메일 발송 없이 Toast/화면 상태로 접수·승인·거절·신고 결과 표시 | Playwright: 상태 변경 시 Toast/화면 상태 노출 확인 |
| REQ-FUNC-044 | IMPLEMENT | Supabase RLS로 본인 글·요청, 작성자, Moderator/Admin만 비공개 데이터 열람 | 통합 테스트: 권한별 접근 시나리오 |
| REQ-FUNC-045 | EXCLUDED | 30일 지연 삭제 파이프라인·법적 보존 예외 처리·감사 로그는 범용 감사 로그·배치 인프라 제외 범위에 해당, 계정 삭제 시 프로필 즉시 비식별화만 제공 | 해당 없음 |

### 5.5 F5. Country Safety

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-046 | IMPLEMENT | 소개되는 해외 15개국 전체에 안전정보 정적 데이터 작성 | 데이터 검증 스크립트: 국가 수-안전정보 수 일치 |
| REQ-FUNC-047 | IMPLEMENT | 치안·사기·법규·교통·재난·보건·문화·긴급연락처 8개 카테고리 필드 구현 | 데이터 스키마 검증 스크립트 |
| REQ-FUNC-048 | IMPLEMENT | `source_name`, `source_url`, `verified_at`, `verified_by` 메타데이터 포함 | 데이터 스키마 검증 스크립트 |
| REQ-FUNC-049 | IMPLEMENT | 외교부 해외안전여행 링크를 새 탭·`noopener,noreferrer`로 제공 | Playwright: 링크 속성·이동 확인 |
| REQ-FUNC-050 | IMPLEMENT(변형) | 별도 배치 없이 렌더링 시점에 `verified_at` 대비 7일 경과 여부 계산해 stale 경고 표시 | Playwright: 경과일 7일 초과 데이터로 경고 노출 확인 |
| REQ-FUNC-051 | IMPLEMENT | 중대 경보 단계를 텍스트 라벨로 본문 상단에 표시(색상 단독 사용 금지) | Playwright/axe: 상단 노출 및 텍스트 라벨 확인 |
| REQ-FUNC-052 | IMPLEMENT | `scope_type`(COUNTRY/REGION), `scope_text` 필드로 범위 구분 | 데이터 스키마 검증 스크립트 |
| REQ-FUNC-053 | IMPLEMENT | 현지 긴급전화·영사콜센터 정보 표시 | 데이터 스키마 검증 + 상세 렌더 테스트 |
| REQ-FUNC-054 | IMPLEMENT | 공식 판단 대체 불가·출국 전 재확인 필요 고지 문구 표시 | Playwright: 안전 페이지·항공 요약 고지 노출 확인 |
| REQ-FUNC-055 | EXCLUDED | Editor/Admin 작성·검수·게시 워크플로는 전체 콘텐츠 CMS 제외 범위에 해당, 정적 데이터 직접 편집·배포로 대체 | 해당 없음 |
| REQ-FUNC-056 | EXCLUDED | 이전 값·새 값·사유 등 변경 이력 보존은 범용 감사 로그 제외 범위에 해당, git 커밋 이력으로 대체 | 해당 없음 |

### 5.6 F6. About free_traveler

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-057 | IMPLEMENT | 대표명·`50+ Trips`·`30+ Countries`를 단일 정적 데이터 소스에서 대표 페이지·홈에 표시 | Playwright: 두 위치 값 일치 확인 |
| REQ-FUNC-058 | IMPLEMENT | 확정 소개문·여행 철학·편집 원칙 전문 표시 | 렌더 테스트: 텍스트 노출 확인 |
| REQ-FUNC-059 | IMPLEMENT | 방문 국가 30개 이상 목록(권역 포함)으로 구현 | 데이터 검증 스크립트: 국가 수≥30 |
| REQ-FUNC-060 | IMPLEMENT | 연도·장소·요약을 포함한 여행 타임라인 표시 | 렌더 테스트: 타임라인 항목 노출 확인 |
| REQ-FUNC-061 | IMPLEMENT(변형) | 대표 이미지에 `alt` 텍스트와 출처 URL만 기록(라이선스·작가 메타데이터 관리 제외) | 데이터 스키마 검증 스크립트 |
| REQ-FUNC-062 | IMPLEMENT(변형) | 문의·SNS 링크를 정적 설정값으로 관리(관리자 UI 없음), 빈 값은 렌더링 제외 | 렌더 테스트: 빈 링크 미노출 확인 |
| REQ-FUNC-063 | IMPLEMENT | 대표 추천 여행지 6개를 공개 여행지 상세로 연결 | Playwright: 추천 링크 이동 확인 |

### 5.7 F7. Common, Admin, Governance

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-064 | IMPLEMENT | 전역 내비게이션·푸터에 핵심 화면·정책 페이지 링크 배치 | Playwright: 2회 이내 이동 경로 확인 |
| REQ-FUNC-065 | IMPLEMENT | Tailwind 반응형 레이아웃(320px~데스크톱) | 수동/Playwright 뷰포트 테스트 |
| REQ-FUNC-066 | IMPLEMENT | Supabase Auth 이메일 가입·인증·로그인·로그아웃·비밀번호 재설정 | Playwright: 인증 플로우 테스트 |
| REQ-FUNC-067 | IMPLEMENT | 여행지·안전정보 통합 키워드 검색과 결과 유형 라벨 | Playwright: 통합 검색 결과 확인 |
| REQ-FUNC-068 | IMPLEMENT(변형) | 즐겨찾기를 `localStorage`에 저장(서버 영속화 없음), 중복 방지 | Playwright: 즐겨찾기 추가/해제/중복 방지 확인 |
| REQ-FUNC-069 | EXCLUDED | 필수 구현 범위 밖의 부가 UX이며 브라우저 기본 URL 복사로 충분히 대체 가능 | 해당 없음 |
| REQ-FUNC-070 | IMPLEMENT | Next.js Metadata API로 title/description/canonical/OG 제공 | 자동 메타데이터 검사 스크립트 |
| REQ-FUNC-071 | EXCLUDED | 별도 분석 이벤트 수집 인프라 구축은 필수 구현 범위·구현 방식에 없음, KPI 계측은 MVP 이후 과제 | 해당 없음 |
| REQ-FUNC-072 | EXCLUDED | Editor/Admin 콘텐츠 CRUD·미리보기는 전체 콘텐츠 CMS 제외 범위에 해당 | 해당 없음 |
| REQ-FUNC-073 | EXCLUDED | 미디어 업로드 시 출처·작가·라이선스 필수 입력은 미디어 업로드·라이선스 워크플로 제외 범위에 해당 | 해당 없음 |
| REQ-FUNC-074 | IMPLEMENT(변형) | 관리자 UI 대신 정적 데이터 필수 필드 검증 스크립트/테스트로 게시 전 완전성 검사 수행 | 데이터 검증 스크립트: 누락 목록 반환 |
| REQ-FUNC-075 | EXCLUDED | stale 현황·담당자 대시보드는 관리자가 신고 상태와 외부 URL만 다루는 범위 밖 | 해당 없음 |
| REQ-FUNC-076 | EXCLUDED | 관리자 변경·신고 처리·권한 변경 감사 로그는 범용 감사 로그 제외 범위에 해당 | 해당 없음 |
| REQ-FUNC-077 | IMPLEMENT | Admin이 항공·호텔 외부 URL을 허용목록 내 HTTPS로 설정(Supabase 설정 테이블 또는 환경변수+관리자 화면) | Playwright: URL 설정 저장·비HTTPS 값 차단 확인 |
| REQ-FUNC-078 | IMPLEMENT | 404·500·권한 없음·외부 연결 실패 화면에 홈/이전/재시도 버튼 제공 | Playwright: 각 오류 화면 복구 행동 확인 |
| REQ-FUNC-079 | IMPLEMENT | 시맨틱 HTML과 ARIA 상태를 폼·모달·탭·알림에 적용 | axe-core 자동 검사 + 키보드 수동 확인 |
| REQ-FUNC-080 | IMPLEMENT(변형) | 이용약관·개인정보 처리방침·동행 안전수칙·콘텐츠 면책 정적 페이지 제공, 모집글 작성 시 동의 여부(boolean)와 시각만 저장(버전별 정책 이력 관리 없음) | Playwright: 동의 미체크 시 제출 차단 확인 |

---

## 6. REQ-NF Traceability (REQ-NF-001 ~ 034)

### 6.1 Performance

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-001 | EXCLUDED | 정량적 LCP 측정·성능 CI는 부하 테스트 제외 범위에 준함, Next.js 기본 최적화만 적용 | 해당 없음 |
| REQ-NF-002 | EXCLUDED | INP 실측 인프라 미구축, 상호작용 최적화는 코드 수준에서만 고려 | 해당 없음 |
| REQ-NF-003 | EXCLUDED | CLS 실측 인프라 미구축 | 해당 없음 |
| REQ-NF-004 | EXCLUDED | 필터 응답 p95 측정 인프라 없음(기능 자체는 REQ-FUNC-002/030으로 구현됨) | 해당 없음 |
| REQ-NF-005 | EXCLUDED | 쓰기 API 응답 p95 측정 인프라 없음 | 해당 없음 |
| REQ-NF-006 | IMPLEMENT | Next.js `Image` 컴포넌트의 반응형 크기·lazy load·priority 기본 기능 사용 | 코드 리뷰: `Image` 컴포넌트 사용 확인 |
| REQ-NF-007 | EXCLUDED | Lighthouse CI 성능 예산 게이트는 부하 테스트·CI 인프라 제외 범위에 해당 | 해당 없음 |

### 6.2 Reliability and Recovery

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-008 | EXCLUDED | 가용성 SLA 측정·모니터링은 자동 백업·장애 알림 제외 범위에 해당, Vercel 기본 인프라에 의존 | 해당 없음 |
| REQ-NF-009 | EXCLUDED | 5xx 비율 모니터링 인프라 미구축 | 해당 없음 |
| REQ-NF-010 | EXCLUDED | DB 백업 RPO/RTO 체계는 자동 백업 제외 범위에 명시적으로 해당 | 해당 없음 |
| REQ-NF-011 | EXCLUDED | 외부 링크 주간 자동 검사 배치는 인프라 제외 범위에 해당, 배포 전 수동 점검으로 대체 | 해당 없음 |

### 6.3 Security and Privacy

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-012 | IMPLEMENT | Vercel 배포 기본 HTTPS/TLS 사용 | 배포 설정 확인 |
| REQ-NF-013 | IMPLEMENT | Supabase Auth 세션·역할 검증과 RLS 정책 서버 적용 | 통합 테스트: 권한별 접근 시나리오 |
| REQ-NF-014 | IMPLEMENT | Next.js Server Actions/Route Handler 기본 CSRF 방어와 SameSite 쿠키 사용 | 코드 리뷰·보안 테스트 |
| REQ-NF-015 | IMPLEMENT | 입력 검증(zod 등)과 이스케이프 처리로 저장 XSS 차단 | 단위 테스트: 악성 입력 케이스 |
| REQ-NF-016 | IMPLEMENT | 비밀키는 Vercel 환경변수로 관리, 클라이언트 번들 미포함 | 빌드 산출물 검사 |
| REQ-NF-017 | IMPLEMENT | 항공·호텔 원시 입력값 서버·분석 미저장(REQ-FUNC-017/025와 동일 구현) | 네트워크·로그 검사 |
| REQ-NF-018 | EXCLUDED | 개인정보 내보내기와 30일 지연 삭제 파이프라인은 범용 감사 로그·배치 인프라 제외 범위에 해당, 계정 삭제 시 즉시 비식별화만 제공 | 해당 없음 |

### 6.4 Safety and Moderation

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-019 | EXCLUDED | 신고 접수 응답 p95 측정 인프라 없음(기능 자체는 REQ-FUNC-039로 구현됨) | 해당 없음 |
| REQ-NF-020 | EXCLUDED | 신고 1차 검토 SLA 추적·알림 인프라는 제외 범위에 해당, 운영자가 관리자 탭에서 수동 확인 | 해당 없음 |
| REQ-NF-021 | EXCLUDED | 사용자별 요청 속도 제한(429) 미들웨어 인프라는 필수 구현 범위 밖 | 해당 없음 |
| REQ-NF-022 | EXCLUDED | Moderator 조치 추적성(감사 로그)은 범용 감사 로그 제외 범위에 해당 | 해당 없음 |

### 6.5 Accessibility

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-023 | IMPLEMENT | WCAG 2.2 Level AA를 목표로 시맨틱 마크업·대체텍스트·라벨 적용 | axe-core 자동 검사 |
| REQ-NF-024 | IMPLEMENT | Playwright 핵심 Smoke Test에 axe-core 검사 포함 | Playwright+axe: serious/critical 0건 확인 |
| REQ-NF-025 | EXCLUDED | 모든 Use Case에 대한 정식 키보드/스크린리더 수동 QA 프로세스는 운영 리소스 밖, 핵심 흐름 개발 중 키보드 동작만 확인 | 해당 없음 |

### 6.6 Content, Freshness, SEO, Copyright

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-026 | IMPLEMENT | 여행지 콘텐츠 완전성 검증 스크립트(REQ-FUNC-074와 동일) | 데이터 검증 스크립트 |
| REQ-NF-027 | IMPLEMENT | 해외 국가 안전정보 커버리지 100% 검증(REQ-FUNC-046과 동일) | 데이터 검증 스크립트 |
| REQ-NF-028 | EXCLUDED | 안전정보 7일 이내 확인율 95%는 콘텐츠 운영 KPI로 소프트웨어가 자동 보장할 수 없음, stale 경고 기능 자체는 REQ-FUNC-050으로 구현됨 | 해당 없음 |
| REQ-NF-029 | EXCLUDED | 미디어 라이선스 메타데이터 100%는 이미지 정책 단순화(alt+URL만)로 제외 | 해당 없음 |
| REQ-NF-030 | IMPLEMENT | 공개 페이지 SEO 메타데이터 누락 검사(REQ-FUNC-070과 동일) | 자동 메타데이터 검사 스크립트 |

### 6.7 Maintainability, Monitoring, Cost

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-031 | IMPLEMENT | TypeScript strict 모드·ESLint·단위 테스트를 main 병합 전 실행 | CI 파이프라인 통과 확인 |
| REQ-NF-032 | EXCLUDED | 구조화 로그 수집·저장 인프라는 모니터링 제외 범위와 연계되어 제외 | 해당 없음 |
| REQ-NF-033 | EXCLUDED | 5분 이내 핵심 오류 알림은 장애 알림 제외 범위에 명시적으로 해당 | 해당 없음 |
| REQ-NF-034 | IMPLEMENT | Vercel/Supabase 무료 또는 최저 유료 티어를 선택해 월 10만원 이하 목표를 아키텍처 선택으로 충족 | 사용 서비스 요금제 확인 |

---

## 7. 검증 지원 체계

| 항목 | 방식 |
|---|---|
| 데이터 무결성 | 정적 데이터(`src/data`) 필수 필드·수량 검증 스크립트(REQ-FUNC-004/008/074, REQ-NF-026/027) |
| 핵심 흐름 회귀 테스트 | Playwright 핵심 Smoke Test(여행지 탐색, 항공/호텔 요약·이동, 동행 참가 요청, 신고·차단, 안전정보 stale 표시) |
| 접근성 | Playwright 실행 중 axe-core 검사(REQ-NF-024) |
| 배포 | Vercel 배포, 환경변수로 외부 URL·Supabase 키 관리 |

---

## 8. 요약 통계

| 구분 | 개수 |
|---|---:|
| REQ-FUNC 전체 | 80 |
| REQ-FUNC IMPLEMENT(변형 포함) | 70 |
| REQ-FUNC EXCLUDED | 10 |
| REQ-NF 전체 | 34 |
| REQ-NF IMPLEMENT | 14 |
| REQ-NF EXCLUDED | 20 |

*— End of SCOPE-TRAVEL-001 —*
