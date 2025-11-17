# CLAUDE.md - AI Assistant Guide

**Last Updated:** 2025-11-17
**Project:** Task Manager Pro
**Version:** 1.0.0

---

## Overview

This is a **production-ready task manager application** built with modern web technologies. This guide helps AI assistants understand the codebase structure, development workflows, and key conventions when working with this project.

### Tech Stack

- **Frontend:** React 19, TypeScript, TailwindCSS, Vite 7
- **Backend:** Node.js, Express, TypeScript, SQLite (better-sqlite3)
- **Validation:** Zod (runtime validation + type inference)
- **Styling:** TailwindCSS with shadcn/ui-inspired components
- **Build Tools:** TypeScript, Vite, tsx
- **Code Quality:** ESLint 9 (flat config), Prettier
- **CI/CD:** GitHub Actions

---

## Project Structure

```
/home/user/task-manager-qa-app/
├── .github/workflows/
│   └── ci.yml                        # CI/CD pipeline (Node 18.x, 20.x)
├── scripts/
│   ├── dev-setup.sh                  # Automated development setup
│   ├── test-all.sh                   # Run type-check, lint, build
│   ├── db-backup.sh                  # SQLite backup utility
│   └── build-prod.sh                 # Production build
├── src/
│   ├── server/                       # Backend (Node.js + Express)
│   │   ├── config/
│   │   │   └── database.ts           # SQLite setup + auto-migrations
│   │   ├── controllers/
│   │   │   └── task.controller.ts    # Request handlers (5 endpoints)
│   │   ├── middleware/
│   │   │   ├── error.middleware.ts   # Error handling + asyncHandler
│   │   │   └── validation.middleware.ts # Zod validation
│   │   ├── routes/
│   │   │   └── task.routes.ts        # API route definitions
│   │   ├── services/
│   │   │   └── task.service.ts       # Business logic + DB queries
│   │   ├── types/
│   │   │   └── task.types.ts         # Zod schemas + TS types
│   │   └── server.ts                 # App entry + Express setup
│   └── client/                       # Frontend (React 19)
│       ├── src/
│       │   ├── components/
│       │   │   ├── ui/               # Reusable UI primitives
│       │   │   │   ├── button.tsx    # CVA-based button variants
│       │   │   │   ├── card.tsx      # Container components
│       │   │   │   ├── input.tsx     # Form input
│       │   │   │   ├── badge.tsx     # Priority/category labels
│       │   │   │   ├── checkbox.tsx  # Custom checkbox
│       │   │   │   └── select.tsx    # Dropdown select
│       │   │   ├── theme-provider.tsx # Dark mode context
│       │   │   ├── theme-toggle.tsx   # Theme switcher
│       │   │   ├── TaskForm.tsx       # Multi-field task form
│       │   │   ├── TaskItem.tsx       # Task card component
│       │   │   ├── TaskStats.tsx      # Analytics dashboard
│       │   │   ├── SearchAndFilter.tsx # Search + filtering
│       │   │   ├── Toast.tsx          # Toast notification
│       │   │   └── ToastContainer.tsx # Toast manager
│       │   ├── services/
│       │   │   └── api.ts            # API client
│       │   ├── styles/
│       │   │   └── index.css         # TailwindCSS + custom styles
│       │   ├── types/
│       │   │   └── task.ts           # Frontend TS types
│       │   ├── lib/
│       │   │   └── utils.ts          # cn() utility
│       │   ├── App.tsx               # Main app component
│       │   └── main.tsx              # React entry
│       ├── index.html
│       └── tsconfig.json
├── .env.example                      # Environment template
├── .prettierrc.json                  # Code formatting
├── eslint.config.js                  # ESLint flat config
├── package.json                      # Dependencies + scripts
├── tailwind.config.js                # TailwindCSS config
├── tsconfig.json                     # Backend TS config
└── vite.config.ts                    # Vite bundler config
```

---

## Architecture Patterns

### Backend: Layered Architecture

**4-tier separation of concerns:**

1. **Routes** (`task.routes.ts`)
   - Define HTTP endpoints (GET, POST, PATCH, DELETE)
   - Apply middleware (validation, params)
   - Map to controller methods

2. **Controllers** (`task.controller.ts`)
   - Handle HTTP request/response
   - Delegate to service layer
   - Return appropriate status codes (201, 204, 404, 500)
   - Wrapped in `asyncHandler` for error handling

3. **Services** (`task.service.ts`)
   - Pure business logic
   - Database operations (better-sqlite3 prepared statements)
   - Data transformation (DB row → API response)
   - UUID generation, JSON serialization

