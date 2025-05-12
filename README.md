# Task Manager QA App

A simple task manager application with UI and API, built for QA automation testing and development practice.

## Features

### Application Features
- Add, edit, and delete tasks through a clean web interface
- Mark tasks as completed with a checkbox
- Tasks are stored in a local JSON database
- Proper validation (title length, empty values, etc.)
- Clean UI with responsive design

### Technical Features
- Complete REST API with proper validation
  - `GET /api/tasks` - Retrieve all tasks
  - `POST /api/tasks` - Create a new task
  - `DELETE /api/tasks/:id` - Delete a specific task
  - `PATCH /api/tasks/:id` - Update task title or completion status
  - `DELETE /api/tasks` - Delete all tasks
- Modern Express.js backend with proper error handling
- Cross-Origin Resource Sharing (CORS) support
- Comprehensive Playwright tests (UI + API)
- Code quality tools (ESLint, Prettier)
- Development mode with auto-reload
- Dockerized environment for consistent testing
- Allure reporting integration
- GitHub Actions CI workflow

## Requirements

- [Node.js](https://nodejs.org/) v14 or higher
- [Docker](https://www.docker.com/) (optional, for containerized testing)
- [Allure CLI](https://docs.qameta.io/allure/) (optional, can use `npx`)

## Installation and Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/task-manager-qa-app.git
   cd task-manager-qa-app
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the application
   ```bash
   npm start
   ```

4. Access the application at http://localhost:3000

## Development

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Code Quality Tools

Lint your code:
```bash
npm run lint
```

Fix linting issues automatically:
```bash
npm run lint:fix
```

Format code with Prettier:
```bash
npm run format
```

## Testing

> **Important**: The application server must be running for tests to work properly. When running tests manually, make sure to start the server first.

### Run All Tests
There are two ways to run tests:

#### Option 1: Start the server first, then run tests
```bash
# Terminal 1: Start the server
npm start

# Terminal 2: Run the tests
npm test
```

#### Option 2: Use the CI command that handles server startup
```bash
npm run test:ci
```

### Run Tests with Continuous Integration
The test:ci command starts the server, waits for it to be ready, and then runs the tests:

```bash
npm run test:ci
```

### Run Tests with Allure Reporting
Make sure the server is running first, then:
```bash
# Run tests with Allure reporter
npm run test:allure

# Generate and open the report
npm run allure:generate
npm run allure:open
```

### Run API Tests Only
Make sure the server is running first, then:
```bash
npx playwright test playwright/tests/api.spec.js
```

### Run UI Tests Only
Make sure the server is running first, then:
```bash
npx playwright test playwright/tests/task.spec.js
```

### Run Tests in Docker with Allure
This command handles the entire process in one step (no need to start the server separately):
```bash
npm run test:docker-allure
```

This does the following:
- Builds Docker containers
- Starts the app and runs Playwright UI + API tests
- Generates and opens Allure report

## Docker Usage

### Build and Run the Application
```bash
docker build -t task-manager-qa .
docker run -p 3000:3000 task-manager-qa
```

### Run Only the App Container (Detached Mode)
```bash
docker compose -f docker-compose-play.yaml up -d app
```

## Project Structure

```
.
├── server/               # Express backend
│   └── server.js         # Main server file with API endpoints
├── playwright/           # Test automation
│   ├── playwright.config.js
│   └── tests/            # Test files
│       ├── api.spec.js   # API tests
│       └── task.spec.js  # UI tests
├── .eslintrc.js          # ESLint configuration
├── .prettierrc.js        # Prettier configuration
├── .gitignore            # Git ignore rules
├── index.html            # Frontend application
├── db.json               # Local JSON database
├── Dockerfile            # Docker configuration
├── docker-compose-play.yaml
└── package.json          # Project dependencies and scripts
```

## GitHub Actions CI

GitHub workflow runs tests on push and PR to `main`. File: `.github/workflows/playwright-ci.yml`

It:
- Installs dependencies
- Installs Playwright browsers
- Runs Playwright with Allure reporter
- Generates Allure report

## Recent Improvements

- **Code Quality**: Added ESLint and Prettier for consistent code style and quality
- **Developer Experience**: Added nodemon for auto-reloading during development
- **API Enhancements**: Improved error handling and validation in the API
- **Cross-Origin Support**: Added CORS middleware for better API accessibility
- **Codebase Refactoring**: Reduced code duplication with utility functions
- **Documentation**: Enhanced README with comprehensive information

---
Created for QA automation practice and development training.
