import { PlaywrightTestConfig, devices } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "e2e",
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  // Run on Chromium by default
  projects: [
    {
      name: "Chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev --workspace frontend",
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: true,
  },
};

export default config; 