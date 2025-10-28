import { test, expect } from '@playwright/test'

const AUTH_KEY = 'dhstx_auth'

// Prepare auth + theme BEFORE app loads
async function primeStorage(page, theme: 'light' | 'dark') {
  await page.addInitScript(({ key, theme }) => {
    try {
      localStorage.setItem(key, JSON.stringify({ id: '1', email: 'qa@dhstx.com', name: 'QA' }))
      localStorage.setItem('dhstx-theme', theme)
    } catch {}
    const doc = document.documentElement
    if (theme === 'dark') {
      doc.classList.add('dark')
    } else {
      doc.classList.remove('dark')
    }
    doc.setAttribute('data-theme', theme)
  }, { key: AUTH_KEY, theme })
}

async function gotoTeam(page) {
  await page.goto('/team')
  await page.waitForSelector('section:has-text("TEAM MEMBERS")')
}

test.describe('Team Members card - iOS Safari visual', () => {
  test('mobile light mode card screenshot (webkit iPhone)', async ({ page }) => {
    await primeStorage(page, 'light')
    await gotoTeam(page)

    const card = page.locator('article.tm-card').first()
    await expect(card).toBeVisible()
    await expect(card).toHaveCSS('background-color', 'rgb(255, 255, 255)')

    // Capture card screenshot for visual reference
    await expect(card).toHaveScreenshot('team-card-light-ios.png')

    // Verify focus outline appears on Change Role
    const changeRole = page.getByRole('button', { name: /change role/i }).first()
    await changeRole.focus()
    const outlineWidth = await changeRole.evaluate((el) => getComputedStyle(el).outlineWidth)
    expect(outlineWidth).not.toBe('0px')
  })

  test('mobile dark mode card screenshot (webkit iPhone)', async ({ page }) => {
    await primeStorage(page, 'dark')
    await gotoTeam(page)

    const card = page.locator('article.tm-card').first()
    await expect(card).toBeVisible()

    await expect(card).toHaveScreenshot('team-card-dark-ios.png')
  })
})