4. **Database** (`database.ts`)
   - SQLite initialization
   - Auto-migration system
   - Index creation
   - Connection lifecycle

### Frontend: Component-Based Architecture

**React hooks + composition:**

- **Container:** `App.tsx` (state orchestration)
- **Presentational:** `TaskForm`, `TaskItem`, `TaskStats`
- **UI Primitives:** Reusable `ui/` components
- **Context:** `ThemeProvider` for dark mode
- **Services:** Separate `api.ts` for backend communication

---

## API Endpoints

**Base URL:** `http://localhost:3001/api`

```
GET    /api/tasks          → Get all tasks
POST   /api/tasks          → Create task (validated)
PATCH  /api/tasks/:id      → Update task (validated)
DELETE /api/tasks/:id      → Delete task
DELETE /api/tasks          → Delete all tasks
```

### Request/Response Flow

```
Client → API Client (api.ts) → Express Routes → Validation Middleware
→ Controller → Service → SQLite → Service → Controller → Client
```

---

## Type System: TypeScript + Zod

### Dual Type System Pattern

**Backend** (`src/server/types/task.types.ts`):

```typescript
// 1. Zod schemas for runtime validation
const createTaskSchema = z.object({
  title: z.string().min(1).max(100).transform(val => val.trim()),
  description: z.string().max(500).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  category: z.enum(['work', 'personal', 'shopping', 'health', 'other']).default('personal'),
  dueDate: z.string().datetime().optional().nullable(),
  tags: z.array(z.string()).default([])
});

// 2. TypeScript types inferred from Zod
type CreateTaskInput = z.infer<typeof createTaskSchema>;
```

**Frontend** (`src/client/src/types/task.ts`):

```typescript
// Pure TypeScript types (compile-time only)
interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'work' | 'personal' | 'shopping' | 'health' | 'other';
  dueDate?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
```

### Type Flow

```
Client Input → Zod Validation → Service → Database (TaskRow)
→ formatTaskResponse() → TaskResponse → Client (Task)
```

---

## Database Schema

**Technology:** SQLite via `better-sqlite3` (synchronous, embedded)

**Location:** `dist/data/tasks.db` (auto-created, configurable via `DB_PATH`)

### Tasks Table

```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL CHECK(length(title) <= 100 AND length(title) > 0),
  description TEXT,
  completed INTEGER NOT NULL DEFAULT 0,
  priority TEXT NOT NULL DEFAULT 'medium'
    CHECK(priority IN ('low', 'medium', 'high', 'urgent')),
  category TEXT NOT NULL DEFAULT 'personal'
    CHECK(category IN ('work', 'personal', 'shopping', 'health', 'other')),
  due_date TEXT,
  tags TEXT,  -- JSON string array
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

### Indexes (Performance Optimization)

```sql
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_category ON tasks(category);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
```

### Auto-Migration Pattern

On server startup, `database.ts`:
1. Checks if table exists
2. Validates schema via `PRAGMA table_info(tasks)`
3. If missing columns (e.g., `priority`), runs migration:
   - Create backup table
   - Drop old table
   - Recreate with new schema
   - Migrate data
   - Drop backup
4. Creates indexes if not exist

---

## State Management

**Pattern:** Local component state + React hooks (no Redux/Zustand)

### State Location (`App.tsx`)

```typescript
// Primary state
const [tasks, setTasks] = useState<Task[]>([]);
const [filters, setFilters] = useState<FilterState>({ /* ... */ });
const [toasts, setToasts] = useState<ToastMessage[]>([]);

// UI state
const [error, setError] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(true);
```

### Key Patterns

1. **Optimistic Updates** (better UX):
```typescript
// Update UI immediately
setTasks(prev => prev.map(task =>
  task.id === id ? { ...task, completed } : task
));

// Then sync with backend
try {
  await taskApi.updateTask(id, { completed });
} catch (error) {
  // On failure, reload from server to resync
  await loadTasks();
  showToast('Failed to update task', 'error');
}
```

2. **Derived State** (useMemo for performance):
```typescript
const filteredAndSortedTasks = useMemo(() => {
  // Filter by search, status, priority, category
  // Sort by date, priority, title, dueDate
}, [tasks, filters]);
```

3. **Context API** (Theme only):
```typescript
// ThemeProvider wraps app
// useTheme() hook for theme state
// Persists to localStorage
```

---

## Development Workflow

### Environment Setup

```bash
# Automated setup (recommended)
./scripts/dev-setup.sh

