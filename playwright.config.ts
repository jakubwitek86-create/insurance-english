import { defineConfig, devices } from '@playwright/test';

// PW_CHROMIUM_PATH lets you reuse an existing Chromium (e.g. in CI images without the Playwright download).
const executablePath = process.env.PW_CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: 'e2e',
  timeout: 60_000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:4173/',
    ...devices['Pixel 7'],
    launchOptions: executablePath ? { executablePath } : {},
    serviceWorkers: 'allow',
  },
  webServer: {
    command: 'npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173/',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
