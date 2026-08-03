import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./playwright",
  webServer: {
    command: "pnpm dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: true,
    timeout: 120_000
  },
  use: {
    baseURL: "http://127.0.0.1:3000",
    browserName: "chromium",
    launchOptions: {
      executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    },
    trace: "on-first-retry"
  },
  projects: [
    {
      name: "mobile",
      use: {
        browserName: "chromium",
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: devices["iPhone 12"].deviceScaleFactor
      }
    },
    {
      name: "desktop",
      use: {
        browserName: "chromium",
        viewport: { width: 1440, height: 1100 }
      }
    }
  ]
});
