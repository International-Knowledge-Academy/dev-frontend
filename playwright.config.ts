/// <reference types="node" />
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  testIgnore: [
    // Account-manager login broken on staging — re-enable after credentials are confirmed
    "**/account-manager/**",
    // Camp feature not yet deployed to staging — run locally with BASE_URL=http://localhost:3000
    "**/public/home-camp.spec.ts",
    "**/public/camp-register.spec.ts",
    "**/admin/camp-registrations.spec.ts",
  ],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  reporter: "html",
  use: {
    baseURL: process.env.BASE_URL ?? "https://dev-frontend-git-staging-adnanmadi417s-projects.vercel.app",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
