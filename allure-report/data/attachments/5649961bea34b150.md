# Test info

- Name: Task Management >> should allow adding multiple tasks
- Location: /tests/playwright/tests/task.spec.js:36:3

# Error details

```
TimeoutError: locator.waitFor: Timeout 5000ms exceeded.
Call log:
  - waiting for locator('#task-list') to be visible
    15 × locator resolved to hidden <ul id="task-list" class="list-group mt-3"></ul>

    at /tests/playwright/tests/task.spec.js:6:38
```

# Page snapshot

```yaml
- heading "Task Manager" [level=1]
- textbox "New task..."
- button "Add Task"
- button "Remove All"
- list
```

# Test source

```ts
   1 | const { test, expect } = require('@playwright/test');
   2 |
   3 | test.describe('Task Management', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     await page.goto(process.env.BASE_URL || 'http://localhost:3000');
>  6 |     await page.locator('#task-list').waitFor({ state: 'visible', timeout: 5000 });
     |                                      ^ TimeoutError: locator.waitFor: Timeout 5000ms exceeded.
   7 |     const deleteButtons = await page.locator('#task-list .btn-danger');
   8 |     const count = await deleteButtons.count();
   9 |     for (let i = 0; i < count; i++) {
  10 |       await deleteButtons.nth(i).click();
  11 |     }
  12 |   });
  13 |
  14 |   test('should add a task', async ({ page }) => {
  15 |     await page.fill('#task-input', 'Test Playwright Task');
  16 |     await page.click('text=Add Task');
  17 |     await expect(page.locator('#task-list')).toContainText('Test Playwright Task');
  18 |   });
  19 |
  20 |   test('should clear the input after adding a task', async ({ page }) => {
  21 |     const input = page.locator('#task-input');
  22 |     await input.fill('Another CI Test Task');
  23 |     await page.click('text=Add Task');
  24 |
  25 |     await expect(page.locator('#task-list')).toContainText('Another CI Test Task');
  26 |     await expect(input).toHaveValue('');
  27 |   });
  28 |
  29 |   test('should not add a task if input is empty', async ({ page }) => {
  30 |     await page.fill('#task-input', '');
  31 |     await page.click('text=Add Task');
  32 |     await expect(page.locator('#form-warning')).toBeVisible({ timeout: 2000 });
  33 |     await expect(page.locator('#form-warning')).toHaveText('Task title cannot be empty.');
  34 |   });
  35 |
  36 |   test('should allow adding multiple tasks', async ({ page }) => {
  37 |     await page.fill('#task-input', 'First Task');
  38 |     await page.click('text=Add Task');
  39 |     await page.fill('#task-input', 'Second Task');
  40 |     await page.click('text=Add Task');
  41 |     await expect(page.locator('#task-list')).toContainText('First Task');
  42 |     await expect(page.locator('#task-list')).toContainText('Second Task');
  43 |   });
  44 |
  45 |   test('should show warning if task input exceeds 20 characters', async ({ page }) => {
  46 |     const input = page.locator('#task-input');
  47 |     const warning = page.locator('#form-warning');
  48 |     const longText = 'A'.repeat(21);
  49 |
  50 |     await input.fill(''); // Ensure empty first
  51 |     await expect(input).toHaveValue('');
  52 |
  53 |     await input.fill(longText); // Fill input with more than 20 characters (should not be allowed to add task)
  54 |     await expect(warning).toBeHidden(); // Still no warning
  55 |
  56 |     await page.click('text=Add Task'); // Try to submit
  57 |     await expect(warning).toBeVisible({ timeout: 3000 }); // Now warning should appear
  58 |     await expect(warning).toHaveText('Task title must be 20 characters or less.');
  59 |
  60 |     const taskTexts = await page.locator('#task-list li').allTextContents();
  61 |     expect(taskTexts.some(text => text.includes(longText))).toBeFalsy(); // Confirm task wasn't added
  62 |   });
  63 |   test('should assign a UUID to new tasks', async ({ page }) => {
  64 |     await page.fill('#task-input', 'UUID Test');
  65 |     await page.click('text=Add Task');
  66 |
  67 |     const deleteButtons = await page.locator('#task-list .btn-danger');
  68 |     const dataId = await deleteButtons.first().getAttribute('data-id');
  69 |     expect(dataId).toMatch(/^[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12}$/i);
  70 |   });
  71 |
  72 |   test('should delete a task', async ({ page }) => {
  73 |     await page.fill('#task-input', 'Task to be deleted');
  74 |     await page.click('text=Add Task');
  75 |
  76 |     const taskLocator = page.locator('#task-list li', { hasText: 'Task to be deleted' });
  77 |     await expect(taskLocator).toBeVisible();
  78 |
  79 |     const deleteButton = taskLocator.locator('.btn-danger');
  80 |     await deleteButton.click();
  81 |
  82 |     await expect(taskLocator).not.toBeVisible();
  83 |   });
  84 | });
  85 |
```