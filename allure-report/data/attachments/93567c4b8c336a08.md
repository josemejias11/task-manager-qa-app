# Test info

- Name: Task Management >> should show warning if task input exceeds 20 characters
- Location: /tests/playwright/tests/task.spec.js:69:3

# Error details

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('#task-list .btn-danger').nth(1)
    - locator resolved to <button aria-label="Delete task Second Task" class="btn btn-sm btn-danger btn-delete-task" data-id="92adb927-9a3f-4fae-a75f-5287c38f1c30">x</button>
  - attempting click action
    - waiting for element to be visible, enabled and stable
  - element was detached from the DOM, retrying

    at /tests/playwright/tests/task.spec.js:34:34
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
   4 |   test('should remove all tasks using Remove All button', async ({ page }) => {
   5 |     await page.fill('#task-input', 'Temp Task 1');
   6 |     await page.click('text=Add Task');
   7 |     await page.fill('#task-input', 'Temp Task 2');
   8 |     await page.click('text=Add Task');
   9 |
   10 |     const tasksBefore = await page.locator('#task-list li').count();
   11 |     expect(tasksBefore).toBeGreaterThan(0);
   12 |
   13 |     page.once('dialog', async dialog => {
   14 |       expect(dialog.type()).toBe('confirm');
   15 |       expect(dialog.message()).toBe('Are you sure you want to delete all tasks?');
   16 |       await dialog.accept();
   17 |     });
   18 |
   19 |     await page.click('text=Remove All');
   20 |
   21 |     await expect(page.locator('#task-list li')).toHaveCount(0);
   22 |   });
   23 |   test.beforeEach(async ({ page }) => {
   24 |     const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
   25 |     await page.goto(baseUrl, { waitUntil: 'load' });
   26 |
   27 |     await expect(page.locator('h1')).toHaveText('Task Manager', { timeout: 5000 });
   28 |
   29 |     await page.screenshot({ path: 'debug.png', fullPage: true });
   30 |
   31 |     const deleteButtons = await page.locator('#task-list .btn-danger');
   32 |     const count = await deleteButtons.count();
   33 |     for (let i = 0; i < count; i++) {
>  34 |       await deleteButtons.nth(i).click();
      |                                  ^ Error: locator.click: Test timeout of 30000ms exceeded.
   35 |     }
   36 |   });
   37 |
   38 |   test('should add a task', async ({ page }) => {
   39 |     await page.fill('#task-input', 'Test Playwright Task');
   40 |     await page.click('text=Add Task');
   41 |     await expect(page.locator('#task-list')).toContainText('Test Playwright Task');
   42 |   });
   43 |
   44 |   test('should clear the input after adding a task', async ({ page }) => {
   45 |     const input = page.locator('#task-input');
   46 |     await input.fill('Another CI Test Task');
   47 |     await page.click('text=Add Task');
   48 |
   49 |     await expect(page.locator('#task-list')).toContainText('Another CI Test Task');
   50 |     await expect(input).toHaveValue('');
   51 |   });
   52 |
   53 |   test('should not add a task if input is empty', async ({ page }) => {
   54 |     await page.fill('#task-input', '');
   55 |     await page.click('text=Add Task');
   56 |     await expect(page.locator('#form-warning')).toBeVisible({ timeout: 2000 });
   57 |     await expect(page.locator('#form-warning')).toHaveText('Task title cannot be empty.');
   58 |   });
   59 |
   60 |   test('should allow adding multiple tasks', async ({ page }) => {
   61 |     await page.fill('#task-input', 'First Task');
   62 |     await page.click('text=Add Task');
   63 |     await page.fill('#task-input', 'Second Task');
   64 |     await page.click('text=Add Task');
   65 |     await expect(page.locator('#task-list')).toContainText('First Task');
   66 |     await expect(page.locator('#task-list')).toContainText('Second Task');
   67 |   });
   68 |
   69 |   test('should show warning if task input exceeds 20 characters', async ({ page }) => {
   70 |     const input = page.locator('#task-input');
   71 |     const warning = page.locator('#form-warning');
   72 |     const longText = 'A'.repeat(21);
   73 |
   74 |     await input.fill('');
   75 |     await expect(input).toHaveValue('');
   76 |
   77 |     await input.fill(longText);
   78 |     await expect(warning).toBeHidden();
   79 |
   80 |     await page.click('text=Add Task');
   81 |     await expect(warning).toBeVisible({ timeout: 3000 });
   82 |     await expect(warning).toHaveText('Task title must be 20 characters or less.');
   83 |
   84 |     const taskTexts = await page.locator('#task-list li').allTextContents();
   85 |     expect(taskTexts.some(text => text.includes(longText))).toBeFalsy();
   86 |   });
   87 |   test('should assign a UUID to new tasks', async ({ page }) => {
   88 |     await page.fill('#task-input', 'UUID Test');
   89 |     await page.click('text=Add Task');
   90 |
   91 |     const deleteButtons = await page.locator('#task-list .btn-danger');
   92 |     const dataId = await deleteButtons.first().getAttribute('data-id');
   93 |     expect(dataId).toMatch(/^[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12}$/i);
   94 |   });
   95 |
   96 |   test('should delete a task', async ({ page }) => {
   97 |     await page.fill('#task-input', 'Task to be deleted');
   98 |     await page.click('text=Add Task');
   99 |
  100 |     const taskLocator = page.locator('#task-list li', { hasText: 'Task to be deleted' });
  101 |     await expect(taskLocator).toBeVisible();
  102 |
  103 |     const deleteButton = taskLocator.locator('.btn-danger');
  104 |     await deleteButton.click();
  105 |
  106 |     await expect(taskLocator).not.toBeVisible();
  107 |   });
  108 | });
  109 |
```