import { test, expect } from '@playwright/test'

test.describe('Portfolio', () => {
  test('home page loads and shows hero section', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=Rajesh')).toBeVisible()
    await expect(page.locator('text=AI Engineer')).toBeVisible()
  })

  test('navigation works', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Projects')
    await expect(page).toHaveURL(/.*projects/)
    await expect(page.locator('text=Mission Manifest')).toBeVisible()
  })

  test('all pages accessible', async ({ page }) => {
    const pages = ['/', '/about', '/projects', '/arsenal', '/journey', '/connect']
    for (const path of pages) {
      await page.goto(path)
      await expect(page.locator('footer')).toBeVisible()
    }
  })

  test('reduced motion respected', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    // Animations should be disabled
    const heroFloat = page.locator('.hero-float')
    await expect(heroFloat).toHaveCSS('animation', 'none')
  })
})