const fs = require('fs');
const path = require('path');

// Get the task ID and new title from command line arguments
const taskId = process.argv[2];
const newTitle = process.argv[3];

if (!taskId || !newTitle) {
  console.error('Usage: node update_task.js <taskId> <newTitle>');
  process.exit(1);
}

// Path to db.json
const dbPath = path.join(__dirname, 'db.json');

try {
  // Read the current database
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  
  // Find the task by ID
  const taskIndex = data.tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex === -1) {
    console.error(`Task with ID ${taskId} not found.`);
    process.exit(1);
  }
  
  // Update the task title
  const oldTitle = data.tasks[taskIndex].title;
  data.tasks[taskIndex].title = newTitle;
  
  // Write the updated data back to the file
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  
  console.log(`Task updated successfully!`);
  console.log(`- Task ID: ${taskId}`);
  console.log(`- Old title: "${oldTitle}"`);
  console.log(`- New title: "${newTitle}"`);
  
} catch (error) {
  console.error('Error updating task:', error.message);
  process.exit(1);
}
