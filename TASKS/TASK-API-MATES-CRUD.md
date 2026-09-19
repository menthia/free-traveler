# TASK-API-MATES-CRUD: 동행 모집글 API Route

- **Seq:** 52
- **Category:** API / Backend (`API`)
- **Implementation Status:** IMPLEMENT
- **Priority:** Must

---

## Context

'동행 모집글 API Route'을 제공하는 서버 측 로직/Route Handler를 구현하는 Task다.

## Project Scope

`docs/PROJECT_SCOPE.md` 기준 이 Task의 분류는 **IMPLEMENT**다. MVP 범위에서 실제로 구현하고 테스트하는 항목이며, 임의로 범위를 확장하거나 축소하지 않는다.

## Requirement Ref

- REQ-FUNC-031
- REQ-FUNC-032
- REQ-FUNC-033
- REQ-FUNC-038

## Screen / Route / Page Entry

- Screen: —
- Route: /api/mates
- Page Entry: —

## Design Ref

- `docs/02_SRS_BASELINE.md` §6.1(Internal API and Server Actions) 중 해당 엔드포인트
- `docs/PROJECT_SCOPE.md`의 관련 REQ-FUNC 처리 방법 절

## Depends On

- TASK-DB-ACCESS
- TASK-API-CONTACT-DETECTION-UTIL

## Expected Files

- src/app/api/mates/route.ts (신규)
- src/app/api/mates/[id]/route.ts (신규)

**이 Task는 위 목록 밖의 어떤 파일도 생성·수정하지 않는다.**

## Functional AC

1. 목록 조회(GET), 생성(POST), 수정/마감/삭제(PATCH/DELETE)를 제공하며 응답에 연락처 필드를 포함하지 않는다.
2. 본문 저장 전 연락처 탐지 유틸을 서버에서도 재검증한다(클라이언트 우회 방지).

## Visual AC

1. 비-UI Task로 해당 없음

## Security/Privacy AC

1. 비회원 POST는 401로 차단한다.

## Test Cases

- TC-01: 목록 조회(GET), 생성(POST), 수정/마감/삭제(PATCH/DELETE)를 제공하며 응답에 연락처 필드를 포함하지 않는다.
- TC-02: 본문 저장 전 연락처 탐지 유틸을 서버에서도 재검증한다(클라이언트 우회 방지).

## Verify

- TEST-RLS-BASIC, UNIT-CONTACT-DETECTION

## Definition of Done

- [ ] 위 Expected Files가 모두 생성/수정되어 있고 그 밖의 파일 변경이 없다.
- [ ] Functional AC, Visual AC, Security/Privacy AC를 모두 충족한다.
- [ ] Test Cases가 Verify에 명시된 방법으로 확인 가능하다.
- [ ] Depends On에 나열된 모든 Task가 먼저 완료되어 있다.

## Forbidden

- **Expected Files 목록 밖의 어떤 파일도 생성·수정하지 않는다.**
- 이 Task 수행 중 실제 구현 코드 실행 결과 커밋, Git Branch 생성, Pull Request 생성을 하지 않는다(이 문서는 계획/명세 파일이다).
- 사용자 간 별점·평점·리뷰 점수 기능을 추가하지 않는다.

---

*— TASK-API-MATES-CRUD 끝 —*
