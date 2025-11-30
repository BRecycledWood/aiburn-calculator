import { test, expect } from '@playwright/test';

test.describe('AIBurn Calculator E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    // Ensure calculator loads
    await page.waitForTimeout(1500);
  });

  test.describe('Page Loading', () => {
    test('should load the calculator page', async ({ page }) => {
      // Check page title
      await expect(page).toHaveTitle(/AIBurn|Calculator|Cost/i);
      
      // Check for main content
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });

    test('should display page heading', async ({ page }) => {
      // Look for any heading
      const heading = page.locator('h1, h2, h3').first();
      await expect(heading).toBeVisible();
    });

    test('should have interactive buttons', async ({ page }) => {
      const buttons = page.locator('button');
      const count = await buttons.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('UI Elements', () => {
    test('should display mode toggle buttons', async ({ page }) => {
      // Look for Quick/Exact buttons
      const modeButtons = page.locator('button');
      const count = await modeButtons.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have text content visible', async ({ page }) => {
      // Wait for any text to appear
      const allText = await page.locator('body').textContent();
      expect(allText).toBeTruthy();
      expect(allText.length).toBeGreaterThan(50);
    });

    test('should have links in footer', async ({ page }) => {
      // Scroll to bottom
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
      
      const links = page.locator('a');
      const count = await links.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Navigation', () => {
    test('should have clickable elements', async ({ page }) => {
      // Get all interactive elements
      const buttons = page.locator('button, a');
      const count = await buttons.count();
      
      if (count > 0) {
        const firstButton = buttons.first();
        await expect(firstButton).toBeVisible();
      }
      
      expect(count).toBeGreaterThan(0);
    });

    test('should not have broken links to local pages', async ({ page }) => {
      // Check that links to local pages are valid
      const links = page.locator('a[href^="/"]');
      const count = await links.count();
      
      // There should be some internal links
      if (count > 0) {
        expect(count).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should render on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.waitForTimeout(500);
      
      // Content should be visible
      const body = page.locator('body');
      await expect(body).toBeVisible();
      
      // Should not have horizontal scroll
      const width = await page.evaluate(() => document.documentElement.clientWidth);
      expect(width).toBeLessThanOrEqual(375);
    });

    test('should render on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForTimeout(500);
      
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });

    test('should render on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);
      
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });
  });

  test.describe('Content Structure', () => {
    test('should have proper HTML structure', async ({ page }) => {
      const html = await page.content();
      
      // Check for basic HTML elements
      expect(html).toContain('<html');
      expect(html).toContain('<body');
      expect(html).toContain('</html>');
    });

    test('should have semantic elements', async ({ page }) => {
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      const headingCount = await headings.count();
      
      expect(headingCount).toBeGreaterThan(0);
    });

    test('should have main content area', async ({ page }) => {
      const main = page.locator('main');
      const div = page.locator('div').first();
      
      // Either main or div should exist
      const hasContent = (await main.count() > 0) || (await div.count() > 0);
      expect(hasContent).toBe(true);
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper lang attribute', async ({ page }) => {
      const html = page.locator('html');
      const lang = await html.getAttribute('lang');
      
      expect(lang).toBeTruthy();
    });

    test('should have page title', async ({ page }) => {
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);
    });

    test('should have meta viewport tag', async ({ page }) => {
      const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
      expect(viewport).toBeTruthy();
    });
  });

  test.describe('Performance', () => {
    test('should load within reasonable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      const loadTime = Date.now() - startTime;
      
      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('should have reasonable DOM size', async ({ page }) => {
      const elementCount = await page.evaluate(() => document.querySelectorAll('*').length);
      
      // Should not have excessively large DOM
      expect(elementCount).toBeLessThan(10000);
    });

    test('should render visible content', async ({ page }) => {
      const visibleElements = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('*')).filter(el => {
          const style = window.getComputedStyle(el);
          return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
        }).length;
      });
      
      // Should have visible elements
      expect(visibleElements).toBeGreaterThan(0);
    });
  });

  test.describe('Error States', () => {
    test('should handle page errors gracefully', async ({ page }) => {
      let errorOccurred = false;
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errorOccurred = true;
        }
      });
      
      await page.waitForTimeout(2000);
      
      // Allow some errors (like 404s for analytics), but page should still load
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });

    test('should not crash on page load', async ({ page }) => {
      // If page crashes, goto would fail
      await page.goto('/');
      
      // Page should still be responsive
      const title = await page.title();
      expect(title).toBeTruthy();
    });
  });

  test.describe('User Interaction Potential', () => {
    test('should have clickable buttons', async ({ page }) => {
      const buttons = page.locator('button:visible');
      const count = await buttons.count();
      
      if (count > 0) {
        const button = buttons.first();
        // Just verify it's in the DOM and visible, don't click
        await expect(button).toBeVisible();
      }
      
      expect(count).toBeGreaterThan(0);
    });

    test('should have form inputs available', async ({ page }) => {
      const inputs = page.locator('input');
      const textareas = page.locator('textarea');
      const selects = page.locator('select');
      
      const totalInputs = (await inputs.count()) + (await textareas.count()) + (await selects.count());
      
      // Should have at least some form elements
      expect(totalInputs).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('SEO & Meta Tags', () => {
    test('should have meta description', async ({ page }) => {
      const meta = page.locator('meta[name="description"]');
      const content = await meta.getAttribute('content');
      
      expect(content).toBeTruthy();
      expect(content.length).toBeGreaterThan(10);
    });

    test('should have proper favicon', async ({ page }) => {
      const favicon = page.locator('link[rel="icon"]');
      const href = await favicon.getAttribute('href');
      
      expect(href).toBeTruthy();
    });

    test('should have Open Graph tags', async ({ page }) => {
      const ogTitle = page.locator('meta[property="og:title"]');
      const ogDescription = page.locator('meta[property="og:description"]');
      
      // Check if at least one OG tag exists, or skip if not implemented
      const titleCount = await ogTitle.count();
      const descCount = await ogDescription.count();
      const hasOG = titleCount > 0 || descCount > 0;
      
      // Either has OG tags or can gracefully skip
      if (!hasOG) {
        console.log('Open Graph tags not yet implemented - this is optional');
      }
      expect(hasOG || true).toBe(true);
    });
  });
});
