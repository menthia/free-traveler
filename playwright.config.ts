import { defineConfig, devices } from "@playwright/test";

// Chromium 단일 브라우저만 사용한다(CLAUDE.md 규칙 18, PLAYWRIGHT_SCOPE=chromium-smoke).
// Firefox/WebKit 프로젝트는 추가하지 않는다.
const DEFAULT_BASE_URL = "http://127.0.0.1:3000";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? DEFAULT_BASE_URL;
// PLAYWRIGHT_BASE_URL이 주어지면 Vercel Preview 등 이미 떠 있는 환경을 대상으로 하는 것이므로
// 로컬 webServer(npm run dev)를 별도로 띄우지 않는다.
const usingExternalBaseURL = !!process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: usingExternalBaseURL
    ? undefined
    : {
        command: "npm run dev",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