# Manual setup
npm install
cp .env.example .env
npm run dev
```

### Environment Variables (`.env`)

```bash
PORT=3001                           # Backend API port
NODE_ENV=development                # Environment mode
CORS_ORIGIN=http://localhost:3000  # Frontend origin
# DB_PATH=./data/tasks.db           # Optional: custom DB path
```

### Development Servers

```bash
# Start both servers (recommended)
npm run dev

# Backend only (port 3001, hot reload via tsx)
npm run dev:server

# Frontend only (port 3000, Vite HMR)
npm run dev:client
```

**URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api/tasks
- Vite proxies `/api/*` requests to backend

### Code Quality Commands

```bash
# Type checking (both frontend + backend)
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Code formatting
npm run format

# Run all quality checks
./scripts/test-all.sh
```

### Build & Production

```bash
# Build both frontend + backend
npm run build

# Start production server
npm start  # NODE_ENV=production node dist/server.js
```

**Build Output:**
- `dist/server/` - Compiled backend (TypeScript → JavaScript)
- `dist/client/` - Optimized frontend bundle (Vite build)
- `dist/data/tasks.db` - SQLite database (auto-created)

---

## Code Conventions

### File Naming

- **Backend:** `lowercase.ts` (e.g., `task.controller.ts`, `database.ts`)
- **Frontend Components:** `PascalCase.tsx` (e.g., `TaskForm.tsx`, `App.tsx`)
- **Frontend UI Primitives:** `lowercase.tsx` (e.g., `button.tsx`, `card.tsx`)
- **Types:** `lowercase.ts` (e.g., `task.types.ts`, `task.ts`)
- **Scripts:** `kebab-case.sh` (e.g., `dev-setup.sh`, `test-all.sh`)

### Code Style (Enforced by Prettier + ESLint)

```typescript
// Formatting
{
  "printWidth": 100,
  "singleQuote": true,
  "semi": true,
  "trailingComma": "es5"
}

// TypeScript
- Strict mode enabled
- No unused vars (except `_` prefix for intentional unused)
- Explicit return types for functions
- No `any` types (use `unknown` if needed)
```

### Component Patterns

**UI Components (shadcn/ui style):**

```typescript
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline';
  size?: 'default' | 'sm' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

**Feature Components:**

```typescript
interface TaskFormProps {
  onSubmit: (data: CreateTaskInput) => Promise<void>;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [formData, setFormData] = useState<CreateTaskInput>({ /* ... */ });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... */}
    </form>
  );
}
```

### Backend Patterns

**Controllers (async/await with error handling):**

```typescript
export class TaskController {
  static getAllTasks = asyncHandler(async (req: Request, res: Response) => {
    const tasks = await TaskService.getAllTasks();
    res.json(tasks);
  });

  static createTask = asyncHandler(async (req: Request, res: Response) => {
    const task = await TaskService.createTask(req.body);
    res.status(201).json(task);
  });
}
```

**Services (pure business logic):**

```typescript
export class TaskService {
  static getAllTasks(): TaskResponse[] {
    const stmt = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC');
    const rows = stmt.all() as TaskRow[];
    return rows.map(formatTaskResponse);
  }

  static createTask(data: CreateTaskInput): TaskResponse {
    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO tasks (id, title, description, priority, category, due_date, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, data.title, data.description || null, /* ... */);
    return this.getTaskById(id);
  }
}
```

---

## Common Tasks for AI Assistants

### 1. Adding a New API Endpoint

**Steps:**

1. **Update Types** (`src/server/types/task.types.ts`):
```typescript
// Add Zod schema
export const newActionSchema = z.object({
  field: z.string().min(1)
});

// Infer TypeScript type
export type NewActionInput = z.infer<typeof newActionSchema>;
```

2. **Update Service** (`src/server/services/task.service.ts`):
```typescript
static performNewAction(data: NewActionInput): TaskResponse {
  // Business logic + DB query
  const stmt = db.prepare('UPDATE tasks SET ...');
  stmt.run(data.field);
  return this.getTaskById(id);
}
```

3. **Update Controller** (`src/server/controllers/task.controller.ts`):
```typescript
static newAction = asyncHandler(async (req: Request, res: Response) => {
  const result = await TaskService.performNewAction(req.body);
  res.json(result);
});
```

4. **Update Routes** (`src/server/routes/task.routes.ts`):
```typescript
router.post('/tasks/new-action', validate(newActionSchema), TaskController.newAction);
```

5. **Update API Client** (`src/client/src/services/api.ts`):
```typescript
async newAction(data: NewActionInput): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/tasks/new-action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new ApiError(response.status, await response.text());
  }

  return response.json();
}
```

6. **Test:**
```bash
npm run type-check  # Verify types
npm run dev         # Test locally
```

### 2. Adding a New UI Component

**Steps:**

1. **Create Component** (`src/client/src/components/NewComponent.tsx`):
```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface NewComponentProps {
  data: SomeType;
  onAction: () => void;
}

