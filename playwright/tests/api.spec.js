const { test, expect, request } = require('@playwright/test');

test.describe('Task API', () => {
  let apiContext;

  test.beforeAll(async () => {
    apiContext = await request.newContext({
      baseURL: process.env.BASE_URL || 'http://localhost:3000'
    });
  });

  test('create a new task', async () => {
    const response = await apiContext.post('/api/tasks', {
      data: { title: 'New API Task' }
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.title).toBe('New API Task');
    expect(body.id).toBeDefined();
  });

  test('return all tasks', async () => {
    const response = await apiContext.get('/api/tasks');
    expect(response.status()).toBe(200);
    const tasks = await response.json();
    expect(Array.isArray(tasks)).toBeTruthy();
  });

  test('delete a task', async () => {
    const create = await apiContext.post('/api/tasks', {
      data: { title: 'To Delete' }
    });
    const { id } = await create.json();

    const del = await apiContext.delete(`/api/tasks/${id}`);
    expect(del.status()).toBe(204);
  });

  test('not create a task with empty title', async () => {
    const response = await apiContext.post('/api/tasks', {
      data: { title: '' }
    });
    expect(response.status()).toBe(400); // assuming your API validates this
  });

  test('return 404 for deleting a non-existent task', async () => {
    const fakeId = 'nonexistent-id-123';
    const response = await apiContext.delete(`/api/tasks/${fakeId}`);
    expect(response.status()).toBe(404);
  });
  test('return a UUID as task id', async () => {
    const response = await apiContext.post('/api/tasks', {
      data: { title: 'Check UUID' }
    });
    const body = await response.json();
    expect(body.id).toMatch(/^[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12}$/i);
  });

  test('not create task with whitespace-only title', async () => {
    const response = await apiContext.post('/api/tasks', {
      data: { title: '   ' }
    });
    expect(response.status()).toBe(400);
  });
  test('handle internal server error gracefully', async () => {
    // Temporarily override the request context to simulate a 500 response
    const customContext = await request.newContext({
      baseURL: process.env.BASE_URL || 'http://localhost:3000',
      extraHTTPHeaders: {
        'x-force-error': 'true' // Assuming backend respects this for testing
      }
    });

    const response = await customContext.post('/api/tasks', {
      data: { title: 'Trigger Error' }
    });

    expect(response.status()).toBe(500);
  });

  test('update only the title of a task', async () => {
    // Create a task to update - keeping title under 20 chars
    const createResponse = await apiContext.post('/api/tasks', {
      data: { title: 'Title Update Task' }
    });
    expect(createResponse.status()).toBe(201);
    const createdTask = await createResponse.json();

    // Update only the title
    const updateResponse = await apiContext.patch(`/api/tasks/${createdTask.id}`, {
      data: { title: 'Updated Title Only' }
    });
    expect(updateResponse.status()).toBe(200);
    const updatedTask = await updateResponse.json();

    // Verify the update
    expect(updatedTask.title).toBe('Updated Title Only');
    expect(updatedTask.completed).toBe(createdTask.completed); // Completed status should remain unchanged
    expect(updatedTask.id).toBe(createdTask.id); // ID should remain unchanged
  });

  test('update only the completed status of a task', async () => {
    // Create a task to update (initially completed = false)
    const createResponse = await apiContext.post('/api/tasks', {
      data: { title: 'Status Update Task' }
    });
    expect(createResponse.status()).toBe(201);
    const createdTask = await createResponse.json();
    expect(createdTask.completed).toBe(false); // Default is false

    // Update only the completed status to true
    const updateResponse = await apiContext.patch(`/api/tasks/${createdTask.id}`, {
      data: { completed: true }
    });
    expect(updateResponse.status()).toBe(200);
    const updatedTask = await updateResponse.json();

    // Verify the update
    expect(updatedTask.completed).toBe(true); // Completed status should be updated
    expect(updatedTask.title).toBe(createdTask.title); // Title should remain unchanged
    expect(updatedTask.id).toBe(createdTask.id); // ID should remain unchanged
  });

  test('update both title and completed status together', async () => {
    // Create a task to update
    const createResponse = await apiContext.post('/api/tasks', {
      data: { title: 'Full Update Task' }
    });
    expect(createResponse.status()).toBe(201);
    const createdTask = await createResponse.json();

    // Update both title and completed status
    const updateResponse = await apiContext.patch(`/api/tasks/${createdTask.id}`, {
      data: {
        title: 'Fully Updated Task',
        completed: true
      }
    });
    expect(updateResponse.status()).toBe(200);
    const updatedTask = await updateResponse.json();

    // Verify both fields were updated
    expect(updatedTask.title).toBe('Fully Updated Task');
    expect(updatedTask.completed).toBe(true);
    expect(updatedTask.id).toBe(createdTask.id); // ID should remain unchanged
  });

  test('reject PATCH request with invalid title', async () => {
    // Create a task to update
    const createResponse = await apiContext.post('/api/tasks', {
      data: { title: 'Valid Title Task' }
    });
    expect(createResponse.status()).toBe(201);
    const createdTask = await createResponse.json();

    // Test with empty title
    const emptyTitleResponse = await apiContext.patch(`/api/tasks/${createdTask.id}`, {
      data: { title: '' }
    });
    expect(emptyTitleResponse.status()).toBe(400);

    // Test with too long title (more than 20 characters)
    const longTitleResponse = await apiContext.patch(`/api/tasks/${createdTask.id}`, {
      data: { title: 'This title is way too long' }
    });
    expect(longTitleResponse.status()).toBe(400);
  });

  test('reject PATCH request with invalid completed status', async () => {
    // Create a task to update
    const createResponse = await apiContext.post('/api/tasks', {
      data: { title: 'Invalid Status Task' }
    });
    expect(createResponse.status()).toBe(201);
    const createdTask = await createResponse.json();

    // Test with non-boolean completed value
    const invalidStatusResponse = await apiContext.patch(`/api/tasks/${createdTask.id}`, {
      data: { completed: 'not-a-boolean' }
    });
    expect(invalidStatusResponse.status()).toBe(400);
  });

  test('return 404 for updating non-existent task', async () => {
    const fakeId = 'nonexistent-id-123';
    const response = await apiContext.patch(`/api/tasks/${fakeId}`, {
      data: { title: 'Won\'t Update' }
    });
    expect(response.status()).toBe(404);
  });

  test('reject PATCH request with no update fields', async () => {
    // Create a task to update
    const createResponse = await apiContext.post('/api/tasks', {
      data: { title: 'Empty Update Task' }
    });
    expect(createResponse.status()).toBe(201);
    const createdTask = await createResponse.json();
    
    // Send PATCH with empty object (no fields to update)
    const emptyUpdateResponse = await apiContext.patch(`/api/tasks/${createdTask.id}`, {
      data: {}
    });
    expect(emptyUpdateResponse.status()).toBe(400);
  });
});
