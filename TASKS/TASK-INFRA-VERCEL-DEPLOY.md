# TASK-INFRA-VERCEL-DEPLOY: Vercel 배포 및 환경변수 설정

- **Seq:** 68
- **Category:** CI / Infra (`CI_INFRA`)
- **Implementation Status:** IMPLEMENT
- **Priority:** Must

---

## Context

'Vercel 배포 및 환경변수 설정'을 구성하는 CI/배포 설정 Task다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다.

## Requirement Ref

- REQ-NF-012
- REQ-NF-016
- REQ-NF-034

## Screen / Route / Page Entry

- Screen: —
- Route: —
- Page Entry: —

## Design Ref

- `docs/PROJECT_SCOPE.md` §3(구현 방식), §4(공통 제외 범위 — EC2·AWS 인프라 제외)

## Depends On

- 없음(선행 Task 없이 시작 가능)

## Expected Files

- vercel.json (신규, 필요 시)
- .env.example (신규)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. FLIGHT_OUTBOUND_URL, HOTEL_OUTBOUND_URL, Supabase URL/키를 Vercel 환경변수로 관리하고 클라이언트 번들에 비밀키를 포함하지 않는다.
2. HTTPS/TLS 1.2 이상은 Vercel 기본 제공을 사용한다.
3. 무료 또는 최저 유료 티어를 선택해 월 인프라 비용 목표(10만원 이하)를 충족한다.
4. EC2·AWS 등 별도 인프라는 구성하지 않는다.

## Visual AC

1. 비-UI Task로 해당 없음

## Security/Privacy AC

1. 비밀키는 서버 전용 환경변수로만 노출한다.

## Test Cases

- TC-01: FLIGHT_OUTBOUND_URL, HOTEL_OUTBOUND_URL, Supabase URL/키를 Vercel 환경변수로 관리하고 클라이언트 번들에 비밀키를 포함하지 않는다.
- TC-02: HTTPS/TLS 1.2 이상은 Vercel 기본 제공을 사용한다.
- TC-03: 무료 또는 최저 유료 티어를 선택해 월 인프라 비용 목표(10만원 이하)를 충족한다.
- TC-04: EC2·AWS 등 별도 인프라는 구성하지 않는다.

## Verify

- RELEASE-CHECK-EXTERNAL-LINKS

## Definition of Done

- [ ] 위 Expected Files가 모두 생성/수정되어 있고 그 밖의 파일 변경이 없다.
- [ ] Functional AC, Visual AC, Security/Privacy AC를 모두 충족한다.
- [ ] Test Cases가 Verify에 명시된 방법으로 확인 가능하다.
- [ ] Depends On에 나열된 모든 Task가 먼저 완료되어 있다.

## Forbidden

- **Expected Files 목록 밖의 어떤 파일도 생성·수정하지 않는다.**
- 이 Task 수행 중 실제 구현 코드 실행 결과 커밋, Git Branch 생성, Pull Request 생성을 하지 않는다(이 문서는 계획/명세 파일이다).
- EC2·AWS 등 Vercel/Supabase 외의 인프라를 구성하지 않는다. 자동 Merge Runner를 만들지 않는다.

---

*— TASK-INFRA-VERCEL-DEPLOY 끝 —*
