import { NextResponse, type NextRequest } from "next/server";

const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const isDev = process.env.NODE_ENV === "development";

function buildCspHeader(nonce: string): string {
  return [
    `default-src 'self'`,
    // Next.js는 요청의 CSP 헤더에서 nonce를 읽어 자체 프레임워크 스크립트(RSC 스트리밍,
    // 하이드레이션 데이터 등)에 자동으로 부여한다 — nonce 없이 'self'만 쓰면 그 인라인
    // 스크립트가 차단되어 Suspense 콘텐츠가 계속 숨김 상태로 남는다.
    // 'strict-dynamic'은 붙이지 않는다 — 이 값이 있으면 브라우저가 'self' 호스트 허용을
    // 완전히 무시하는데, Turbopack이 코드 분할된 청크를 nonce 없는 <script src> 태그로
    // 동적 삽입해 로딩해 strict-dynamic 하에서는 그 청크 자체가 차단되고 사이트 전체
    // 하이드레이션이 깨졌다(실측: PAGE-SCR003 프로덕션 빌드 검증 중 발견). 청크는 동일
    // 출처 <script src>이므로 'self'만으로 이미 허용된다.
    `script-src 'self' 'nonce-${nonce}'${isDev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' https://upload.wikimedia.org data:`,
    // Client Component(예: 외부 이동 URL·로그인 상태 조회)가 Supabase에 직접 fetch하므로
    // connect-src를 명시한다 — 없으면 default-src 'self'로 대체되어 Supabase 도메인으로의
    // 요청이 전부 차단된다(실측: PAGE-SCR003 프로덕션 빌드 검증 중 발견).
    `connect-src 'self'${process.env.NEXT_PUBLIC_SUPABASE_URL ? ` ${process.env.NEXT_PUBLIC_SUPABASE_URL}` : ""}`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `frame-ancestors 'none'`,
  ].join("; ");
}

/**
 * CSRF/XSS 방어 기본 설정(REQ-NF-014/015).
 * - Server Actions는 Next.js가 Origin 헤더를 자동 검증하지만, Route Handler(`/api/**`)는
 *   자동 검증이 없어 상태 변경 메서드(POST/PUT/PATCH/DELETE)에 한해 Origin을 same-origin으로 강제한다.
 * - Supabase Auth 쿠키는 `@supabase/ssr`가 기본적으로 SameSite=Lax로 설정하며,
 *   이 Origin 검증이 교차 출처 요청에 대한 1차 방어선 역할을 한다.
 * - 모든 응답에 nonce 기반 Content-Security-Policy를 부여해 저장 XSS의 실행 범위를 제한한다
 *   (docs/ 대신 `node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md`의
 *   권장 패턴을 그대로 따른다 — `unsafe-inline` 없이 nonce+strict-dynamic 사용).
 */
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/") && UNSAFE_METHODS.has(request.method)) {
    const origin = request.headers.get("origin");
    if (origin && origin !== request.nextUrl.origin) {
      return NextResponse.json({ error: "CROSS_ORIGIN_REQUEST_BLOCKED" }, { status: 403 });
    }
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeader = buildCspHeader(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
