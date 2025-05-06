# Test info

- Name: should add a task
- Location: /Users/josemejias/WebstormProjects/task-manager-qa-app/playwright/tests/task.spec.ts:3:5

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toContainText(expected)

Locator: locator('#task-list')
Expected string: "Test Playwright Task"
Received string: ""
Call log:
  - expect.toContainText with timeout 5000ms
  - waiting for locator('#task-list')
    9 × locator resolved to <ul id="task-list" class="list-group mt-3"></ul>
      - unexpected value ""

    at /Users/josemejias/WebstormProjects/task-manager-qa-app/playwright/tests/task.spec.ts:7:44
```

# Page snapshot

```yaml
- heading "Task Manager" [level=1]
- textbox "New task..."
- button "Add Task"
- list
```

# Test source

```ts
  1 | import { test, expect } from '@playwright/test';
  2 |
  3 | test('should add a task', async ({ page }) => {
  4 |   await page.goto('http://localhost:3000');
  5 |   await page.fill('#task-input', 'Test Playwright Task');
  6 |   await page.click('text=Add Task');
> 7 |   await expect(page.locator('#task-list')).toContainText('Test Playwright Task');
    |                                            ^ Error: Timed out 5000ms waiting for expect(locator).toContainText(expected)
  8 | });
  9 |
```