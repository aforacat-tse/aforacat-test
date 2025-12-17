import { defineConfig, devices } from '@playwright/test';

const ENV_CONFIG = {
  dev: {
    loginURL: 'http://dev-aforacat-keycloak.germanywestcentral.azurecontainer.io:8080/realms/gicar-ad-des/protocol/openid-connect/auth?response_type=code&client_id=gicar-client&scope=openid&redirect_uri=http%3A%2F%2Faforacat-des.germanywestcentral.cloudapp.azure.com%2Fseguretat%2Fapi%2Flogin',
    baseURL: 'http://aforacat-des.germanywestcentral.cloudapp.azure.com',
  },
  pre: {
    loginURL: 'https://preproduccio.autenticaciogicar5.extranet.gencat.cat/realms/gicar-ad/protocol/openid-connect/auth?response_type=code&client_id=aforacat-terri-internet&scope=openid&redirect_uri=https%3A%2F%2Fpreproduccio.aforacat.territori.gencat.cat%2Fseguretat%2Fapi%2Flogin',
    baseURL: 'https://preproduccio.aforacat.territori.gencat.cat',
  },
  prod: {
    loginURL: 'pending',
    baseURL: 'pending',
  },
};
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
projects: [
    // ----------------------------------------------------------------------
    // 🌐 DEV ENVIRONMENT (Chromium Only)
    // ----------------------------------------------------------------------    
    {
      name: 'dev-chromium',
      use: {
        baseURL: ENV_CONFIG.dev.baseURL,
        ...devices['Desktop Chrome'],
      },
      // This is how we pass the special login URL
      metadata: {
        loginURL: ENV_CONFIG.dev.loginURL,
        env: 'dev' // Optional: Pass the environment name as well
      },
      globalSetup: require.resolve('./global-setup'), 
    },    

    // ----------------------------------------------------------------------
    // 🌐 PRE-PROD ENVIRONMENT (All Browsers)
    // ----------------------------------------------------------------------
    {
      name: 'pre-chromium',
      use: {
        baseURL: ENV_URLS.pre, // Reference the variable
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'pre-firefox',
      use: {
        baseURL: ENV_URLS.pre, // Reference the variable
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'pre-webkit',
      use: {
        baseURL: ENV_URLS.pre, // Reference the variable
        ...devices['Desktop Safari'],
      },
    },
    
    // ----------------------------------------------------------------------
    // 🌐 PROD ENVIRONMENT (Optional: WebKit/Safari Only)
    // ----------------------------------------------------------------------
    {
      name: 'prod-webkit',
      use: {
        baseURL: ENV_URLS.prod, // Reference the variable
        ...devices['Desktop Safari'],
      },
    },
    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
