# Task Manager Pro 🚀

A **professional, production-ready** task manager application with a stunning modern UI, built with **React 19**, **TypeScript**, **TailwindCSS**, **Node.js**, **Express**, and **SQLite**. Features advanced task management, real-time search, dark mode, comprehensive automation scripts, and CI/CD pipeline.

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)

</div>

---

## ✨ Features

### 🎯 Advanced Task Management

- ✅ **Create, edit, and delete tasks** with comprehensive details
- ✅ **Priority levels** - Low, Medium, High, Urgent with color coding
- ✅ **Categories** - Work, Personal, Shopping, Health, Other
- ✅ **Due dates** with overdue warnings and visual indicators
- ✅ **Task descriptions** - Add detailed notes up to 500 characters
- ✅ **Tag system** - Organize with custom tags
- ✅ **Title support** - Up to 100 characters (previously 20)
- ✅ **Inline editing** with keyboard shortcuts (Enter/Escape)
- ✅ **Bulk operations** - Clear completed, delete all

### 🔍 Search & Filtering

- ✅ **Real-time search** - Instant search across titles, descriptions, and tags
- ✅ **Advanced filtering** - Filter by status, priority, and category
- ✅ **Flexible sorting** - Sort by date, priority, title, or due date
- ✅ **Multi-criteria filtering** - Combine multiple filters simultaneously

### 📊 Dashboard & Analytics

- ✅ **Live statistics** - Total, active, completed, and overdue tasks
- ✅ **Progress tracking** - Visual progress bar with completion percentage
- ✅ **Urgent task alerts** - Highlighted warnings for urgent items
- ✅ **Task completion insights** - Track productivity over time

### 🎨 Modern UI/UX

- ✅ **Beautiful glassmorphism** design with card-based layout
- ✅ **Dark mode support** with theme toggle
- ✅ **Fully responsive** - Mobile-first design for all screen sizes
- ✅ **Smooth animations** and micro-interactions
- ✅ **Color-coded badges** for priorities and categories
- ✅ **Toast notifications** for all user actions
- ✅ **Loading states** with elegant spinners
- ✅ **Empty state messaging** for better UX

### 🔧 Technical Excellence

- ✅ **TypeScript** - Full type safety across frontend and backend
- ✅ **React 19** - Modern component-based architecture
- ✅ **TailwindCSS** - Utility-first styling with custom design system
- ✅ **Vite 7** - Lightning-fast HMR and optimized builds
- ✅ **SQLite** - Zero-config embedded database with migrations
- ✅ **Express.js** - RESTful API with layered architecture
- ✅ **Zod** - Runtime validation with TypeScript inference
- ✅ **Security** - Helmet, CORS, rate limiting, SQL injection protection
- ✅ **Code Quality** - ESLint, Prettier for consistent formatting

### 🤖 Automation & DevOps

- ✅ **GitHub Actions CI/CD** - Automated testing and builds
- ✅ **Development setup script** - One-command environment setup
- ✅ **Database backup utility** - Automated SQLite backups
- ✅ **Comprehensive test suite** - Type checking, linting, builds
- ✅ **Production build optimization** - Automated clean builds

---

## 🛠️ Technology Stack

### Frontend

- **React 19** with TypeScript and hooks
- **TailwindCSS v3** for modern utility-first styling
- **shadcn/ui-inspired** components (Button, Card, Input, Badge, Checkbox, Select)
- **Lucide React** for beautiful icons
- **date-fns** for date formatting
- **Vite 7** for blazing-fast development and builds
- Optimistic UI updates for better UX
- Component-based architecture with 12+ reusable components

### Backend

- **Node.js** with TypeScript
- **Express.js** web framework
- **SQLite** with better-sqlite3 (synchronous, zero-config)
- **Zod** for schema validation
- Layered architecture: Routes → Controllers → Services → Database
- Prepared statements for SQL injection protection
- Database migration system for schema updates

### Development Tools

- **TypeScript 5.9** - Strict mode enabled
- **ESLint 9** - Flat config with TypeScript support
- **Prettier 3.4** - Code formatting
- **Concurrently** - Run multiple dev servers
- **tsx** - Fast TypeScript execution

### Security & Performance

