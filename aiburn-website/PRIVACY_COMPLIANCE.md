# Privacy & Compliance Checklist

## Status: IN PROGRESS

Last Updated: Nov 29, 2025

## Privacy & Legal Compliance Items

### 1. Cookie & Consent Management
- [ ] Implement cookie banner for visitor consent
- [ ] Document all cookies used
  - Session cookies
  - Analytics cookies (Google Analytics if enabled)
  - Third-party cookies (Sentry, etc.)
- [ ] Obtain explicit consent before setting tracking cookies
- [ ] Provide easy opt-out mechanism
- [ ] Honor user consent preferences

### 2. Privacy Policy
- [x] Privacy policy published at `/privacy`
- [ ] Review for accuracy and completeness
- [ ] Verify covers:
  - Data collection practices
  - How data is used
  - Data retention periods
  - User rights (GDPR: access, rectification, deletion)
  - Third-party data sharing
  - Contact information for privacy inquiries

### 3. Terms of Service
- [x] Terms published at `/terms`
- [ ] Review for accuracy
- [ ] Verify covers:
  - Disclaimer of warranties
  - Limitation of liability
  - User responsibilities
  - API key security
  - Acceptable use policy

### 4. Data Retention Policies
- [ ] Define retention periods for each data type
  - User submissions: 90 days
  - API keys: Not stored (immediate discard)
  - Error logs: 30 days
  - Analytics data: Per Google Analytics defaults
- [ ] Implement data cleanup/archival processes
- [ ] Document in privacy policy

### 5. Sensitive Data Handling
- [ ] Verify API keys are never stored
  - Server: Not persisted to database
  - Client: Not stored in localStorage
  - Logs: Stripped from logs
- [ ] Email addresses handled securely
  - Only used for contact purposes
  - Not shared with third parties
  - Deleted after campaign period
- [ ] No PII in error logs
  - Sentry configured to redact sensitive data
  - Error messages sanitized

### 6. GDPR Compliance (EU Users)
- [ ] Legal basis for processing data documented
  - Legitimate interest for calculations
  - Consent for email/newsletter (if applicable)
- [ ] User rights implemented:
  - [ ] Right to access data
  - [ ] Right to rectification
  - [ ] Right to erasure ("right to be forgotten")
  - [ ] Right to restrict processing
  - [ ] Right to object
- [ ] Data Processing Agreement with processors (Sentry, etc.)
- [ ] Data breach notification plan documented
- [ ] DPA with Vercel (hosting provider)

### 7. CCPA Compliance (California Users)
- [ ] Privacy notice includes required disclosures
- [ ] "Do Not Sell My Personal Information" link (if applicable)
- [ ] User rights documented:
  - [ ] Right to know
  - [ ] Right to delete
  - [ ] Right to opt-out
- [ ] California Privacy Rights Act (CPRA) considerations

### 8. Third-Party Integrations
- [ ] FormSubmit.co
  - [ ] Terms reviewed
  - [ ] Privacy policy documented
  - [ ] Disclosure in Privacy Policy
- [ ] Sentry
  - [ ] Data processing agreement in place
  - [ ] Users notified of error tracking
- [ ] OpenAI API
  - [ ] Users informed data sent to OpenAI
  - [ ] OpenAI privacy policy disclosed
  - [ ] Zero data retention confirmed
- [ ] Google Analytics (if used)
  - [ ] Consent obtained
  - [ ] IP anonymization enabled
  - [ ] Data retention configured

### 9. Security Measures
- [ ] HTTPS/TLS enforced
- [ ] Security headers implemented
  - CSP
  - HSTS
  - X-Frame-Options
  - X-Content-Type-Options
- [ ] Input validation & sanitization
- [ ] XSS prevention (DOMPurify)
- [ ] CSRF protection (if POST forms)
- [ ] Regular security audits

### 10. Accessibility & Transparency
- [ ] Privacy policy in plain language
- [ ] Easy-to-find contact for privacy inquiries
- [ ] Publicly documented data flows:
  - What data collected
  - How it's used
  - Where it goes
- [ ] Transparent about API key handling

## Data Flow Documentation

```
User Input → Validation/Sanitization → Processing → Output
                ↓
            [Not Stored]
```

### Specific Flows:

**Quick Calculator Mode**
- Input: Token counts, model selection (all client-side)
- Storage: Memory only (not persisted)
- Output: Cost calculations
- No data sent to server

**Exact Usage Mode**
- Input: OpenAI API key
- Processing: Sent to `/api/usage` endpoint
- Server: Fetches data from OpenAI API
- Storage: No storage (immediate discard)
- Output: Cost analysis

**Email Capture Form**
- Input: Name, email, company, phone, job title
- Processing: Sent to FormSubmit.co
- Storage: By FormSubmit (per their policy, ~90 days)
- Output: Email notification to user
- Disclosure: Privacy policy link in form

## Template Responses for Privacy Inquiries

### GDPR Data Access Request
"Please provide your email address. We can confirm that we do not store your API keys or personal data. For information about email subscriptions, data will be retained as per our privacy policy."

### GDPR Erasure Request
"We can remove your email from our mailing list. Note that data sent to our form processor (FormSubmit.co) is subject to their retention policy."

### Security Incident Response
- Log incident details
- Notify affected users within 72 hours (GDPR requirement)
- Document root cause and remediation
- Update security measures

## Compliance Checklist Template

### Before Production Launch
- [ ] Privacy policy reviewed by legal counsel
- [ ] Terms of service reviewed by legal counsel
- [ ] GDPR/CCPA compliance verified
- [ ] Third-party agreements documented
- [ ] Security measures implemented
- [ ] Data retention policies documented
- [ ] User rights implementation plan
- [ ] Privacy incident response plan

### Ongoing
- [ ] Monthly audit of data handling practices
- [ ] Quarterly security assessments
- [ ] Annual privacy policy review
- [ ] Third-party agreement renewals

## References & Resources

### GDPR
- [GDPR Compliance Checklist](https://gdpr-info.eu/)
- [GDPR Legal Basis](https://gdpr-info.eu/chapter-2/article-6/)

### CCPA
- [CCPA Compliance Guide](https://www.ccpa-guide.org/)
- [California Consumer Privacy Act](https://cppa.ca.gov/)

### Privacy Best Practices
- [Privacy by Design](https://en.wikipedia.org/wiki/Privacy_by_design)
- [OWASP Privacy Risks](https://owasp.org/www-community/Privacy_Risk)

## Contact for Privacy Inquiries

For privacy-related questions or requests:
- Email: privacy@howstud.io
- Form: [Privacy Policy Page]
- Response time: Within 30 days (GDPR requirement)

---

**Note:** This is a living document. Update as new features are added or compliance requirements change.
