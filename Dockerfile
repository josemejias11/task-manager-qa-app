FROM mcr.microsoft.com/playwright:v1.52.0-jammy

WORKDIR /app
COPY . .
RUN npm install
RUN npx playwright install --with-deps
RUN npm install -g allure-commandline --save-dev

CMD ["npx", "playwright", "test", "--headed", "--reporter=allure-playwright"]
