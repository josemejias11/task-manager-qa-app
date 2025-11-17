# Task Manager Pro

A **production-ready** task manager application with a modern minimalist UI, built with **React 19**, **TypeScript**, **TailwindCSS**, **Node.js**, **Express**, and **SQLite**. Features advanced task management, real-time search, dark mode, comprehensive automation scripts, and CI/CD pipeline.

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)

</div>

---

## Features

### Task Management

- **Create, edit, and delete tasks** with comprehensive details
- **Priority levels** - Low, Medium, High, Urgent with color coding
- **Categories** - Work, Personal, Shopping, Health, Other
- **Due dates** with overdue warnings and visual indicators
- **Task descriptions** - Add detailed notes up to 500 characters
- **Tag system** - Organize with custom tags
- **Inline editing** with keyboard shortcuts (Enter/Escape)
- **Bulk operations** - Clear completed, delete all tasks

### Search & Filtering

- **Real-time search** - Instant search across titles, descriptions, and tags
- **Advanced filtering** - Filter by status, priority, and category
- **Flexible sorting** - Sort by date, priority, title, or due date
- **Multi-criteria filtering** - Combine multiple filters simultaneously

### Dashboard & Analytics

- **Live statistics** - Total, active, completed, and overdue tasks
- **Progress tracking** - Visual progress bar with completion percentage
- **Urgent task alerts** - Highlighted warnings for urgent items
- **Color-coded metrics** - Visual task completion insights

### Modern UI/UX

- **Green minimalist design** - Clean, professional appearance with soft color palette
- **Dark mode support** - System-aware theme with manual toggle
- **Fully responsive** - Mobile-first design for all screen sizes
- **Smooth animations** - Toast notifications and micro-interactions
- **Color-coded badges** - Priorities and categories clearly identified
- **Loading states** - Elegant feedback for all operations
- **Empty state messaging** - User-friendly guidance

### Technical Features

- **TypeScript** - Full type safety across frontend and backend
- **React 19** - Modern component-based architecture
- **TailwindCSS** - Utility-first styling with custom design system
- **Vite 7** - Lightning-fast HMR and optimized builds
- **SQLite** - Zero-config embedded database with auto-migrations
- **Express.js** - RESTful API with layered architecture
- **Zod** - Runtime validation with TypeScript inference
- **Security** - Helmet, CORS, rate limiting, SQL injection protection
- **Code Quality** - ESLint 9, Prettier for consistent formatting

### Automation & DevOps

- **GitHub Actions CI/CD** - Automated testing and builds
- **Development setup script** - One-command environment setup
- **Database backup utility** - Automated SQLite backups
- **Test automation** - Type checking, linting, builds
- **Production build optimization** - Automated clean builds

---

## Technology Stack

### Frontend

- **React 19** - Latest React with TypeScript and hooks
- **TailwindCSS 3.4** - Modern utility-first styling
- **Vite 7** - Fast development server and build tool
- **Lucide React 0.553** - Icon library
- **date-fns 4.1** - Date formatting utilities
- **class-variance-authority 0.7** - Component variant management
- **clsx 2.1** & **tailwind-merge 3.4** - Utility class composition

**Component Architecture:**
- shadcn/ui-inspired design patterns
- 15+ reusable components (Button, Card, Input, Badge, Checkbox, Select, Toast, etc.)
- Optimistic UI updates for responsive user experience

### Backend

- **Node.js** - JavaScript runtime
- **Express 4.18** - Web application framework
- **TypeScript 5.9** - Type-safe backend development
- **better-sqlite3 12.4** - Synchronous SQLite3 bindings
- **Zod 4.1** - Schema validation and type inference
- **uuid 11.1** - Unique identifier generation

**Architecture:**
- Layered pattern: Routes → Controllers → Services → Database
- Prepared statements for SQL injection protection
- Auto-migration system for schema updates
- Database indexing for performance

### Security

- **Helmet 8.1** - Security HTTP headers
- **CORS 2.8** - Cross-origin resource sharing
- **express-rate-limit 8.2** - API rate limiting (100 req/15min)
- **compression 1.8** - Response compression
- Input validation with Zod schemas

