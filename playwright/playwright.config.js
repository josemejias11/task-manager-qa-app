const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  reporter: [['html'], ['allure-playwright']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on',
    screenshot: 'on',
    video: 'on-first-retry',
    headless: process.env.HEADLESS === 'false',
    actionTimeout: 60000,
    navigationTimeout: 60000,
    launchOptions: {
      slowMo: 500,
    },
  },
});
