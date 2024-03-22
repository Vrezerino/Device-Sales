import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    supportFile: '__tests__/e2e/cypress/support/e2e.{js,jsx,ts,tsx}',
    specPattern: '__tests__/e2e/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:3000',
  }
});
