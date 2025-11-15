/**
 * Task Manager Application
 *
 * A simple task management application with CRUD operations.
 * Uses the Fetch API to communicate with the backend.
 */

// Constants and DOM element references
const API_BASE = window.location.origin;
const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const removeAllBtn = document.getElementById('remove-all-btn');
const clearCompletedBtn = document.getElementById('clear-completed-btn');
const formWarning = document.getElementById('form-warning');
const formWarningText = document.getElementById('form-warning-text');
const emptyState = document.getElementById('empty-state');
const activeCount = document.getElementById('active-count');
const completedCount = document.getElementById('completed-count');
const progressBar = document.getElementById('progress-bar');
const toastContainer = document.getElementById('toast-container');

// ----- Utility Functions -----

/**
 * Validate a task title according to business rules
 * @param {string} title - The task title to validate
 * @returns {Object} - Validation result with isValid and errorMessage properties
 *
 * Note: This validation logic is intentionally duplicated in server/server.js
 * for defense-in-depth. Client-side validation provides immediate UX feedback,
 * while server-side validation ensures data integrity. In a TypeScript project,
 * consider using a shared validation schema (e.g., Zod, Yup).
 */
const validateTaskTitle = title => {
  if (!title || title.trim() === '') {
    return {
      isValid: false,
      errorMessage: 'Task title cannot be empty.',
    };
  }

  if (title.trim().length > 20) {
    return {
      isValid: false,
      errorMessage: 'Task title must be 20 characters or less.',
    };
  }

  return { isValid: true };
};

/**
 * Show a validation error message
 * @param {string} message - The error message to display
 * @param {HTMLElement} element - The element to show the message in (default: formWarning)
 */
const showValidationError = (message, element = formWarning) => {
  if (element) {
    if (formWarningText) {
      formWarningText.textContent = message;
    } else {
      element.textContent = message;
    }
    element.style.display = 'block';
  } else {
    // Fallback to alert if the element is not available
    alert(message);
  }
};

/**
 * Hide the validation error message
 * @param {HTMLElement} element - The element to hide (default: formWarning)
 */
const hideValidationError = (element = formWarning) => {
  if (element) {
    element.style.display = 'none';
  }
};

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of toast (success, error, info, warning)
 */
