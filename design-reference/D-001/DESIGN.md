---
version: D-001
name: Free-Traveler-Design-System
description: An original, white-canvas travel-planning design system anchored on a single coral accent (#FF6A4D) and a dark warm-gray ink (#262425) — never pure black. Type runs Inter with a system Korean sans-serif fallback stack, no proprietary font files. The shape language borrows only the structural idea of generous whitespace, photo-first rounded cards, and a pill-shaped search bar from consumer-marketplace design — it does not reuse any vendor's colors, type names, iconography, or booking/payment UI. This document is the single locked source of truth for Free Traveler's five core screens (SCR-001~SCR-005) and their two mobile variants (SCR-001, SCR-003), validated in `docs/STITCH_VALIDATION_REPORT.md`.

colors:
  canvas: "#FFFFFF"
  surface-soft: "#F7F6F4"
  surface-strong: "#F0EEEA"
  ink: "#262425"
  body: "#4B4749"
  muted: "#78737A"
  hairline: "#E4E0DC"
  coral: "#FF6A4D"
  coral-active: "#E14E32"
  coral-tint: "#FFE3D8"
  on-coral: "#FFFFFF"
  info-text: "#1D5C8A"
  info-bg: "#EAF3FA"
  warning-text: "#9A5B12"
  warning-bg: "#FFF3E1"
  error-text: "#B3261E"
  error-bg: "#FDECEA"
  success-text: "#1E7C4C"
  success-bg: "#E9F7EF"

typography:
  display-xl:
    fontFamily: "Inter, -apple-system, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', system-ui, sans-serif"
    fontSizeDesktop: 36px
    fontSizeMobile: 28px
    fontWeight: 700
    lineHeight: 1.25
    use: "Hero 제목(h1)"
  display-lg:
    fontFamily: "Inter, ... (동일 fallback)"
    fontSizeDesktop: 26px
    fontSizeMobile: 22px
    fontWeight: 700
    lineHeight: 1.3
    use: "Section 제목(h2)"
  display-md:
    fontSizeDesktop: 20px
    fontSizeMobile: 18px
    fontWeight: 600
    lineHeight: 1.4
    use: "카드 그룹 소제목"
  title-md:
    fontSizeDesktop: 17px
    fontSizeMobile: 16px
    fontWeight: 600
    lineHeight: 1.4
    use: "카드·탭 제목"
  body-md:
    fontSizeDesktop: 16px
    fontSizeMobile: 15px
    fontWeight: 400
    lineHeight: 1.6
    use: "본문 설명(1~3문장)"
  body-sm:
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    use: "카드 메타, 보조 설명"
  caption:
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.4
    use: "라벨, 배지, 폼 캡션"
  button-md:
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.25
    use: "버튼 라벨"

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  base: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section-desktop-min: 64px
  section-desktop-max: 96px
  section-mobile-min: 40px
  section-mobile-max: 64px

rounded:
  button: 10px
  card: 16px
  pill: 999px

elevation:
  none: "flat, no shadow — 95% of surfaces (body, footer, section 배경)"
  tier-1: "0 1px 2px rgba(38,36,37,0.06), 0 8px 20px rgba(38,36,37,0.08) — Card hover, Drawer, Dropdown, Toast에만 적용"
  scrim: "rgba(0,0,0,0.5) — Drawer/Modal 배경"

breakpoints:
  desktop: 1440px
  mobile: 390px
  tablet-transition: "744~1128px"
---

## 0. Overview

Free Traveler는 여행지 탐색·항공숙소 조건 정리·동행 매칭·국가 안전정보·대표(`free_traveler`) 소개를 한 곳에서 제공하는 여행 준비 허브다. 이 문서는 `design-reference/vendor/airbnb/DESIGN.md`(이하 Vendor Reference)를 **구조적 참고**로만 사용해 작성한 **독자 디자인 정본(D-001)**이며, Airbnb의 색상 값·폰트명·아이콘·워드마크·예약(Reserve)·결제(Checkout) UI 패턴은 어떤 형태로도 재현하지 않는다.

Vendor Reference에서 참고한 것은 다음 **구조적 원칙**뿐이다:
1. 순백 캔버스 위에 단일 포인트 컬러만 사용하는 절제된 색상 전략
2. 사진 중심의 둥근 모서리 카드
3. 완전히 둥근(pill) 검색창
4. 그림자 계층을 1단계로만 제한하는 절제된 elevation

이 문서는 `docs/04_UIUX_PLAN.md`에서 정의한 토큰·화면 설계를 `docs/STITCH_VALIDATION_REPORT.md`에서 **PASS로 확정된 실제 승인 화면(SCR-001~005, SCR-001/003 Mobile)**의 콘텐츠 구조와 대조해 최종 고정한 것이다. 이후 이 저장소의 모든 화면 구현은 이 문서를 기준으로 삼는다.

---

## 1. Color Token

| 토큰 | 값 | 용도 | 금지 사항 |
|---|---|---|---|
| `canvas` | `#FFFFFF` | 기본 배경(흰 배경) | — |
| `surface-soft` | `#F7F6F4` | 인접 Section을 시각적으로 구분하는 톤(같은 Card Grid가 반복될 때) | — |
| `surface-strong` | `#F0EEEA` | 카드 내부 보조 배경, 비활성 필드 | — |
| `ink` | `#262425` | 제목·본문 짙은 회색 텍스트 | 순검정(`#000000`) 사용 금지 |
| `body` | `#4B4749` | 긴 설명문 본문 | — |
| `muted` | `#78737A` | 캡션, 보조 라벨, 비활성 텍스트 | — |
| `hairline` | `#E4E0DC` | 구분선, 카드 테두리 | — |
| `coral` | `#FF6A4D` | **브랜드 포인트 전용** — 주요 CTA, 활성 탭, 배지 | 코랄을 경고·오류·안전정보 색상으로 겸용 금지 |
| `coral-active` | `#E14E32` | 코랄 버튼 클릭(press) 상태 | — |
| `coral-tint` | `#FFE3D8` | 코랄 비활성/배경 톤 | — |
| `on-coral` | `#FFFFFF` | 코랄 배경 위 텍스트 | — |
| `info-text` / `info-bg` | `#1D5C8A` / `#EAF3FA` | 안전정보 일반 안내(청색 계열, 코랄과 다른 색상군) | — |
| `warning-text` / `warning-bg` | `#9A5B12` / `#FFF3E1` | 여행경보 중대 단계, Stale 경고, 관리자 신고 OPEN 상태 | — |
| `error-text` / `error-bg` | `#B3261E` / `#FDECEA` | 폼 검증 실패, 오류 화면 | — |
| `success-text` / `success-bg` | `#1E7C4C` / `#E9F7EF` | 신고 처리 완료, 요청 승인 완료 | — |

**규칙:** 이 표에 없는 색상(임의 hex 값)을 화면에 새로 도입하지 않는다. 새 의미가 필요하면 이 문서에 토큰을 먼저 추가한 뒤 사용한다. 색상만으로 상태를 구분하지 않고 텍스트 라벨을 항상 병기한다(예: "OPEN", "최신 정보 재확인 필요").

---

## 2. Typography

- **폰트 스택:** `Inter, -apple-system, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', system-ui, sans-serif`
- Inter는 오픈소스 웹폰트로 Google Fonts CDN 또는 시스템 폰트 스택에서 로드한다. **Airbnb Cereal VF 등 타사 상용/독점 폰트 파일을 저장소에 포함하거나 임베드하지 않는다.**
- 한글 본문은 Inter가 커버하지 못하는 글리프를 시스템 한글 폰트(Apple SD Gothic Neo, Noto Sans KR, Malgun Gothic)가 자동 대체한다.

| 토큰 | Desktop | Mobile | Weight | 용도 |
|---|---|---|---|---|
| `display-xl` | 36px/1.25 | 28px/1.3 | 700 | Hero 제목(h1) |
| `display-lg` | 26px/1.3 | 22px/1.35 | 700 | Section 제목(h2) |
| `display-md` | 20px/1.4 | 18px/1.4 | 600 | 카드 그룹 소제목 |
| `title-md` | 17px/1.4 | 16px/1.4 | 600 | 카드·탭 제목 |
| `body-md` | 16px/1.6 | 15px/1.6 | 400 | 본문 설명 |
| `body-sm` | 14px/1.5 | 14px/1.5 | 400 | 카드 메타 |
| `caption` | 13px/1.4 | 13px/1.4 | 500 | 라벨, 배지, 폼 캡션 |
| `button-md` | 16px/1.25 | 16px/1.25 | 600 | 버튼 라벨 |

가장 큰 타이포그래피는 Hero 제목(`display-xl`)이며, 판매·평점·가격류의 강조 숫자를 크게 키우는 용도로 이 스케일을 사용하지 않는다(별점·리뷰 자체가 이 시스템에 존재하지 않음, §13 참고).

---

## 3. Spacing

| 토큰 | 값 |
|---|---|
| `xxs`~`xxl` | 4 · 8 · 12 · 16 · 24 · 32 · 48px |
| Section 상하 여백(Desktop) | **64~96px** |
| Section 상하 여백(Mobile) | **40~64px** |
| Mobile 좌우 여백 | 20px |
| Card 내부 패딩 | 16~24px |
| Card Grid 간격(Desktop) | 24px / (Mobile, 1열) | 16px |

---

## 4. Radius

| 토큰 | 값 | 적용 대상 |
|---|---|---|
| `radius.card` | 16px | 여행지 Card, Mate Post Card, Drawer 패널, Form Card |
| `radius.button` | 10px | Primary/Secondary 버튼 |
| `radius.pill` | 999px | 검색창, Chip, 탭 배지, Badge |

하드 코너(radius 0)는 전역 그리드 컨테이너를 제외하고 사용하지 않는다.

---

## 5. Shadow (Elevation)

단일 그림자 계층만 사용한다.

| 계층 | 값 | 적용 대상 |
|---|---|---|
| 무광(기본) | 없음 | 본문, Hero, Footer, 전체 Section 배경의 95% |
| Tier-1(유일한 그림자) | `0 1px 2px rgba(38,36,37,0.06), 0 8px 20px rgba(38,36,37,0.08)` | Card hover, Drawer, Modal, Dropdown, Toast |
| Scrim | `rgba(0,0,0,0.5)` | Drawer/Modal 뒷배경 |

2단계 이상의 점진적 elevation을 만들지 않는다 — 깊이감은 사진과 여백, radius로 표현한다.

---

## 6. Header · Footer (5개 화면 공통)

### Header
| 항목 | Desktop(1440px) | Mobile(390px) |
|---|---|---|
| 높이 | 72px | 56px |
| 배경 | `canvas`, 하단 1px `hairline` | 동일 |
| 좌측 | `Free Traveler` 텍스트 워드마크(`title-md`, `ink`) | 동일, 축약 없음 |
| 내비게이션 | 여행지 · 여행 준비 · 동행 찾기 · 대표 소개 텍스트 링크, 현재 화면은 `coral` 밑줄 | 햄버거 버튼 → 전체화면 Sheet로 동일 4개 링크 + 계정 |
| 우측 | 계정 버튼(비로그인 "로그인" / 로그인 시 닉네임+아바타 이니셜) → `/account` | Sheet 최상단 계정 카드 |

### Footer
| 컬럼 | 내용 |
|---|---|
| 서비스 | 여행지 탐색, 여행 준비, 동행 찾기, 대표 소개 |
| 정책 | 이용약관, 개인정보 처리방침, 동행 안전수칙, 콘텐츠 면책 안내 |
| 안전·출처 고지 | 외교부 해외안전여행 출처 고지 + 항공·숙소 정보 비전달 고지 2줄 |
| Legal Band | `© 2026 Free Traveler. 여행 정보는 참고용이며 실제 예약과 안전 판단은 각 공식 서비스에서 확인하세요.` (`caption`, `muted`) |

Desktop 3열 그리드, Mobile 1열 스택. Legal Band는 항상 최하단 별도 줄.

---

## 7. Search · Filter

| 컴포넌트 | 규칙 |
|---|---|
| 검색창(SCR-001 Hero) | `radius.pill`, `canvas` 배경, `hairline` 테두리, 코랄 검색 아이콘 버튼, 최소 높이 48px |
| Chip Filter(테마, 국가, 스타일 등) | `radius.pill`, 비활성 `surface-strong` 배경 + `ink` 텍스트 / 활성 `coral` 배경 + `on-coral` 텍스트, 터치 영역 최소 44×44px |
| Select/Dropdown Filter(국가·지역·기간·모집 상태) | `radius.card` 내부에 배치, 라벨은 `caption`, 값은 `body-sm` |
| 결과 요약 텍스트 | 필터 그룹 바로 아래 `body-sm`, `muted` — 예: "조건에 맞는 동행글 12건" |
| 결과 없음 | 안내 문구 + 필터 초기화 버튼을 300ms 이내 표시(§14 Empty State 규칙과 연동) |

---

## 8. Destination Card

| 속성 | 값 |
|---|---|
| 이미지 | 1:1~4:3 비율, `radius.card`(16px) 클리핑, `alt`에 실제 장소를 설명하는 텍스트 필수(예: `alt="제주 성산일출봉과 유채꽃밭 풍경"`) |
| 배지 | 국가명/테마 배지 1~2개, `radius.pill`, `caption` |
| 제목 | `title-md`, `ink` |
| 메타 라인 | 추천 시기 등 1줄, `body-sm`, `muted` |
| 클릭 동작 | SCR-001 내부에서 **같은 화면의 Drawer**를 연다(별도 페이지 이동 아님). SCR-002·SCR-004 등 다른 화면에서 클릭 시 SCR-001로 이동 후 해당 Drawer를 자동으로 연다 |
| Grid | Desktop 3열, Mobile 1열, 카드 간격 Desktop 24px / Mobile 16px |

---

## 9. Form · Tabs

### Form (SCR-003 항공/숙소/동행 작성)
| 상태 | 규칙 |
|---|---|
| 기본 | `canvas` 배경, `hairline` 테두리, `radius.button`(10px), 라벨은 필드 위 `caption` |
| 포커스 | 2px `coral` 또는 `ink` 아웃라인, `outline-offset: 2px` |
| 오류 | 필드 하단에 `error-text`/`error-bg` 문구 + 프로그램적 연결(`aria-describedby`), 예: "귀국일은 출발일보다 늦어야 합니다" |
| 비활성(국가 미선택 시 지역 필드 등) | `surface-strong` 배경, `muted` 텍스트 |
| 제출 버튼 | 유효하지 않으면 비활성(coral-tint), 유효하면 `coral` 활성 |

### Tabs (SCR-003 항공편/숙소/동행 구하기, SCR-005 프로필/내 활동/관리자)
- 활성 탭: `ink` 텍스트 + `coral` 하단 밑줄(2px)
- 비활성 탭: `muted` 텍스트, 밑줄 없음
- 각 탭은 **입력·검증·완료 상태를 독립적으로 유지**한다 — 한 탭의 값/오류가 다른 탭에 영향을 주지 않는다
- 역할에 따라 존재하지 않는 탭(예: 일반 회원의 "관리자" 탭)은 렌더링하지 않는다
- Mobile은 가로 스크롤 가능한 탭바로 축소, 최소 터치 영역 44px

---

## 10. Mate Post Card

| 속성 | 값 |
|---|---|
| 배지 | 모집 상태(모집중/모집완료), 여행 스타일 — `radius.pill`, `caption` |
| 메타 | 국가·지역, 기간, 모집 인원 — `body-sm` |
| 목록 상한 | 화면당 **최대 8개** 우선 노출(그 이상은 "더 보기"로 이동) |
| 연락처 | 어떤 필드에도 전화번호·이메일·메신저 ID를 표시하지 않는다 |
| 평가 요소 | **별점·평점·리뷰 점수를 표시하지 않는다.** 활동 이력이 필요하면 "참여 동행 N회"처럼 점수·별 아이콘이 없는 순수 카운트만 사용한다 |
| 상세 진입 | Desktop은 목록(좌) + 상세 패널(우) 좌우분할, Mobile은 목록→상세 Drawer(하단에서 슬라이드 업) |

---

## 11. Drawer · Modal

| 항목 | 규칙 |
|---|---|
| 배경 | `canvas`, `radius.card` 상단 모서리(Mobile 하단 Drawer) 또는 전체(Desktop side Drawer) |
| Elevation | Tier-1 그림자 + `scrim` 배경 |
| 포커스 관리 | 열릴 때 포커스를 Drawer 내부로 이동, `Esc`와 닫기 버튼으로 이전 포커스 위치 복귀 |
| 사용처 | 여행지 상세(SCR-001), 안전정보 상세(SCR-001), Mate 상세(SCR-004 Mobile) |
| 금지 | Drawer/Modal 내부에 결제·예약 확정 버튼(예: "지금 예약", "결제하기")을 넣지 않는다 — 외부 이동 CTA만 허용 |

---

## 12. Alert · Toast

| 유형 | 색상 토큰 | 사용처 |
|---|---|---|
| Info | `info-text`/`info-bg` | 안전정보 일반 안내, 비전달 고지 배너 |
| Warning | `warning-text`/`warning-bg` | 여행경보 중대 단계, Stale(7일 초과) 경고, 관리자 신고 OPEN |
| Error | `error-text`/`error-bg` | 폼 검증 실패, 외부 링크 오류, 연락처 탐지 차단 |
| Success | `success-text`/`success-bg` | 참가 요청 접수, 신고 처리 완료, URL 저장 완료 |
| Toast(화면 상태) | 위 토큰 재사용, `radius.card`, Tier-1 그림자, 3~5초 후 자동 소멸 또는 수동 닫기 | 실제 이메일 발송 없이 화면 내 상태로 알림을 대체하는 모든 지점(참가 요청 결과, 신고 접수 등) |

모든 Alert/Toast는 아이콘+색상+텍스트 라벨을 함께 사용한다(색상 단독 사용 금지).

---

## 13. Loading · Empty · Error 상태

| 상태 | 규칙 |
|---|---|
| Loading | 카드 스켈레톤(형태 유지, `surface-strong` 톤) 또는 버튼 내 스피너. 스피너만 있고 텍스트가 없는 무의미한 대기 화면 금지 |
| Empty | §14의 "완성형 Empty State" 규칙을 따른다 |
| Error | 무엇이 실패했는지 설명하는 문장 + 재시도 또는 대체 행동(CTA) 1개 이상을 함께 표시. 동일 탭 손실 없이 표시 |
| Unauthorized | 필요한 로그인/성인 확인 단계를 안내하고 해당 액션으로 이동하는 CTA 제공 |

Dashboard형 통계·차트·그래프는 어떤 화면(특히 SCR-005 관리자 영역)에도 사용하지 않는다.

---

## 14. Desktop · Mobile 규칙

| 항목 | Desktop(1440px 기준) | Mobile(390px 기준) |
|---|---|---|
| Page Section 최대 폭 | **1200~1280px**(중앙 정렬) | 뷰포트 전체, 좌우 여백 20px |
| Section 상하 여백 | **64~96px** | **40~64px** |
| Card Grid | 3~4열 | 1열 |
| Header 높이 | 72px | 56px(햄버거로 축약) |
| 상세 진입 방식 | Drawer(같은 화면 내) 또는 좌우분할(목록+상세) | 하단 Drawer(목록→상세) |
| 터치 영역 | 최소 44×44px | 최소 44×44px(동일, 완화 없음) |

전환 구간(744~1128px)에서는 Card Grid를 4→2열로 줄이고 좌우분할은 유지하며, 상세 패널은 하단 Drawer로 전환한다.

---

## 15. Hero 규칙

- Hero는 **뷰포트 전체 높이를 차지하지 않는다.**
- Desktop Hero 높이는 화면 목적에 따라 **420~560px** 범위로 고정한다(예: SCR-001 560px, SCR-002 460~480px).
- Mobile Hero 높이는 **400~440px** 범위로 축소한다(예: SCR-001 Mobile 420px).
- 1440px Desktop 뷰포트 기준, Hero 아래 다음 Section의 **제목 줄이 스크롤 없이 보여야 한다.** (즉 Hero 높이 + Header 높이 < 일반적인 1440px 브라우저 표시 영역)
- Hero 내부에는 제목(`display-xl`) + 1~2문장 설명 + 핵심 CTA(검색창 또는 버튼) 이상을 넘는 장식만을 위한 콘텐츠를 넣지 않는다.

---

## 16. Section 계층과 시각적 리듬

모든 화면은 Header와 Footer 사이에 목적이 분명한 Section을 순서대로 배치하며, 각 Section은 다음 4단 계층을 갖는다.

1. **제목**(`display-lg`, h2 — Hero는 `display-xl`, h1)
2. **설명**(`body-md`, 1~3문장, `body`/`muted` 톤)
3. **본문**(Card Grid / 좌우분할 / Chip 목록 / 3단계 안내 / Form 중 하나)
4. **CTA 또는 명확한 다음 행동**(버튼, 링크, 또는 폼 제출)

**시각적 리듬 규칙:** Hero, Card Grid, 좌우분할, Chip 목록, 3단계 안내, CTA Banner의 6개 레이아웃 패턴을 교차 사용해 같은 패턴이 한 화면에서 3회 이상 연속되지 않게 한다(부득이하게 국내/해외처럼 같은 Card Grid가 연속될 때는 배경 톤을 `canvas` ↔ `surface-soft`로 교대해 구분한다).

---

## 17. 화면별 Section 순서와 최소 콘텐츠 수

`docs/STITCH_VALIDATION_REPORT.md`에서 PASS로 확정된 구조를 그대로 고정한다.

### SCR-001 `/` 메인 — 7 Section
1. 검색 Hero(높이 560px/Mobile 420px) — 검색창 + `/travel-tools` CTA
2. 국내 인기 여행지 — Card Grid **6개**
3. 해외 인기 여행지 — Card Grid **6개**(배경 톤 교대)
4. 여행 동기·테마 — Chip **6개**
5. 국가별 주의사항 — Card Grid **6개** + 안전정보 Drawer 연결, Stale 경고 배지 포함
6. 최근 동행글 — Card **3개** 또는 완성형 Empty State(§18)
7. free_traveler 요약 — 좌우분할, `50+ Trips`/`30+ Countries` + `/about` CTA

### SCR-002 `/about` — 7 Section
1. Hero(높이 460~480px) — 대표 사진 + 한 줄 소개
2. 여행 지표 — Card **3개**(`50+`/`30+`/권역 수, 차트 없음)
3. 소개·철학 — 좌우분할, **2~4개 문단**
4. 여행 Timeline — **최소 6개** 시점(연도·장소·요약)
5. 방문 국가 — 권역별 그룹 Chip(최소 4개 권역, "30개국" 헤드라인 표기)
6. 여행 Gallery — **최소 8장**, 서로 다른 장소, 실제 장소를 설명하는 alt
7. 기억에 남는 여행지 — Card **4개** + CTA Banner(`/travel-tools`, `/mates`)

### SCR-003 `/travel-tools` — 6 Section(3탭 공유 구조)
1. Intro — 3단계 이용 안내
2. 탭 — **항공편 / 숙소 / 동행 구하기** 3개 모두 존재, 각 탭 한 줄 설명
3. 조건 입력 Form(항공/숙소 탭 전용, 필드는 탭별로 상이)
4. 입력 요약 + 외부 이동 Action Card(항공/숙소 탭 전용)
5. 비전달 고지 + 이용 Tip **3개**
6. 동행 탭 전용: 로그인/성인확인 게이트 또는 작성 Form + 안전 안내
- 3개 탭의 입력·검증·완료 상태는 서로 독립적으로 분리한다.

### SCR-004 `/mates` — 6 Section
1. Intro + 글 작성 CTA
2. 검색 Filter(국가·지역·기간·모집 상태) + 결과 요약 텍스트
3. 동행글 목록 — 데이터 있으면 Card **최대 8개**, 없으면 완성형 Empty State
4. Desktop 목록+상세 좌우분할 / Mobile 목록→상세 Drawer(참가 요청·승인거절·신고·차단 포함, 평점/별점 요소 없음)
5. 신청 방법 — 3단계 안내
6. 안전·신고·차단 안내 — CTA Banner(`/travel-tools` 연결)

### SCR-005 `/account` — 역할별 가변 Section(Dashboard/차트 금지)
- **Guest:** 계정 기능 Intro → 로그인/가입/비밀번호 재설정 Card → 로그인 후 가능한 기능 Chip 목록 → 보안·개인정보 안내
- **Member:** 프로필·성인 확인 요약 → 정책 동의 현황 → 내 글/참가 요청(보낸·받은)/차단 목록/즐겨찾기(각 항목 Empty 시 §18 규칙 적용) → 새 동행글 작성 CTA
- **Admin(관리자 탭, 역할 있을 때만 렌더링):** 관리 범위 Intro → 신고 큐(상태 필터 + 상태별 처리 액션) → 외부 URL 설정 Form(HTTPS 검증 안내 포함)
- 현재 역할에 없는 탭·Section은 렌더링하지 않는다.

---

## 18. 완성형 Empty State와 Placeholder 문구 금지 규칙

**금지 문구/패턴(어떤 화면에도 사용 불가):**
- `Lorem ipsum` 등 의미 없는 채움 텍스트
- `준비 중`
- `정보 확인 필요`
- 제목·설명·CTA 없이 텅 빈 Card 또는 과도한 빈 여백

**완성형 Empty State 3요소(데이터가 없을 때 반드시 모두 포함):**
1. 왜 비어 있는지 설명하는 자연스러운 한국어 문장
2. 간단한 이용 방법(1~3단계 요약)
3. 다음 행동으로 이어지는 명확한 CTA(예: "동행글 작성하기", "여행지 보러 가기", "필터 초기화")

예: "아직 등록된 동행글이 없어요. 가장 먼저 글을 올리고 일정이 맞는 동행을 기다려보세요." + 이용 방법 3단계 + "동행글 작성하기" 버튼.

---

## 19. Do / Do Not

### Do
- 흰 배경(`canvas`) + `ink` 텍스트 + `coral` 단일 포인트만 브랜드 색으로 사용한다.
- 모든 이미지에 실제 장소/상황을 설명하는 `alt` 텍스트를 붙인다.
- 모든 인터랙션 요소에 키보드 포커스 링과 최소 44×44px 터치 영역을 확보한다.
- 경고·오류·안전 정보에는 코랄과 구분되는 semantic color(§1) + 텍스트 라벨을 함께 쓴다.
- Empty State에는 항상 설명·이용 방법·CTA 3요소를 채운다.
- 6개 레이아웃 패턴(Hero/Card Grid/좌우분할/Chip/3단계/CTA Banner)을 교차 사용한다.
- Section당 제목·설명·본문·CTA 4단 계층을 지킨다.
- 새 색상이 필요하면 이 문서(§1)에 토큰을 먼저 추가한 뒤 사용한다.

### Do Not
- Airbnb의 색상 값(예: `#ff385c`), 폰트명(Airbnb Cereal), 워드마크, 아이콘 등 상표적 요소를 재현하지 않는다.
- 예약(Reserve)·결제(Checkout)·장바구니·가격 확정 등 구매 UI를 어떤 화면에도 넣지 않는다.
- Airbnb Cereal VF 등 타사 독점 폰트 파일을 저장소에 포함하지 않는다(Inter는 오픈소스 CDN/시스템 폰트로만 로드).
- 이 문서의 색상 토큰 표(§1)에 없는 임의 hex 색상을 화면에 추가하지 않는다.
- 사용자 간 별점·평점·리뷰 점수 기능을 넣지 않는다(SCR-004 검증에서 발견되어 제거된 사례 참고).
- 실시간 외부 API 연동을 실제 구현된 것처럼 표현하는 문구(예: "실시간 연동 완료")를 넣지 않는다 — 안전정보·콘텐츠는 정적 데이터 기반이다.
- Hero를 뷰포트 전체 높이로 만들어 다음 Section을 가리지 않는다.
- 광고 배너, 실시간 항공권/호텔 가격, 대시보드형 차트·그래프를 넣지 않는다.
- Lorem ipsum, "준비 중", "정보 확인 필요", 빈 Card를 사용하지 않는다.

---

*— End of D-001/DESIGN.md —*
