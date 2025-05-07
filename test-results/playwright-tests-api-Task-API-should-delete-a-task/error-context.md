# Test info

- Name: Task API >> should delete a task
- Location: /Users/josemejias/WebstormProjects/task-manager-qa-app/playwright/tests/api.spec.js:29:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 204
    at /Users/josemejias/WebstormProjects/task-manager-qa-app/playwright/tests/api.spec.js:36:26
```

# Test source

```ts
   1 | const { test, expect, request } = require('@playwright/test');
   2 |
   3 | test.describe('Task API', () => {
   4 |   let apiContext;
   5 |
   6 |   test.beforeAll(async ({ playwright }) => {
   7 |     apiContext = await request.newContext({
   8 |       baseURL: process.env.BASE_URL || 'http://localhost:3000'
   9 |     });
  10 |   });
  11 |
  12 |   test('should create a new task', async () => {
  13 |     const response = await apiContext.post('/api/tasks', {
  14 |       data: { title: 'New API Task' }
  15 |     });
  16 |     expect(response.status()).toBe(201);
  17 |     const body = await response.json();
  18 |     expect(body.title).toBe('New API Task');
  19 |     expect(body.id).toBeDefined();
  20 |   });
  21 |
  22 |   test('should return all tasks', async () => {
  23 |     const response = await apiContext.get('/api/tasks');
  24 |     expect(response.status()).toBe(200);
  25 |     const tasks = await response.json();
  26 |     expect(Array.isArray(tasks)).toBeTruthy();
  27 |   });
  28 |
  29 |   test('should delete a task', async () => {
  30 |     const create = await apiContext.post('/api/tasks', {
  31 |       data: { title: 'To Delete' }
  32 |     });
  33 |     const { id } = await create.json();
  34 |
  35 |     const del = await apiContext.delete(`/api/tasks/${id}`);
> 36 |     expect(del.status()).toBe(200);
     |                          ^ Error: expect(received).toBe(expected) // Object.is equality
  37 |   });
  38 |
  39 |   test('should not create a task with empty title', async () => {
  40 |     const response = await apiContext.post('/api/tasks', {
  41 |       data: { title: '' }
  42 |     });
  43 |     expect(response.status()).toBe(400); // assuming your API validates this
  44 |   });
  45 |
  46 |   test('should return 404 for deleting a non-existent task', async () => {
  47 |     const fakeId = 'nonexistent-id-123';
  48 |     const response = await apiContext.delete(`/api/tasks/${fakeId}`);
  49 |     expect(response.status()).toBe(404);
  50 |   });
  51 | });
```