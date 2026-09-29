import { createBrowserClient } from "@supabase/ssr";

/**
 * Client Component에서 사용하는 Browser Supabase Client(docs/ARCHITECTURE.md §7.1).
 * anon key만 사용하며, service_role 키는 어떤 코드 경로에서도 참조하지 않는다.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
