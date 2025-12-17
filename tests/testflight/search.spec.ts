import { test, expect } from '@playwright/test';

test('should search for playwright and verify the title', async ({ page }) => {
  // 1. Navigate to the Google homepage
  await page.goto('https://www.google.com');

  // 2. Accept cookies if the consent banner appears (common step for Google)
  // This locator targets a common 'Accept all' button on Google's consent page

  await test.step('2. Handle the Cookie Consent Banner', async () => {
      // Look for both 'Accept all' (English) OR 'Aceptar todo' (Spanish)
      const acceptButton = page.getByRole('button', { name: /Accept all|Aceptar todo/i });
      if (await acceptButton.isVisible()) {
        await acceptButton.click();
      }
  });

  await test.step('3. Locate the Search Box and Search', async () => {
      // This locator targets the search input by its stable, language-neutral 'name' attribute
      const searchInput = page.locator('textarea[name="q"]');
    
      // Playwright automatically waits for this element to be visible before filling.
      await searchInput.fill('Playwright documentation');

      await page.keyboard.press('Enter');
  });


  // 5. Verify the results page title contains the search term
  await expect(page).toHaveTitle(/Playwright documentation/);

  // Optional: Take a screenshot to confirm the result
  await page.screenshot({ path: 'screenshot-search-result.png' });
});