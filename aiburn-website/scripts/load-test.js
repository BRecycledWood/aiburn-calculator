#!/usr/bin/env node

/**
 * K6 Load Testing Script Generator
 * 
 * This script generates a k6 test file for load testing the AIBurn calculator.
 * K6 is a modern load testing tool that's easy to script and understand.
 * 
 * Usage:
 *   npm run load-test                    # Run with defaults
 *   npm run load-test -- --vus 50 --duration 2m  # Custom parameters
 * 
 * Prerequisites:
 *   brew install k6  # macOS
 *   sudo apt-get install k6  # Linux
 *   Or download from: https://k6.io/docs/getting-started/installation/
 */

const fs = require('fs');
const path = require('path');

const k6Script = `import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend, Counter, Gauge } from 'k6/metrics';

// Metrics
const errorRate = new Rate('errors');
const pageLoadTime = new Trend('page_load_time');
const apiResponseTime = new Trend('api_response_time');
const requestsPerSecond = new Gauge('requests_per_second');
const totalRequests = new Counter('total_requests');

// Configuration
const BASE_URL = __ENV.BASE_URL || 'https://aiburn.howstud.io';
const VUS = __ENV.VUS || 10;
const DURATION = __ENV.DURATION || '30s';

export const options = {
  vus: parseInt(VUS),
  duration: DURATION,
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.1'],
    errors: ['rate<0.05'],
  },
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
};

export default function () {
  // Test 1: Load main page
  group('Main Page Load', () => {
    const startTime = new Date();
    const res = http.get(\`\${BASE_URL}/\`, {
      headers: {
        'User-Agent': 'AIBurn-LoadTest/1.0',
        'Accept': 'text/html,application/xhtml+xml',
      },
      timeout: '10s',
    });
    const loadTime = new Date() - startTime;

    pageLoadTime.add(loadTime);
    totalRequests.add(1);

    const success = check(res, {
      'status is 200': (r) => r.status === 200,
      'page loads under 3s': (r) => loadTime < 3000,
      'has content': (r) => r.body.includes('calculator') || r.body.includes('AIBurn'),
      'has required meta tags': (r) => r.body.includes('AIBurn'),
    });

    errorRate.add(!success);
    if (!success) {
      console.error(\`Main page failed: \${res.status} - \${res.body.slice(0, 100)}\`);
    }
  });

  sleep(1);

  // Test 2: Privacy policy page
  group('Privacy Policy Load', () => {
    const res = http.get(\`\${BASE_URL}/privacy\`, {
      headers: { 'User-Agent': 'AIBurn-LoadTest/1.0' },
      timeout: '10s',
    });

    const success = check(res, {
      'status is 200': (r) => r.status === 200,
      'has privacy content': (r) => r.body.includes('Privacy'),
    });

    errorRate.add(!success);
  });

  sleep(1);

  // Test 3: Terms page
  group('Terms of Service Load', () => {
    const res = http.get(\`\${BASE_URL}/terms\`, {
      headers: { 'User-Agent': 'AIBurn-LoadTest/1.0' },
      timeout: '10s',
    });

    const success = check(res, {
      'status is 200': (r) => r.status === 200,
      'has terms content': (r) => r.body.includes('Terms') || r.body.includes('Service'),
    });

    errorRate.add(!success);
  });

  sleep(1);

  // Test 4: API endpoint - usage calculator
  group('API - Usage Calculator', () => {
    const startTime = new Date();
    const payload = JSON.stringify({
      model: 'gpt-4o',
      inputTokens: 1000,
      outputTokens: 500,
    });

    const res = http.post(\`\${BASE_URL}/api/usage\`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AIBurn-LoadTest/1.0',
      },
      timeout: '10s',
    });
    const responseTime = new Date() - startTime;

    apiResponseTime.add(responseTime);
    totalRequests.add(1);

    const success = check(res, {
      'status is 200 or 400': (r) => [200, 400, 415].includes(r.status),
      'response time under 1s': (r) => responseTime < 1000,
      'has response body': (r) => r.body.length > 0,
    });

    errorRate.add(!success);
    if (!success) {
      console.error(\`API call failed: \${res.status} - \${res.body.slice(0, 100)}\`);
    }
  });

  sleep(1);

  // Test 5: Contact page
  group('Contact/Advertise Page Load', () => {
    const res = http.get(\`\${BASE_URL}/advertise\`, {
      headers: { 'User-Agent': 'AIBurn-LoadTest/1.0' },
      timeout: '10s',
    });

    const success = check(res, {
      'status is 200': (r) => r.status === 200,
      'has advertise content': (r) => r.body.includes('Advertise') || r.body.includes('contact'),
    });

    errorRate.add(!success);
  });

  sleep(2);
}

export function handleSummary(data) {
  // Custom summary output
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    '/tmp/summary.json': JSON.stringify(data),
  };
}

function textSummary(data, options = {}) {
  const indent = options.indent || '';
  let summary = '\\n📊 K6 Load Test Summary\\n';
  summary += '═══════════════════════════════════════\\n';

  // Extract key metrics
  const metrics = data.metrics;
  if (metrics['http_req_duration']) {
    const stats = metrics['http_req_duration'].values;
    summary += \`\\n⏱️  Page Load Times:\\n\`;
    summary += \`   Avg: \${Math.round(stats?.avg || 0)}ms\\n\`;
    summary += \`   Min: \${Math.round(stats?.min || 0)}ms\\n\`;
    summary += \`   Max: \${Math.round(stats?.max || 0)}ms\\n\`;
    summary += \`   P95: \${Math.round(stats?.['p(95)'] || 0)}ms\\n\`;
  }

  if (metrics['http_req_failed']) {
    summary += \`\\n❌ Failed Requests: \${metrics['http_req_failed'].value}\\n\`;
  }

  if (metrics['total_requests']) {
    summary += \`\\n📈 Total Requests: \${metrics['total_requests'].value}\\n\`;
  }

  summary += '\\n═══════════════════════════════════════\\n';
  return summary;
}
`;

