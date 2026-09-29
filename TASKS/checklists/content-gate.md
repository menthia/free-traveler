# RELEASE-CHECK-CONTENT-GATE 체크리스트 (REQ-FUNC-074)

배포 전 `scripts/validate_content.py`(콘텐츠 완전성 게이트, DATA-CONTENT-COMPLETENESS-CHECK)
실행 결과가 통과인지 사람이 최종 확인한다.

## 1. 자동 실행 결과

```
$ python3 scripts/validate_content.py
국내 여행지: 10곳 (최소 10)
해외 여행지: 15개국 / 30개 도시 (최소 15개국 / 30개 도시)
안전정보 커버리지: 15개국 (해외 여행지 국가 15개국과 비교)

[PASS] 콘텐츠 완전성 검증 통과
```

Exit code: 0

## 2. 사람이 직접 확인할 항목

- [ ] 위 실행 결과가 `[PASS]`인지 확인한다.
- [ ] 국내 10곳 / 해외 15개국·30개 도시 / 안전정보 15개국 커버리지 수치가
      `src/data/destinations.ts`, `src/data/safety.ts`의 실제 최신 콘텐츠와 맞는지
      (스크립트 실행 시점과 배포 시점 사이에 데이터가 바뀌지 않았는지) 확인한다.

## 3. 확인 결과

사용자가 직접 확인 — `[PASS]` 결과와 국내 10곳 / 해외 15개국·30개 도시 / 안전정보
15개국 커버리지 수치가 실제 최신 데이터와 일치함을 확인함. 확인 완료.
