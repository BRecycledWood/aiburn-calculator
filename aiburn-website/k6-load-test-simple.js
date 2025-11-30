/**
 * Simple K6 Load Testing Script for AIBurn Calculator
 * 
 * Usage:
 *   k6 run k6-load-test-simple.js
 *   k6 run k6-load-test-simple.js --vus 100 --duration 2m
 *   k6 run k6-load-test-simple.js -e BASE_URL=https://aiburn.howstud.io
 * 
 * Prerequisites:
 *   brew install k6  # macOS
 *   sudo apt-get install k6  # Linux
 *   Or use Docker: docker run -i grafana/k6 run - < k6-load-test-simple.js
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const pageLoadTime = new Trend('page_load_time');
const apiResponseTime = new Trend('api_response_time');
const totalRequests = new Counter('total_requests');

// Configuration
const BASE_URL = __ENV.BASE_URL || 'https://aiburn.howstud.io';

// Test scenarios and thresholds
export const options = {
  stages: [
    { duration: '10s', target: 10 },   // Ramp up to 10 users
    { duration: '30s', target: 50 },   // Ramp up to 50 users
    { duration: '20s', target: 50 },   // Stay at 50 users
    { duration: '10s', target: 0 },    // Ramp down
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500', 'p(99)<1000'],  // 95% under 500ms, 99% under 1s
    'http_req_failed': ['rate<0.1'],                    // <10% failures
    'errors': ['rate<0.05'],                             // <5% errors
  },
};

export default function () {
  // Test 1: Load main page
  group('Home Page', () => {
    const startTime = Date.now();
    const res = http.get(`${BASE_URL}/`, {
      headers: {
        'User-Agent': 'k6-load-test/1.0',
      },
      timeout: '10s',
    });
    const loadTime = Date.now() - startTime;

    pageLoadTime.add(loadTime);
    totalRequests.add(1);

    const success = check(res, {
      'status is 200': (r) => r.status === 200,
      'page loads under 2s': (r) => loadTime < 2000,
      'has calculator content': (r) => r.body.includes('AIBurn') || r.body.includes('calculator'),
    });

    if (!success) {
      errorRate.add(true);
      console.error(`Home page failed: ${res.status} - ${res.body.slice(0, 100)}`);
    }
  });

  sleep(1);

  // Test 2: Load privacy page
  group('Privacy Page', () => {
    const res = http.get(`${BASE_URL}/privacy`, {
      headers: { 'User-Agent': 'k6-load-test/1.0' },
      timeout: '10s',
    });

    const success = check(res, {
      'status is 200': (r) => r.status === 200,
      'has privacy content': (r) => r.body.includes('Privacy') || r.body.includes('privacy'),
    });

    if (!success) errorRate.add(true);
  });

  sleep(1);

  // Test 3: Load terms page
  group('Terms Page', () => {
    const res = http.get(`${BASE_URL}/terms`, {
      headers: { 'User-Agent': 'k6-load-test/1.0' },
      timeout: '10s',
    });

    const success = check(res, {
      'status is 200': (r) => r.status === 200,
      'has terms content': (r) => r.body.includes('Terms') || r.body.includes('terms'),
    });

    if (!success) errorRate.add(true);
  });

  sleep(1);

  // Test 4: API endpoint test
  group('API - Usage Calculator', () => {
    const startTime = Date.now();
    const payload = JSON.stringify({
      model: 'gpt-4o',
      inputTokens: 1000,
      outputTokens: 500,
    });

    const res = http.post(`${BASE_URL}/api/usage`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'k6-load-test/1.0',
      },
      timeout: '10s',
    });
    const responseTime = Date.now() - startTime;

    apiResponseTime.add(responseTime);
    totalRequests.add(1);

    const success = check(res, {
      'status is 200 or 400': (r) => [200, 400, 415].includes(r.status),
      'response under 1s': (r) => responseTime < 1000,
      'has response body': (r) => r.body.length > 0,
    });

    if (!success) {
      errorRate.add(true);
      console.error(`API failed: ${res.status}`);
    }
  });

  sleep(1);

  // Test 5: Load advertise page
  group('Advertise Page', () => {
    const res = http.get(`${BASE_URL}/advertise`, {
      headers: { 'User-Agent': 'k6-load-test/1.0' },
      timeout: '10s',
    });

    const success = check(res, {
      'status is 200': (r) => r.status === 200,
      'has content': (r) => r.body.length > 100,
    });

    if (!success) errorRate.add(true);
  });

  sleep(2);
}

/**
 * Handle custom summary output
 */
export function handleSummary(data) {
  return {
    'stdout': generateTextSummary(data),
  };
}

function generateTextSummary(data) {
  const metrics = data.metrics;
  let summary = '\n╔════════════════════════════════════════╗\n';
  summary += '║        K6 LOAD TEST SUMMARY            ║\n';
  summary += '╚════════════════════════════════════════╝\n\n';

  // HTTP Request Duration
  if (metrics['http_req_duration']) {
    const stats = metrics['http_req_duration'].values;
    summary += '⏱️  Response Times:\n';
    summary += `   Average: ${Math.round(stats?.avg || 0)}ms\n`;
    summary += `   Min:     ${Math.round(stats?.min || 0)}ms\n`;
    summary += `   Max:     ${Math.round(stats?.max || 0)}ms\n`;
    summary += `   P95:     ${Math.round(stats?.['p(95)'] || 0)}ms\n`;
    summary += `   P99:     ${Math.round(stats?.['p(99)'] || 0)}ms\n\n`;
  }

  // Request counts
  if (metrics['http_reqs']) {
    summary += `📊 Total Requests: ${metrics['http_reqs'].value}\n`;
  }

  // Error counts
  if (metrics['http_req_failed']) {
    summary += `❌ Failed Requests: ${metrics['http_req_failed'].value}\n`;
  }

  // Errors
  if (metrics['errors']) {
    summary += `🚨 Errors: ${metrics['errors'].value}\n`;
  }

  summary += '\n╔════════════════════════════════════════╗\n';
  summary += '║         TEST COMPLETE                  ║\n';
  summary += '╚════════════════════════════════════════╝\n';

  return summary;
}
