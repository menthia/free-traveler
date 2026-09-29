-- 0002_rls_base.sql
-- Free Traveler — 6개 테이블에 대한 RLS 정책(ARCHITECTURE.md §7.3의 3원칙만 적용).
-- 1) 본인 데이터만 쓰기: MATE_POST/USER_BLOCK/REPORT는 auth.uid() = owner_id(또는 준하는 컬럼).
-- 2) 당사자만 비공개 열람: MATE_APPLICATION.message는 신청자 본인과 해당 MATE_POST 작성자만.
-- 3) 역할 기반 관리자 열람: REPORT 상세와 OUTBOUND_LINK_SETTING 쓰기는 Moderator/Admin만.
-- 이 3원칙 밖의 세분화된 정책(열람 이력 기반, 시간 기반 등)은 추가하지 않는다.

-- ---------------------------------------------------------------- helper functions

create or replace function public.is_moderator_or_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_profile
    where user_id = uid and role in ('moderator', 'admin')
  );
$$;

create or replace function public.is_blocked_pair(a uuid, b uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_block
    where (blocker_id = a and blocked_id = b)
       or (blocker_id = b and blocked_id = a)
  );
$$;

-- ---------------------------------------------------------------- USER_PROFILE

alter table public.user_profile enable row level security;

grant select, insert, update on public.user_profile to authenticated;
grant select on public.user_profile to anon;

-- 닉네임 등 공개 프로필 정보는 동행 모집글 작성자 표시 등에 필요해 누구나 조회 가능하게 둔다
-- (역할·상태 등 민감 필드의 노출 최소화는 애플리케이션 레이어의 select 컬럼 제한으로 처리한다).
create policy user_profile_select_public
  on public.user_profile for select
  using (true);

create policy user_profile_insert_self
  on public.user_profile for insert
  to authenticated
  with check (user_id = auth.uid());

create policy user_profile_update_self
  on public.user_profile for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ---------------------------------------------------------------- MATE_POST

alter table public.mate_post enable row level security;

grant select, insert, update, delete on public.mate_post to authenticated;
grant select on public.mate_post to anon;

-- 열람: OPEN/CLOSED 글은 누구나, 그 외(HIDDEN/DELETED)는 작성자 본인과 Moderator/Admin만.
-- 차단 관계에 있는 상대의 글은 노출하지 않는다(원칙 2: 차단 관계 노출 차단).
create policy mate_post_select_visible
  on public.mate_post for select
  using (
    (
      status in ('OPEN', 'CLOSED')
      or owner_id = auth.uid()
      or public.is_moderator_or_admin(auth.uid())
    )
    and not (
      auth.uid() is not null
      and public.is_blocked_pair(auth.uid(), owner_id)
    )
  );

-- 쓰기: 본인 글만(원칙 1).
create policy mate_post_insert_own
  on public.mate_post for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy mate_post_update_own_or_moderator
  on public.mate_post for update
  to authenticated
  using (owner_id = auth.uid() or public.is_moderator_or_admin(auth.uid()))
  with check (owner_id = auth.uid() or public.is_moderator_or_admin(auth.uid()));

create policy mate_post_delete_own
  on public.mate_post for delete
  to authenticated
  using (owner_id = auth.uid());

-- ---------------------------------------------------------------- MATE_APPLICATION

alter table public.mate_application enable row level security;

grant select, insert, update on public.mate_application to authenticated;

-- 열람(message 포함): 신청자 본인, 대상 글 작성자, Moderator/Admin만(원칙 2).
create policy mate_application_select_party
  on public.mate_application for select
  to authenticated
  using (
    applicant_id = auth.uid()
    or exists (
      select 1 from public.mate_post p
      where p.post_id = mate_application.post_id
        and p.owner_id = auth.uid()
    )
    or public.is_moderator_or_admin(auth.uid())
  );

-- 신청: 본인 명의로만, 차단 관계에 있는 글 작성자에게는 신청할 수 없다.
create policy mate_application_insert_own
  on public.mate_application for insert
  to authenticated
  with check (
    applicant_id = auth.uid()
    and not exists (
      select 1 from public.mate_post p
      where p.post_id = mate_application.post_id
        and public.is_blocked_pair(auth.uid(), p.owner_id)
    )
  );

-- 상태 변경: 신청자 본인(철회) 또는 대상 글 작성자(수락/거절)만.
create policy mate_application_update_party
  on public.mate_application for update
  to authenticated
  using (
    applicant_id = auth.uid()
    or exists (
      select 1 from public.mate_post p
      where p.post_id = mate_application.post_id
        and p.owner_id = auth.uid()
    )
  )
  with check (
    applicant_id = auth.uid()
    or exists (
      select 1 from public.mate_post p
      where p.post_id = mate_application.post_id
        and p.owner_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------- USER_BLOCK

alter table public.user_block enable row level security;

grant select, insert, delete on public.user_block to authenticated;

-- 본인이 만든 차단 관계만 조회·생성·해제 가능(원칙 1) — 누가 나를 차단했는지는 노출하지 않는다.
create policy user_block_select_own
  on public.user_block for select
  to authenticated
  using (blocker_id = auth.uid());

create policy user_block_insert_own
  on public.user_block for insert
  to authenticated
  with check (blocker_id = auth.uid());

create policy user_block_delete_own
  on public.user_block for delete
  to authenticated
  using (blocker_id = auth.uid());

-- ---------------------------------------------------------------- REPORT

alter table public.report enable row level security;

grant select, insert, update on public.report to authenticated;

-- 신고 접수: 본인 명의로만(원칙 1).
create policy report_insert_own
  on public.report for insert
  to authenticated
  with check (reporter_id = auth.uid());

-- 열람: 신고자 본인은 자신이 접수한 신고만, 상세 처리 화면은 Moderator/Admin만(원칙 3).
create policy report_select_own_or_moderator
  on public.report for select
  to authenticated
  using (
    reporter_id = auth.uid()
    or public.is_moderator_or_admin(auth.uid())
  );

-- 처리(상태 변경): Moderator/Admin만(원칙 3).
create policy report_update_moderator_only
  on public.report for update
  to authenticated
  using (public.is_moderator_or_admin(auth.uid()))
  with check (public.is_moderator_or_admin(auth.uid()));

-- ---------------------------------------------------------------- OUTBOUND_LINK_SETTING

alter table public.outbound_link_setting enable row level security;

grant select on public.outbound_link_setting to anon, authenticated;
grant insert, update on public.outbound_link_setting to authenticated;

-- 열람: 비로그인 포함 누구나(항공·숙소 탭에서 외부 이동 버튼을 구성하는 데 필요).
create policy outbound_link_setting_select_public
  on public.outbound_link_setting for select
  using (true);

-- 쓰기: Moderator/Admin만(원칙 3).
create policy outbound_link_setting_write_moderator_only
  on public.outbound_link_setting for insert
  to authenticated
  with check (public.is_moderator_or_admin(auth.uid()));

create policy outbound_link_setting_update_moderator_only
  on public.outbound_link_setting for update
  to authenticated
  using (public.is_moderator_or_admin(auth.uid()))
  with check (public.is_moderator_or_admin(auth.uid()));
