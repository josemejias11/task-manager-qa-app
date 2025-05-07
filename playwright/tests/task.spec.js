const { test, expect } = require('@playwright/test');

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.BASE_URL || 'http://localhost:3000');
    // Clear all tasks before each test
    const deleteButtons = await page.locator('#task-list .btn-danger').all();
    for (const btn of deleteButtons) {
      await btn.click();
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
    const longText = 'A'.repeat(21); // 21 characters

    // Clear the input field explicitly
    await input.fill('');
    await expect(input).toHaveValue('');

    // Fill with long text
    await input.fill(longText);

    // Ensure warning is not visible before clicking
    await expect(page.locator('#form-warning')).toBeHidden();

    // Attempt to add the task
    await page.click('text=Add Task');

    // Verify warning message appears
    const warning = page.locator('#form-warning');
    await expect(warning).toBeVisible({ timeout: 2000 });
    await expect(warning).toHaveText('Task title must be 20 characters or less.');
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
