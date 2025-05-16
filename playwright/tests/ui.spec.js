const { test, expect } = require('@playwright/test');

/**
 * Page Object Model for the Task Manager application
 */
class TaskPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    
    // Selectors
    this.taskInput = '#task-input';
    this.addTaskButton = 'button[type="submit"]';
    this.taskList = '#task-list';
    this.removeAllButton = '#remove-all-btn';
    this.formWarning = '#form-warning';
    this.confirmDialog = 'text=Are you sure you want to delete all tasks?';
    
    // Task item selectors
    this.taskItem = (taskTitle) => 
      `${this.taskList} li:has(.task-title:text-is("${taskTitle}"))`;
    this.taskTitle = (taskTitle) => 
      `${this.taskItem(taskTitle)} .task-title`;
    this.taskCheckbox = (taskTitle) => 
      `${this.taskItem(taskTitle)} input[type="checkbox"]`;
    this.taskEditButton = (taskTitle) => 
      `${this.taskItem(taskTitle)} button:text-is("Edit")`;
    this.taskDeleteButton = (taskTitle) => 
      `${this.taskItem(taskTitle)} button:text-is("Delete")`;
  }

  /**
   * Navigate to the task manager homepage and wait for it to be ready
   */
  async goto() {
    try {
      // Navigate to the homepage with full URL
      console.log('Navigating to the task manager homepage...');
      await this.page.goto('http://localhost:3001', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      // Wait for critical elements to be present in DOM (without checking visibility)
      await this.page.waitForSelector(this.taskInput);
      await this.page.waitForSelector(this.taskList);
      await this.page.waitForSelector(this.addTaskButton);
      
      // Wait for JavaScript to initialize properly
      await this.page.waitForFunction(() => {
        return document.readyState === 'complete';
      }, { timeout: 10000 });
      
      // Give a little extra time for any AJAX calls to complete
      await this.page.waitForTimeout(1000);
      
      console.log('Page loaded and initialized successfully');
    } catch (error) {
      console.error('Error loading page:', error);
      if (error.message.includes('Cannot navigate to invalid URL')) {
        throw new Error('Failed to load task manager page: Could not connect to http://localhost:3001. Make sure the server is running.');
      } else if (error.message.includes('ERR_CONNECTION_REFUSED')) {
        throw new Error('Failed to load task manager page: Connection refused. Make sure the server is running on port 3001.');
      } else if (error.message.includes('Timeout')) {
        throw new Error('Failed to load task manager page: Connection timed out. The server is not responding.');
      } else {
        throw new Error(`Failed to load task manager page: ${error.message}`);
      }
    }
  }

  /**
   * Add a new task
   * @param {string} title - The task title
   */
  async addTask(title) {
    try {
      // Clear any existing input just to be safe
      await this.page.fill(this.taskInput, '');
      
      // Type the task title
      await this.page.fill(this.taskInput, title);
      
      // Submit the form by clicking the Add Task button
      await this.page.click(this.addTaskButton);
      
      // Wait for the task to appear in the list
      await this.page.waitForSelector(this.taskTitle(title), { 
        state: 'visible',
        timeout: 5000 
      });
      
      // Give a small amount of time for any animations to complete
      await this.page.waitForTimeout(500);
    } catch (error) {
      console.error(`Error adding task "${title}":`, error);
      throw new Error(`Failed to add task "${title}": ${error.message}`);
    }
  }

  /**
   * Check if a task exists in the list
   * @param {string} title - The task title
   * @returns {Promise<boolean>} - Whether the task exists
   */
  async taskExists(title) {
    try {
      return await this.page.isVisible(this.taskItem(title));
    } catch (error) {
      console.error(`Error checking if task "${title}" exists:`, error);
      return false;
    }
  }

  /**
   * Toggle a task's completion status
   * @param {string} title - The task title
   */
  async toggleTaskCompletion(title) {
    try {
      // Make sure the task exists first
      await this.page.waitForSelector(this.taskItem(title), { 
        state: 'visible',
        timeout: 5000 
      });
      
      // Click the checkbox to toggle completion
      await this.page.click(this.taskCheckbox(title));
      
      // Wait for the API call and UI update to complete
      await this.page.waitForTimeout(1000);
      
      // Verify the visual update has been applied
      // This is important to ensure the test is waiting for the actual state change
      const isCompleted = await this.isTaskCompleted(title);
      await this.page.waitForFunction(
        ([selector, expectedState]) => {
          const element = document.querySelector(selector);
          return element && element.classList.contains('task-completed') === expectedState;
        },
        [this.taskTitle(title), isCompleted],
        { timeout: 5000 }
      );
    } catch (error) {
      console.error(`Error toggling completion for task "${title}":`, error);
      throw new Error(`Failed to toggle completion status for task "${title}": ${error.message}`);
    }
  }

  /**
   * Check if a task is marked as completed
   * @param {string} title - The task title
   * @returns {Promise<boolean>} - Whether the task is completed
   */
  async isTaskCompleted(title) {
    try {
      // Wait for the task to be visible
      await this.page.waitForSelector(this.taskTitle(title), { 
        state: 'visible',
        timeout: 5000 
      });
      
      // Get the class attribute and check for task-completed
      const classAttribute = await this.page.$eval(
        this.taskTitle(title), 
        element => element.className
      );
      return classAttribute.includes('task-completed');
    } catch (error) {
      console.error(`Error checking if task "${title}" is completed:`, error);
      throw new Error(`Failed to check completion status for task "${title}": ${error.message}`);
    }
  }

  /**
   * Delete a task
   * @param {string} title - The task title
   */
  async deleteTask(title) {
    try {
      // Make sure the task and delete button are visible
      await this.page.waitForSelector(this.taskDeleteButton(title), { 
        state: 'visible',
        timeout: 5000 
      });
      
      // Click the delete button
      await this.page.click(this.taskDeleteButton(title));
      
      // Wait for the task to be removed from the DOM
      await this.page.waitForSelector(this.taskItem(title), { 
        state: 'detached',
        timeout: 5000
      });
      
      // Give a little time for any animations to complete
      await this.page.waitForTimeout(500);
    } catch (error) {
      console.error(`Error deleting task "${title}":`, error);
      throw new Error(`Failed to delete task "${title}": ${error.message}`);
    }
  }

  /**
   * Edit a task
   * @param {string} oldTitle - The original task title
   * @param {string} newTitle - The new task title
   */
  async editTask(oldTitle, newTitle) {
    try {
      // Make sure the task and edit button are visible
      await this.page.waitForSelector(this.taskEditButton(oldTitle), { 
        state: 'visible',
        timeout: 5000 
      });
      
      // Click the edit button
      await this.page.click(this.taskEditButton(oldTitle));
      
      // Wait for the edit form to appear
      await this.page.waitForSelector('form input.edit-input', { 
        state: 'visible',
        timeout: 5000 
      });
      
      // Clear the input and type the new title
      await this.page.fill('form input.edit-input', '');
      await this.page.fill('form input.edit-input', newTitle);
      
      // Click save button
      await this.page.click('button:text-is("Save")');
      
      // Wait for the task with the new title to appear
      await this.page.waitForSelector(this.taskTitle(newTitle), { 
        state: 'visible',
        timeout: 5000 
      });
      
      // Wait a moment for any UI updates to complete
      await this.page.waitForTimeout(500);
    } catch (error) {
      console.error(`Error editing task from "${oldTitle}" to "${newTitle}":`, error);
      throw new Error(`Failed to edit task from "${oldTitle}" to "${newTitle}": ${error.message}`);
    }
  }
}

