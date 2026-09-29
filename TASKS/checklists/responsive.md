# MANUAL-RESPONSIVE-CHECK 체크리스트 (REQ-FUNC-065)

320px / 390px / 744px / 1128px / 1440px 5개 폭 × 5개 Screen에서 **가로 스크롤·겹침**이
없는지 확인한다.

## 1. 자동 사전 스캔 결과 (참고용 — 사람 확인을 대체하지 않는다)

Playwright로 `document.documentElement.scrollWidth === clientWidth`(가로 스크롤 없음)를
5×5=25개 조합 전체에서 자동 확인했다. 1차 스캔에서 `/mates` 1128px에서 실제 가로 스크롤
버그(약 12px)를 발견해 수정했다(`src/components/mates/MatesPageSections.tsx` — grid
column을 `40% 60%`에서 `2fr 3fr`로 변경, percentage 트랙이 `gap`을 반영하지 않아 생긴
문제). 수정 후 재스캔 결과:

| Route | 320px | 390px | 744px | 1128px | 1440px |
|---|---|---|---|---|---|
| `/` | ok | ok | ok | ok | ok |
| `/about` | ok | ok | ok | ok | ok |
| `/travel-tools` | ok | ok | ok | ok | ok |
| `/mates` | ok | ok | ok | ok | ok (수정 전 OVERFLOW → 수정 후 ok) |
| `/account` | ok | ok | ok | ok | ok |

이 자동 스캔은 **가로 스크롤 유무**만 기계적으로 검사한다. **겹침(overlap)**, 텍스트
줄바꿈 어색함, 터치 영역 크기, 실제 기기에서의 체감 등은 사람이 직접 봐야 한다.

## 2. 사람이 직접 확인할 항목

아래 5×5 표에서 각 칸을 실제 Chrome DevTools(반응형 모드) 또는 실기기로 열어
✅/❌로 표시해 주세요. 문제가 있으면 무엇이 어떻게 겹치는지 간단히 메모해 주시면 됩니다.

| Route | 320px | 390px | 744px | 1128px | 1440px |
|---|---|---|---|---|---|
| `/` | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/about` | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/travel-tools` | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/mates` | ☐ | ☐ | ☐ | ☐ | ☐ |
| `/account` | ☐ | ☐ | ☐ | ☐ | ☐ |

- [ ] 위 25칸 모두 가로 스크롤·겹침 없음을 사람이 직접 확인했다.

## 3. 확인 결과

사용자가 Chrome DevTools 반응형 모드로 25칸(5폭×5화면) 전체를 직접 확인 — 가로 스크롤·겹침
없음, 정상.
