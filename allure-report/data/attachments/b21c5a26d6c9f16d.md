# Test info

- Name: Task Management >> should add a task
- Location: /tests/playwright/tests/task.spec.js:12:3

# Error details

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('#task-list .btn-danger').nth(1)
    - locator resolved to <button aria-label="Delete task Check UUID" class="btn btn-sm btn-danger btn-delete-task" data-id="580363d0-cae0-4ab8-8c04-8928e7df2b58">x</button>
  - attempting click action
    - waiting for element to be visible, enabled and stable
  - element was detached from the DOM, retrying

    at /tests/playwright/tests/task.spec.js:8:17
```

# Page snapshot

```yaml
- heading "Task Manager" [level=1]
- textbox "New task..."
- button "Add Task"
- button "Remove All"
- list:
  - listitem:
    - text: Check UUID
    - button "Delete task Check UUID": x
```

# Test source

```ts
   1 | const { test, expect } = require('@playwright/test');
   2 |
   3 | test.describe('Task Management', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     await page.goto(process.env.BASE_URL || 'http://localhost:3000');
   6 |     const deleteButtons = await page.locator('#task-list .btn-danger').all();
   7 |     for (const btn of deleteButtons) {
>  8 |       await btn.click();
     |                 ^ Error: locator.click: Test timeout of 30000ms exceeded.
   9 |     }
  10 |   });
  11 |
  12 |   test('should add a task', async ({ page }) => {
  13 |     await page.fill('#task-input', 'Test Playwright Task');
  14 |     await page.click('text=Add Task');
  15 |     await expect(page.locator('#task-list')).toContainText('Test Playwright Task');
  16 |   });
  17 |
  18 |   test('should clear the input after adding a task', async ({ page }) => {
  19 |     const input = page.locator('#task-input');
  20 |     await input.fill('Another CI Test Task');
  21 |     await page.click('text=Add Task');
  22 |
  23 |     await expect(page.locator('#task-list')).toContainText('Another CI Test Task');
  24 |     await expect(input).toHaveValue('');
  25 |   });
  26 |
  27 |   test('should not add a task if input is empty', async ({ page }) => {
  28 |     await page.fill('#task-input', '');
  29 |     await page.click('text=Add Task');
  30 |     await expect(page.locator('#form-warning')).toBeVisible({ timeout: 2000 });
  31 |     await expect(page.locator('#form-warning')).toHaveText('Task title cannot be empty.');
  32 |   });
  33 |
  34 |   test('should allow adding multiple tasks', async ({ page }) => {
  35 |     await page.fill('#task-input', 'First Task');
  36 |     await page.click('text=Add Task');
  37 |     await page.fill('#task-input', 'Second Task');
  38 |     await page.click('text=Add Task');
  39 |     await expect(page.locator('#task-list')).toContainText('First Task');
  40 |     await expect(page.locator('#task-list')).toContainText('Second Task');
  41 |   });
  42 |
  43 |   test('should show warning if task input exceeds 20 characters', async ({ page }) => {
  44 |     const input = page.locator('#task-input');
  45 |     const warning = page.locator('#form-warning');
  46 |     const longText = 'A'.repeat(21);
  47 |
  48 |     await input.fill(''); // Ensure empty first
  49 |     await expect(input).toHaveValue('');
  50 |
  51 |     await input.fill(longText); // Input >20 chars
  52 |     await expect(warning).toBeHidden(); // Still no warning
  53 |
  54 |     await page.click('text=Add Task'); // Try to submit
  55 |     await expect(warning).toBeVisible({ timeout: 3000 }); // Now warning should appear
  56 |     await expect(warning).toHaveText('Task title must be 20 characters or less.');
  57 |
  58 |     const taskTexts = await page.locator('#task-list li').allTextContents();
  59 |     expect(taskTexts.some(text => text.includes(longText))).toBeFalsy(); // Confirm task wasn't added
  60 |   });
  61 |   test('should assign a UUID to new tasks', async ({ page }) => {
  62 |     await page.fill('#task-input', 'UUID Test');
  63 |     await page.click('text=Add Task');
  64 |
  65 |     const deleteButtons = await page.locator('#task-list .btn-danger');
  66 |     const dataId = await deleteButtons.first().getAttribute('data-id');
  67 |     expect(dataId).toMatch(/^[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12}$/i);
  68 |   });
  69 |
  70 |   test('should delete a task', async ({ page }) => {
  71 |     await page.fill('#task-input', 'Task to be deleted');
  72 |     await page.click('text=Add Task');
  73 |
  74 |     const taskLocator = page.locator('#task-list li', { hasText: 'Task to be deleted' });
  75 |     await expect(taskLocator).toBeVisible();
  76 |
  77 |     const deleteButton = taskLocator.locator('.btn-danger');
  78 |     await deleteButton.click();
  79 |
  80 |     await expect(taskLocator).not.toBeVisible();
  81 |   });
  82 | });
  83 |
```