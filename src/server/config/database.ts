import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../data/tasks.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize SQLite database
export const db: Database.Database = new Database(DB_PATH, { verbose: console.log });

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tasks table
const createTasksTable = `
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL CHECK(length(title) <= 20 AND length(title) > 0),
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`;

db.exec(createTasksTable);

// Create indexes for faster queries
db.exec('CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed)');
db.exec('CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at)');

console.log('✓ SQLite database initialized at:', DB_PATH);

// Graceful shutdown
process.on('SIGINT', () => {
  db.close();
  console.log('SQLite database connection closed');
  process.exit(0);
});

export default db;
