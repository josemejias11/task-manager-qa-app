# Task Manager QA App

A modern, production-ready task manager application built with React, TypeScript, Node.js, Express, and MongoDB. Features a clean architecture with proper separation of concerns, type safety, and comprehensive development tooling.

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

### Technical Features

- ✅ **TypeScript** - Full type safety across frontend and backend
- ✅ **React 19** - Modern component-based UI
- ✅ **Vite** - Lightning-fast build tool with HMR
- ✅ **MongoDB** - NoSQL database with Mongoose ODM
- ✅ **Express.js** - RESTful API with middleware architecture
- ✅ **Zod** - Runtime validation with TypeScript inference
- ✅ **Security** - Helmet, CORS, rate limiting
- ✅ **Code Quality** - ESLint, Prettier, Husky, lint-staged
- ✅ **Performance** - Compression, optimistic updates

---

## Technology Stack

### Frontend

- **React 19** with TypeScript
- **Vite** for build tooling
- **Bootstrap 5** for styling
- Component-based architecture
- Custom hooks and services

### Backend

- **Node.js** with TypeScript
- **Express.js** web framework
- **MongoDB** with Mongoose
- **Zod** for validation
- Layered architecture (routes, controllers, services, models)

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
- [MongoDB](https://www.mongodb.com/try/download/community) v4.4 or higher
- npm or yarn package manager

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

Edit `.env` file with your configuration (see [Configuration](#configuration) section).

4. **Start MongoDB:**

```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env with your Atlas connection string
```

---

## Configuration

Create a `.env` file in the root directory (use `.env.example` as template):

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/task-manager

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Environment Variables

| Variable      | Description                          | Default                                |
| ------------- | ------------------------------------ | -------------------------------------- |
| `PORT`        | Backend server port                  | 3001                                   |
| `NODE_ENV`    | Environment (development/production) | development                            |
| `MONGODB_URI` | MongoDB connection string            | mongodb://localhost:27017/task-manager |
| `CORS_ORIGIN` | Allowed frontend origin for CORS     | http://localhost:3000                  |

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

### Start Production Server

```bash
npm start
```

The production server:

- Serves the API on the configured PORT
- Serves the built React app for all non-API routes
- Uses MongoDB for data persistence

---

## Project Structure

```
task-manager-qa-app/
├── src/
│   ├── server/                 # Backend (TypeScript)
│   │   ├── config/            # Configuration files
│   │   │   └── database.ts    # MongoDB connection
│   │   ├── controllers/       # Request handlers
│   │   │   └── task.controller.ts
│   │   ├── middleware/        # Express middleware
│   │   │   ├── error.middleware.ts
│   │   │   └── validation.middleware.ts
│   │   ├── models/            # Mongoose models
│   │   │   └── task.model.ts
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
├── .husky/                    # Git hooks
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── eslint.config.js          # ESLint configuration
├── package.json              # Dependencies and scripts
├── prettier.config.js        # Prettier configuration
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
    "id": "507f1f77bcf86cd799439011",
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
- ✅ **MongoDB** - Professional database replacing JSON file storage
- ✅ **Layered Architecture** - Proper separation: routes → controllers → services → models
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

### Code Organization

- ✅ **Component-based UI** - Reusable React components
- ✅ **Service Layer** - Business logic separated from controllers
- ✅ **Middleware** - Reusable validation and error handling
- ✅ **Type Definitions** - Centralized TypeScript types

---

## Security

This application includes several security best practices:

- **Helmet** - Sets security-related HTTP headers
- **CORS** - Configured for specific origins
- **Rate Limiting** - Prevents API abuse
- **Input Validation** - Server-side validation with Zod
- **MongoDB Injection Protection** - Mongoose sanitization

For production deployment, ensure:

- Update `CORS_ORIGIN` to your production domain
- Use strong MongoDB credentials
- Enable HTTPS
- Set `NODE_ENV=production`
- Review and update rate limit settings

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

Built for modern development workflows with TypeScript, React, and MongoDB.