test.describe('Task Manager UI Tests', () => {
  let taskPage;

  test.beforeEach(async ({ page }) => {
    taskPage = new TaskPage(page);
    await taskPage.goto();
    
    // Clear any existing tasks to ensure a clean state
    if (await page.isVisible(`${taskPage.taskList} li`)) {
      // Setup dialog handler before clicking the button
      page.on('dialog', async dialog => {
        console.log('Dialog appeared:', dialog.message());
        await dialog.accept();
      });
      
      await page.click(taskPage.removeAllButton);
      await page.waitForSelector(`${taskPage.taskList} li`, { 
        state: 'detached',
        timeout: 10000 
      });
    }
  });

  test('creates, completes, and deletes a task', async ({ page }) => {
    // 1. Add a new task
    const taskTitle = 'Test Task ' + Date.now();
    await test.step('Add a new task', async () => {
      await taskPage.addTask(taskTitle);
      
      // Verify the task was added
      expect(await taskPage.taskExists(taskTitle)).toBeTruthy();
    });
    
    // 2. Mark task as completed
    await test.step('Mark task as completed', async () => {
      await taskPage.toggleTaskCompletion(taskTitle);
      
      // Verify the task is marked as completed
      expect(await taskPage.isTaskCompleted(taskTitle)).toBeTruthy();
    });
    
    // 3. Mark task as incomplete
    await test.step('Mark task as incomplete', async () => {
      await taskPage.toggleTaskCompletion(taskTitle);
      
      // Verify the task is marked as incomplete
      expect(await taskPage.isTaskCompleted(taskTitle)).toBeFalsy();
    });
    
    // 4. Delete the task
    await test.step('Delete the task', async () => {
      await taskPage.deleteTask(taskTitle);
      
      // Verify the task was deleted
      expect(await taskPage.taskExists(taskTitle)).toBeFalsy();
    });
  });

  test('edits an existing task', async ({ page }) => {
    // 1. Add a new task
    const originalTitle = 'Task to Edit ' + Date.now();
    const newTitle = 'Edited Task ' + Date.now();
    
    await test.step('Add a new task', async () => {
      await taskPage.addTask(originalTitle);
      expect(await taskPage.taskExists(originalTitle)).toBeTruthy();
    });
    
    // 2. Edit the task
    await test.step('Edit the task', async () => {
      await taskPage.editTask(originalTitle, newTitle);
      
      // Verify the edited task exists
      expect(await taskPage.taskExists(newTitle)).toBeTruthy();
      
      // Verify the original task no longer exists
      expect(await taskPage.taskExists(originalTitle)).toBeFalsy();
    });
    
    // 3. Clean up
    await test.step('Delete the edited task', async () => {
      await taskPage.deleteTask(newTitle);
      expect(await taskPage.taskExists(newTitle)).toBeFalsy();
    });
  });
});