### Development Tools

- **TypeScript 5.9** - Strict mode enabled
- **ESLint 9** - Flat config with TypeScript support
- **Prettier 3.4** - Consistent code formatting
- **Concurrently 9.2** - Run multiple dev servers
- **tsx 4.20** - Fast TypeScript execution
- **Autoprefixer 10.4** - CSS vendor prefixing
- **PostCSS 8.5** - CSS transformation

---

## Requirements

- **Node.js** v18.0.0 or higher
- **npm** (comes with Node.js)

**No additional database installation required** - SQLite is embedded and auto-configured.

---

## Installation

### Quick Start (Automated)

```bash
# Clone repository
git clone https://github.com/josemejias11/task-manager-qa-app.git
cd task-manager-qa-app

# Run automated setup script
./scripts/dev-setup.sh
```

The setup script will:
- Verify Node.js version (≥18)
- Install all dependencies
- Create `.env` configuration file
- Run type checking and linting
- Build the project

### Manual Installation

```bash
# Clone repository
git clone https://github.com/josemejias11/task-manager-qa-app.git
cd task-manager-qa-app

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development servers
npm run dev
```

---

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

#### Available Configuration Options

```env
# Server Configuration
PORT=3001                           # Backend API server port
NODE_ENV=development                # Environment: development, production, or test

# Database Configuration (optional)
# DB_PATH=./data/tasks.db           # Custom SQLite database path

# CORS Configuration
CORS_ORIGIN=http://localhost:3000  # Allowed frontend origin
```

#### Environment Variables Reference

| Variable      | Description                          | Default                 | Required |
| ------------- | ------------------------------------ | ----------------------- | -------- |
| `PORT`        | Backend server port                  | `3001`                  | No       |
| `NODE_ENV`    | Node environment mode                | `development`           | No       |
| `DB_PATH`     | SQLite database file path            | `dist/data/tasks.db`    | No       |
| `CORS_ORIGIN` | Allowed frontend origin              | `http://localhost:3000` | No       |

### Development vs Production

**Development Mode:**
- Backend API: `http://localhost:3001`
- Frontend Dev Server: `http://localhost:3000` (Vite HMR)
- Hot reload enabled for both frontend and backend
- Detailed logging and error messages
- Source maps enabled

**Production Mode:**
- Single server serves both API and static frontend
- Set `NODE_ENV=production`
- Optimized builds with compression and minification
- Security headers enabled (Helmet)
- Rate limiting: 100 requests per 15 minutes per IP
- Error messages sanitized

### Database Configuration

SQLite database is automatically created on first run with the following features:

- **Auto-creation** - Database file and directory created automatically
- **Schema** - Tasks table with priority, category, tags, due dates
- **Indexes** - Optimized for queries on completed, created_at, priority, category, due_date
- **Auto-migration** - Existing databases automatically migrated to latest schema
- **Backup** - Use `./scripts/db-backup.sh` for backups (saved to `data/backups/`)

### Security Configuration

Built-in security features are enabled by default:

- **Helmet** - Sets security HTTP headers for XSS and clickjacking protection
- **CORS** - Configurable cross-origin resource sharing
- **Rate Limiting** - 100 requests per IP per 15 minutes on `/api/*` endpoints
- **SQL Injection Protection** - All queries use prepared statements
- **Input Validation** - Zod schemas validate all incoming data
- **Password-less** - No authentication required (single-user application)

### Configuration Files

- **tsconfig.json** - Backend TypeScript configuration (strict mode)
- **src/client/tsconfig.json** - Frontend TypeScript configuration
- **vite.config.ts** - Vite bundler settings and dev server proxy
- **tailwind.config.js** - TailwindCSS theme and color scheme
- **eslint.config.js** - ESLint flat config with TypeScript rules
- **.prettierrc.json** - Code formatting rules
- **postcss.config.js** - PostCSS with Autoprefixer and TailwindCSS

---

## Running the Application

### Development Mode

Start both frontend and backend servers:

```bash
npm run dev
```

