-- 0001_schema_base.sql
-- Free Traveler — 정확히 6개 테이블 스키마(DEC-006).
-- USER_PROFILE, MATE_POST, MATE_APPLICATION, USER_BLOCK, REPORT, OUTBOUND_LINK_SETTING
-- 그 외(COUNTRY/REGION/DESTINATION/DESTINATION_CONTENT/COUNTRY_SAFETY/MEDIA_ASSET/
-- REPRESENTATIVE_PROFILE/AUDIT_LOG)는 만들지 않는다 — 콘텐츠 계열은 src/data 정적 데이터,
-- 감사 로그는 EXCLUDED 범위로 대체(docs/DECISION_LOG.md DEC-004/DEC-006/DEC-014).
--
-- MATE_POST의 국가·지역은 원 SRS(6.3.9)가 COUNTRY/REGION FK로 정의했으나, 이 두 테이블을
-- 만들지 않으므로 이 스키마에서는 country_name/region_name TEXT 컬럼으로 대체한다
-- (src/data/destinations.ts의 국가명과 자유 텍스트로 일치시켜 사용).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- enums

create type user_status as enum ('ACTIVE', 'RESTRICTED', 'DELETED');
create type user_role as enum ('member', 'moderator', 'admin');
create type age_band as enum ('10s', '20s', '30s', '40s', '50s_plus');
create type gender_type as enum ('male', 'female', 'other', 'unspecified');

create type mate_post_status as enum ('OPEN', 'CLOSED', 'HIDDEN', 'DELETED');
create type mate_application_status as enum ('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');
create type report_target_type as enum ('MATE_POST', 'MATE_APPLICATION', 'USER_PROFILE');
create type report_status as enum ('OPEN', 'IN_REVIEW', 'RESOLVED', 'DISMISSED');
create type outbound_link_key as enum ('flight', 'hotel');

-- ---------------------------------------------------------------- USER_PROFILE

create table public.user_profile (
  user_id uuid primary key references auth.users (id) on delete cascade,
  nickname varchar(40) not null unique,
  is_adult boolean not null default false,
  adult_verified_at timestamptz,
  age_band age_band,
  gender gender_type,
  travel_styles text[] not null default '{}',
  bio varchar(500),
  role user_role not null default 'member',
  status user_status not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.user_profile is '회원 프로필(닉네임·연령대·성별·여행 스타일·성인 확인·역할).';

-- ---------------------------------------------------------------- MATE_POST

create table public.mate_post (
  post_id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.user_profile (user_id) on delete cascade,
  country_name varchar(80) not null,
  region_name varchar(80),
  start_date date not null,
  end_date date not null,
  capacity smallint not null default 2,
  preferences jsonb not null default '{}'::jsonb,
  travel_styles text[] not null default '{}',
  title varchar(100) not null,
  description text,
  status mate_post_status not null default 'OPEN',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint mate_post_capacity_range check (capacity between 1 and 10),
  constraint mate_post_date_order check (end_date >= start_date),
  constraint mate_post_description_length check (char_length(description) <= 3000)
);

comment on table public.mate_post is '동행 모집글.';

create index mate_post_owner_id_idx on public.mate_post (owner_id);
create index mate_post_status_idx on public.mate_post (status);

-- ---------------------------------------------------------------- MATE_APPLICATION

create table public.mate_application (
  application_id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.mate_post (post_id) on delete cascade,
  applicant_id uuid not null references public.user_profile (user_id) on delete cascade,
  message varchar(500) not null,
  status mate_application_status not null default 'PENDING',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint mate_application_unique_per_post unique (post_id, applicant_id)
);

comment on table public.mate_application is '동행 모집글 참가 요청(신청자당 글 하나에 1건만 허용).';

create index mate_application_post_id_idx on public.mate_application (post_id);
create index mate_application_applicant_id_idx on public.mate_application (applicant_id);

-- ---------------------------------------------------------------- USER_BLOCK

create table public.user_block (
  blocker_id uuid not null references public.user_profile (user_id) on delete cascade,
  blocked_id uuid not null references public.user_profile (user_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  constraint user_block_no_self_block check (blocker_id <> blocked_id)
);

comment on table public.user_block is '사용자 차단 관계(쌍 UNIQUE는 PK로 보장).';

create index user_block_blocked_id_idx on public.user_block (blocked_id);

-- ---------------------------------------------------------------- REPORT

create table public.report (
  report_id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.user_profile (user_id) on delete cascade,
  target_type report_target_type not null,
  target_id uuid not null,
  reason_code varchar(60) not null,
  description text,
  status report_status not null default 'OPEN',
  assignee_id uuid references public.user_profile (user_id) on delete set null,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

comment on table public.report is '신고(대상 유형·사유·처리 상태).';

create index report_status_idx on public.report (status);
create index report_target_idx on public.report (target_type, target_id);

-- ---------------------------------------------------------------- OUTBOUND_LINK_SETTING

create table public.outbound_link_setting (
  setting_key outbound_link_key primary key,
  url text not null,
  updated_by uuid references public.user_profile (user_id) on delete set null,
  updated_at timestamptz not null default now(),
  constraint outbound_link_setting_https_only check (url like 'https://%')
);

comment on table public.outbound_link_setting is '관리자가 설정하는 항공·숙소 외부 이동 URL(HTTPS만 허용).';
