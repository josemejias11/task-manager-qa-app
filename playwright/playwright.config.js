const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60000,  // Increase from 30000 to 60000
  reporter: [['html'], ['allure-playwright']],
  expect: {
    timeout: 10000
  },
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on',
    screenshot: 'on',
    video: 'on-first-retry',
    headless: process.env.HEADLESS === 'false',
    actionTimeout: 60000,
    navigationTimeout: 60000,
    launchOptions: {
      slowMo: 1000,
    },
  },
});