This starts:
- Backend API on `http://localhost:3001` (hot reload with tsx)
- Frontend on `http://localhost:3000` (Vite HMR)
- SQLite database auto-initialized

### Individual Commands

```bash
# Backend only (API server)
npm run dev:server

# Frontend only (Vite dev server)
npm run dev:client

# Type checking (both frontend and backend)
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Code formatting
npm run format
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

Build output:
- `dist/server/` - Compiled TypeScript backend
- `dist/client/` - Optimized frontend bundle (minified, tree-shaken)
- `dist/data/tasks.db` - SQLite database (created on first run)

### Automation Scripts

```bash
# Complete development setup
./scripts/dev-setup.sh

# Run all quality checks (type-check, lint, build)
./scripts/test-all.sh

# Backup database with timestamp
./scripts/db-backup.sh

# Production build (clean + quality checks + build)
./scripts/build-prod.sh
```

---

## Project Structure

```
task-manager-qa-app/
├── src/
│   ├── server/                       # Backend (Node.js + Express + SQLite)
│   │   ├── config/
│   │   │   └── database.ts          # SQLite setup, migrations, indexes
│   │   ├── controllers/
│   │   │   └── task.controller.ts   # HTTP request handlers
│   │   ├── middleware/
│   │   │   ├── error.middleware.ts  # Error handling
│   │   │   └── validation.middleware.ts # Zod validation
│   │   ├── routes/
│   │   │   └── task.routes.ts       # API route definitions
│   │   ├── services/
│   │   │   └── task.service.ts      # Business logic + DB queries
│   │   ├── types/
│   │   │   └── task.types.ts        # Zod schemas + TypeScript types
│   │   └── server.ts                # Express app entry point
│   │
│   └── client/                       # Frontend (React + TypeScript + TailwindCSS)
│       ├── src/
│       │   ├── components/
│       │   │   ├── ui/              # Reusable UI primitives
│       │   │   │   ├── button.tsx   # Button with variants
│       │   │   │   ├── card.tsx     # Card container components
│       │   │   │   ├── input.tsx    # Form input
│       │   │   │   ├── badge.tsx    # Priority/category labels
│       │   │   │   ├── checkbox.tsx # Custom checkbox
│       │   │   │   └── select.tsx   # Dropdown select
│       │   │   ├── theme-provider.tsx # Dark mode context
│       │   │   ├── theme-toggle.tsx   # Theme switcher button
│       │   │   ├── TaskForm.tsx       # Task creation form
│       │   │   ├── TaskItem.tsx       # Individual task card
│       │   │   ├── TaskStats.tsx      # Analytics dashboard
│       │   │   ├── SearchAndFilter.tsx # Search + filter UI
│       │   │   ├── Toast.tsx          # Toast notification
│       │   │   └── ToastContainer.tsx # Toast manager
│       │   ├── services/
│       │   │   └── api.ts           # API client for backend
│       │   ├── styles/
│       │   │   └── index.css        # TailwindCSS + custom styles
│       │   ├── types/
│       │   │   └── task.ts          # Frontend TypeScript types
│       │   ├── lib/
│       │   │   └── utils.ts         # Utility functions (cn)
│       │   ├── App.tsx              # Main application component
│       │   └── main.tsx             # React entry point
│       ├── index.html
│       └── tsconfig.json
│
├── scripts/                          # Automation scripts
│   ├── dev-setup.sh                 # Development setup automation
│   ├── test-all.sh                  # Quality checks (type-check, lint, build)
│   ├── db-backup.sh                 # Database backup utility
│   └── build-prod.sh                # Production build script
│
├── .github/
│   └── workflows/
│       └── ci.yml                   # GitHub Actions CI/CD pipeline
│
├── dist/                            # Build output (gitignored)
├── .env.example                     # Environment template
├── .env                             # Local environment (gitignored)
├── eslint.config.js                 # ESLint flat configuration
├── tailwind.config.js               # TailwindCSS theme config
├── postcss.config.js                # PostCSS configuration
├── vite.config.ts                   # Vite bundler config
├── tsconfig.json                    # Backend TypeScript config
├── package.json                     # Dependencies and scripts
├── CLAUDE.md                        # AI assistant development guide
└── README.md                        # This file
```

---

## API Documentation

### Base URL

```
Development: http://localhost:3001/api
Production:  <your-domain>/api
```

### Endpoints

#### Get All Tasks

```http
GET /api/tasks
```

**Response:** `200 OK`

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
POST /api/tasks
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "New task",
  "description": "Optional description",
  "priority": "medium",
  "category": "personal",
  "dueDate": "2024-12-01T00:00:00.000Z",
  "tags": ["tag1", "tag2"]
}
```

