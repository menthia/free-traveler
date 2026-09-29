import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Supabase Auth 이메일 인증·비밀번호 재설정 콜백(REQ-FUNC-066).
 * `code`(PKCE) 파라미터를 세션으로 교환하고, `next` 파라미터가 가리키는 화면으로 이동시킨다.
 * TLS는 Vercel 배포 환경이 기본 제공하므로 이 Route는 별도 처리를 하지 않는다.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/account";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/account?auth_error=1`);
}
