# Test info

- Name: Task Management >> should handle very long task input
- Location: /tests/playwright/tests/task.spec.js:44:3

# Error details

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('#task-list .btn-danger').nth(1)
    - locator resolved to <button class="btn btn-sm btn-danger" onclick="deleteTask(1746631889255)">x</button>
  - attempting click action
    - waiting for element to be visible, enabled and stable
  - element was detached from the DOM, retrying

    at /tests/playwright/tests/task.spec.js:9:17
```

# Page snapshot

```yaml
- heading "Task Manager" [level=1]
- textbox "New task..."
- button "Add Task"
- button "Remove All"
- list:
  - listitem:
    - text: Second Task
    - button "x"
```

# Test source

```ts
   1 | const { test, expect } = require('@playwright/test');
   2 |
   3 | test.describe('Task Management', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     await page.goto(process.env.BASE_URL || 'http://localhost:3000');
   6 |     // Clear all tasks before each test
   7 |     const deleteButtons = await page.locator('#task-list .btn-danger').all();
   8 |     for (const btn of deleteButtons) {
>  9 |       await btn.click();
     |                 ^ Error: locator.click: Test timeout of 30000ms exceeded.
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
  30 |     await page.click('text=Add Task');
  31 |     const finalCount = await page.locator('#task-list li').count();
  32 |     expect(finalCount).toBe(initialCount);
  33 |   });
  34 |
  35 |   test('should allow adding multiple tasks', async ({ page }) => {
  36 |     await page.fill('#task-input', 'First Task');
  37 |     await page.click('text=Add Task');
  38 |     await page.fill('#task-input', 'Second Task');
  39 |     await page.click('text=Add Task');
  40 |     await expect(page.locator('#task-list')).toContainText('First Task');
  41 |     await expect(page.locator('#task-list')).toContainText('Second Task');
  42 |   });
  43 |
  44 |   test('should handle very long task input', async ({ page }) => {
  45 |     const longText = 'A'.repeat(1000);
  46 |     await page.fill('#task-input', longText);
  47 |     await page.click('text=Add Task');
  48 |     await expect(page.locator('#task-list')).toContainText(longText);
  49 |   });
  50 | });
  51 |
```