import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  retries: 0,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm dev --port 5173',
    port: 5173,
    timeout: 120_000,
    reuseExistingServer: true,
  },
  projects: [
    {
      name: 'webkit',
      use: {
        ...devices['iPhone 12'],
        locale: 'en-US',
      },
    },
  ],
});
