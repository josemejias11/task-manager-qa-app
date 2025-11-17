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

// Create tasks table with enhanced fields
const createTasksTable = `
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL CHECK(length(title) <= 100 AND length(title) > 0),
    description TEXT,
    completed INTEGER NOT NULL DEFAULT 0,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high', 'urgent')),
    category TEXT NOT NULL DEFAULT 'personal' CHECK(category IN ('work', 'personal', 'shopping', 'health', 'other')),
    due_date TEXT,
    tags TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`;

db.exec(createTasksTable);

// Check if we need to migrate existing table
const tableInfo = db.pragma('table_info(tasks)') as Array<{ name: string }>;
const columns = tableInfo.map(col => col.name);

// Add missing columns if table exists but doesn't have new fields
if (columns.length > 0 && !columns.includes('priority')) {
  console.log('Migrating database schema...');

  // Create backup of existing data
  db.exec('CREATE TABLE IF NOT EXISTS tasks_backup AS SELECT * FROM tasks');

  // Drop old table
  db.exec('DROP TABLE IF EXISTS tasks');

  // Recreate with new schema
  db.exec(createTasksTable);

  // Migrate data (only id, title, completed, created_at, updated_at)
  db.exec(`
    INSERT INTO tasks (id, title, completed, created_at, updated_at)
    SELECT id, title, completed, created_at, updated_at FROM tasks_backup
  `);

  // Drop backup
  db.exec('DROP TABLE tasks_backup');

  console.log('✓ Database schema migrated successfully');
}

// Create indexes for faster queries
db.exec('CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed)');
db.exec('CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at)');
db.exec('CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority)');
db.exec('CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category)');
db.exec('CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date)');

console.log('✓ SQLite database initialized at:', DB_PATH);

// Graceful shutdown
process.on('SIGINT', () => {
  db.close();
  console.log('SQLite database connection closed');
  process.exit(0);
});

export default db;
