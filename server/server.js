app.delete('/api/tasks', (req, res) => {
  const data = { tasks: [] };
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  res.status(204).end();
});
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname + '/../'));

const DB_FILE = path.join(__dirname, '../db.json');

app.get('/api/tasks', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_FILE));
  res.json(data.tasks || []);
});

app.post('/api/tasks', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_FILE));
  const newTask = { id: Date.now(), title: req.body.title };
  data.tasks.push(newTask);
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  res.status(201).json(newTask);
});

app.delete('/api/tasks/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_FILE));
  data.tasks = data.tasks.filter(task => task.id !== parseInt(req.params.id));
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  res.status(204).end();
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));