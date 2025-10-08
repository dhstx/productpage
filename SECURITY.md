# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

The DHStx team takes security bugs seriously. We appreciate your efforts to responsibly disclose your findings, and will make every effort to acknowledge your contributions.

### How to Report a Security Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to:

**security@daleyhousestacks.com** or **contact@daleyhousestacks.com**

Include the following information in your report:

* Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
* Full paths of source file(s) related to the manifestation of the issue
* The location of the affected source code (tag/branch/commit or direct URL)
* Any special configuration required to reproduce the issue
* Step-by-step instructions to reproduce the issue
* Proof-of-concept or exploit code (if possible)
* Impact of the issue, including how an attacker might exploit it

### What to Expect

* **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours.
* **Assessment**: We will assess the vulnerability and determine its severity within 5 business days.
* **Resolution**: We will work on a fix and aim to release a patch within 7-14 days for critical vulnerabilities.
* **Disclosure**: We will coordinate with you on the disclosure timeline. We prefer to fully remediate the issue before public disclosure.
* **Credit**: We will credit you in our security advisories (unless you prefer to remain anonymous).

## Security Best Practices

When deploying this application, please ensure:

1. **Environment Variables**: Never commit `.env` files or expose sensitive credentials
2. **Dependencies**: Regularly update dependencies using `pnpm update` and monitor security advisories
3. **Authentication**: Use strong authentication mechanisms and rotate API keys regularly
4. **HTTPS**: Always use HTTPS in production environments
5. **Database Security**: Enable Row Level Security (RLS) in Supabase and follow the principle of least privilege
6. **Input Validation**: Validate and sanitize all user inputs
7. **Rate Limiting**: Implement rate limiting on API endpoints
8. **Monitoring**: Set up monitoring and alerting for suspicious activities

## Security Features

This project includes:

* **Supabase Row Level Security (RLS)**: Database access is controlled at the row level
* **Environment Variable Validation**: Required environment variables are checked at build time
* **Dependency Scanning**: Automated dependency vulnerability scanning via GitHub Dependabot
* **Code Scanning**: Static analysis security testing (SAST) via CodeQL
* **Content Security Policy**: CSP headers configured in production
* **HTTPS Enforcement**: All production traffic is encrypted

## Known Security Considerations

* **Demo Mode**: The application includes a demo mode that logs form submissions to console when Supabase is not configured. This should not be used in production.
* **API Keys**: Supabase anon keys are exposed in the client. Ensure RLS policies are properly configured to prevent unauthorized access.
* **Third-party Dependencies**: This project uses third-party npm packages. Review the dependency tree and keep packages updated.

## Security Updates

Security updates will be released as patch versions (e.g., 0.1.1, 0.1.2). Subscribe to repository releases to stay informed about security patches.

## Bug Bounty Program

We do not currently have a formal bug bounty program, but we deeply appreciate security researchers who responsibly disclose vulnerabilities. We will publicly acknowledge your contribution (with your permission) in our security advisories.

## Contact

For any security-related questions or concerns:

* **Email**: security@daleyhousestacks.com
* **Backup**: contact@daleyhousestacks.com
* **Response Time**: Within 48 hours

## Additional Resources

* [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
* [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/row-level-security)
* [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

**Last Updated**: October 2025
