const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const db = require('./db.json');
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));
let tasks = db.tasks || [];

app.get('/api/tasks', (req, res) => res.json(tasks));
app.post('/api/tasks', (req, res) => {
  const task = { id: Date.now(), ...req.body };
  tasks.push(task);
  res.status(201).json(task);
});
app.delete('/api/tasks/:id', (req, res) => {
  tasks = tasks.filter(t => t.id !== parseInt(req.params.id));
  res.status(204).end();
});
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
