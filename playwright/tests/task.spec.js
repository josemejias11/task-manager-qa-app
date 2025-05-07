const { test, expect } = require('@playwright/test');

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.BASE_URL || 'http://localhost:3000');
  });

  test('should add a task', async ({ page }) => {
    await page.fill('#task-input', 'Test Playwright Task');
    await page.click('text=Add Task');
    await expect(page.locator('#task-list')).toContainText('Test Playwright Task');
  });

  test('should clear the input after adding a task', async ({ page }) => {
    const input = page.locator('#task-input');
    await input.fill('Another CI Test Task');
    await page.click('text=Add Task');

    await expect(page.locator('#task-list')).toContainText('Another CI Test Task');
    await expect(input).toHaveValue('');
  });

  test('should not add a task if input is empty', async ({ page }) => {
    await page.click('text=Add Task');
    await expect(page.locator('#task-list')).not.toContainText('');
  });

  test('should allow adding multiple tasks', async ({ page }) => {
    await page.fill('#task-input', 'First Task');
    await page.click('text=Add Task');
    await page.fill('#task-input', 'Second Task');
    await page.click('text=Add Task');
    await expect(page.locator('#task-list')).toContainText(['First Task', 'Second Task']);
  });

  test('should handle very long task input', async ({ page }) => {
    const longText = 'A'.repeat(1000);
    await page.fill('#task-input', longText);
    await page.click('text=Add Task');
    await expect(page.locator('#task-list')).toContainText(longText);
  });
});
