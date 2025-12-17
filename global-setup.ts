import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  // 1. Get the project configuration (FullConfig contains all project definitions)
  // We need to find the project that is currently being executed.
  const projects = config.projects;

  // We are assuming this setup only needs to run for one environment at a time
  // so we take the first project in the list that is running.
  const currentProject = projects[0]; 

  // 2. Extract the loginURL from the metadata we defined in playwright.config.ts
  const loginURL = currentProject.metadata.loginURL;
  const envName = currentProject.metadata.env; // e.g., 'dev'

  if (!loginURL) {
      console.error(`Login URL not defined for environment: ${envName}`);
      return;
  }
  
  console.log(`Starting global setup for ${envName}. Login URL: ${loginURL}`);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // 3. Use the dynamic login URL
  await page.goto(loginURL); 

  // ... rest of your login logic (fill credentials, click button)

  // 4. Save the storage state (ensure the path is unique if running different envs)
  await page.context().storageState({ path: `storageState-${envName}.json` });
  
  await browser.close();
}

export default globalSetup;