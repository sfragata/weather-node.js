const { test, expect } = require('@playwright/test');

test.describe('Weather App Frontend', function () {

  test('should load the main page with React app', async function ({ page }) {
    await page.goto('/weather/index.html');
    await expect(page).toHaveTitle('Weather App');
    await expect(page.locator('#app')).toBeVisible();
    await expect(page.locator('h2')).toHaveText('City');
    await expect(page.locator('input#city')).toBeVisible();
    await expect(page.locator('input[type="submit"]')).toBeVisible();
    await expect(page.locator('input[type="submit"]')).toHaveValue('Send');
  });

  test('should have the city input field with placeholder', async function ({ page }) {
    await page.goto('/weather/index.html');
    const cityInput = page.locator('input#city');
    await expect(cityInput).toHaveAttribute('placeholder', 'enter a City');
    await expect(cityInput).toHaveAttribute('title', 'City');
  });

  test('should disable submit button when city is empty', async function ({ page }) {
    await page.goto('/weather/index.html');
    const submitButton = page.locator('input[type="submit"]');
    await expect(submitButton).toBeDisabled();
  });

  test('should enable submit button when city is entered', async function ({ page }) {
    await page.goto('/weather/index.html');
    await page.fill('input#city', 'London');
    const submitButton = page.locator('input[type="submit"]');
    await expect(submitButton).toBeEnabled();
  });

  test('should redirect root to weather page', async function ({ page }) {
    await page.goto('/');
    await expect(page).toHaveURL(/\/weather\/index\.html/);
  });

  test('should render Bootstrap CSS styles', async function ({ page }) {
    await page.goto('/weather/index.html');
    const btn = page.locator('input[type="submit"]');
    await expect(btn).toHaveClass(/btn-primary/);
  });

});