const showToast = (message, type = 'success') => {
  // Safety check - don't show toast if container doesn't exist
  if (!toastContainer) {
    console.warn('Toast container not found');
    return;
  }

  // Safety check for bootstrap
  if (typeof bootstrap === 'undefined' || !bootstrap.Toast) {
    console.warn('Bootstrap Toast not available');
    return;
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type} align-items-center text-white bg-${type === 'success' ? 'success' : type === 'error' ? 'danger' : type === 'warning' ? 'warning' : 'info'} border-0`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');

  const iconMap = {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ',
  };

  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        <span class="icon-toast me-2">${iconMap[type]}</span>${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  toastContainer.appendChild(toast);

  const bsToast = new bootstrap.Toast(toast, {
    autohide: true,
    delay: 3000,
  });

  bsToast.show();

  // Remove toast from DOM after it's hidden
  toast.addEventListener('hidden.bs.toast', () => {
    toast.remove();
  });
};

/**
 * Update task statistics (active count, completed count, progress bar)
 */
const updateStats = () => {
  const tasks = Array.from(list.querySelectorAll('li[data-id]'));
  const total = tasks.length;
  const completed = tasks.filter(task => {
    const checkbox = task.querySelector('.form-check-input');
    return checkbox && checkbox.checked;
  }).length;
  const active = total - completed;

  // Update counters
  if (activeCount) {
    activeCount.textContent = `${active} active`;
  }
  if (completedCount) {
    completedCount.textContent = `${completed} completed`;
  }

  // Update progress bar
  if (progressBar) {
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    progressBar.style.width = `${percentage}%`;
    progressBar.setAttribute('aria-valuenow', percentage);
  }

  // Show/hide empty state
  if (emptyState) {
    emptyState.style.display = total === 0 ? 'block' : 'none';
  }

  // Show/hide clear completed button
  if (clearCompletedBtn) {
    clearCompletedBtn.disabled = completed === 0;
  }
};

/**
 * Create and send a request to the API
 * @param {string} url - The API endpoint
 * @param {Object} options - Request options
 * @returns {Promise<any>} - The API response
 */
const apiRequest = async (url, options = {}) => {
  const fullUrl = `${API_BASE}${url}`;

  // Set default headers with proper cache control
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    ...(options.headers || {}),
  };

  const response = await fetch(fullUrl, { ...options, headers });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  // For DELETE requests, don't try to parse JSON
  if (options.method === 'DELETE') {
    return null;
  }

  return await response.json();
};

/**
 * Show a notification that fades out after a few seconds
 * @param {HTMLElement} container - The element containing the notification
 */
const showNotification = container => {
  const notification = container.querySelector('.update-notification');
  if (!notification) return;

  notification.style.display = 'inline';
  notification.classList.add('show');

  // Hide the notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.style.display = 'none';
    }, 300);
  }, 3000);
};

// ----- Task API Functions -----

/**
 * Load all tasks from the server and render them
 */
const loadTasks = async () => {
  try {
    const tasks = await apiRequest('/api/tasks');

    // Create a document fragment for better performance
    const fragment = document.createDocumentFragment();

    // Clear the list
    list.innerHTML = '';

    // Render each task
    tasks.forEach(task => {
      const taskElement = createTaskElement(task);
      fragment.appendChild(taskElement);
    });

    // Add all tasks to the DOM in one operation
    list.appendChild(fragment);

    // Update statistics
    updateStats();
  } catch (err) {
    console.error('Failed to load tasks:', err);
    showToast('Failed to load tasks. Please refresh the page.', 'error');
  }
};

/**
 * Create a task element for the DOM
 * @param {Object} task - The task object from the API
 * @returns {HTMLElement} - The task list item element
 */
const createTaskElement = ({ id, title, completed }) => {
  // Create list item
  const li = document.createElement('li');
  li.className = 'list-group-item d-flex justify-content-between align-items-center';
  li.setAttribute('data-id', id);

  // Create container for task content (checkbox and title)
  const taskContent = document.createElement('div');
  taskContent.className = 'd-flex align-items-center flex-grow-1';

  // Create checkbox for task completion
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'form-check-input me-2';
  checkbox.checked = completed || false;
  checkbox.setAttribute('data-id', id);
  checkbox.addEventListener('change', () => toggleTaskCompletion(id, checkbox.checked));

  // Create title span
  const span = document.createElement('span');
  span.textContent = title;
  span.className = 'task-title flex-grow-1';
  if (completed) {
    span.classList.add('task-completed');
  }

  // Create notification element (hidden by default)
  const notification = document.createElement('span');
  notification.className = 'update-notification';
  notification.textContent = 'Updated!';
  notification.style.display = 'none';

  // Assemble task content
  taskContent.appendChild(checkbox);
  taskContent.appendChild(span);
  taskContent.appendChild(notification);
  li.appendChild(taskContent);

  // Create button container
  const btnContainer = document.createElement('div');
  btnContainer.className = 'btn-group-task';

  // Create edit button
  const editBtn = document.createElement('button');
  editBtn.className = 'btn btn-sm btn-secondary';
  editBtn.setAttribute('data-id', id);
  editBtn.setAttribute('aria-label', `Edit task ${title}`);
  editBtn.innerHTML = '<span class="icon-edit">✎</span> Edit';
  editBtn.addEventListener('click', () => enterEditMode(li, id, title));

  // Create delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn btn-sm btn-danger';
  deleteBtn.setAttribute('data-id', id);
  deleteBtn.setAttribute('aria-label', `Delete task ${title}`);
  deleteBtn.innerHTML = '<span class="icon-delete">✗</span> Delete';
  deleteBtn.addEventListener('click', async () => {
    try {
      await deleteTask(id);
    } catch (err) {
      console.warn('Failed to delete task', err);
    }
  });

  // Assemble button container
  btnContainer.appendChild(editBtn);
  btnContainer.appendChild(deleteBtn);
  li.appendChild(btnContainer);

  return li;
};

/**
 * Enter edit mode for a task
 * @param {HTMLElement} listItem - The task list item element
 * @param {string} id - The task ID
 * @param {string} currentTitle - The current task title
 */
const enterEditMode = (listItem, id, currentTitle) => {
  // Store the current state
  const taskContent = listItem.querySelector('div:first-child');
  const originalContent = taskContent.innerHTML;

  // Hide the button container (Edit and Delete buttons)
  const btnContainer = listItem.querySelector('.btn-group-task');
  btnContainer.style.display = 'none';

  // Function to cancel edit
  const cancelEdit = () => {
    taskContent.innerHTML = originalContent;
    // Show the button container again
    listItem.querySelector('.btn-group-task').style.display = 'flex';
  };

  // Create edit form
  const editForm = document.createElement('form');
  editForm.className = 'd-flex align-items-center flex-grow-1';
  editForm.addEventListener('submit', e => {
    e.preventDefault();
    const newTitle = editInput.value.trim();
    saveTaskEdit(id, newTitle, listItem, originalContent, btnContainer);
  });

  // Create edit input
  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.className = 'form-control edit-input';
  editInput.value = currentTitle;

  // Add keyboard shortcut for Escape key
  editInput.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  });

  // Create save button
  const saveBtn = document.createElement('button');
  saveBtn.type = 'submit';
  saveBtn.className = 'btn btn-sm btn-success me-1';
  saveBtn.innerHTML = '<span class="icon-save">✓</span> Save';

  // Create cancel button
  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'btn btn-sm btn-secondary';
  cancelBtn.innerHTML = '<span class="icon-cancel">✗</span> Cancel';
  cancelBtn.addEventListener('click', cancelEdit);

  // Add buttons to form
  editForm.appendChild(editInput);
  editForm.appendChild(saveBtn);
  editForm.appendChild(cancelBtn);

  // Replace task content with edit form
  taskContent.innerHTML = '';
  taskContent.appendChild(editForm);

  // Focus the input
  editInput.focus();
  editInput.select();
};

/**
 * Save edited task
 * @param {string} id - The task ID
 * @param {string} newTitle - The new task title
 * @param {HTMLElement} listItem - The task list item element
 * @param {string} originalContent - The original HTML content
 * @param {HTMLElement} btnContainer - The button container element
 */
const saveTaskEdit = async (id, newTitle, listItem, originalContent, btnContainer) => {
  const taskContent = listItem.querySelector('div:first-child');

  // Validate the new title
  const validation = validateTaskTitle(newTitle);
  if (!validation.isValid) {
    alert(validation.errorMessage);

    // Show the button container again on validation error
    btnContainer.style.display = 'flex';
    return;
  }

  try {
    // Get the current completed status from the checkbox
    const checkbox =
      taskContent.querySelector('input[type="checkbox"]') ||
      listItem.querySelector('.form-check-input');

    // Default to false if checkbox can't be found
    const isCompleted = checkbox ? checkbox.checked : false;

    // Create request payload with both title and completed status
    const payload = {
      title: newTitle,
      completed: isCompleted,
    };

    // Send the update to the server
    const updatedTask = await apiRequest(`/api/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });

    // Re-render the task with updated information
    const updatedElement = createTaskElement(updatedTask);
    listItem.replaceWith(updatedElement);

    // Show the "Updated!" notification
    const notification = updatedElement.querySelector('.update-notification');
    if (notification) {
      showNotification(updatedElement);
    }
  } catch (err) {
    console.error('Failed to save task edit:', err);
    alert('Failed to update task. Please try again.');

    // Restore original content on error
    taskContent.innerHTML = originalContent;
  } finally {
    // Always show the button container again
    btnContainer.style.display = 'flex';
  }
};

