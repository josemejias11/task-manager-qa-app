# Security Considerations

## Overview

This is a **practice application** designed for QA automation testing and learning purposes. It is **NOT** intended for production use and lacks several critical security features that would be required in a production environment.

## Known Security Limitations

### 1. No Authentication or Authorization

- **Issue**: The application has no user authentication or authorization mechanisms.
- **Impact**: Anyone with access to the application can create, read, update, and delete all tasks.
- **Recommendation for Learning**: Consider implementing JWT-based authentication or OAuth 2.0 as a learning exercise.

### 2. CORS Enabled for All Origins

- **Issue**: CORS is enabled for all origins (`app.use(cors())` in `server/server.js:11`).
- **Impact**: Any website can make requests to this API, enabling potential CSRF attacks.
- **Recommendation**: In production, restrict CORS to specific trusted origins:
  ```javascript
  app.use(cors({
    origin: ['https://trusted-domain.com'],
    credentials: true
  }));
  ```

### 3. No Rate Limiting

- **Issue**: No rate limiting is implemented on API endpoints.
- **Impact**: The application is vulnerable to brute force attacks and denial of service through excessive requests.
- **Recommendation**: Implement rate limiting using packages like `express-rate-limit`:
  ```javascript
  const rateLimit = require('express-rate-limit');
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
  app.use('/api/', limiter);
  ```

### 4. Simple JSON File Database

- **Issue**: Data is stored in a plain JSON file (`db.json`) with no encryption or access controls.
- **Impact**:
  - Race conditions possible with concurrent writes
  - No data encryption at rest
  - File corruption risk
- **Recommendation**: Use a proper database (SQLite, PostgreSQL, MongoDB) with connection pooling and transaction support.

### 5. No Input Sanitization

- **Issue**: While input validation exists, there's no HTML/script sanitization.
- **Impact**: Potential XSS vulnerabilities if task titles contain malicious scripts (mitigated by React/Vue would auto-escape, but vanilla JS doesn't).
- **Recommendation**: Sanitize user input using libraries like `DOMPurify` or `validator`.

### 6. No HTTPS Enforcement

- **Issue**: Application runs on HTTP by default.
- **Impact**: Data transmitted in plaintext, susceptible to man-in-the-middle attacks.
- **Recommendation**: Use HTTPS in production with valid SSL/TLS certificates.

### 7. No SQL Injection Protection

- **Issue**: While not applicable with JSON file storage, if migrating to SQL database.
- **Recommendation**: Always use parameterized queries or ORM libraries.

### 8. Error Messages Expose Internal Details

- **Issue**: Error responses may reveal internal implementation details.
- **Impact**: Information leakage that could aid attackers.
- **Recommendation**: Return generic error messages to clients, log detailed errors server-side only.

### 9. No Content Security Policy (CSP)

- **Issue**: No CSP headers are set.
- **Impact**: Increased risk of XSS attacks.
- **Recommendation**: Implement CSP headers using `helmet`:
  ```javascript
  const helmet = require('helmet');
  app.use(helmet());
  ```

### 10. No Request Size Limits

- **Issue**: No explicit limits on request body size beyond Express defaults.
- **Impact**: Potential for denial of service through large payloads.
- **Recommendation**: Set explicit body size limits:
  ```javascript
  app.use(express.json({ limit: '10kb' }));
  ```

## Security Best Practices for Production

If you plan to deploy a similar application to production, implement:

1. **Authentication & Authorization**
   - JWT tokens or session-based auth
   - Role-based access control (RBAC)
   - Secure password storage with bcrypt

2. **API Security**
   - Rate limiting
   - API key authentication
   - Request validation with schemas (e.g., Joi, Yup)

3. **Data Protection**
   - Encryption at rest and in transit (HTTPS)
   - Proper database with transactions
   - Regular backups
   - Data retention policies

4. **Infrastructure Security**
   - Environment variables for secrets (never commit `.env`)
   - Security headers (helmet.js)
   - Dependency scanning (npm audit, Snyk)
   - Regular updates of dependencies

5. **Monitoring & Logging**
   - Security audit logging
   - Intrusion detection
   - Error monitoring (Sentry, etc.)
   - Regular security assessments

## Reporting Security Issues

Since this is a practice/learning project, security issues are expected and documented here for educational purposes. If you're using this code as a starting point and find additional security concerns, please:

1. Document them in this file
2. Implement fixes as learning exercises
3. Share improvements via pull requests

## Resources for Learning Security

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)

---

**Remember**: This application is for **learning and testing purposes only**. Never deploy it to production without implementing proper security measures!
