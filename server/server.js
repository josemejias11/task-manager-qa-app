const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // UUID support
const app = express();

app.use(express.json());
app.use(express.static(__dirname + '/../'));

const DB_FILE = path.join(__dirname, '../db.json');

app.delete('/api/tasks', (req, res) => {
  const data = { tasks: [] };
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to write db.json', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
  res.status(204).end();
});

app.get('/api/tasks', (req, res) => {
  let data = { tasks: [] };
  try {
    if (req.headers['x-force-error'] === 'true') {
      throw new Error('Forced error for testing');
    }
    data = JSON.parse(fs.readFileSync(DB_FILE));
  } catch (err) {
    console.error('Failed to read or parse db.json', err);
  }
  res.json(data.tasks || []);
});

app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  if (req.headers['x-force-error'] === 'true') {
    return res.status(500).json({ error: 'Internal server error (forced)' });
  }
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
  }

  let data = { tasks: [] };
  try {
    data = JSON.parse(fs.readFileSync(DB_FILE));
  } catch (err) {
    console.error('Failed to read db.json', err);
  }
  const newTask = { id: uuidv4(), title: title.trim() };
  data.tasks.push(newTask);
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to write db.json', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
  res.status(201).json(newTask);
});

app.delete('/api/tasks/:id', (req, res) => {
  let data = { tasks: [] };
  try {
    data = JSON.parse(fs.readFileSync(DB_FILE));
  } catch (err) {
    console.error('Failed to read db.json', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
  const originalLength = data.tasks.length;
  data.tasks = data.tasks.filter(task => task.id !== req.params.id);

  if (data.tasks.length === originalLength) {
    return res.status(404).json({ error: 'Task not found' });
  }

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to write db.json', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
  res.status(204).end();
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));