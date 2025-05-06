const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const db = require('./db.json');
app.use(bodyParser.json());
app.use(express.static(__dirname));
let tasks = db.tasks || [];

app.get('/api/tasks', (req, res) => res.json(tasks));
app.post('/api/tasks', (req, res) => {
  const task = { id: Date.now(), ...req.body };
  tasks.push(task);
  fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify({ tasks }, null, 2));
  res.status(201).json(task);
});
app.delete('/api/tasks/:id', (req, res) => {
  tasks = tasks.filter(t => t.id !== parseInt(req.params.id));
  fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify({ tasks }, null, 2));
  res.status(204).end();
});
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
