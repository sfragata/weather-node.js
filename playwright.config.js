const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './test/e2e',
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  webServer: {
    command: 'node weather.js',
    port: 3000,
    reuseExistingServer: true,
  },
  reporter: [['html', { open: 'never' }]],
  outputDir: 'test/e2e/screenshots',
});
