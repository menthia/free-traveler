import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { afterAll, describe, expect, it } from "vitest";

/**
 * RLS 기본 정책 Integration Test(REQ-FUNC-044, REQ-NF-013). 실제 라이브 Supabase 프로젝트에
 * anon key로 접속해 `supabase/seed.sql`이 만든 시드 계정(member1/member2/moderator)으로
 * 로그인(signInWithPassword — 이메일 발송 없음)한 뒤, 익명/타인/Moderator 3개 역할로 각
 * 테이블에 대한 부정 접근 시나리오를 실행해 모두 오류 또는 빈 결과를 반환하는지 검증한다.
 *
 * 이 시드 데이터에는 별도 'admin' 역할 계정이 없다(moderator만 존재) — 이 저장소의 RLS
 * 정책이 admin/moderator를 `is_moderator_or_admin()` 함수로 동일하게 취급하므로(예외:
 * 외부 URL 설정 저장은 애플리케이션 코드에서 admin으로 추가 제한, API-ADMIN-OUTBOUND-SETTINGS
 * 참고) moderator 계정으로 "관리자 권한" 시나리오를 대표 검증한다.
 *
 * `supabase/seed.sql`을 실행하지 않은 환경에서는 로그인 자체가 실패하므로, 이 테스트는
 * 시드 계정이 없으면(로그인 실패) 명확한 안내와 함께 전체를 스킵한다(CI 환경에서는
 * CI-PIPELINE이 시드 적용을 보장해야 한다). `describe.skipIf`는 동기적으로 평가되므로
 * 로그인 시도는 파일 최상단에서 top-level await로 먼저 끝내 둔다.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const SEED_PASSWORD = "SeedPass!1234";
const MEMBER1_EMAIL = "seed.member1@example.com";
const MEMBER2_EMAIL = "seed.member2@example.com";
const MODERATOR_EMAIL = "seed.moderator@example.com";

const MEMBER1_ID = "11111111-1111-1111-1111-111111111111";
const MEMBER1_POST_ID = "a1111111-1111-1111-1111-111111111111";
const MEMBER1_OTHER_APPLICATION_ID = "b2222222-2222-2222-2222-222222222222";

function newClient(): SupabaseClient {
  return createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

const anonClient = SUPABASE_URL && SUPABASE_ANON_KEY ? newClient() : null;
const member1Client = SUPABASE_URL && SUPABASE_ANON_KEY ? newClient() : null;
const member2Client = SUPABASE_URL && SUPABASE_ANON_KEY ? newClient() : null;
const moderatorClient = SUPABASE_URL && SUPABASE_ANON_KEY ? newClient() : null;

let seedAvailable = false;

if (member1Client && member2Client && moderatorClient) {
  const [m1, m2, mod] = await Promise.all([
    member1Client.auth.signInWithPassword({ email: MEMBER1_EMAIL, password: SEED_PASSWORD }),
    member2Client.auth.signInWithPassword({ email: MEMBER2_EMAIL, password: SEED_PASSWORD }),
    moderatorClient.auth.signInWithPassword({ email: MODERATOR_EMAIL, password: SEED_PASSWORD }),
  ]);
  seedAvailable = !m1.error && !m2.error && !mod.error;
}

if (!seedAvailable) {
  console.warn(
    "[TEST-RLS-BASIC] 시드 계정으로 로그인하지 못했습니다 — supabase/seed.sql을 라이브 " +
      "프로젝트에 먼저 적용해야 이 통합 테스트를 실행할 수 있습니다. 이번 실행은 스킵합니다.",
  );
}

afterAll(async () => {
  await Promise.all([
    member1Client?.auth.signOut(),
    member2Client?.auth.signOut(),
    moderatorClient?.auth.signOut(),
  ]);
});

describe.skipIf(!seedAvailable)("RLS 기본 정책 — 익명(anon) 부정 접근", () => {
  it("공개(OPEN/CLOSED) 동행글은 읽을 수 있다", async () => {
    const { data, error } = await anonClient!
      .from("mate_post")
      .select("post_id")
      .eq("status", "OPEN")
      .limit(1);
    expect(error).toBeNull();
    expect(data).not.toBeNull();
  });

  it("동행글을 새로 작성할 수 없다(권한 없음)", async () => {
    const { error } = await anonClient!.from("mate_post").insert({
      owner_id: MEMBER1_ID,
      country_name: "일본",
      start_date: "2027-01-01",
      end_date: "2027-01-05",
      title: "익명 무단 작성 시도",
    });
    expect(error).not.toBeNull();
  });

  it("참가 요청(mate_application)은 열람할 수 없다(anon grant 없음)", async () => {
    const { data, error } = await anonClient!.from("mate_application").select("*").limit(1);
    // anon에는 select grant 자체가 없어 PostgREST가 오류를 반환하거나, 반환되더라도 빈 배열이어야 한다.
    expect(error !== null || (data ?? []).length === 0).toBe(true);
  });

  it("신고(report) 테이블은 열람할 수 없다", async () => {
    const { data, error } = await anonClient!.from("report").select("*").limit(1);
    expect(error !== null || (data ?? []).length === 0).toBe(true);
  });
});

describe.skipIf(!seedAvailable)("RLS 기본 정책 — 타인(member2) 부정 접근", () => {
  it("다른 사람이 작성한 동행글을 수정할 수 없다", async () => {
    const { error, data } = await member2Client!
      .from("mate_post")
      .update({ title: "타인이 무단으로 수정 시도" })
      .eq("post_id", MEMBER1_POST_ID)
      .select();
    // RLS 위반 시 오류가 나거나, 조건에 맞는 행이 없어 빈 배열이 반환되어야 한다(실제 수정은 없어야 함).
    expect(error !== null || (data ?? []).length === 0).toBe(true);
  });

  it("다른 사람이 작성한 동행글을 삭제할 수 없다", async () => {
    const { error, data } = await member2Client!
      .from("mate_post")
      .delete()
      .eq("post_id", MEMBER1_POST_ID)
      .select();
    expect(error !== null || (data ?? []).length === 0).toBe(true);
  });

  it("본인이 당사자(작성자/신청자)가 아닌 참가 요청은 열람할 수 없다", async () => {
    const { data } = await member2Client!
      .from("mate_application")
      .select("application_id")
      .eq("application_id", MEMBER1_OTHER_APPLICATION_ID);
    expect(data ?? []).toHaveLength(0);
  });
});

describe.skipIf(!seedAvailable)("RLS 기본 정책 — Moderator 권한", () => {
  it("신고(report) 테이블을 열람할 수 있다(빈 목록이어도 오류는 없어야 한다)", async () => {
    const { error } = await moderatorClient!.from("report").select("*").limit(1);
    expect(error).toBeNull();
  });

  it("다른 사람이 작성한 동행글도 숨김(HIDDEN) 처리할 수 있다", async () => {
    const { error, data } = await moderatorClient!
      .from("mate_post")
      .update({ status: "HIDDEN" })
      .eq("post_id", MEMBER1_POST_ID)
      .select();
    expect(error).toBeNull();
    expect(data?.[0]?.status).toBe("HIDDEN");

    // 테스트 부작용 복구 — 다음 테스트 실행에 영향을 주지 않도록 원래 상태로 되돌린다.
    await moderatorClient!
      .from("mate_post")
      .update({ status: "OPEN" })
      .eq("post_id", MEMBER1_POST_ID);
  });
});
