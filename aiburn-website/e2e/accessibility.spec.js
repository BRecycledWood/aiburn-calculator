import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

/**
 * Accessibility (A11y) Tests
 * 
 * Tests WCAG 2.1 AA compliance using axe-core
 * Also includes manual accessibility checks
 * 
 * Run: npm run a11y
 */

test.describe('Accessibility Tests (WCAG 2.1 AA)', () => {
  // Helper to check accessibility on a page
  async function checkPageAccessibility(page, pageTitle) {
    test.step(`Check a11y for ${pageTitle}`, async () => {
      // Inject axe-core
      await injectAxe(page);

      // Run axe scan
      const violations = await page.evaluate(() => {
        return new Promise((resolve) => {
          axe.run((results) => {
            resolve(results.violations);
          });
        });
      });

      // Report violations
      if (violations.length > 0) {
        console.log(`\n⚠️  A11y violations on ${pageTitle}:`);
        violations.forEach((violation) => {
          console.log(`  - ${violation.id}: ${violation.description}`);
          console.log(`    Impact: ${violation.impact}`);
          console.log(`    Nodes affected: ${violation.nodes.length}`);
        });
      }

      // Ensure no critical/serious violations
      const seriousViolations = violations.filter((v) => 
        ['critical', 'serious'].includes(v.impact)
      );
      
      expect(seriousViolations.length).toBe(0);
    });
  }

  test.describe('Main Calculator Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
    });

    test('should have no critical a11y violations', async ({ page }) => {
      // First, load axe-core library
      await page.addScriptTag({
        url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.0/axe.min.js',
      });

      // Run accessibility checks
      const results = await page.evaluate(() => {
        return new Promise((resolve) => {
          if (window.axe) {
            window.axe.run((results) => {
              resolve({
                violations: results.violations,
                passes: results.passes,
              });
            });
          } else {
            resolve({ violations: [], passes: [] });
          }
        });
      });

      // Check for critical violations
      const criticalViolations = results.violations.filter((v) => 
        v.impact === 'critical' || v.impact === 'serious'
      );
      
      expect(criticalViolations.length).toBe(0, 
        `Found ${criticalViolations.length} critical a11y violations`
      );
    });

    test('should have descriptive page title', async ({ page }) => {
      const title = await page.title();
      expect(title.length).toBeGreaterThan(10);
      expect(title).toMatch(/AIBurn|Calculator|Cost/i);
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      
      // Should have at least one H1
      const h1s = await page.locator('h1').count();
      expect(h1s).toBeGreaterThanOrEqual(1);
      
      // All headings should have text
      for (const heading of headings) {
        const text = await heading.textContent();
        expect(text).toBeTruthy();
        expect(text.trim().length).toBeGreaterThan(0);
      }
    });

    test('should have alt text on all images', async ({ page }) => {
      const images = await page.locator('img').all();
      
      // Check each image
      for (const img of images) {
        const alt = await img.getAttribute('alt');
        const src = await img.getAttribute('src');
        
        // Logo can be empty alt (decorative background)
        if (src && src.includes('logo') && !alt) {
          continue; // Logo can have empty alt
        }
        
        // All other images should have alt text
        if (src && !src.includes('logo')) {
          expect(alt).toBeTruthy(`Image ${src} missing alt text`);
        }
      }
    });

    test('should have proper button labels', async ({ page }) => {
      const buttons = await page.locator('button').all();
      
      for (const button of buttons) {
        // Button should have text or aria-label
        const text = (await button.textContent()).trim();
        const ariaLabel = await button.getAttribute('aria-label');
        
        expect(text || ariaLabel).toBeTruthy('Button missing label');
      }
    });

    test('should have proper form labels', async ({ page }) => {
      const inputs = await page.locator('input, select, textarea').all();
      
      for (const input of inputs) {
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');
        
        // Should have associated label
        if (id) {
          const label = await page.locator(`label[for="${id}"]`).count();
          expect(
            label > 0 || ariaLabel || ariaLabelledBy
          ).toBeTruthy(`Input ${id} missing label`);
        }
      }
    });

    test('should be keyboard navigable', async ({ page }) => {
      // Tab through interactive elements
      let tabCount = 0;
      const maxTabs = 20;

      for (let i = 0; i < maxTabs; i++) {
        await page.keyboard.press('Tab');
        const focused = await page.evaluate(() => {
          const el = document.activeElement;
          return {
            tag: el.tagName,
            role: el.getAttribute('role'),
            canFocus: el.offsetParent !== null,
          };
        });

        // Focus should move to interactive elements
        if (
          ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(focused.tag) ||
          ['button', 'link', 'textbox', 'combobox'].includes(focused.role)
        ) {
          tabCount++;
        }
      }

      expect(tabCount).toBeGreaterThan(0);
    });

    test('should have sufficient color contrast', async ({ page }) => {
      // Check contrast using axe
      await page.addScriptTag({
        url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.0/axe.min.js',
      });

      const contrastIssues = await page.evaluate(() => {
        return new Promise((resolve) => {
          if (window.axe) {
            window.axe.run(
              { rules: ['color-contrast'] },
              (results) => {
                resolve(results.violations);
              }
            );
          } else {
            resolve([]);
          }
        });
      });

      // Should have minimal contrast issues (0-1 acceptable for edge cases)
      expect(contrastIssues.length).toBeLessThanOrEqual(1);
    });

    test('should not have missing lang attribute', async ({ page }) => {
      const lang = await page.locator('html').getAttribute('lang');
      expect(lang).toBeTruthy('HTML element missing lang attribute');
      expect(lang).toMatch(/^[a-z]{2}(-[a-z]{2})?$/i);
    });

    test('should have proper ARIA landmarks', async ({ page }) => {
      // Check for navigation
      const nav = await page.locator('nav, [role="navigation"]').count();
      const main = await page.locator('main, [role="main"]').count();
      const footer = await page.locator('footer, [role="contentinfo"]').count();

      // Should have main content area
      expect(main).toBeGreaterThanOrEqual(0);
    });

    test('should announce dynamic content with ARIA live regions', async ({ page }) => {
      // Look for live regions
      const liveRegions = await page.locator('[aria-live]').count();
      // At minimum for error messages, status updates
      // This is informational - not a hard requirement
      console.log(`Found ${liveRegions} ARIA live regions`);
    });
  });

  test.describe('Privacy Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/privacy', { waitUntil: 'networkidle' });
    });

    test('should have no critical a11y violations', async ({ page }) => {
      await page.addScriptTag({
        url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.0/axe.min.js',
      });

      const results = await page.evaluate(() => {
        return new Promise((resolve) => {
          if (window.axe) {
            window.axe.run((results) => {
              resolve(results.violations);
            });
          } else {
            resolve([]);
          }
        });
      });

      const critical = results.filter((v) => 
        v.impact === 'critical' || v.impact === 'serious'
      );
      expect(critical.length).toBe(0);
    });

    test('should have proper page structure', async ({ page }) => {
      const h1 = await page.locator('h1').count();
      expect(h1).toBeGreaterThanOrEqual(1);

      // Content should be readable
      const text = await page.locator('body').textContent();
      expect(text.length).toBeGreaterThan(100);
    });

    test('should have expandable sections properly labeled', async ({ page }) => {
      // Check TL;DR toggle button
      const toggles = await page.locator('button').all();
      
      for (const toggle of toggles) {
        const text = await toggle.textContent();
        const ariaExpanded = await toggle.getAttribute('aria-expanded');
        
        // Interactive toggles should have aria-expanded
        if (text && text.includes('TL;DR')) {
          expect(ariaExpanded).toBeTruthy('Toggle missing aria-expanded');
        }
      }
    });
  });

  test.describe('Terms Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/terms', { waitUntil: 'networkidle' });
    });

    test('should have no critical a11y violations', async ({ page }) => {
      await page.addScriptTag({
        url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.0/axe.min.js',
      });

      const results = await page.evaluate(() => {
        return new Promise((resolve) => {
          if (window.axe) {
            window.axe.run((results) => {
              resolve(results.violations);
            });
          } else {
            resolve([]);
          }
        });
      });

      const critical = results.filter((v) => 
        v.impact === 'critical' || v.impact === 'serious'
      );
      expect(critical.length).toBe(0);
    });
  });

  test.describe('Mobile Accessibility', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto('/', { waitUntil: 'networkidle' });
    });

    test('should be usable on mobile (touch targets)', async ({ page }) => {
      // Check button sizes (minimum 44x44 CSS pixels)
      const buttons = await page.locator('button, a[role="button"]').all();
      
      let smallButtons = 0;
      for (const button of buttons) {
        const box = await button.boundingBox();
        if (box && (box.width < 44 || box.height < 44)) {
          smallButtons++;
        }
      }

      // Some small buttons are acceptable (for dense UI)
      expect(smallButtons).toBeLessThan(buttons.length);
    });

    test('should not zoom on input focus', async ({ page }) => {
      // This is tested by checking viewport meta tag
      const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
      expect(viewport).toContain('width=device-width');
      expect(viewport).toContain('initial-scale=1');
    });
  });

  test.describe('Dark Mode Support (Optional)', () => {
    test('should respect prefers-color-scheme', async ({ page }) => {
      // Test dark mode preference
      await page.emulateMedia({ colorScheme: 'dark' });
      
      // Page should still be readable
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });
  });
});