**Validation Rules:**

- `title`: Required, 1-100 characters (trimmed)
- `description`: Optional, max 500 characters
- `priority`: Optional, one of: `low`, `medium`, `high`, `urgent` (default: `medium`)
- `category`: Optional, one of: `work`, `personal`, `shopping`, `health`, `other` (default: `personal`)
- `dueDate`: Optional, ISO 8601 datetime string
- `tags`: Optional, array of strings

**Response:** `201 Created`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "New task",
  "description": "Optional description",
  "completed": false,
  "priority": "medium",
  "category": "personal",
  "dueDate": "2024-12-01T00:00:00.000Z",
  "tags": ["tag1", "tag2"],
  "createdAt": "2024-11-15T10:00:00.000Z",
  "updatedAt": "2024-11-15T10:00:00.000Z"
}
```

#### Update Task

```http
PATCH /api/tasks/:id
Content-Type: application/json
```

**Request Body:** (all fields optional, at least one required)

```json
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

**Response:** `200 OK`

#### Delete Task

```http
DELETE /api/tasks/:id
```

**Response:** `204 No Content`

#### Delete All Tasks

```http
DELETE /api/tasks
```

**Response:** `204 No Content`

### Error Responses

All errors return JSON with an error message:

```json
{
  "error": "Error message description"
}
```

**HTTP Status Codes:**

