# Free Traveler — Design Manifest

- **Document ID:** DESIGN-MANIFEST-001
- **최종 갱신일:** 2026-09-19

---

## Active Design

| 항목 | 값 |
|---|---|
| **Active Design Version** | `D-001` |
| **Status** | `LOCKED` |
| **Active File** | `design-reference/D-001/DESIGN.md` |
| **Vendor Reference** | `design-reference/vendor/airbnb/DESIGN.md` (구조적 참고 전용 — 색상·폰트명·아이콘·워드마크·예약/결제 UI 미차용) |

`LOCKED` 상태에서는 `design-reference/D-001/DESIGN.md`의 색상 토큰·타이포그래피·레이아웃 규칙을 변경하지 않는다. 변경이 필요하면 새 버전 디렉터리(`design-reference/D-002/`)를 만들고 이 매니페스트의 Active Design을 갱신하는 절차를 거친다.

---

## Approved Screens

출처: `docs/STITCH_VALIDATION_REPORT.md` (최종 판정 `STITCH_VALIDATION_PASS`, 전 화면 PASS 확정)

| Screen | Route | Screen ID | Device | 판정 |
|---|---|---|---|---|
| SCR-001 | `/` | `e605695d319e4c60846f2bb60ee3ec26` | Desktop | PASS |
| SCR-002 | `/about` | `9294817a8a2c4c528ff10c1dac0c5b82` | Desktop | PASS |
| SCR-003 | `/travel-tools` | `e1e6eb7518e24ca7bf324e9d96fe8b8e` | Desktop | PASS |
| SCR-004 | `/mates` | `96898e10f9914f32b81fc0a63cf228fe` | Desktop | PASS |
| SCR-005 | `/account` | `8dadbf1afacb49d2b0ca4d8ff868c451` | Desktop | PASS |

**Approved Screens:** SCR-001 ~ SCR-005 (전체 승인)

---

## Mobile Variants

| Screen | Screen ID | Device |
|---|---|---|
| SCR-001 Mobile | `f4bbb71a02284842aeb4a8548700be2f` | Mobile |
| SCR-003 Mobile | `390e61f96fa24cda848850868687e84e` | Mobile |

**Mobile Variants:** SCR-001, SCR-003 (그 외 화면은 Mobile 변형 생성 대상 아님)

---

## Stitch Project 정보 (참고)

| 항목 | 값 |
|---|---|
| Stitch Project ID | `16339559805993473633` |
| Stitch Design System Asset | `assets/2298874084718831656` |

---

## 금지 사항 (D-001 전역 적용)

- Airbnb 상표 요소(색상 값, 폰트명, 워드마크, 아이콘) 재현 금지
- 구매·예약·결제(Reserve/Checkout) UI 금지
- Airbnb Cereal VF 등 Proprietary Font 파일 저장소 포함 금지 — Inter(오픈소스)만 사용
- `design-reference/D-001/DESIGN.md`의 Color Token 표에 정의되지 않은 임의 색상 추가 금지

---

## 변경 이력

| 일자 | 내용 |
|---|---|
| 2026-09-19 | D-001 최초 작성 및 LOCKED. SCR-001~005 및 Mobile 변형(SCR-001, SCR-003) 승인 반영 |

---

*— End of DESIGN-MANIFEST-001 —*