/**
 * Add a new task
 * @param {string} title - The task title
 * @returns {Promise<Object>} - The created task
 */
const addTask = async title => {
  // Validate the title
  const validation = validateTaskTitle(title);
  if (!validation.isValid) {
    showValidationError(validation.errorMessage);
    return null;
  }

  try {
    hideValidationError();

    const newTask = await apiRequest('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title: title.trim() }),
    });

    // Create and add the new task element
    const taskElement = createTaskElement(newTask);

    // Ensure the element was created properly
    if (!taskElement) {
      console.error('Failed to create task element for:', newTask);
      return newTask;
    }

    // Append the new task to the list
    list.appendChild(taskElement);

    // Update statistics
    updateStats();

    // Show success toast
    showToast(`Task "${title}" added successfully!`, 'success');

    return newTask;
  } catch (err) {
    console.error('Failed to add task:', err);
    showValidationError('Failed to add task. Please try again.');
    showToast('Failed to add task. Please try again.', 'error');
    return null;
  }
};

/**
 * Delete a task
 * @param {string} id - The task ID
 */
const deleteTask = async id => {
  try {
    // Find the task element
    const taskElement = document.querySelector(`li[data-id="${id}"]`);
    if (!taskElement) {
      return;
    }

    // Get task title for notification
    const taskTitle = taskElement.querySelector('.task-title').textContent;

    // Optimistically remove the task from the DOM
    taskElement.remove();

    // Update statistics
    updateStats();

    // Delete the task on the server
    await apiRequest(`/api/tasks/${id}`, {
      method: 'DELETE',
    });

    // Show success toast
    showToast(`Task "${taskTitle}" deleted successfully!`, 'success');
  } catch (err) {
    console.error('Failed to delete task:', err);
    showToast('Failed to delete task. Refreshing...', 'error');

    // If there was an error, reload all tasks to restore the correct state
    await loadTasks();
  }
};