- `200` - OK (successful GET/PATCH)
- `201` - Created (successful POST)
- `204` - No Content (successful DELETE)
- `400` - Bad Request (validation error)
- `404` - Not Found (task ID doesn't exist)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

---

## Code Quality & Testing

### Quality Assurance Tools

```bash
# Run all quality checks
./scripts/test-all.sh

# Individual checks
npm run type-check    # TypeScript compilation (no emit)
npm run lint          # ESLint
npm run lint:fix      # ESLint with auto-fix
npm run format        # Prettier formatting
npm run build         # Production build
```

### CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`) automatically:

- Triggers on push/PR to `main` and `develop` branches
- Tests on Node.js 18.x and 20.x
- Runs type checking for both frontend and backend
- Runs ESLint with configured rules
- Builds production bundle
- Performs security audit with `npm audit`
- Uploads build artifacts (Node.js 20.x only)

### Code Standards

- **TypeScript Strict Mode** - Enabled on both frontend and backend
- **ESLint 9** - Flat config with TypeScript plugin
- **Prettier** - Consistent formatting (single quotes, 100 print width, trailing commas)
- **Zero `any` Types** - Full type coverage throughout codebase
- **Prepared Statements** - All database queries use parameterized queries

---

## Design System

### Color Palette

The application uses a **green minimalist color scheme** with the following palette:

**Primary Colors:**
- Light Green: `#A8E6CF` - Primary actions and success states
- Soft Green: `#DCEDC8` - Backgrounds and subtle highlights
- Mint Green: `#C8E6C9` - Hover states

**Neutrals:**
- Light Gray: `#F5F5F5` - Main background
- Medium Gray: `#9E9E9E` - Secondary text and borders
- Dark Gray: `#424242` - Primary text and headings
- Off-White: `#FAFAFA` - Card backgrounds

**Accents:**
- Soft Purple: `#B39DDB` - Highlights and call-to-action elements
- Deep Purple: `#7E57C2` - Active states and important elements

### Design Principles

- **8px Grid System** - Consistent spacing using multiples of 8px
- **Modern Typography** - Clean sans-serif fonts with clear hierarchy
- **Subtle Shadows** - Depth without distraction
- **Rounded Corners** - 4-8px border-radius for modern feel
- **Smooth Transitions** - 200-300ms for state changes
- **Ample Whitespace** - Clean, breathing layouts
- **Color-Coded UI** - Visual distinction for priorities and categories

### Theme Support

- **Light Mode** - Clean, professional appearance with soft greens
- **Dark Mode** - Adjusted colors for comfortable night viewing
- **System Default** - Automatically respects OS theme preference
- **Theme Toggle** - Quick switching with persistent localStorage

### UI Components

All components follow shadcn/ui design patterns:

- **Button** - 6 variants (default, destructive, outline, secondary, ghost, link), 4 sizes
- **Card** - Container with header, title, description, content, footer
- **Input** - Styled form input with focus states
- **Badge** - 7 variants (default, secondary, destructive, outline, success, warning, info)
- **Checkbox** - Custom styled with check icon
- **Select** - Dropdown with chevron icon
- **Toast** - Modern notification cards with icons and close button

---

## Database Management

### Database Schema

SQLite database with the following structure:

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

### Performance Indexes

```sql
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_category ON tasks(category);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
```

### Backup and Restore

**Create Backup:**

```bash
# Automated backup with timestamp
./scripts/db-backup.sh

# Manual backup
cp dist/data/tasks.db data/backups/tasks_backup_$(date +%Y%m%d_%H%M%S).db
```

Backups are stored in `data/backups/` directory. The automated script keeps the last 10 backups and auto-cleans older files.

**Restore Backup:**

```bash
# Replace current database with backup
cp data/backups/tasks_backup_TIMESTAMP.db dist/data/tasks.db

# Restart the server
npm run dev
```

---

## Security

### Built-in Security Features

- **Helmet** - Sets security-related HTTP headers
  - XSS protection
  - Clickjacking prevention
  - MIME type sniffing protection
  - Referrer policy

- **CORS** - Configurable cross-origin resource sharing
  - Restricted to configured origins
  - Credentials support

- **Rate Limiting** - Prevents abuse
  - 100 requests per 15 minutes per IP
  - Applied to all `/api/*` endpoints

- **Input Validation** - Server-side validation
  - Zod schema validation
  - Type checking at runtime
  - String trimming and sanitization

- **SQL Injection Protection**
  - All queries use prepared statements
  - Parameterized queries only
  - No string concatenation

- **Error Handling**
  - Generic error messages in production
  - Detailed errors only in development
  - No stack traces exposed to clients

### Production Security Checklist

Before deploying to production:

- [ ] Update `CORS_ORIGIN` to production domain in `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Review and adjust rate limit settings if needed
- [ ] Enable HTTPS (required for production)
- [ ] Run security audit: `npm audit`
- [ ] Keep dependencies updated regularly
- [ ] Set up automated database backups
- [ ] Configure firewall rules for port access
- [ ] Review Helmet CSP settings in `server.ts`

---

## Deployment

### Production Build

```bash
# Clean build with quality checks
./scripts/build-prod.sh

# Or manually
npm run build
npm start
```

### Recommended Platforms

- **Railway** - Simple deployment with automatic HTTPS
- **Fly.io** - Global deployment with SQLite support
- **Render** - Free tier available, automatic deployments
- **DigitalOcean App Platform** - Managed container platform
- **Docker** - Containerize for any platform

### Docker Deployment

Example `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source files
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3001

# Start production server
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t task-manager-pro .
docker run -p 3001:3001 -v $(pwd)/data:/app/dist/data task-manager-pro
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run quality checks (`./scripts/test-all.sh`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

**Code Standards:**
- Maintain TypeScript strict mode
- Follow existing code style (enforced by Prettier and ESLint)
- Add type definitions for all new code
- Use prepared statements for database queries
- Write clear commit messages

---

## License

This project is for educational and demonstration purposes.

---

## Acknowledgments

- **shadcn/ui** - Component design inspiration
- **TailwindCSS** - Utility-first CSS framework
- **Lucide** - Beautiful icon library
- **better-sqlite3** - Excellent synchronous SQLite library
- **Zod** - Type-safe schema validation

---

<div align="center">

**Built with modern web technologies**

</div>