export function NewComponent({ data, onAction }: NewComponentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{data.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={onAction}>Action</Button>
      </CardContent>
    </Card>
  );
}
```

2. **Import in App** (`src/client/src/App.tsx`):
```typescript
import { NewComponent } from '@/components/NewComponent';

// In component:
<NewComponent data={someData} onAction={handleAction} />
```

3. **Test with HMR:**
```bash
npm run dev:client  # Changes auto-reload
```

### 3. Modifying Database Schema

**Steps:**

1. **Update Schema** (`src/server/config/database.ts`):
```typescript
// Add new column to CREATE TABLE statement
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    /* ... existing columns ... */
    new_field TEXT,  -- Add here
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`;

// Add migration logic
export function initializeDatabase(): Database.Database {
  // Check if column exists
  const tableInfo = db.prepare('PRAGMA table_info(tasks)').all();
  const hasNewField = tableInfo.some(col => col.name === 'new_field');

  if (!hasNewField) {
    // Add migration
    db.prepare('ALTER TABLE tasks ADD COLUMN new_field TEXT').run();
  }

  return db;
}
```

2. **Update Types** (`src/server/types/task.types.ts`):
```typescript
interface TaskRow {
  /* ... */
  new_field: string | null;
}

interface TaskResponse {
  /* ... */
  newField?: string;
}

const createTaskSchema = z.object({
  /* ... */
  newField: z.string().optional()
});
```

3. **Update Service** (data transformation):
```typescript
function formatTaskResponse(row: TaskRow): TaskResponse {
  return {
    /* ... */
    newField: row.new_field || undefined
  };
}
```

4. **Test Migration:**
```bash
# Delete existing DB to test fresh creation
rm dist/data/tasks.db

# Start server (auto-creates with new schema)
npm run dev:server
```

### 4. Adding Dark Mode Support to a Component

**Pattern already implemented:**

```typescript
// Use CSS variables defined in index.css
<div className="bg-background text-foreground">
  {/* Colors auto-switch based on theme */}
</div>

// Access theme programmatically
import { useTheme } from '@/components/theme-provider';

const { theme } = useTheme();
```

**Available CSS Variables:**

```css
/* Light mode */
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;
--card: 0 0% 100%;
--card-foreground: 222.2 84% 4.9%;
/* ... etc */

/* Dark mode (automatically applied with .dark class) */
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... etc */
}
```

### 5. Adding Form Validation

**Use Zod schemas:**

```typescript
// Backend (runtime validation)
const schema = z.object({
  email: z.string().email(),
  age: z.number().min(18).max(120)
});

// In route
router.post('/endpoint', validate(schema), controller);

// Frontend (optional - can reuse backend types)
import type { CreateTaskInput } from '@/types/task';

const [errors, setErrors] = useState<Record<string, string>>({});

const validateForm = (data: CreateTaskInput): boolean => {
  const newErrors: Record<string, string> = {};

  if (!data.title.trim()) {
    newErrors.title = 'Title is required';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

---

## Testing & Quality Assurance

### Running Tests

```bash
# Full test suite (recommended before commits)
./scripts/test-all.sh

