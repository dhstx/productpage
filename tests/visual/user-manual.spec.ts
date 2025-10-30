import { test, expect } from '@playwright/test'

// Prepare theme and SAFE MODE before app loads
async function primeStorage(page, theme: 'light' | 'dark', safeMode = true) {
  await page.addInitScript(({ theme, safeMode }) => {
    try {
      localStorage.setItem('NEXT_PUBLIC_HELP_SAFE_MODE', safeMode ? 'true' : 'false')
      localStorage.setItem('dhstx-theme', theme)
    } catch {}
    const doc = document.documentElement
    if (theme === 'dark') {
      doc.classList.add('dark')
    } else {
      doc.classList.remove('dark')
    }
    doc.setAttribute('data-theme', theme)
  }, { theme, safeMode })
}

function headerLocator(page) {
  // Same header as AdminLayout
  return page.locator('header').first()
}

test.describe('User Manual route', () => {
  test('loads content without overlays and preserves header style (light)', async ({ page }) => {
    await primeStorage(page, 'light', true) // Safe Mode ON for CI
    await page.goto('/user-manual')

    // Header should be visible and stable
    const header = headerLocator(page)
    await expect(header).toBeVisible()
    await expect(header).toHaveScreenshot('user-manual-header-light.png')

    // Page content should render
    await expect(page.getByRole('heading', { name: /user manual/i })).toBeVisible()

    // No full-screen overlay present by default
    const overlays = page.locator('[class*="fixed"][class*="inset-0"]')
    await expect(overlays).toHaveCount(0)
  })

  test('does not redirect away from /user-manual (safe mode)', async ({ page }) => {
    await primeStorage(page, 'dark', true) // Safe Mode ON
    await page.goto('/user-manual')

    // Stay on user-manual
    await expect(page).toHaveURL(/\/user-manual/)

    // Content visible
    await expect(page.getByRole('heading', { name: /user manual/i })).toBeVisible()
  })
})
