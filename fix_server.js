// This script finds and fixes issues in the server's PATCH endpoint

const fs = require('fs');
const path = require('path');
const serverFile = path.join(__dirname, 'server', 'server.js');

try {
  // Read the server file
  let serverCode = fs.readFileSync(serverFile, 'utf8');
  
  // Log the original PATCH endpoint code for comparison
  const patchEndpointMatch = serverCode.match(/app\.patch\('\/api\/tasks\/:id'[\s\S]*?res\.json\(data\.tasks\[taskIndex\]\)/);
  if (patchEndpointMatch) {
    console.log('Original PATCH endpoint:');
    console.log('----------------------------------------');
    console.log(patchEndpointMatch[0]);
    console.log('----------------------------------------');
  } else {
    console.log('Could not find PATCH endpoint in server.js');
  }
  
  // Test the logic for updating task title
  console.log('\nTesting task update logic:');
  const mockReq = {
    params: { id: '464437ef-bb4b-48ac-8161-7c9bee6ad6eb' },
    body: { title: 'Test Title from Fix Script' }
  };
  
  // Read current db.json
  const dbFile = path.join(__dirname, 'db.json');
  const data = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
  
  // Find the task
  const taskIndex = data.tasks.findIndex(task => task.id === mockReq.params.id);
  
  if (taskIndex === -1) {
    console.log('Task not found');
  } else {
    console.log('Task found, current title:', data.tasks[taskIndex].title);
    
    // Test the update logic
    const { title } = mockReq.body;
    if (title !== undefined) {
      console.log('Updating title to:', title);
      data.tasks[taskIndex].title = title.trim();
      
      // Write the update
      fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
      console.log('db.json updated, new title:', data.tasks[taskIndex].title);
    }
  }
  
} catch (err) {
  console.error('Error:', err);
}