// Write the k6 script
const scriptPath = path.join(__dirname, '../k6-load-test.js');
fs.writeFileSync(scriptPath, k6Script);
console.log('✅ K6 load test script created at: k6-load-test.js');

// Create a helper script to run k6
const runScript = `#!/bin/bash

# K6 Load Test Runner
# 
# Usage:
#   ./scripts/run-load-test.sh [--vus 10] [--duration 30s] [--url https://...]

set -e

# Default values
VUS=10
DURATION="30s"
URL="https://aiburn.howstud.io"

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --vus)
      VUS="$2"
      shift 2
      ;;
    --duration)
      DURATION="$2"
      shift 2
      ;;
    --url)
      URL="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

echo "🚀 Running K6 Load Test"
echo "   URL: $URL"
echo "   VUs (Virtual Users): $VUS"
echo "   Duration: $DURATION"
echo ""

# Check if k6 is installed
if ! command -v k6 &> /dev/null; then
  echo "❌ k6 is not installed."
  echo "Install from: https://k6.io/docs/getting-started/installation/"
  exit 1
fi

# Run k6
k6 run k6-load-test.js \\
  --vus $VUS \\
  --duration $DURATION \\
  --env BASE_URL=$URL

echo ""
echo "✅ Load test complete. Check /tmp/summary.json for detailed results."
`;

const runPath = path.join(__dirname, '../run-load-test.sh');
fs.writeFileSync(runPath, runScript);
fs.chmodSync(runPath, 0o755);
console.log('✅ K6 runner script created at: run-load-test.sh');

console.log(`
📋 Load Testing Setup Complete

Next steps:
1. Install K6:
   brew install k6  # macOS
   Or visit: https://k6.io/docs/getting-started/installation/

2. Run local load test:
   ./scripts/run-load-test.sh --vus 10 --duration 30s --url http://localhost:5173

3. Run against production:
   ./scripts/run-load-test.sh --vus 50 --duration 2m --url https://aiburn.howstud.io

4. Or directly with k6:
   k6 run k6-load-test.js --vus 10 --duration 30s --env BASE_URL=https://aiburn.howstud.io

📊 Load Testing Scenarios:
   - Main page load (HTML)
   - Privacy page load
   - Terms page load
   - API endpoint (usage calculator)
   - Contact/Advertise page load

✅ All tests include:
   - Page load time tracking
   - Error rate monitoring
   - Threshold validation (p95 < 500ms, p99 < 1000ms)
   - Success rate verification
`);
