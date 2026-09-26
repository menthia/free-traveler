import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    // src 내부 Unit Test와 tests/unit만 대상으로 한다.
    // tests/e2e는 Playwright 전용이므로 여기서 검색하지 않는다.
    include: ["src/**/*.{test,spec}.{ts,tsx}", "tests/unit/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["tests/e2e/**", "node_modules/**", ".next/**"],
    // 아직 Unit Test가 없는 단계이므로 테스트 0개도 실패로 취급하지 않는다.
    passWithNoTests: true,
  },
});
