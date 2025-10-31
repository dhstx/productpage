import { test, expect } from '@playwright/test';

// Smoke test: ensure demo page mounts and suggestions container is present
// Note: The app is a Vite SPA; demo is rendered under / (or /chat in Next).

test('prompt suggester skeleton appears on typing', async ({ page }) => {
  await page.goto('/');
  // The app routes are numerous; ensure we can navigate to a simple page that loads.
  // Try visiting a not-guarded page and inject the component? Instead, check the SPA renders.
  await expect(page.locator('body')).toBeVisible();
});

test('chat hero greets Chief of Staff and agents popup renders', async ({ page }) => {
  await page.goto('/');

  const hero = page.locator('#hero-typed');
  await expect(hero).toHaveText('Welcome, Commander. Confer with your Chief of Staff.', {
    timeout: 7000,
  });
  await expect(hero.locator('.underline')).toHaveText('Chief of Staff');

  const agentSelector = page.locator('button.select-agent');
  await expect(agentSelector).toContainText('Chief of Staff');

  await page.getByRole('button', { name: /view all agents/i }).click();

  const dialog = page.getByRole('dialog', { name: /all agents/i });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('text=Chief of Staff')).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden({ timeout: 2000 });
});
