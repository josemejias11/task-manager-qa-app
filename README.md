# Task Manager QA App

A simple task manager with UI + API, built for QA automation demos.

## 🚀 Features

- Add/delete tasks (UI)
- REST API: `/api/tasks`
- Playwright tests (UI + API)
- Dockerized environment
- Allure reporting
- GitHub Actions CI workflow

## 🧰 Requirements

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/) (for local testing)
- [Allure CLI](https://docs.qameta.io/allure/) (optional, can use `npx`)

## 🧪 Test Execution

### Run All Tests in Docker with Allure
```bash
npm run test:docker-allure
```

This does the following:
- Builds Docker containers
- Starts the app and runs Playwright UI + API tests
- Generates and opens Allure report

### Run Tests Locally

```bash
npm install
npm start
# In another terminal
npm run test:allure
```

### API Tests Only
```bash
npx playwright test playwright/tests/api.spec.js
```

### UI Tests Only
```bash
npx playwright test playwright/tests/task.spec.js
```

## 📊 Allure Report

To generate manually:
```bash
npm run allure:generate
npm run allure:open
```

To clean old results:
```bash
rm -rf allure-results allure-report
```

## 🐳 Docker Usage

```bash
docker build -t task-manager-qa .
docker run -p 3000:3000 task-manager-qa
```

## 🧱 Folder Structure

```
.
├── server/               # Express backend
├── playwright/           # UI and API tests
│   └── tests/
├── Dockerfile
├── docker-compose-play.yaml
└── package.json
```

## ⚙️ GitHub Actions CI

GitHub workflow runs tests on push and PR to `main`. File: `.github/workflows/playwright-ci.yml`

It:
- Installs dependencies
- Installs Playwright browsers
- Runs Playwright with Allure reporter
- Generates Allure report

---
Created for QA automation practice.
