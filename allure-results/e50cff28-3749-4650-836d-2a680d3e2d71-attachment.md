# Test info

- Name: Task Management >> should clear the input after adding a task
- Location: /tests/playwright/tests/task.spec.js:19:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

    at /tests/playwright/tests/task.spec.js:5:16
```

# Test source

```ts
   1 | const { test, expect } = require('@playwright/test');
   2 |
   3 | test.describe('Task Management', () => {
   4 |   test.beforeEach(async ({ page }) => {
>  5 |     await page.goto(process.env.BASE_URL || 'http://localhost:3000');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
   6 |     // Clear all tasks before each test
   7 |     const deleteButtons = await page.locator('#task-list .btn-danger').all();
   8 |     for (const btn of deleteButtons) {
   9 |       await btn.click();
  10 |     }
  11 |   });
  12 |
  13 |   test('should add a task', async ({ page }) => {
  14 |     await page.fill('#task-input', 'Test Playwright Task');
  15 |     await page.click('text=Add Task');
  16 |     await expect(page.locator('#task-list')).toContainText('Test Playwright Task');
  17 |   });
  18 |
  19 |   test('should clear the input after adding a task', async ({ page }) => {
  20 |     const input = page.locator('#task-input');
  21 |     await input.fill('Another CI Test Task');
  22 |     await page.click('text=Add Task');
  23 |
  24 |     await expect(page.locator('#task-list')).toContainText('Another CI Test Task');
  25 |     await expect(input).toHaveValue('');
  26 |   });
  27 |
  28 |   test('should not add a task if input is empty', async ({ page }) => {
  29 |     const initialCount = await page.locator('#task-list li').count();
  30 |
  31 |     // Try with empty input
  32 |     await page.fill('#task-input', '');
  33 |     await page.click('text=Add Task');
  34 |     await expect(page.locator('#form-warning')).toBeVisible({ timeout: 2000 });
  35 |     await expect(page.locator('#form-warning')).toHaveText('Task title cannot be empty.');
  36 |     const afterEmptyCount = await page.locator('#task-list li').count();
  37 |     expect(afterEmptyCount).toBe(initialCount);
  38 |
  39 |     // Try with whitespace-only input
  40 |     await page.fill('#task-input', '   ');
  41 |     await page.click('text=Add Task');
  42 |     await expect(page.locator('#form-warning')).toBeVisible({ timeout: 2000 });
  43 |     await expect(page.locator('#form-warning')).toHaveText('Task title cannot be empty.');
  44 |     const afterSpaceCount = await page.locator('#task-list li').count();
  45 |     expect(afterSpaceCount).toBe(initialCount);
  46 |   });
  47 |
  48 |   test('should allow adding multiple tasks', async ({ page }) => {
  49 |     await page.fill('#task-input', 'First Task');
  50 |     await page.click('text=Add Task');
  51 |     await page.fill('#task-input', 'Second Task');
  52 |     await page.click('text=Add Task');
  53 |     await expect(page.locator('#task-list')).toContainText('First Task');
  54 |     await expect(page.locator('#task-list')).toContainText('Second Task');
  55 |   });
  56 |
  57 |   test('should handle very long task input', async ({ page }) => {
  58 |     const longText = 'A'.repeat(1000);
  59 |     await page.fill('#task-input', longText);
  60 |     await page.click('text=Add Task');
  61 |     await expect(page.locator('#task-list')).toContainText(longText);
  62 |   });
  63 |   test('should assign a UUID to new tasks', async ({ page }) => {
  64 |     await page.fill('#task-input', 'UUID Test');
  65 |     await page.click('text=Add Task');
  66 |
  67 |     const deleteButtons = await page.locator('#task-list .btn-danger');
  68 |     const dataId = await deleteButtons.first().getAttribute('data-id');
  69 |     expect(dataId).toMatch(/^[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12}$/i);
  70 |   });
  71 | });
  72 |
```