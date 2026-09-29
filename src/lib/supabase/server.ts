import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server Component/Route Handler에서 사용하는 Server Supabase Client(docs/ARCHITECTURE.md §7.1).
 * anon key + 요청 쿠키의 세션으로 동작하며, RLS를 우회하지 않는다(service_role 키 미사용).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server Component에서 호출된 경우 set은 무시한다(미들웨어가 세션을 갱신).
          }
        },
      },
    },
  );
}
