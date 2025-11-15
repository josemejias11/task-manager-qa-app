const { test, expect } = require('@playwright/test');

// Use serial mode to prevent race conditions with shared JSON database
test.describe.serial('Task Manager UI', () => {
  test.beforeEach(async ({ page, request }) => {
    // Clean up all tasks before each test
    await request.delete('http://localhost:3000/api/tasks');

    // Navigate to the application
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display the task manager interface', async ({ page }) => {
    await test.step('Verify page title', async () => {
      await expect(page).toHaveTitle('Task Manager');
    });

    await test.step('Verify main heading', async () => {
      await expect(page.locator('h1')).toHaveText('Task Manager');
    });

    await test.step('Verify form elements exist', async () => {
      await expect(page.locator('#task-input')).toBeVisible();
      await expect(page.locator('button:has-text("Add Task")')).toBeVisible();
      await expect(page.locator('button:has-text("Remove All")')).toBeVisible();
    });

    await test.step('Verify task list exists', async () => {
      await expect(page.locator('#task-list')).toBeVisible();
    });
  });

  test('should add a new task via UI', async ({ page }) => {
    const taskTitle = 'Buy groceries';

    await test.step('Fill in task input', async () => {
      await page.locator('#task-input').fill(taskTitle);
    });

    await test.step('Submit the form', async () => {
      await page.locator('button:has-text("Add Task")').click();
    });

    await test.step('Verify task appears in list', async () => {
      const taskItem = page.locator(`li:has-text("${taskTitle}")`);
      await expect(taskItem).toBeVisible();
    });

    await test.step('Verify input is cleared', async () => {
      await expect(page.locator('#task-input')).toHaveValue('');
    });

    await test.step('Verify task has checkbox and buttons', async () => {
      const taskItem = page.locator(`li:has-text("${taskTitle}")`);
      await expect(taskItem.locator('input[type="checkbox"]')).toBeVisible();
      await expect(taskItem.locator('button:has-text("Edit")')).toBeVisible();
      await expect(taskItem.locator('button:has-text("Delete")')).toBeVisible();
    });
  });

  test('should add multiple tasks', async ({ page }) => {
    const tasks = ['Task One', 'Task Two', 'Task Three'];

    for (const task of tasks) {
      await page.locator('#task-input').fill(task);
      await page.locator('button:has-text("Add Task")').click();
      await page.waitForTimeout(100); // Small delay to ensure tasks are added
    }

    await test.step('Verify all tasks are displayed', async () => {
      for (const task of tasks) {
        await expect(page.locator(`li:has-text("${task}")`)).toBeVisible();
      }
    });

    await test.step('Verify task count', async () => {
      const taskItems = page.locator('#task-list li');
      await expect(taskItems).toHaveCount(3);
    });
  });

  test('should not create task with empty title', async ({ page }) => {
    await test.step('Click Add Task without entering title', async () => {
      await page.locator('button:has-text("Add Task")').click();
    });

    await test.step('Verify validation error is displayed', async () => {
      const errorMessage = page.locator('#form-warning');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toContainText('Task title cannot be empty');
    });

    await test.step('Verify no task was added', async () => {
      const taskItems = page.locator('#task-list li');
      await expect(taskItems).toHaveCount(0);
    });
  });

  test('should not create task with title exceeding 20 characters', async ({ page }) => {
    const longTitle = 'This title is way too long to be valid';

    await test.step('Enter long title', async () => {
      await page.locator('#task-input').fill(longTitle);
    });

    await test.step('Submit the form', async () => {
      await page.locator('button:has-text("Add Task")').click();
    });

    await test.step('Verify validation error is displayed', async () => {
      const errorMessage = page.locator('#form-warning');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toContainText('must be 20 characters or less');
    });

    await test.step('Verify no task was added', async () => {
      const taskItems = page.locator('#task-list li');
      await expect(taskItems).toHaveCount(0);
    });
  });

  test('should hide validation error when user types', async ({ page }) => {
    await test.step('Trigger validation error', async () => {
      await page.locator('button:has-text("Add Task")').click();
      await expect(page.locator('#form-warning')).toBeVisible();
    });

    await test.step('Start typing in input', async () => {
      await page.locator('#task-input').fill('Valid task');
    });

    await test.step('Verify error is hidden', async () => {
      await expect(page.locator('#form-warning')).toBeHidden();
    });
  });

  test('should toggle task completion status', async ({ page }) => {
    const taskTitle = 'Complete this task';

    await test.step('Create a task', async () => {
      await page.locator('#task-input').fill(taskTitle);
      await page.locator('button:has-text("Add Task")').click();
    });

    const taskItem = page.locator(`li:has-text("${taskTitle}")`);
    const checkbox = taskItem.locator('input[type="checkbox"]');
    const titleSpan = taskItem.locator('.task-title');

    await test.step('Verify task is not completed initially', async () => {
      await expect(checkbox).not.toBeChecked();
      await expect(titleSpan).not.toHaveClass(/task-completed/);
    });

    await test.step('Mark task as completed', async () => {
      await checkbox.check();
    });

    await test.step('Verify task shows as completed', async () => {
      await expect(checkbox).toBeChecked();
      await expect(titleSpan).toHaveClass(/task-completed/);
    });

    await test.step('Uncheck the task', async () => {
      await checkbox.uncheck();
    });

    await test.step('Verify task shows as not completed', async () => {
      await expect(checkbox).not.toBeChecked();
      await expect(titleSpan).not.toHaveClass(/task-completed/);
    });
  });

  test('should delete a task', async ({ page }) => {
    const taskTitle = 'Task to delete';

    await test.step('Create a task', async () => {
      await page.locator('#task-input').fill(taskTitle);
      await page.locator('button:has-text("Add Task")').click();
    });

    await test.step('Verify task exists', async () => {
      await expect(page.locator(`li:has-text("${taskTitle}")`)).toBeVisible();
    });

    await test.step('Click delete button', async () => {
      const taskItem = page.locator(`li:has-text("${taskTitle}")`);
      await taskItem.locator('button:has-text("Delete")').click();
    });

    await test.step('Verify task is removed', async () => {
      await expect(page.locator(`li:has-text("${taskTitle}")`)).toHaveCount(0);
    });
  });

  test('should edit a task', async ({ page }) => {
    const originalTitle = 'Original Task';
    const updatedTitle = 'Updated Task';

    await test.step('Create a task', async () => {
      await page.locator('#task-input').fill(originalTitle);
      await page.locator('button:has-text("Add Task")').click();
    });

    const taskItem = page.locator(`li:has-text("${originalTitle}")`);

    await test.step('Click edit button', async () => {
      await taskItem.locator('button:has-text("Edit")').click();
    });

    await test.step('Verify edit mode is active', async () => {
      const editInput = taskItem.locator('input.edit-input');
      await expect(editInput).toBeVisible();
      await expect(editInput).toHaveValue(originalTitle);
      await expect(taskItem.locator('button:has-text("Save")')).toBeVisible();
      await expect(taskItem.locator('button:has-text("Cancel")')).toBeVisible();
    });

    await test.step('Update task title', async () => {
      const editInput = taskItem.locator('input.edit-input');
      await editInput.clear();
      await editInput.fill(updatedTitle);
    });

    await test.step('Save the changes', async () => {
      await taskItem.locator('button:has-text("Save")').click();
    });

    await test.step('Verify task is updated', async () => {
      await expect(page.locator(`li:has-text("${updatedTitle}")`)).toBeVisible();
      await expect(page.locator(`li:has-text("${originalTitle}")`)).toHaveCount(0);
    });

    await test.step('Verify "Updated!" notification appears', async () => {
      const notification = page.locator('.update-notification');
      await expect(notification).toBeVisible();
    });
  });

  test('should cancel task edit', async ({ page }) => {
    const taskTitle = 'Task to edit';

    await test.step('Create a task', async () => {
      await page.locator('#task-input').fill(taskTitle);
      await page.locator('button:has-text("Add Task")').click();
    });

    const taskItem = page.locator(`li:has-text("${taskTitle}")`);

    await test.step('Enter edit mode', async () => {
      await taskItem.locator('button:has-text("Edit")').click();
    });

    await test.step('Modify the title', async () => {
      const editInput = taskItem.locator('input.edit-input');
      await editInput.clear();
      await editInput.fill('Changed Title');
    });

    await test.step('Click cancel button', async () => {
      await taskItem.locator('button:has-text("Cancel")').click();
    });

    await test.step('Verify original title is preserved', async () => {
      await expect(page.locator(`li:has-text("${taskTitle}")`)).toBeVisible();
      await expect(page.locator('li:has-text("Changed Title")')).toHaveCount(0);
    });

    await test.step('Verify edit mode is closed', async () => {
      await expect(taskItem.locator('input.edit-input')).toHaveCount(0);
      await expect(taskItem.locator('button:has-text("Edit")')).toBeVisible();
    });
  });

  test('should remove all tasks', async ({ page }) => {
    const tasks = ['Task 1', 'Task 2', 'Task 3'];

    await test.step('Create multiple tasks', async () => {
      for (const task of tasks) {
        await page.locator('#task-input').fill(task);
        await page.locator('button:has-text("Add Task")').click();
        await page.waitForTimeout(100);
      }
    });

    await test.step('Verify tasks exist', async () => {
      const taskItems = page.locator('#task-list li');
      await expect(taskItems).toHaveCount(3);
    });

    await test.step('Click Remove All button and confirm', async () => {
      // Set up dialog handler before clicking
      page.on('dialog', dialog => dialog.accept());
      await page.locator('button:has-text("Remove All")').click();
    });

    await test.step('Verify all tasks are removed', async () => {
      const taskItems = page.locator('#task-list li');
      await expect(taskItems).toHaveCount(0);
    });
  });

  test('should cancel remove all tasks', async ({ page }) => {
    const tasks = ['Task 1', 'Task 2'];

    await test.step('Create tasks', async () => {
      for (const task of tasks) {
        await page.locator('#task-input').fill(task);
        await page.locator('button:has-text("Add Task")').click();
        await page.waitForTimeout(100);
      }
    });

    await test.step('Click Remove All and dismiss dialog', async () => {
      page.on('dialog', dialog => dialog.dismiss());
      await page.locator('button:has-text("Remove All")').click();
    });

    await test.step('Verify tasks still exist', async () => {
      const taskItems = page.locator('#task-list li');
      await expect(taskItems).toHaveCount(2);
    });
  });

  test('should persist task completion status after edit', async ({ page }) => {
    const taskTitle = 'Task to test';

    await test.step('Create and complete a task', async () => {
      await page.locator('#task-input').fill(taskTitle);
      await page.locator('button:has-text("Add Task")').click();

      const checkbox = page.locator(`li:has-text("${taskTitle}") input[type="checkbox"]`);
      await checkbox.check();
      await expect(checkbox).toBeChecked();
    });

    await test.step('Edit the task title', async () => {
      const taskItem = page.locator(`li:has-text("${taskTitle}")`);
      await taskItem.locator('button:has-text("Edit")').click();

      const editInput = taskItem.locator('input.edit-input');
      await editInput.clear();
      await editInput.fill('Edited Task');
      await taskItem.locator('button:has-text("Save")').click();
    });

    await test.step('Verify completion status is preserved', async () => {
      const updatedCheckbox = page.locator('li:has-text("Edited Task") input[type="checkbox"]');
      await expect(updatedCheckbox).toBeChecked();

      const titleSpan = page.locator('li:has-text("Edited Task") .task-title');
      await expect(titleSpan).toHaveClass(/task-completed/);
    });
  });

  test('should not allow editing task with empty title', async ({ page }) => {
    const taskTitle = 'Valid Task';

    await test.step('Create a task', async () => {
      await page.locator('#task-input').fill(taskTitle);
      await page.locator('button:has-text("Add Task")').click();
    });

    await test.step('Enter edit mode and clear title', async () => {
      const taskItem = page.locator(`li:has-text("${taskTitle}")`);
      await taskItem.locator('button:has-text("Edit")').click();

      const editInput = taskItem.locator('input.edit-input');
      await editInput.clear();
    });

    await test.step('Try to save empty title', async () => {
      const taskItem = page.locator(`li:has-text("${taskTitle}")`);

      // Set up dialog handler to capture alert
      page.on('dialog', dialog => {
        expect(dialog.message()).toContain('cannot be empty');
        dialog.accept();
      });

      await taskItem.locator('button:has-text("Save")').click();
    });

    await test.step('Verify original task is preserved', async () => {
      await expect(page.locator(`li:has-text("${taskTitle}")`)).toBeVisible();
    });
  });

  test('should handle rapid task additions', async ({ page }) => {
    const tasks = ['Fast 1', 'Fast 2', 'Fast 3', 'Fast 4', 'Fast 5'];

    await test.step('Rapidly add tasks', async () => {
      for (const task of tasks) {
        await page.locator('#task-input').fill(task);
        await page.locator('button:has-text("Add Task")').click();
        // No wait - testing rapid additions
      }
    });

    await test.step('Verify all tasks were added', async () => {
      // Wait a bit for all requests to complete
      await page.waitForTimeout(500);

      for (const task of tasks) {
        await expect(page.locator(`li:has-text("${task}")`)).toBeVisible();
      }

      const taskItems = page.locator('#task-list li');
      await expect(taskItems).toHaveCount(5);
    });
  });
});
