const { test, expect, request } = require('@playwright/test');

test.describe.parallel('Task API', () => {
  let apiContext;

  const createTask = async (title = 'Sample Task') => {
    const response = await apiContext.post('/api/tasks', {
      data: { title }
    });
    expect(response.status()).toBe(201);
    return response.json();
  };

  const deleteTask = async (id) => {
    await apiContext.delete(`/api/tasks/${id}`);
  };

  test.beforeAll(async () => {
    apiContext = await request.newContext({
      baseURL: process.env.BASE_URL || 'http://localhost:3000'
    });
  });

  test('should create a new task', async () => {
    await test.step('Send POST request', async () => {
      const response = await apiContext.post('/api/tasks', {
        data: { title: 'New API Task' }
      });
      expect(response.status()).toBe(201);
      const body = await response.json();
      expect.soft(body.title).toBe('New API Task');
      expect.soft(body.id).toBeDefined();
    });
  });

  test('should return all tasks', async () => {
    const response = await apiContext.get('/api/tasks');
    expect(response.status()).toBe(200);
    const tasks = await response.json();
    expect(Array.isArray(tasks)).toBeTruthy();
  });

  test('should delete a task', async () => {
    const { id } = await createTask('To Delete');
    const del = await apiContext.delete(`/api/tasks/${id}`);
    expect(del.status()).toBe(204);
  });

  test('should not create a task with empty title', async () => {
    const response = await apiContext.post('/api/tasks', {
      data: { title: '' }
    });
    expect(response.status()).toBe(400);
  });

  test('should return 404 for deleting a non-existent task', async () => {
    const fakeId = 'nonexistent-id-123';
    const response = await apiContext.delete(`/api/tasks/${fakeId}`);
    expect(response.status()).toBe(404);
  });

  test('should return a UUID as task id', async () => {
    const task = await createTask('Check UUID');
    expect(task.id).toMatch(/^[\da-f]{8}(-[\da-f]{4}){3}-[\da-f]{12}$/i);
  });

  test('should not create task with whitespace-only title', async () => {
    const response = await apiContext.post('/api/tasks', {
      data: { title: '   ' }
    });
    expect(response.status()).toBe(400);
  });

  test('should handle internal server error gracefully', async () => {
    const customContext = await request.newContext({
      baseURL: process.env.BASE_URL || 'http://localhost:3000',
      extraHTTPHeaders: { 'x-force-error': 'true' }
    });

    const response = await customContext.post('/api/tasks', {
      data: { title: 'Trigger Error' }
    });

    expect(response.status()).toBe(500);
  });

  test('should update only the title of a task', async () => {
    const createdTask = await createTask('Title Update Task');

    const updateResponse = await apiContext.patch(`/api/tasks/${createdTask.id}`, {
      data: { title: 'Updated Title Only' }
    });

    expect(updateResponse.status()).toBe(200);
    const updatedTask = await updateResponse.json();

    expect(updatedTask.title).toBe('Updated Title Only');
    expect(updatedTask.completed).toBe(createdTask.completed);
    expect(updatedTask.id).toBe(createdTask.id);
  });

  test('should update only the completed status of a task', async () => {
    const createdTask = await createTask('Status Update Task');
    expect(createdTask.completed).toBe(false);

    const updateResponse = await apiContext.patch(`/api/tasks/${createdTask.id}`, {
      data: { completed: true }
    });

    expect(updateResponse.status()).toBe(200);
    const updatedTask = await updateResponse.json();

    expect(updatedTask.completed).toBe(true);
    expect(updatedTask.title).toBe(createdTask.title);
    expect(updatedTask.id).toBe(createdTask.id);
  });

  test('should update both title and completed status together', async () => {
    const createdTask = await createTask('Full Update Task');

    const updateResponse = await apiContext.patch(`/api/tasks/${createdTask.id}`, {
      data: { title: 'Fully Updated Task', completed: true }
    });

    expect(updateResponse.status()).toBe(200);
    const updatedTask = await updateResponse.json();

    expect(updatedTask.title).toBe('Fully Updated Task');
    expect(updatedTask.completed).toBe(true);
    expect(updatedTask.id).toBe(createdTask.id);
  });

  test('should reject PATCH request with invalid title', async () => {
    const createdTask = await createTask('Valid Title Task');

    const emptyTitleResponse = await apiContext.patch(`/api/tasks/${createdTask.id}`, {
      data: { title: '' }
    });
    expect(emptyTitleResponse.status()).toBe(400);

    const longTitleResponse = await apiContext.patch(`/api/tasks/${createdTask.id}`, {
      data: { title: 'This title is way too long' }
    });
    expect(longTitleResponse.status()).toBe(400);
  });

  test('should reject PATCH request with invalid completed status', async () => {
    const createdTask = await createTask('Invalid Status Task');

    const response = await apiContext.patch(`/api/tasks/${createdTask.id}`, {
      data: { completed: 'not-a-boolean' }
    });
    expect(response.status()).toBe(400);
  });

  test('should return 404 for updating non-existent task', async () => {
    const fakeId = 'nonexistent-id-123';
    const response = await apiContext.patch(`/api/tasks/${fakeId}`, {
      data: { title: 'Won\'t Update' }
    });
    expect(response.status()).toBe(404);
  });

  test('should reject PATCH request with no update fields', async () => {
    const createdTask = await createTask('Empty Update Task');

    const response = await apiContext.patch(`/api/tasks/${createdTask.id}`, {
      data: {}
    });
    expect(response.status()).toBe(400);
  });
});
