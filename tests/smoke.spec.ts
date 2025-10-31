import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Skip long animations so the UI renders in its final state immediately.
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test('landing hero greets Chief of Staff by default', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#hero-typed')).toHaveText(
    'Welcome, Commander. Confer with your Chief of Staff'
  );
});

test('view all agents popup opens and closes via Escape', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'View All Agents' }).click();

  const dialog = page.getByRole('dialog', { name: 'All Agents' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('Chief of Staff')).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});