- **Helmet** - Security headers
- **CORS** - Configurable cross-origin resource sharing
- **express-rate-limit** - API rate limiting (100 req/15min)
- **compression** - Response compression
- **Optimistic updates** - Instant UI feedback

---

## 📋 Requirements

- [Node.js](https://nodejs.org/) v18 or higher
- npm or yarn package manager

**That's it!** No database installation required - SQLite is embedded.

---

## 🚀 Quick Start

### Automated Setup (Recommended)

```bash
# Clone repository
git clone https://github.com/yourusername/task-manager-qa-app.git
cd task-manager-qa-app

# Run automated setup script
./scripts/dev-setup.sh
```

This script will:

- Check Node.js version
- Install dependencies
- Create `.env` file
- Run type checking and linting
- Build the project

### Manual Setup

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development servers
npm run dev
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

#### Configuration Options

```env
# Server Configuration
PORT=3001                           # Backend API server port
NODE_ENV=development                # Environment: development, production, or test

# Database Configuration
# DB_PATH=./data/tasks.db           # Custom SQLite database path (optional)

# CORS Configuration
CORS_ORIGIN=http://localhost:3000  # Allowed frontend origin for CORS
```

#### Environment Variables Reference

| Variable      | Description                                          | Default                      | Required |
| ------------- | ---------------------------------------------------- | ---------------------------- | -------- |
| `PORT`        | Backend server port                                  | `3001`                       | No       |
| `NODE_ENV`    | Node environment (development/production/test)       | `development`                | No       |
| `DB_PATH`     | SQLite database file path (auto-created if missing)  | `dist/data/tasks.db`         | No       |
| `CORS_ORIGIN` | Allowed frontend origin for CORS                     | `http://localhost:3000`      | No       |

#### Development vs Production

**Development:**
- Backend API: `http://localhost:3001`
- Frontend Dev Server: `http://localhost:3000` (Vite HMR)
- Hot reload enabled for both frontend and backend
- Detailed logging and error messages

**Production:**
- Single server serves both API and static frontend
- Configured via `NODE_ENV=production`
- Optimized builds with compression and minification
- Security headers enabled (Helmet)
- Rate limiting: 100 requests per 15 minutes per IP

#### Database Configuration

The SQLite database is automatically created on first run. Features include:

- **Schema**: Comprehensive task table with priority, category, tags, due dates
- **Indexes**: Optimized for fast queries on completed, created_at, priority, category, due_date
- **Auto-migration**: Existing databases are automatically migrated to new schema
- **Backup**: Use `./scripts/db-backup.sh` to create backups (saved to `data/backups/`)

#### Security Features

Built-in security configured automatically:

- **Helmet**: Security headers for XSS, clickjacking, and other attacks
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: 100 requests per IP per 15 minutes on `/api/*` endpoints
- **SQL Injection Protection**: Prepared statements with better-sqlite3
- **Input Validation**: Zod schemas for runtime type checking
- **Content Security Policy**: Configurable in `server.ts`

---

## 💻 Development

### Start Development Servers

```bash
npm run dev
```

This starts:

- Backend API on `http://localhost:3001` (with hot reload)
- Frontend on `http://localhost:3000` (with Vite HMR)
- SQLite database auto-initialized

### Individual Commands

```bash
# Backend only
npm run dev:server

# Frontend only
npm run dev:client

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Code formatting
npm run format
```

### Automation Scripts

```bash
# Development environment setup
./scripts/dev-setup.sh

# Run all tests (type-check, lint, build)
./scripts/test-all.sh

# Backup database
./scripts/db-backup.sh

# Production build
./scripts/build-prod.sh
```

---

## 🏭 Production

### Build for Production

```bash
npm run build
```

Creates:

- `dist/server/` - Compiled TypeScript backend
- `dist/client/` - Optimized frontend bundle
- `dist/data/tasks.db` - SQLite database (created on first run)

### Start Production Server

```bash
npm start
```

The production server:

- Serves API on configured PORT
- Serves built React app for all non-API routes
- Uses SQLite for persistence (single file database)
- Includes security headers, compression, and rate limiting

---

## 📁 Project Structure

```
task-manager-qa-app/
├── src/
│   ├── server/                    # Backend (TypeScript + Express + SQLite)
│   │   ├── config/
│   │   │   └── database.ts       # SQLite setup, migrations, indexes
│   │   ├── controllers/
│   │   │   └── task.controller.ts # Request handlers
│   │   ├── middleware/
│   │   │   ├── error.middleware.ts
│   │   │   └── validation.middleware.ts
│   │   ├── routes/
│   │   │   └── task.routes.ts    # API endpoints
│   │   ├── services/
│   │   │   └── task.service.ts   # Business logic
│   │   ├── types/
│   │   │   └── task.types.ts     # Zod schemas, TypeScript types
│   │   └── server.ts             # Application entry
│   │
│   └── client/                    # Frontend (React + TypeScript + TailwindCSS)
│       ├── src/
│       │   ├── components/
│       │   │   ├── ui/           # shadcn-style UI components
│       │   │   │   ├── button.tsx
│       │   │   │   ├── card.tsx
│       │   │   │   ├── input.tsx
│       │   │   │   ├── badge.tsx
│       │   │   │   ├── checkbox.tsx
│       │   │   │   └── select.tsx
│       │   │   ├── theme-provider.tsx   # Dark mode context
│       │   │   ├── theme-toggle.tsx     # Theme switcher
│       │   │   ├── TaskForm.tsx         # Multi-field task form
│       │   │   ├── TaskItem.tsx         # Task card with badges
│       │   │   ├── TaskStats.tsx        # Analytics dashboard
│       │   │   ├── SearchAndFilter.tsx  # Search and filter UI
│       │   │   ├── Toast.tsx            # Toast notification
│       │   │   └── ToastContainer.tsx   # Toast manager
│       │   ├── services/
│       │   │   └── api.ts        # API client
│       │   ├── styles/
│       │   │   └── index.css     # TailwindCSS + custom styles
│       │   ├── types/
│       │   │   └── task.ts       # Frontend TypeScript types
│       │   ├── lib/
│       │   │   └── utils.ts      # Utility functions (cn)
│       │   ├── App.tsx           # Main application
│       │   └── main.tsx          # React entry point
│       ├── index.html
│       └── tsconfig.json
│
├── scripts/                       # Automation scripts
│   ├── dev-setup.sh              # Development environment setup
│   ├── test-all.sh               # Comprehensive test suite
│   ├── db-backup.sh              # SQLite backup utility
│   └── build-prod.sh             # Production build script
│
├── .github/
│   └── workflows/
│       └── ci.yml                # GitHub Actions CI/CD pipeline
│
├── dist/                         # Build output (gitignored)
├── .env.example                  # Environment template
├── eslint.config.js              # ESLint flat config
├── tailwind.config.js            # TailwindCSS configuration
├── postcss.config.js             # PostCSS configuration
├── vite.config.ts                # Vite configuration
├── tsconfig.json                 # Backend TypeScript config
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

---

## 📡 API Documentation

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
    "title": "Complete project documentation",
    "description": "Write comprehensive README with examples",
    "completed": false,
    "priority": "high",
    "category": "work",
    "dueDate": "2024-12-01T00:00:00.000Z",
    "tags": ["documentation", "priority"],
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
  "title": "New task",
  "description": "Optional description",
  "priority": "medium",
  "category": "personal",
  "dueDate": "2024-12-01T00:00:00.000Z",
  "tags": ["tag1", "tag2"]
}
```

**Validation:**

- `title`: Required, 1-100 characters, trimmed
- `description`: Optional, max 500 characters
- `priority`: Optional, one of: `low`, `medium`, `high`, `urgent` (default: `medium`)
- `category`: Optional, one of: `work`, `personal`, `shopping`, `health`, `other` (default: `personal`)
- `dueDate`: Optional, ISO 8601 datetime string
- `tags`: Optional, array of strings

**Response:** `201 Created`

#### Update Task

```http
PATCH /tasks/:id
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true,
  "priority": "urgent",
  "category": "work",
  "dueDate": "2024-12-01T00:00:00.000Z",
  "tags": ["urgent", "work"]
}
```

**Validation:**

- All fields optional
- At least one field required
- Same validation rules as create

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

## 🧪 Testing & Quality

### Code Quality Tools

```bash
# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Code formatting
npm run format

# Run all tests
./scripts/test-all.sh
```

### CI/CD Pipeline

GitHub Actions automatically:

- Runs on push/PR to `main` and `develop` branches
- Tests on Node.js 18.x and 20.x
- Executes type checking, linting, and builds
- Performs security audits with `npm audit`
- Uploads build artifacts

---

## 🔐 Security

### Built-in Security Features

- **Helmet** - Sets security-related HTTP headers
- **CORS** - Configured for specific origins
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **Input Validation** - Server-side validation with Zod
- **SQL Injection Protection** - Prepared statements
- **XSS Protection** - Input sanitization

### Production Security Checklist

- [ ] Update `CORS_ORIGIN` to production domain
- [ ] Set `NODE_ENV=production`
- [ ] Review rate limit settings
- [ ] Enable HTTPS
- [ ] Regular security audits: `npm audit`
- [ ] Keep dependencies updated
- [ ] Backup database regularly

---

## 🎨 UI Components

### shadcn/ui-Inspired Components

- **Button** - Multiple variants (default, destructive, outline, ghost, link)
- **Card** - Container with header, content, footer sections
- **Input** - Form input with focus states
- **Badge** - Color-coded labels for priorities/categories
- **Checkbox** - Custom styled checkbox with check icon
- **Select** - Dropdown with chevron icon

### Theme Support

- **Light Mode** - Clean, professional appearance
- **Dark Mode** - Easy on the eyes for night work
- **System Default** - Respects OS preference
- **Theme Toggle** - Quick switch with animated icon

---

## 🚀 Deployment

### Recommended Platforms

1. **Vercel** - Zero-config Next.js deployment
2. **Railway** - Simple deployment with databases
3. **Fly.io** - Global deployment with SQLite support
4. **Docker** - Containerize for any platform

### Docker Example

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

---

## 📦 Database Management

### Backup Database

```bash
# Automated backup with timestamp
./scripts/db-backup.sh

# Keeps last 10 backups, auto-cleanup
# Backups stored in ./backups/
```

### Restore Backup

```bash
cp ./backups/tasks_backup_TIMESTAMP.db ./data/tasks.db
```

### Database Schema

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
  tags TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

**Indexes:**

- `idx_tasks_completed` - Fast completed/active filtering
- `idx_tasks_created_at` - Date sorting
- `idx_tasks_priority` - Priority filtering
- `idx_tasks_category` - Category filtering
- `idx_tasks_due_date` - Due date sorting

---

## 🎯 Roadmap

### Completed ✅

- [x] Modern UI with TailwindCSS
- [x] Dark mode support
- [x] Advanced task features (priority, category, due date, tags)
- [x] Search and filtering
- [x] Automation scripts
- [x] CI/CD pipeline
- [x] Database migrations

### Future Enhancements 🔮

- [ ] **Vitest** - Unit testing framework
- [ ] **Playwright** - E2E testing
- [ ] **TanStack Query** - Advanced data fetching and caching
- [ ] **React Hook Form** - Better form handling
- [ ] **Drizzle ORM** - Type-safe database queries
- [ ] **tRPC** - End-to-end type safety
- [ ] **Next.js 15** - Full-stack framework migration
- [ ] **Subtasks** - Nested checklist support
- [ ] **Recurring tasks** - Scheduled task creation
- [ ] **Task templates** - Quick task creation
- [ ] **Export/Import** - JSON, CSV, Markdown formats
- [ ] **Collaborative features** - Multi-user support
- [ ] **Mobile app** - React Native version

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`./scripts/test-all.sh`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

## 📄 License

This project is for educational and demonstration purposes.

---

## 🙏 Acknowledgments

- **shadcn/ui** for component design inspiration
- **TailwindCSS** for the utility-first CSS framework
- **Lucide** for beautiful icons
- **Better-sqlite3** for the excellent SQLite library

---

<div align="center">

**Built with ❤️ using modern web technologies**

[Report Bug](https://github.com/yourusername/task-manager-qa-app/issues) · [Request Feature](https://github.com/yourusername/task-manager-qa-app/issues)

</div>
