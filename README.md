# Task Manager QA App

A simple task manager application with both UI and REST API, built for QA automation testing and development practice.

---

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Testing](#testing)
  - [Run All Tests](#run-all-tests)
  - [CI Testing](#run-tests-with-continuous-integration)
  - [Allure Reporting](#run-tests-with-allure-reporting)
  - [Run API Tests Only](#run-api-tests-only)
  - [Run UI Tests Only](#run-ui-tests-only)
  - [Docker-based Testing](#run-tests-in-docker-with-allure)
- [Docker Usage](#docker-usage)
- [Project Structure](#project-structure)
- [GitHub Actions CI](#github-actions-ci)
- [Recent Improvements](#recent-improvements)

---

## Features

### Application Features

- Add, edit, and delete tasks through a web UI
- Mark tasks as completed
- Tasks are stored in a local JSON database
- Input validation (empty title, title length)
- Responsive and clean UI

### Technical Features

- REST API:
  - `GET /api/tasks` — Get all tasks
  - `POST /api/tasks` — Create a new task
  - `PATCH /api/tasks/:id` — Update task
  - `DELETE /api/tasks/:id` — Delete task
  - `DELETE /api/tasks` — Delete all tasks
- Express.js backend with CORS and error handling
- Allure reporting integration
- ESLint, Prettier for code style
- Dockerized environment
- Playwright tests (UI + API)
- GitHub Actions CI/CD

---

## Requirements

- [Node.js](https://nodejs.org/) v14 or higher
- [Docker](https://www.docker.com/) *(optional)*
- [Allure CLI](https://docs.qameta.io/allure/) *(optional, or use `npx`)*

---

## Installation

```bash
 git clone https://github.com/yourusername/task-manager-qa-app.git
 cd task-manager-qa-app
 npm install
```

---

## Usage

Start the application:

```bash
 npm start
```

Visit the app at [http://localhost:3000](http://localhost:3000)

---

## Development

Start with auto-reload:

```bash
 npm run dev
```

### Code Quality Tools

```bash
 npm run lint
 npm run lint:fix
 npm run format
```

---

## Testing

> Make sure the app is running before running tests (unless using `test:ci` or Docker).

### Run All Tests

Option 1: Manual

```bash
 # Terminal 1
npm start

 # Terminal 2
npm test
```

### Run Tests with Continuous Integration

```bash
 npm run test:ci
```

### Run Tests with Allure Reporting

```bash
 npm run test:allure
 npm run allure:generate
 npm run allure:open
```

### Run API Tests Only

```bash
 npx playwright test playwright/tests/api.spec.js
```

### Run UI Tests Only

```bash
 npx playwright test playwright/tests/task.spec.js
```

### Run Tests in Docker with Allure

```bash
 npm run test:docker-allure
```

This will:
- Build containers
- Run tests
- Generate and open Allure report

---

## Docker Usage

### Build and Run App

```bash
 docker build -t task-manager-qa .
 docker run -p 3000:3000 task-manager-qa
```

### Run Only the App (Detached Mode)

```bash
 docker compose -f docker-compose-play.yaml up -d app
```

---

## Project Structure

```
.
├── server/
│   └── server.js
├── playwright/
│   ├── playwright.config.js
│   └── tests/
│       ├── api.spec.js
│       └── task.spec.js
├── .eslintrc.js
├── .prettierrc.js
├── .gitignore
├── index.html
├── db.json     
├── Dockerfile
├── docker-compose-play.yaml
└── package.json
```

---

## GitHub Actions CI

Located at: `.github/workflows/playwright-ci.yml`

- Installs dependencies
- Installs Playwright
- Runs tests
- Generates Allure report

Runs on push/PR to `main` and `update-tests`.

---

## Recent Improvements

- Added ESLint + Prettier
- Added nodemon for dev auto-reload
- Refined error handling in API
- Improved CORS support
- Refactored duplicated code
- Enhanced README documentation

---

Built for QA practice and modern development workflows.
