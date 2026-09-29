-- seed.sql — 로컬/스테이징 개발 전용 최소 시드 데이터.
-- 실 서비스(Production) 배포 파이프라인에는 이 파일을 적용하지 않는다.
-- 실제 개인정보를 포함하지 않는다 — 아래 이메일·닉네임은 모두 example.com 더미 값이다.
--
-- 이 파일은 auth.users에도 함께 INSERT한다(Supabase 로컬/스테이징 Postgres에서 통용되는
-- 개발용 시드 방식 — pgcrypto의 crypt()/gen_salt()로 테스트 비밀번호를 해시한다).
-- Production Supabase 프로젝트에는 실행하지 않는다.

-- ---------------------------------------------------------------- 테스트 계정 3개

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data, is_sso_user, is_anonymous
) values
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111111',
    'authenticated', 'authenticated',
    'seed.member1@example.com', crypt('SeedPass!1234', gen_salt('bf')),
    now(), now(), now(), '{}', '{}', false, false
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-2222-2222-222222222222',
    'authenticated', 'authenticated',
    'seed.member2@example.com', crypt('SeedPass!1234', gen_salt('bf')),
    now(), now(), now(), '{}', '{}', false, false
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '33333333-3333-3333-3333-333333333333',
    'authenticated', 'authenticated',
    'seed.moderator@example.com', crypt('SeedPass!1234', gen_salt('bf')),
    now(), now(), now(), '{}', '{}', false, false
  )
on conflict (id) do nothing;

insert into public.user_profile (
  user_id, nickname, is_adult, adult_verified_at, age_band, travel_styles, bio, role, status
) values
  (
    '11111111-1111-1111-1111-111111111111',
    '시드_여행자1', true, now(), '30s', array['배낭여행', '맛집탐방'],
    '테스트용 계정입니다. 동행 모집글 작성 흐름을 확인하는 데 사용합니다.',
    'member', 'ACTIVE'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '시드_여행자2', true, now(), '20s', array['액티비티', '휴양'],
    '테스트용 계정입니다. 참가 요청 흐름을 확인하는 데 사용합니다.',
    'member', 'ACTIVE'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '시드_모더레이터', true, now(), '50s_plus', array[]::text[],
    '테스트용 모더레이터 계정입니다. 신고 큐·외부 URL 설정 화면을 확인하는 데 사용합니다.',
    'moderator', 'ACTIVE'
  )
on conflict (user_id) do nothing;

-- ---------------------------------------------------------------- 동행 모집글 4개

insert into public.mate_post (
  post_id, owner_id, country_name, region_name, start_date, end_date,
  capacity, preferences, travel_styles, title, description, status
) values
  (
    'a1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    '일본', '도쿄', '2027-04-01', '2027-04-05',
    3, '{"budget": "중간"}'::jsonb, array['맛집탐방'],
    '도쿄 벚꽃 시즌 함께 가실 분',
    '4박 5일 일정으로 도쿄 벚꽃 명소를 함께 둘러볼 동행을 구합니다. 안전수칙에 동의하신 분만 신청해 주세요.',
    'OPEN'
  ),
  (
    'a2222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    '태국', '방콕', '2027-05-10', '2027-05-14',
    2, '{"budget": "저예산"}'::jsonb, array['배낭여행'],
    '방콕 저예산 배낭여행 동행',
    '대중교통과 로컬 맛집 위주로 다닐 계획입니다. 편하게 다니실 분 환영합니다.',
    'OPEN'
  ),
  (
    'a3333333-3333-3333-3333-333333333333',
    '22222222-2222-2222-2222-222222222222',
    '스위스', '인터라켄', '2027-06-01', '2027-06-07',
    4, '{"budget": "높음"}'::jsonb, array['액티비티'],
    '인터라켄 하이킹 동행 모집',
    '융프라우요흐 전망대와 그린델발트 하이킹을 함께할 동행을 찾습니다.',
    'OPEN'
  ),
  (
    'a4444444-4444-4444-4444-444444444444',
    '22222222-2222-2222-2222-222222222222',
    '대한민국', '제주', '2025-01-10', '2025-01-13',
    2, '{"budget": "중간"}'::jsonb, array['휴양'],
    '제주 겨울 여행 동행(마감 예시)',
    '이미 종료된 일정 예시 데이터입니다(자동 마감 계산 확인용).',
    'OPEN'
  )
on conflict (post_id) do nothing;

-- ---------------------------------------------------------------- 참가 요청 2개

insert into public.mate_application (application_id, post_id, applicant_id, message, status)
values
  (
    'b1111111-1111-1111-1111-111111111111',
    'a1111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '같이 여행하고 싶습니다. 잘 부탁드려요!',
    'PENDING'
  ),
  (
    'b2222222-2222-2222-2222-222222222222',
    'a2222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333',
    '방콕 여행 경험이 있어서 도움이 될 것 같습니다.',
    'ACCEPTED'
  )
on conflict (application_id) do nothing;

-- ---------------------------------------------------------------- 외부 URL 설정 2개

insert into public.outbound_link_setting (setting_key, url, updated_by)
values
  ('flight', 'https://www.google.com/travel/flights', '33333333-3333-3333-3333-333333333333'),
  ('hotel', 'https://www.booking.com/', '33333333-3333-3333-3333-333333333333')
on conflict (setting_key) do nothing;
