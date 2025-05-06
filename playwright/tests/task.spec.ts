import { test, expect } from '@playwright/test';

test('should add a task', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.fill('#task-input', 'Test Playwright Task');
  await page.click('text=Add Task');
  await expect(page.locator('#task-list')).toContainText('Test Playwright Task');
});

test('should clear the input after adding a task', async ({ page }) => {
  await page.goto('http://localhost:3000');

  const input = page.locator('#task-input');
  await input.fill('Another CI Test Task');
  await page.click('text=Add Task');

  await expect(page.locator('#task-list')).toContainText('Another CI Test Task');
  await expect(input).toHaveValue('');
});
