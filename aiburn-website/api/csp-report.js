/**
 * CSP Violation Report Handler
 * 
 * Accepts Content-Security-Policy violation reports and logs them
 * for security monitoring and debugging.
 * 
 * Endpoint: POST /api/csp-report
 */

export default function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const report = req.body['csp-report'] || req.body;

    if (!report) {
      return res.status(400).json({ error: 'No CSP report data' });
    }

    // Log CSP violation
    const violation = {
      timestamp: new Date().toISOString(),
      documentUri: report['document-uri'],
      violatedDirective: report['violated-directive'],
      effectiveDirective: report['effective-directive'],
      originalPolicy: report['original-policy'],
      blockedUri: report['blocked-uri'],
      sourceFile: report['source-file'],
      lineNumber: report['line-number'],
      columnNumber: report['column-number'],
      statusCode: report['status-code'],
      disposition: report['disposition'], // 'enforce' or 'report'
      userAgent: req.headers['user-agent'],
    };

    // Log to console (visible in Vercel logs)
    console.warn('⚠️  CSP VIOLATION:', JSON.stringify(violation, null, 2));

    // In production, you can:
    // 1. Send to external service (Sentry, Splunk, etc.)
    // 2. Store in database
    // 3. Alert team if critical
    // 4. Create GitHub issue

    // Example: Send to Sentry
    if (process.env.VITE_SENTRY_DSN) {
      captureCSPViolation(violation);
    }

    // Example: Alert on repeated violations
    if (
      violation.violatedDirective &&
      violation.violatedDirective.includes('script-src')
    ) {
      console.error('🚨 CRITICAL: Script-src violation detected');
      // Could trigger Slack alert, email, etc.
    }

    // Return success
    return res.status(204).send();
  } catch (error) {
    console.error('Error processing CSP report:', error);
    return res.status(500).json({ error: 'Failed to process report' });
  }
}

/**
 * Send CSP violation to Sentry for monitoring
 */
function captureCSPViolation(violation) {
  try {
    // This would use Sentry SDK to report the violation
    // For now, just log it
    console.log('📤 CSP violation would be sent to Sentry:', violation.violatedDirective);
  } catch (error) {
    console.error('Failed to send CSP violation to Sentry:', error);
  }
}
