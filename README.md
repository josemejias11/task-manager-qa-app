# Task Manager QA App

A modern, production-ready task manager application built with **React**, **TypeScript**, **Node.js**, **Express**, and **SQLite**. Features a clean architecture with proper separation of concerns, type safety, zero-configuration database, and comprehensive development tooling.

---

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Production](#production)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Code Quality](#code-quality)
- [Recent Improvements](#recent-improvements)
- [Technology Roadmap](#technology-roadmap)

---

## Features

### Application Features

- ✅ Create, read, update, and delete tasks
- ✅ Mark tasks as completed
- ✅ Real-time task statistics (active/completed counts, progress bar)
- ✅ Inline editing with keyboard shortcuts
- ✅ Bulk operations (clear completed, remove all)
- ✅ Toast notifications for user feedback
- ✅ Responsive and modern UI with Bootstrap 5
- ✅ Client-side and server-side validation
- ✅ **Zero-configuration database** - SQLite (no server required!)

### Technical Features

- ✅ **TypeScript** - Full type safety across frontend and backend
- ✅ **React 19** - Modern component-based UI
- ✅ **Vite** - Lightning-fast build tool with HMR
- ✅ **SQLite** - Zero-config embedded database (no installation needed!)
- ✅ **Express.js** - RESTful API with middleware architecture
- ✅ **Zod** - Runtime validation with TypeScript inference
- ✅ **Security** - Helmet, CORS, rate limiting
- ✅ **Code Quality** - ESLint, Prettier, Husky, lint-staged
- ✅ **Performance** - Compression, optimistic updates

---

## Technology Stack

### Frontend

- **React 19** with TypeScript
- **Vite 7** for build tooling
- **Bootstrap 5** for styling
- Component-based architecture
- Custom API service layer
- Optimistic UI updates

### Backend

- **Node.js** with TypeScript
- **Express.js** web framework
- **SQLite** with better-sqlite3
- **Zod** for validation
- Layered architecture (routes → controllers → services → database)

### Development Tools

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for Git hooks
- **lint-staged** for pre-commit checks
- **Concurrently** for parallel dev servers

### Security & Performance

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **express-rate-limit** - Rate limiting
- **compression** - Response compression

---

## Requirements

- [Node.js](https://nodejs.org/) v14 or higher
- npm or yarn package manager

**That's it!** No database installation required - SQLite is embedded.

---

## Installation

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/task-manager-qa-app.git
cd task-manager-qa-app
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**

```bash
cp .env.example .env
```

**Note:** The database file is automatically created on first run. No additional setup required!

---

## Configuration

Create a `.env` file in the root directory (use `.env.example` as template):

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
# SQLite database file path (automatically created if it doesn't exist)
# Default: dist/data/tasks.db
# DB_PATH=./data/tasks.db

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Environment Variables

| Variable      | Description                          | Default               |
| ------------- | ------------------------------------ | --------------------- |
| `PORT`        | Backend server port                  | 3001                  |
| `NODE_ENV`    | Environment (development/production) | development           |
| `DB_PATH`     | SQLite database file path (optional) | dist/data/tasks.db    |
| `CORS_ORIGIN` | Allowed frontend origin for CORS     | http://localhost:3000 |

---

## Development

### Start Development Servers

Run both frontend and backend in development mode:

```bash
npm run dev
```

This will start:

- Backend server on `http://localhost:3001` (with auto-reload via tsx)
- Frontend dev server on `http://localhost:3000` (with Vite HMR)
- SQLite database automatically initialized

### Run Servers Separately

**Backend only:**

```bash
npm run dev:server
```

**Frontend only:**

```bash
npm run dev:client
```

### Type Checking

Check TypeScript types without building:

```bash
npm run type-check
```

### Code Quality

**Lint code:**

```bash
npm run lint
```

**Auto-fix lint issues:**

```bash
npm run lint:fix
```

**Format code:**

```bash
npm run format
```

---

## Production

### Build

Build both frontend and backend:

```bash
npm run build
```

This creates:

- `dist/` - Compiled TypeScript backend
- `dist/client/` - Production-optimized frontend
- `dist/data/tasks.db` - SQLite database (created on first run)

### Start Production Server

```bash
npm start
```

The production server:

- Serves the API on the configured PORT
- Serves the built React app for all non-API routes
- Uses SQLite for data persistence (single file database)

---

## Project Structure

```
task-manager-qa-app/
├── src/
│   ├── server/                 # Backend (TypeScript + Express + SQLite)
│   │   ├── config/            # Configuration files
│   │   │   └── database.ts    # SQLite setup & table creation
│   │   ├── controllers/       # Request handlers
│   │   │   └── task.controller.ts
│   │   ├── middleware/        # Express middleware
│   │   │   ├── error.middleware.ts
│   │   │   └── validation.middleware.ts
│   │   ├── routes/            # API routes
│   │   │   └── task.routes.ts
│   │   ├── services/          # Business logic
│   │   │   └── task.service.ts
│   │   ├── types/             # TypeScript types
│   │   │   └── task.types.ts
│   │   └── server.ts          # Application entry point
│   │
│   └── client/                # Frontend (React + TypeScript)
│       ├── src/
│       │   ├── components/    # React components
│       │   │   ├── ActionButtons.tsx
│       │   │   ├── TaskForm.tsx
│       │   │   ├── TaskItem.tsx
│       │   │   ├── TaskList.tsx
│       │   │   ├── TaskStats.tsx
│       │   │   ├── Toast.tsx
│       │   │   └── ToastContainer.tsx
│       │   ├── services/      # API client
│       │   │   └── api.ts
│       │   ├── styles/        # CSS files
│       │   │   └── index.css
│       │   ├── types/         # TypeScript types
│       │   │   └── task.ts
│       │   ├── App.tsx        # Main app component
│       │   └── main.tsx       # React entry point
│       ├── index.html         # HTML template
│       ├── tsconfig.json      # TypeScript config
│       └── tsconfig.node.json # Vite TypeScript config
│
├── dist/                      # Build output (gitignored)
│   ├── data/                  # SQLite database location
│   │   └── tasks.db          # SQLite database file
│   └── client/               # Built frontend
├── .husky/                    # Git hooks
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── eslint.config.js          # ESLint configuration
├── package.json              # Dependencies and scripts
├── .prettierrc.json          # Prettier configuration
├── tsconfig.json             # Backend TypeScript config
├── vite.config.ts            # Vite configuration
└── README.md                 # This file
```

---

## API Documentation

### Base URL

```
http://localhost:3001/api
```

### Endpoints

#### Get All Tasks

```http
GET /tasks
```

**Response:**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Sample task",
    "completed": false,
    "createdAt": "2024-11-15T10:00:00.000Z",
    "updatedAt": "2024-11-15T10:00:00.000Z"
  }
]
```

#### Create Task

```http
POST /tasks
Content-Type: application/json

{
  "title": "New task"
}
```

**Validation:**

- `title`: Required, 1-20 characters, trimmed

**Response:** `201 Created`

#### Update Task

```http
PATCH /tasks/:id
Content-Type: application/json

{
  "title": "Updated title",
  "completed": true
}
```

**Validation:**

- `title`: Optional, 1-20 characters, trimmed
- `completed`: Optional, boolean
- At least one field required

**Response:** `200 OK`

#### Delete Task

```http
DELETE /tasks/:id
```

**Response:** `204 No Content`

#### Delete All Tasks

```http
DELETE /tasks
```

**Response:** `204 No Content`

### Error Responses

All errors return JSON with an `error` field:

```json
{
  "error": "Error message here"
}
```

**Status Codes:**

- `400` - Bad Request (validation error)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

---

## Code Quality

### Pre-commit Hooks

Husky runs lint-staged on every commit to ensure code quality:

- **TypeScript files** - Linted with ESLint, formatted with Prettier
- **JSON/Markdown files** - Formatted with Prettier

### Linting Rules

- TypeScript strict mode enabled
- ESLint with recommended rules
- Prettier for consistent formatting
- No unused variables/imports
- Consistent naming conventions

### Type Safety

- Full TypeScript coverage
- Strict null checks
- No implicit any
- Shared types between frontend/backend via Zod schemas

---

## Recent Improvements

### Architecture Overhaul

- ✅ **Migrated to TypeScript** - Full type safety across the stack
- ✅ **Modern Frontend** - React 19 with Vite replacing vanilla JS
- ✅ **SQLite Database** - Zero-config embedded database replacing MongoDB
- ✅ **Layered Architecture** - Proper separation: routes → controllers → services
- ✅ **Shared Validation** - Zod schemas used on both client and server

### Developer Experience

- ✅ **Vite** - Lightning-fast HMR and build times
- ✅ **TypeScript** - Catch errors before runtime
- ✅ **Husky + lint-staged** - Automated code quality checks
- ✅ **Concurrently** - Run frontend and backend together
- ✅ **Better Scripts** - Separate dev/build commands for client/server

### Security & Performance

- ✅ **Helmet** - Security headers for production
- ✅ **Rate Limiting** - Protect against API abuse
- ✅ **Compression** - Reduce response sizes
- ✅ **Proper CORS** - Configurable origins
- ✅ **Input Validation** - Zod validation on all inputs

### Database Simplification

- ✅ **Zero Configuration** - No database server installation required
- ✅ **Single File** - Easy backup and portability (tasks.db)
- ✅ **ACID Compliant** - Proper transaction support
- ✅ **Synchronous** - Simpler code, no async overhead

---

## Technology Roadmap

### Current Stack Assessment

Our current stack is modern and production-ready, but here are cutting-edge alternatives to consider:

### 🚀 Recommended Next-Gen Upgrades

#### 1. **Backend Framework**

**Current:** Express.js
**Consider:**

- **Fastify** - 2x faster than Express, better TypeScript support
- **Hono** - Ultra-fast, edge-compatible, modern API design
- **tRPC** - End-to-end type safety (no API layer needed!)

```typescript
// tRPC example - Type-safe API calls with no runtime overhead
const task = await trpc.tasks.create.mutate({ title: 'New task' });
// ↑ Fully typed, autocomplete works!
```

#### 2. **Frontend Styling**

**Current:** Bootstrap 5
**Consider:**

- **TailwindCSS** - Utility-first, smaller bundle, more flexible
- **shadcn/ui** - Beautifully designed components (Tailwind + Radix UI)
- **Panda CSS** - Zero-runtime CSS-in-JS with type safety

```tsx
// Tailwind example
<button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded">Add Task</button>
```

#### 3. **State Management**

**Current:** useState hooks
**Consider:**

- **Zustand** - Simple, fast, minimal boilerplate
- **Jotai** - Atomic state management, great TypeScript support
- **TanStack Query** - Server state management (caching, refetching)

```typescript
// TanStack Query example - automatic caching & revalidation
const { data: tasks } = useQuery({
  queryKey: ['tasks'],
  queryFn: () => taskApi.getAllTasks(),
});
```

#### 4. **Form Handling**

**Current:** Manual forms
**Consider:**

- **React Hook Form** - Performant, flexible, great DX
- **Conform** - Progressive enhancement, server-side validation
- **Zod + React Hook Form** - Type-safe forms with validation

```typescript
// React Hook Form + Zod
const { register, handleSubmit } = useForm({
  resolver: zodResolver(createTaskSchema),
});
```

#### 5. **Database ORM**

**Current:** Raw SQLite queries
**Consider:**

- **Drizzle ORM** - TypeScript-first, lightweight, SQL-like syntax
- **Prisma** - Type-safe queries, migrations, great DX
- **Kysely** - Type-safe SQL query builder

```typescript
// Drizzle example
const tasks = await db.select().from(tasksTable).orderBy(desc(tasksTable.createdAt));
```

#### 6. **API Layer**

**Current:** REST with Express
**Consider:**

- **tRPC** - No API layer, end-to-end type safety
- **GraphQL** - Flexible queries, single endpoint
- **Hono RPC** - Type-safe RPC with edge support

#### 7. **Testing**

**Current:** None (recommended addition!)
**Consider:**

- **Vitest** - Fast, Vite-native, Jest-compatible
- **Playwright** - End-to-end testing
- **Testing Library** - Component testing

```typescript
// Vitest example
import { describe, it, expect } from 'vitest';

describe('TaskService', () => {
  it('should create a task', () => {
    const task = TaskService.createTask({ title: 'Test' });
    expect(task.title).toBe('Test');
  });
});
```

#### 8. **Deployment**

**Consider:**

- **Vercel** - Zero-config deployment for Next.js
- **Railway** - Simple deployment with databases
- **Fly.io** - Global deployment with SQLite support
- **Docker** - Containerization for any platform

#### 9. **Monorepo Tools**

**Consider:**

- **Turborepo** - High-performance build system
- **pnpm workspaces** - Faster, more efficient than npm
- **Nx** - Smart, extensible build framework

#### 10. **Full-Stack Frameworks**

**Consider replacing React + Express with:**

- **Next.js 15** - React Server Components, App Router
- **Remix** - Web fundamentals, nested routing
- **Astro** - Content-focused, partial hydration
- **SvelteKit** - Svelte + full-stack framework

---

### 📋 Priority Upgrade Path

#### Phase 1: Low-Hanging Fruit (1-2 days)

1. Add **TailwindCSS** - Better styling, smaller bundle
2. Add **TanStack Query** - Better data fetching
3. Add **Drizzle ORM** - Type-safe database queries
4. Add **Vitest** - Unit testing

#### Phase 2: Developer Experience (3-5 days)

5. Add **React Hook Form** - Better forms
6. Add **Zustand** - Global state management
7. Add **Playwright** - E2E testing
8. Add **Turborepo** - Monorepo optimization

#### Phase 3: Architecture (1-2 weeks)

9. Migrate to **tRPC** - End-to-end type safety
10. Consider **Next.js** - Full-stack framework

---

### 💡 Recommended Modern Stack (If Starting Fresh)

```
Frontend: Next.js 15 + TypeScript + TailwindCSS + shadcn/ui
Backend: Next.js API Routes + tRPC + Drizzle ORM
Database: SQLite (Turso for production) or PostgreSQL
State: TanStack Query + Zustand
Forms: React Hook Form + Zod
Testing: Vitest + Playwright
Deployment: Vercel or Railway
```

**Benefits:**

- End-to-end type safety (no API layer needed)
- Server Components for better performance
- Single framework for full-stack development
- Modern DX with minimal boilerplate

---

## Security

This application includes several security best practices:

- **Helmet** - Sets security-related HTTP headers
- **CORS** - Configured for specific origins
- **Rate Limiting** - Prevents API abuse
- **Input Validation** - Server-side validation with Zod
- **SQL Injection Protection** - Prepared statements

For production deployment, ensure:

- Update `CORS_ORIGIN` to your production domain
- Set `NODE_ENV=production`
- Review and update rate limit settings
- Enable HTTPS
- Regular security audits: `npm audit`

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is for educational purposes.

---

**Built for modern development workflows with TypeScript, React, and SQLite.**
**Ready for next-gen upgrades with tRPC, Next.js, and TailwindCSS.**