/**
 * Delete all tasks
 */
const deleteAllTasks = async () => {
  try {
    // Confirm before deleting all tasks
    if (!confirm('Are you sure you want to delete all tasks?')) {
      return;
    }

    // Get count for notification
    const taskCount = list.querySelectorAll('li[data-id]').length;

    // Clear the list (optimistic update)
    list.innerHTML = '';

    // Update statistics
    updateStats();

    // Delete all tasks on the server
    await apiRequest('/api/tasks', {
      method: 'DELETE',
    });

    // Show success toast
    showToast(`All ${taskCount} tasks deleted successfully!`, 'success');
  } catch (err) {
    console.error('Failed to delete all tasks:', err);
    showToast('Failed to delete all tasks. Refreshing...', 'error');

    // If there was an error, reload all tasks to restore the correct state
    await loadTasks();
  }
};

/**
 * Toggle task completion status
 * @param {string} id - The task ID
 * @param {boolean} completed - The new completion status
 */
const toggleTaskCompletion = async (id, completed) => {
  try {
    // Find the task element
    const taskElement = document.querySelector(`li[data-id="${id}"]`);
    if (!taskElement) {
      return;
    }

    // Optimistically update the UI
    const titleSpan = taskElement.querySelector('.task-title');
    if (completed) {
      titleSpan.classList.add('task-completed');
    } else {
      titleSpan.classList.remove('task-completed');
    }

    // Update statistics
    updateStats();

    // Update the task on the server
    await apiRequest(`/api/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
    });
  } catch (err) {
    console.error('Failed to update task completion status:', err);
    showToast('Failed to update task. Refreshing...', 'error');

    // If there was an error, reload all tasks to restore the correct state
    await loadTasks();
  }
};

/**
 * Clear all completed tasks
 */
const clearCompletedTasks = async () => {
  try {
    // Get all completed tasks
    const completedTasks = Array.from(list.querySelectorAll('li[data-id]')).filter(
      task => {
        const checkbox = task.querySelector('.form-check-input');
        return checkbox && checkbox.checked;
      }
    );

    if (completedTasks.length === 0) {
      showToast('No completed tasks to clear!', 'info');
      return;
    }

    // Confirm before deleting
    if (!confirm(`Are you sure you want to delete ${completedTasks.length} completed tasks?`)) {
      return;
    }

    // Delete each completed task
    const deletePromises = completedTasks.map(async task => {
      const id = task.getAttribute('data-id');
      task.remove();
      await apiRequest(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
    });

    await Promise.all(deletePromises);

    // Update statistics
    updateStats();

    // Show success toast
    showToast(`${completedTasks.length} completed tasks cleared!`, 'success');
  } catch (err) {
    console.error('Failed to clear completed tasks:', err);
    showToast('Failed to clear completed tasks. Refreshing...', 'error');

    // If there was an error, reload all tasks to restore the correct state
    await loadTasks();
  }
};

// ----- Event Listeners -----

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Load tasks from the server
  loadTasks();

  // Clear validation error when input changes
  input.addEventListener('input', () => {
    hideValidationError();
  });
});

// Handle form submission (adding a new task)
form.addEventListener('submit', async e => {
  e.preventDefault();
  const title = input.value.trim();

  // Clear the input field immediately to enable adding multiple tasks in succession
  const originalValue = input.value;
  input.value = '';

  const task = await addTask(title);

  // Only restore the input value if task creation failed
  if (!task) {
    input.value = originalValue;
  }
});

// Handle Remove All button click
removeAllBtn.addEventListener('click', deleteAllTasks);

// Handle Clear Completed button click
clearCompletedBtn.addEventListener('click', clearCompletedTasks);
