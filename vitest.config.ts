import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // tsconfig.json의 `@/*` -> `./src/*` 경로 별칭과 동일하게 맞춘다. 이게 없으면
  // `@/lib/supabase/server`처럼 별칭으로 import하는 src/lib/db/*.ts 등을 테스트에서
  // import하는 즉시 모듈 해석에 실패한다(실측: UNIT-MATE-STATE 작성 중 발견).
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    // src 내부 Unit Test, tests/unit, tests/integration(RLS 등 라이브 Supabase 대상
    // Integration Test)을 대상으로 한다. tests/e2e는 Playwright 전용이므로 여기서 검색하지 않는다.
    include: [
      "src/**/*.{test,spec}.{ts,tsx}",
      "tests/unit/**/*.{test,spec}.{ts,tsx}",
      "tests/integration/**/*.{test,spec}.{ts,tsx}",
    ],
    exclude: ["tests/e2e/**", "node_modules/**", ".next/**"],
    // 아직 Unit Test가 없는 단계이므로 테스트 0개도 실패로 취급하지 않는다.
    passWithNoTests: true,
  },
});
