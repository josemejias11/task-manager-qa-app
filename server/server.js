const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // UUID support
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(__dirname + '/../public'));
app.use(cors()); // Enable CORS for all routes

// Constants
const DB_FILE = path.join(__dirname, '../db.json');
const DEFAULT_DB = { tasks: [] };
const PORT = process.env.PORT || 3000;

// Error handling middleware
const errorHandler = (err, req, res, _next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
};

// Database utility functions
const readDatabase = () => {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (err) {
    console.error('Failed to read or parse db.json:', err);
    return DEFAULT_DB;
  }
};

const writeDatabase = data => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error('Failed to write db.json:', err);
    throw new Error('Failed to write to database');
  }
};

// Task validation utilities
const validateTaskTitle = title => {
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return { valid: false, error: 'Title is required and must be a non-empty string' };
  }
  if (title.trim().length > 20) {
    return { valid: false, error: 'Task title must be 20 characters or less' };
  }
  return { valid: true };
};

const validateTaskUpdate = (title, completed) => {
  // At least one field must be provided
  if (completed === undefined && title === undefined) {
    return { valid: false, error: 'At least one of completed or title must be provided' };
  }

  // Validate completed if provided
  if (completed !== undefined && typeof completed !== 'boolean') {
    return { valid: false, error: 'Completed status must be a boolean value' };
  }

  // Validate title if provided
  if (title !== undefined) {
    const titleValidation = validateTaskTitle(title);
    if (!titleValidation.valid) {
      return titleValidation;
    }
  }

  return { valid: true };
};

// Routes
app.delete('/api/tasks', (req, res) => {
  try {
    writeDatabase(DEFAULT_DB);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/tasks', (req, res) => {
  try {
    if (req.headers['x-force-error'] === 'true') {
      console.warn('Forced error triggered by x-force-error header');
      return res.status(500).json({ error: 'Internal server error (forced)' });
    }
    const data = readDatabase();
    res.json(data.tasks || []);
  } catch (err) {
    console.error('Error in GET /api/tasks:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/tasks', (req, res) => {
  try {
    const { title } = req.body;

    if (req.headers['x-force-error'] === 'true') {
      return res.status(500).json({ error: 'Internal server error (forced)' });
    }

    // Validate task title
    const validation = validateTaskTitle(title);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Read database, add task, write database
    const data = readDatabase();
    const newTask = { id: uuidv4(), title: title.trim(), completed: false };
    data.tasks.push(newTask);
    writeDatabase(data);

    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  try {
    const data = readDatabase();
    const originalLength = data.tasks.length;
    data.tasks = data.tasks.filter(task => task.id !== req.params.id);

    if (data.tasks.length === originalLength) {
      return res.status(404).json({ error: 'Task not found' });
    }

    writeDatabase(data);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.patch('/api/tasks/:id', (req, res) => {
  try {
    // Extract fields from request body
    const { title } = req.body;
    const completed = req.body.completed;

    // For debug purposes - maintaining the same logging
    console.log('PATCH request body:', req.body);
    console.log('Extracted title:', title, 'type:', typeof title);
    console.log('Extracted completed:', completed, 'type:', typeof completed);

    // Validate update fields
    const validation = validateTaskUpdate(title, completed);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Get task from database
    const data = readDatabase();
    const taskIndex = data.tasks.findIndex(task => task.id === req.params.id);

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Update the task
    if (completed !== undefined) {
      data.tasks[taskIndex].completed = completed;
    }

    if (title !== undefined) {
      data.tasks[taskIndex].title = title.trim();
    }

    // Save changes
    writeDatabase(data);
    res.json(data.tasks[taskIndex]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware (must be after all routes)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('DB_FILE path:', DB_FILE);
});
