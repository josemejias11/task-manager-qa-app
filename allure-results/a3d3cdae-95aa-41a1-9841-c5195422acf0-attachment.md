# Test info

- Name: should add a task
- Location: /Users/josemejias/WebstormProjects/task-manager-qa-app/playwright/tests/task.spec.js:3:1

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

    at /Users/josemejias/WebstormProjects/task-manager-qa-app/playwright/tests/task.spec.js:4:14
```

# Test source

```ts
   1 | const { test, expect } = require('@playwright/test');
   2 |
   3 | test('should add a task', async ({ page }) => {
>  4 |   await page.goto(process.env.BASE_URL || 'http://localhost:3000');
     |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
   5 |   await page.fill('#task-input', 'Test Playwright Task');
   6 |   await page.click('text=Add Task');
   7 |   await expect(page.locator('#task-list')).toContainText('Test Playwright Task');
   8 | });
   9 |
  10 | test('should clear the input after adding a task', async ({ page }) => {
  11 |   await page.goto(process.env.BASE_URL || 'http://localhost:3000');
  12 |
  13 |   const input = page.locator('#task-input');
  14 |   await input.fill('Another CI Test Task');
  15 |   await page.click('text=Add Task');
  16 |
  17 |   await expect(page.locator('#task-list')).toContainText('Another CI Test Task');
  18 |   await expect(input).toHaveValue('');
  19 | });
  20 |
```