# RELEASE-CHECK-EXTERNAL-LINKS 체크리스트 (REQ-FUNC-016/024/049)

배포 직전, 항공/숙소 외부 이동 URL과 외교부 해외안전여행 링크를 **실제 브라우저**에서
열어 정상 동작하는지 확인한다. 자동 주간 점검(REQ-NF-011)은 EXCLUDED이므로 이 수동
점검이 대체 조치다.

## 1. 사전 자동 확인 결과 (참고용 — 사람 확인을 대체하지 않는다)

`curl`로 각 URL의 HTTP 응답 코드만 확인했다(리다이렉트 포함 실제 화면 렌더링/로그인
차단 여부는 확인하지 못한다 — 아래 2번에서 사람이 직접 확인해야 한다).

| URL | 출처 | HTTP 상태 |
|---|---|---|
| https://www.google.com/travel/flights | `outbound_link_setting` (`setting_key='flight'`, seed 기본값) | 200 |
| https://www.booking.com/ | `outbound_link_setting` (`setting_key='hotel'`, seed 기본값) | 202 |
| https://www.0404.go.kr/ | `src/data/safety.ts`의 외교부 해외안전여행 고정 링크 | 200 |

**주의**: 항공/숙소 URL은 하드코딩이 아니라 관리자(`AdminExternalUrlForm`,
SCR-005)가 Supabase `outbound_link_setting` 테이블에서 바꿀 수 있는 값이다. 실제
배포 환경(Production Supabase 프로젝트)에 설정된 값이 위 seed 기본값과 다를 수
있으므로, 배포 직전에는 **그 시점에 실제로 설정된 URL**을 관리자 화면에서 확인한
뒤 아래 항목을 점검해야 한다.

## 2. 사람이 직접 확인할 항목

- [ ] `/travel-tools`(SCR-003) 항공 탭에서 조건 입력 후 "항공권 검색하러 가기" 버튼을
      새 탭으로 열어, 실제로 항공 예약 사이트가 정상 로드되는지 확인한다.
- [ ] `/travel-tools`(SCR-003) 숙소 탭에서 조건 입력 후 "숙소 검색하러 가기" 버튼을
      새 탭으로 열어, 실제로 숙소 예약 사이트가 정상 로드되는지 확인한다.
- [ ] `/`(SCR-001) 여행지 Drawer의 국가별 안전정보 섹션에서 "외교부 해외안전여행"
      링크를 새 탭으로 열어, 정상 로드되고 현재 서비스 중인 페이지인지 확인한다.
- [ ] 위 세 링크 모두 `target="_blank"` + `rel="noopener noreferrer"`로 새 탭에서
      열리고, 원래 탭(Free Traveler)이 그대로 남아 있는지 확인한다.

## 3. 확인 결과

사용자가 직접 확인 — 항공/숙소 외부 이동 버튼과 안전정보 Drawer의 외교부 해외안전여행
링크 모두 실제 브라우저 새 탭에서 정상 로드됨을 확인함. 확인 완료.
