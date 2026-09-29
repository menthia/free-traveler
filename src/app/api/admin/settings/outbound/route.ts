import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

type OutboundLinkKey = "flight" | "hotel";

/** 항공·숙소 외부 이동 URL 설정을 조회한다(비로그인 포함 누구나 — RLS 공개 SELECT 정책). */
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("outbound_link_setting").select("*");
  if (error) {
    return NextResponse.json({ error: "LOOKUP_FAILED", message: error.message }, { status: 400 });
  }
  return NextResponse.json({ settings: data ?? [] });
}

/**
 * 항공·숙소 외부 이동 URL을 설정한다. Admin 역할만 접근 가능(그 외 403).
 * HTTPS 허용목록 내 주소만 저장하도록 서버에서 재검증한다(http/javascript/data URL 거부).
 */
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "LOGIN_REQUIRED" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("user_profile")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "FORBIDDEN_NOT_ADMIN" }, { status: 403 });
  }

  const body = await request.json();
  const { settingKey, url } = (body ?? {}) as { settingKey?: OutboundLinkKey; url?: string };

  if (!settingKey || !url) {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }
  if (!/^https:\/\//i.test(url)) {
    return NextResponse.json({ error: "HTTPS_URL_REQUIRED" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("outbound_link_setting")
    .upsert({ setting_key: settingKey, url, updated_by: user.id })
    .select("*")
    .single();
  if (error) {
    return NextResponse.json({ error: "SAVE_FAILED", message: error.message }, { status: 400 });
  }

  return NextResponse.json({ setting: data });
}
