// Create a debug version of the server with additional logging

const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const DB_FILE = path.join(__dirname, 'db.json');
const PORT = 3001; // Use a different port to avoid conflicts

// Middleware to log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.method === 'PATCH' || req.method === 'POST') {
    console.log('Request body:', JSON.stringify(req.body));
  }
  next();
});

// GET all tasks
app.get('/api/tasks', (req, res) => {
  console.log('Reading db.json for GET /api/tasks');
  let data = { tasks: [] };
  try {
    data = JSON.parse(fs.readFileSync(DB_FILE));
    console.log('Tasks found:', data.tasks.length);
  } catch (err) {
    console.error('Failed to read or parse db.json', err);
  }
  res.json(data.tasks);
});

// PATCH a task
app.patch('/api/tasks/:id', (req, res) => {
  const { completed, title } = req.body;
  
  console.log(`PATCH /api/tasks/${req.params.id} - Request body:`, req.body);
  
  // At least one of completed or title must be provided
  if (completed === undefined && title === undefined) {
    console.log('Error: neither completed nor title provided');
    return res.status(400).json({ error: 'At least one of completed or title must be provided' });
  }
  
  // Validate completed if provided
  if (completed !== undefined && typeof completed !== 'boolean') {
    console.log('Error: completed is not a boolean', completed);
    return res.status(400).json({ error: 'Completed status must be a boolean value' });
  }
  
  // Validate title if provided
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      console.log('Error: title is not a valid string', title);
      return res.status(400).json({ error: 'Title must be a non-empty string' });
    }
    if (title.trim().length > 20) {
      console.log('Error: title is too long', title.length);
      return res.status(400).json({ error: 'Task title must be 20 characters or less' });
    }
  }

  console.log('Reading db.json for PATCH');
  let data = { tasks: [] };
  try {
    const fileContent = fs.readFileSync(DB_FILE, 'utf8');
    console.log('db.json content:', fileContent);
    data = JSON.parse(fileContent);
  } catch (err) {
    console.error('Failed to read db.json', err);
    return res.status(500).json({ error: 'Internal server error' });
  }

  const taskIndex = data.tasks.findIndex(task => task.id === req.params.id);
  if (taskIndex === -1) {
    console.log('Task not found:', req.params.id);
    return res.status(404).json({ error: 'Task not found' });
  }
  
  console.log('Task found:', data.tasks[taskIndex]);

  // Update the completed status if provided
  if (completed !== undefined) {
    console.log(`Updating completed from ${data.tasks[taskIndex].completed} to ${completed}`);
    data.tasks[taskIndex].completed = completed;
  }
  
  // Update the title if provided
  if (title !== undefined) {
    console.log(`Updating title from "${data.tasks[taskIndex].title}" to "${title.trim()}"`);
    data.tasks[taskIndex].title = title.trim();
  }

  console.log('Updated task:', data.tasks[taskIndex]);

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    console.log('Successfully wrote updated data to db.json');
  } catch (err) {
    console.error('Failed to write db.json', err);
    return res.status(500).json({ error: 'Internal server error' });
  }

  console.log('Sending response:', data.tasks[taskIndex]);
  res.json(data.tasks[taskIndex]);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Debug server listening on port ${PORT}`);
  console.log(`DB_FILE path: ${DB_FILE}`);
  
  // Log current db.json content
  try {
    const data = JSON.parse(fs.readFileSync(DB_FILE));
    console.log('Current tasks in db.json:', data.tasks);
  } catch (err) {
    console.error('Failed to read initial db.json', err);
  }
});
