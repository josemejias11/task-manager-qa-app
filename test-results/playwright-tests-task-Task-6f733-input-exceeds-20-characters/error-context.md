# Test info

- Name: Task Management >> should show warning if task input exceeds 20 characters
- Location: /Users/josemejias/WebstormProjects/task-manager-qa-app/playwright/tests/task.spec.js:44:3

# Error details

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('#task-list .btn-danger').nth(1)
    - locator resolved to <button aria-label="Delete task Second Task" class="btn btn-sm btn-danger btn-delete-task" data-id="df01f1b9-340c-4a0f-b304-53b0741b33f8">x</button>
  - attempting click action
    - waiting for element to be visible, enabled and stable
  - element was detached from the DOM, retrying

    at /Users/josemejias/WebstormProjects/task-manager-qa-app/playwright/tests/task.spec.js:9:17
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
    - button "Delete task Second Task": x
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
  29 |     await page.fill('#task-input', '');
  30 |     await page.click('text=Add Task');
  31 |     await expect(page.locator('#form-warning')).toBeVisible({ timeout: 2000 });
  32 |     await expect(page.locator('#form-warning')).toHaveText('Task title cannot be empty.');
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
  44 |   test('should show warning if task input exceeds 20 characters', async ({ page }) => {
  45 |     const input = page.locator('#task-input');
  46 |     const longText = 'A'.repeat(21); // 21 characters
  47 |
  48 |     // Clear the input field explicitly
  49 |     await input.fill('');
  50 |     await expect(input).toHaveValue('');
  51 |
  52 |     // Fill with long text
  53 |     await input.fill(longText);
  54 |
  55 |     // Ensure warning is not visible before clicking
  56 |     await expect(page.locator('#form-warning')).toBeHidden();
  57 |
  58 |     // Attempt to add the task
  59 |     await page.click('text=Add Task');
  60 |
  61 |     // Verify warning message appears
  62 |     const warning = page.locator('#form-warning');
  63 |     await expect(warning).toBeVisible({ timeout: 2000 });
  64 |     await expect(warning).toHaveText('Task title must be 20 characters or less.');
  65 |   });
  66 |   test('should assign a UUID to new tasks', async ({ page }) => {
  67 |     await page.fill('#task-input', 'UUID Test');
  68 |     await page.click('text=Add Task');
  69 |
  70 |     const deleteButtons = await page.locator('#task-list .btn-danger');
  71 |     const dataId = await deleteButtons.first().getAttribute('data-id');
  72 |     expect(dataId).toMatch(/^[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12}$/i);
  73 |   });
  74 |
  75 |   test('should delete a task', async ({ page }) => {
  76 |     await page.fill('#task-input', 'Task to be deleted');
  77 |     await page.click('text=Add Task');
  78 |
  79 |     const taskLocator = page.locator('#task-list li', { hasText: 'Task to be deleted' });
  80 |     await expect(taskLocator).toBeVisible();
  81 |
  82 |     const deleteButton = taskLocator.locator('.btn-danger');
  83 |     await deleteButton.click();
  84 |
  85 |     await expect(taskLocator).not.toBeVisible();
  86 |   });
  87 | });
  88 |
```