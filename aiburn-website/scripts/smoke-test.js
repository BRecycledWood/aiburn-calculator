#!/usr/bin/env node

/**
 * Smoke Test Script - Post-Deployment Validation
 * 
 * Validates that the production URL is reachable and key endpoints
 * return expected status codes and content.
 * 
 * Usage: node scripts/smoke-test.js [URL]
 * Example: node scripts/smoke-test.js https://aiburn.howstud.io
 */

import http from 'http';
import https from 'https';
import { URL } from 'url';

const baseURL = process.argv[2] || 'https://aiburn.howstud.io';

const tests = [
  {
    name: 'Home page loads (SPA)',
    path: '/',
    expectedStatus: 200,
    expectedContent: ['Calculator', 'AIBurn', 'token', 'React'],
  },
  {
    name: 'Advertise route loads (SPA)',
    path: '/advertise',
    expectedStatus: 200,
    expectedContent: ['Calculator', 'AIBurn'], // SPA returns same HTML for all routes
  },
  {
    name: 'Privacy route loads (SPA)',
    path: '/privacy',
    expectedStatus: 200,
    expectedContent: ['Calculator', 'AIBurn'],
  },
  {
    name: 'Terms route loads (SPA)',
    path: '/terms',
    expectedStatus: 200,
    expectedContent: ['Calculator', 'AIBurn'],
  },
  {
    name: 'Security headers present',
    path: '/',
    expectedStatus: 200,
    expectedHeaders: ['X-Content-Type-Options', 'X-Frame-Options', 'Referrer-Policy'],
  },
];

let passed = 0;
let failed = 0;

async function runSmokeTests() {
  console.log(`\n🚀 Running smoke tests against: ${baseURL}\n`);
  console.log('═'.repeat(60));

  for (const test of tests) {
    try {
      const result = await validateEndpoint(test);
      if (result.success) {
        console.log(`✅ ${test.name}`);
        passed++;
      } else {
        console.log(`❌ ${test.name}`);
        console.log(`   ${result.error}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name}`);
      console.log(`   Error: ${error.message}`);
      failed++;
    }
  }

  console.log('═'.repeat(60));
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

function validateEndpoint(test) {
  return new Promise((resolve) => {
    const url = new URL(baseURL + test.path);
    const isHttps = url.protocol === 'https:';
    const client = isHttps ? https : http;

    const req = client.get(url, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        const expectedStatusArray = Array.isArray(test.expectedStatus)
          ? test.expectedStatus
          : [test.expectedStatus];

        const statusOk = expectedStatusArray.includes(res.statusCode);

        if (!statusOk) {
          resolve({
            success: false,
            error: `Expected status ${test.expectedStatus}, got ${res.statusCode}`,
          });
          return;
        }

        // Check for expected headers
        if (test.expectedHeaders) {
          const missingHeaders = test.expectedHeaders.filter(
            (header) => !res.headers[header.toLowerCase()]
          );

          if (missingHeaders.length > 0) {
            resolve({
              success: false,
              error: `Missing security headers: ${missingHeaders.join(', ')}`,
            });
            return;
          }
        }

        if (test.expectedContent) {
          const contentOk = test.expectedContent.some((content) =>
            body.toLowerCase().includes(content.toLowerCase())
          );

          if (!contentOk) {
            resolve({
              success: false,
              error: `Expected content not found. Looking for one of: ${test.expectedContent.join(
                ', '
              )}`,
            });
            return;
          }
        }

        resolve({ success: true });
      });
    });

    req.on('error', (error) => {
      resolve({
        success: false,
        error: `Connection error: ${error.message}`,
      });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        success: false,
        error: 'Request timeout (10s)',
      });
    });
  });
}

// Run tests
runSmokeTests().catch((error) => {
  console.error('Smoke test failed:', error);
  process.exit(1);
});
