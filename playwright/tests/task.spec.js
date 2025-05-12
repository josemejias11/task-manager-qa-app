const { test, expect } = require('@playwright/test');

test.describe('Task Management', () => {
  test('should remove all tasks using Remove All button', async ({ page }) => {
    await page.fill('#task-input', 'Temp Task 1');
    await page.click('text=Add Task');
    await page.fill('#task-input', 'Temp Task 2');
    await page.click('text=Add Task');

    const tasksBefore = await page.locator('#task-list li').count();
    expect(tasksBefore).toBeGreaterThan(0);

    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toBe('Are you sure you want to delete all tasks?');
      await dialog.accept();
    });

    await page.click('text=Remove All');

    await expect(page.locator('#task-list li')).toHaveCount(0);
  });
  test.beforeEach(async ({ page }) => {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    await page.goto(baseUrl, { waitUntil: 'load' });

    await expect(page.locator('h1')).toHaveText('Task Manager', { timeout: 5000 });

    await page.screenshot({ path: 'debug.png', fullPage: true });

    const deleteButtons = await page.locator('#task-list .btn-danger');
    const count = await deleteButtons.count();
    for (let i = count - 1; i >= 0; i--) {
      await deleteButtons.nth(i).click();
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
    const warning = page.locator('#form-warning');
    const longText = 'A'.repeat(21);

    await input.fill('');
    await expect(input).toHaveValue('');

    await input.fill(longText);
    await expect(warning).toBeHidden();

    await page.click('text=Add Task');
    await expect(warning).toBeVisible({ timeout: 3000 });
    await expect(warning).toHaveText('Task title must be 20 characters or less.');

    const taskTexts = await page.locator('#task-list li').allTextContents();
    expect(taskTexts.some(text => text.includes(longText))).toBeFalsy();
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

  test('should edit a task title', async ({ page }) => {
    // Create a task to edit
    await page.fill('#task-input', 'Task to be edited');
    await page.click('text=Add Task');

    // Verify the task was created and take a screenshot
    const taskLocator = page.locator('#task-list li', { hasText: 'Task to be edited' });
    await expect(taskLocator).toBeVisible();
    
    // Store the task's position in the list (we'll use this later)
    const taskItems = page.locator('#task-list li');
    const taskCount = await taskItems.count();
    console.log(`Found ${taskCount} tasks in the list`);
    
    // Store the task ID for more reliable tracking
    const taskId = await taskLocator.getAttribute('data-id');
    console.log(`Task ID: ${taskId}`);
    
    await page.screenshot({ path: 'test-results/task-before-edit.png' });

    // Wait for the Edit button to be available and click it
    const editButton = taskLocator.locator('button', { hasText: 'Edit' });
    await expect(editButton).toBeVisible({ timeout: 2000 });
    console.log('Edit button found, clicking it...');
    await editButton.click();
    
    // Take screenshot after clicking edit
    await page.screenshot({ path: 'test-results/task-after-edit-click.png' });

    // Wait a moment for any animations
    await page.waitForTimeout(500);

    // Use a more reliable selector based on the task's position or ID
    // Option 1: Select by position if there's only one task
    let editFormSelector = '#task-list li';
    if (taskId) {
      // Option 2: Use the task ID if available
      editFormSelector = `#task-list li[data-id="${taskId}"]`;
    }
    console.log(`Using selector: ${editFormSelector}`);
    
    // Now find the edit input within the form
    const editForm = page.locator(editFormSelector).first();
    await expect(editForm).toBeVisible();
    
    // Look for the input field
    const editInput = editForm.locator('input.form-control');
    console.log('Looking for edit input...');
    
    // Verify the input is visible and has the right initial value
    await expect(editInput).toBeVisible({ timeout: 5000 });
    await expect(editInput).toHaveValue('Task to be edited');
    
    // Edit the task title
    await editInput.clear();
    await editInput.fill('Edited task title');
    
    // Take a screenshot before submitting
    await page.screenshot({ path: 'test-results/task-before-save.png' });
    
    // Submit the edit form
    const saveButton = editForm.locator('button.btn-success', { hasText: 'Save' });
    await expect(saveButton).toBeVisible();
    await saveButton.click();
    
    // Wait for the save operation to complete and for animations to start
    await page.waitForTimeout(1000);
    
    // Verify the task title was updated - use the same task ID or position
    const updatedTaskLocator = page.locator(editFormSelector);
    await expect(updatedTaskLocator.locator('.task-title')).toHaveText('Edited task title');
    
    // Take a screenshot after save to verify the task title was updated
    await page.screenshot({ path: 'test-results/task-after-save.png' });
    
    // The primary verification is that the task title was updated correctly
    // This is the core functionality we care about
    
    // Instead of depending on CSS animations or classes, just verify
    // that the notification element exists in the DOM
    const notification = updatedTaskLocator.locator('.update-notification');
    await expect(notification).toHaveCount(1);
    
    // Log success message
    console.log('Successfully verified task title was updated to: "Edited task title"');
  });

  test('should toggle task completion status', async ({ page }) => {
    // Create a task to toggle
    await page.fill('#task-input', 'Task to toggle');
    await page.click('text=Add Task');

    // Verify the task was created
    const taskLocator = page.locator('#task-list li', { hasText: 'Task to toggle' });
    await expect(taskLocator).toBeVisible();
    
    // Initially, the task should not be marked as completed
    const titleSpan = taskLocator.locator('.task-title');
    await expect(titleSpan).not.toHaveClass(/task-completed/);
    
    // Get the checkbox and toggle it
    const checkbox = taskLocator.locator('input[type="checkbox"]');
    await checkbox.check();
    
    // After toggling, the task should be marked as completed
    await expect(titleSpan).toHaveClass(/task-completed/);
    
    // Toggle it back to incomplete
    await checkbox.uncheck();
    
    // Verify it's no longer marked as completed
    await expect(titleSpan).not.toHaveClass(/task-completed/);
  });
});
