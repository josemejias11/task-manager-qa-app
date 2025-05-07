# Test info

- Name: Task Management >> should not add a task if input is empty
- Location: /tests/playwright/tests/task.spec.js:23:3

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).not.toContainText(expected)

Locator: locator('#task-list')
Expected string: not ""
Received string: "
    Test Playwright Task
    x
  
    Another CI Test Task
    x
  
    Test Playwright Task
    x
  
    Another CI Test Task
    x
  
    Test Playwright Task
    x
  
    Another CI Test Task
    x
  
    Test Playwright Task
    x
  
    Another CI Test Task
    x
  "
Call log:
  - expect.not.toContainText with timeout 5000ms
  - waiting for locator('#task-list')
    9 × locator resolved to <ul id="task-list" class="list-group mt-3">…</ul>
      - unexpected value "
    Test Playwright Task
    x
  
    Another CI Test Task
    x
  
    Test Playwright Task
    x
  
    Another CI Test Task
    x
  
    Test Playwright Task
    x
  
    Another CI Test Task
    x
  
    Test Playwright Task
    x
  
    Another CI Test Task
    x
  "

    at /tests/playwright/tests/task.spec.js:25:50
```

# Page snapshot

```yaml
- heading "Task Manager" [level=1]
- textbox "New task..."
- button "Add Task"
- button "Remove All"
- list:
  - listitem:
    - text: Test Playwright Task
    - button "x"
  - listitem:
    - text: Another CI Test Task
    - button "x"
  - listitem:
    - text: Test Playwright Task
    - button "x"
  - listitem:
    - text: Another CI Test Task
    - button "x"
  - listitem:
    - text: Test Playwright Task
    - button "x"
  - listitem:
    - text: Another CI Test Task
    - button "x"
  - listitem:
    - text: Test Playwright Task
    - button "x"
  - listitem:
    - text: Another CI Test Task
    - button "x"
```

# Test source

```ts
   1 | const { test, expect } = require('@playwright/test');
   2 |
   3 | test.describe('Task Management', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     await page.goto(process.env.BASE_URL || 'http://localhost:3000');
   6 |   });
   7 |
   8 |   test('should add a task', async ({ page }) => {
   9 |     await page.fill('#task-input', 'Test Playwright Task');
  10 |     await page.click('text=Add Task');
  11 |     await expect(page.locator('#task-list')).toContainText('Test Playwright Task');
  12 |   });
  13 |
  14 |   test('should clear the input after adding a task', async ({ page }) => {
  15 |     const input = page.locator('#task-input');
  16 |     await input.fill('Another CI Test Task');
  17 |     await page.click('text=Add Task');
  18 |
  19 |     await expect(page.locator('#task-list')).toContainText('Another CI Test Task');
  20 |     await expect(input).toHaveValue('');
  21 |   });
  22 |
  23 |   test('should not add a task if input is empty', async ({ page }) => {
  24 |     await page.click('text=Add Task');
> 25 |     await expect(page.locator('#task-list')).not.toContainText('');
     |                                                  ^ Error: Timed out 5000ms waiting for expect(locator).not.toContainText(expected)
  26 |   });
  27 |
  28 |   test('should allow adding multiple tasks', async ({ page }) => {
  29 |     await page.fill('#task-input', 'First Task');
  30 |     await page.click('text=Add Task');
  31 |     await page.fill('#task-input', 'Second Task');
  32 |     await page.click('text=Add Task');
  33 |     await expect(page.locator('#task-list')).toContainText(['First Task', 'Second Task']);
  34 |   });
  35 |
  36 |   test('should handle very long task input', async ({ page }) => {
  37 |     const longText = 'A'.repeat(1000);
  38 |     await page.fill('#task-input', longText);
  39 |     await page.click('text=Add Task');
  40 |     await expect(page.locator('#task-list')).toContainText(longText);
  41 |   });
  42 | });
  43 |
```