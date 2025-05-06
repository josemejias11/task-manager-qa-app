# Task Manager QA App

A simple task manager with UI + API, built for QA automation demos.

## Features
- Add/delete tasks (UI)
- REST API: `/api/tasks`
- Playwright tests included
- Dockerized app

## Usage

### Run locally:
```bash
npm install
npm start
```

### Run tests:
```bash
npx playwright test
```

### Docker:
```bash
docker build -t task-manager-qa .
docker run -p 3000:3000 task-manager-qa
```
