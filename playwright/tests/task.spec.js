const { test, expect } = require('@playwright/test');

test.describe('Task Management', () => {
  test('should remove all tasks using Remove All button', async ({ page }) => {
    await page.fill('#task-input', 'Temp Task 1');
    await page.click('text=Add Task');
    await page.fill('#task-input', 'Temp Task 2');
    await page.click('text=Add Task');

    const tasksBefore = await page.locator('#task-list li').count();
    expect(tasksBefore).toBeGreaterThan(0);

    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toBe('Are you sure you want to delete all tasks?');
      await dialog.accept();
    });

    await page.click('text=Remove All');

    await expect(page.locator('#task-list li')).toHaveCount(0);
  });
  test.beforeEach(async ({ page }) => {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    await page.goto(baseUrl, { waitUntil: 'load' });

    await expect(page.locator('h1')).toHaveText('Task Manager', { timeout: 5000 });

    await page.screenshot({ path: 'debug.png', fullPage: true });

    const deleteButtons = await page.locator('#task-list .btn-danger');
    const count = await deleteButtons.count();
    for (let i = count - 1; i >= 0; i--) {
      await deleteButtons.nth(i).click();
    }
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
    await page.fill('#task-input', '');
    await page.click('text=Add Task');
    await expect(page.locator('#form-warning')).toBeVisible({ timeout: 2000 });
    await expect(page.locator('#form-warning')).toHaveText('Task title cannot be empty.');
  });

  test('should allow adding multiple tasks', async ({ page }) => {
    await page.fill('#task-input', 'First Task');
    await page.click('text=Add Task');
    await page.fill('#task-input', 'Second Task');
    await page.click('text=Add Task');
    await expect(page.locator('#task-list')).toContainText('First Task');
    await expect(page.locator('#task-list')).toContainText('Second Task');
  });

  test('should show warning if task input exceeds 20 characters', async ({ page }) => {
    const input = page.locator('#task-input');
    const warning = page.locator('#form-warning');
    const longText = 'A'.repeat(21);

    await input.fill('');
    await expect(input).toHaveValue('');

    await input.fill(longText);
    await expect(warning).toBeHidden();

    await page.click('text=Add Task');
    await expect(warning).toBeVisible({ timeout: 3000 });
    await expect(warning).toHaveText('Task title must be 20 characters or less.');

    const taskTexts = await page.locator('#task-list li').allTextContents();
    expect(taskTexts.some(text => text.includes(longText))).toBeFalsy();
  });
  test('should assign a UUID to new tasks', async ({ page }) => {
    await page.fill('#task-input', 'UUID Test');
    await page.click('text=Add Task');

    const deleteButtons = await page.locator('#task-list .btn-danger');
    const dataId = await deleteButtons.first().getAttribute('data-id');
    expect(dataId).toMatch(/^[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12}$/i);
  });

  test('should delete a task', async ({ page }) => {
    await page.fill('#task-input', 'Task to be deleted');
    await page.click('text=Add Task');

    const taskLocator = page.locator('#task-list li', { hasText: 'Task to be deleted' });
    await expect(taskLocator).toBeVisible();

    const deleteButton = taskLocator.locator('.btn-danger');
    await deleteButton.click();

    await expect(taskLocator).not.toBeVisible();
  });
});
