const { test, expect, request } = require('@playwright/test');

test.describe('Task API', () => {
  let apiContext;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await request.newContext({
      baseURL: process.env.BASE_URL || 'http://localhost:3000'
    });
  });

  test('should create a new task', async () => {
    const response = await apiContext.post('/api/tasks', {
      data: { title: 'New API Task' }
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.title).toBe('New API Task');
    expect(body.id).toBeDefined();
  });

  test('should return all tasks', async () => {
    const response = await apiContext.get('/api/tasks');
    expect(response.status()).toBe(200);
    const tasks = await response.json();
    expect(Array.isArray(tasks)).toBeTruthy();
  });

  test('should delete a task', async () => {
    const create = await apiContext.post('/api/tasks', {
      data: { title: 'To Delete' }
    });
    const { id } = await create.json();

    const del = await apiContext.delete(`/api/tasks/${id}`);
    expect(del.status()).toBe(204);
  });

  test('should not create a task with empty title', async () => {
    const response = await apiContext.post('/api/tasks', {
      data: { title: '' }
    });
    expect(response.status()).toBe(400); // assuming your API validates this
  });

  test('should return 404 for deleting a non-existent task', async () => {
    const fakeId = 'nonexistent-id-123';
    const response = await apiContext.delete(`/api/tasks/${fakeId}`);
    expect(response.status()).toBe(404);
  });
  test('should return a UUID as task id', async () => {
    const response = await apiContext.post('/api/tasks', {
      data: { title: 'Check UUID' }
    });
    const body = await response.json();
    expect(body.id).toMatch(/^[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12}$/i);
  });

  test('should not create task with whitespace-only title', async () => {
    const response = await apiContext.post('/api/tasks', {
      data: { title: '   ' }
    });
    expect(response.status()).toBe(400);
  });
});