# Individual checks
npm run type-check  # TypeScript compilation
npm run lint        # ESLint
npm run build       # Build verification
```

### CI/CD Pipeline

**Triggers:** Push/PR to `main` or `develop`

**Matrix:** Node.js 18.x, 20.x

**Steps:**
1. Checkout code
2. Setup Node.js with npm cache
3. `npm ci` (clean install)
4. Type checking
5. Linting
6. Build
7. Upload artifacts (Node 20.x only)
8. Security audit (`npm audit`)

**Artifacts:** `dist/` directory uploaded for Node 20.x builds

### Pre-commit Checklist

- [ ] Run `npm run type-check` (no errors)
- [ ] Run `npm run lint` (no errors)
- [ ] Run `npm run format` (code formatted)
- [ ] Test locally with `npm run dev`
- [ ] Build succeeds: `npm run build`
- [ ] No console errors in browser
- [ ] All API endpoints respond correctly

---

## Important Guidelines for AI Assistants

### File Modification Rules

1. **Always Read Before Edit:**
   - Use `Read` tool before using `Edit` or `Write` tools
   - Understand existing code structure first

2. **Prefer Editing Over Writing:**
   - Edit existing files when possible
   - Only create new files when absolutely necessary
   - Follow existing naming conventions

3. **Type Safety:**
   - Backend: Use Zod schemas for validation
   - Frontend: Use TypeScript interfaces
   - Keep types in sync between frontend/backend

4. **Path Patterns:**
   - Backend: `/home/user/task-manager-qa-app/src/server/**/*.ts`
   - Frontend: `/home/user/task-manager-qa-app/src/client/src/**/*.{ts,tsx}`
   - Types are duplicated (backend has Zod + TS, frontend has TS only)

### Security Considerations

**Built-in Security (already implemented):**
- Helmet (security headers)
- CORS (configurable origin)
- Rate limiting (100 req/15min per IP on `/api/*`)
- SQL injection protection (prepared statements)
- Input validation (Zod schemas)

**When Adding Code:**
- ❌ Never use string concatenation for SQL queries
- ✅ Always use prepared statements: `db.prepare('...').run(params)`
- ❌ Never trust user input without validation
- ✅ Always validate with Zod schemas in routes
- ❌ Never expose sensitive errors to client
- ✅ Use generic error messages in production

### Performance Considerations

**Database:**
- Use existing indexes (completed, created_at, priority, category, due_date)
- Add indexes if querying new columns frequently
- Use prepared statements (already done in service layer)

**Frontend:**
- Use `useMemo` for expensive computations (filtering/sorting)
- Use `useCallback` for event handlers passed to children
- Implement optimistic updates for better UX

**API:**
- Keep payload sizes small (already optimized)
- Use pagination for large datasets (not implemented yet)

### Common Pitfalls to Avoid

1. **Database Path Issues:**
   - Default: `dist/data/tasks.db`
   - Directory created automatically
   - Don't hardcode paths, use `DB_PATH` env variable

2. **CORS Errors:**
   - Dev: Frontend on 3000, backend on 3001
   - Vite proxies `/api/*` in dev mode
   - Production: Both served from same origin

3. **Type Mismatches:**
   - Backend uses `snake_case` in DB (e.g., `due_date`)
   - API uses `camelCase` (e.g., `dueDate`)
   - Transformation done in `formatTaskResponse()`

4. **State Desync:**
   - Always refresh from server on API errors
   - Use optimistic updates for UI responsiveness
   - Revert on failure: `loadTasks()` re-fetches all tasks

5. **Build Paths:**
   - Backend builds to: `dist/server/`
   - Frontend builds to: `dist/client/`
   - Production server serves from `dist/client/`

### UI/UX Patterns

**Component Composition:**

```typescript
// Good: Compose with UI primitives
<Card>
  <CardHeader>
    <CardTitle>Task</CardTitle>
  </CardHeader>
  <CardContent>
    <Badge variant="default">{priority}</Badge>
  </CardContent>
</Card>

// Good: Use cn() for conditional classes
<div className={cn(
  "base-class",
  isActive && "active-class",
  className
)}>
```

**Styling with TailwindCSS:**

```typescript
// Good: Use semantic classes
<button className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90">

// Good: Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Good: Dark mode support (uses CSS variables)
<div className="bg-card text-card-foreground">
```

---

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Backend auto-increments port on EADDRINUSE
# Or manually kill process:
lsof -ti:3001 | xargs kill -9
```

**Database locked:**
```bash
# SQLite doesn't support concurrent writes
# better-sqlite3 is synchronous, handles this automatically
# If issues persist, check for zombie processes
```

**Type errors after schema change:**
```bash
# 1. Update Zod schema (task.types.ts)
# 2. Update TypeScript interface
# 3. Run type-check to find all issues
npm run type-check
```

**Build fails:**
```bash
# Check for import errors (common with path aliases)
# Frontend uses @/ alias (configured in vite.config.ts and tsconfig.json)

# Verify both configs match:
# vite.config.ts: resolve.alias['@'] = './src/client/src'
# tsconfig.json: paths['@/*'] = ['./src/*']
```

**Vite HMR not working:**
```bash
# Check Vite config proxy settings
# Ensure backend is running on port 3001
# Check browser console for WebSocket errors
```

---

## Scripts Reference

### NPM Scripts

```bash
# Development
npm run dev              # Start both servers (recommended)
npm run dev:server       # Backend only (tsx watch)
npm run dev:client       # Frontend only (Vite HMR)

# Building
npm run build:server     # Compile TypeScript backend
npm run build:client     # Bundle React frontend
npm run build            # Build both

# Production
npm start                # Start production server

# Code Quality
npm run type-check       # TypeScript compilation (no emit)
npm run lint             # Run ESLint
npm run lint:fix         # Auto-fix ESLint issues
npm run format           # Format with Prettier
```

### Bash Scripts

```bash
# Development setup (run once)
./scripts/dev-setup.sh
# - Checks Node.js ≥18
# - Installs dependencies
# - Creates .env
# - Runs quality checks

# Comprehensive testing (run before commits)
./scripts/test-all.sh
# - Type checking (backend + frontend)
# - Linting
# - Build verification
# - Color-coded output
# - Exits with code 1 on any failure

# Database backup
./scripts/db-backup.sh
# - Creates timestamped backup
# - Saves to data/backups/
# - Keeps last 10 backups
# - Auto-cleanup

# Production build
./scripts/build-prod.sh
# - Clean build (removes dist/)
# - Type-check + lint + build
# - Production-ready output
```

---

## Git Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Feature branches
- `fix/*` - Bug fixes

### Commit Message Convention

```bash
# Format: type(scope): description

# Examples:
feat(api): add bulk delete endpoint
fix(ui): correct dark mode toggle styling
refactor(db): optimize task queries with indexes
docs(readme): update API documentation
chore(deps): update dependencies
```

### CI/CD Triggers

- Push to `main` or `develop` → Full CI pipeline
- Pull request to `main` or `develop` → Full CI pipeline
- Security audit runs on all branches

---

## Future Enhancements (Roadmap)

**Planned Features:**
- [ ] Unit testing (Vitest)
- [ ] E2E testing (Playwright)
- [ ] TanStack Query (data fetching/caching)
- [ ] React Hook Form (form handling)
- [ ] Subtasks support
- [ ] Recurring tasks
- [ ] Export/Import (JSON, CSV, Markdown)
- [ ] Real-time updates (WebSocket)

**When Implementing:**
- Follow existing patterns (layered architecture, type safety)
- Add tests for new features
- Update this CLAUDE.md with new patterns
- Document breaking changes

---

## Quick Reference

### Key File Paths

```bash
# Backend Entry
/home/user/task-manager-qa-app/src/server/server.ts

# Frontend Entry
/home/user/task-manager-qa-app/src/client/src/App.tsx

# Database Config
/home/user/task-manager-qa-app/src/server/config/database.ts

# Type Definitions
/home/user/task-manager-qa-app/src/server/types/task.types.ts  # Backend (Zod + TS)
/home/user/task-manager-qa-app/src/client/src/types/task.ts    # Frontend (TS only)

# API Client
/home/user/task-manager-qa-app/src/client/src/services/api.ts

# UI Components
/home/user/task-manager-qa-app/src/client/src/components/ui/

# Configuration
/home/user/task-manager-qa-app/vite.config.ts
/home/user/task-manager-qa-app/tsconfig.json
/home/user/task-manager-qa-app/tailwind.config.js
/home/user/task-manager-qa-app/eslint.config.js
```

### Development URLs

```
Frontend:     http://localhost:3000
Backend API:  http://localhost:3001/api/tasks
Database:     dist/data/tasks.db
```

### Environment Variables

```bash
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
DB_PATH=dist/data/tasks.db  # Optional
```

---

## Summary for AI Assistants

**When working with this codebase:**

1. **Always read files before editing** - Understand context first
2. **Follow the layered architecture** - Routes → Controllers → Services → Database
3. **Maintain type safety** - Use Zod for validation, TypeScript for types
4. **Test changes thoroughly** - Run `./scripts/test-all.sh` before committing
5. **Use existing patterns** - Don't reinvent, follow established conventions
6. **Update documentation** - Keep CLAUDE.md and README.md in sync
7. **Security first** - Use prepared statements, validate input, handle errors properly
8. **Optimize for UX** - Implement optimistic updates, show loading states
9. **Follow code style** - Prettier + ESLint enforce consistency
10. **Git workflow** - Feature branches, clear commits, CI/CD validation

**This is a well-structured, production-ready codebase with clear patterns. Respect the architecture and maintain the quality standards.**

---

**Need help?** Refer to README.md for user-facing documentation, or this CLAUDE.md for development guidance.
