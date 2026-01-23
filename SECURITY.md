# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly.

**Do not open a public issue for security vulnerabilities.**

Instead, please send an email to the maintainers or use GitHub's private vulnerability reporting feature.

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response Timeline

- We will acknowledge receipt within 48 hours
- We will provide an initial assessment within 7 days
- We will work with you to understand and resolve the issue

### Disclosure Policy

- We will coordinate with you on disclosure timing
- We will credit you in the security advisory (unless you prefer anonymity)
- We aim to release fixes within 30 days of confirmed vulnerabilities

## Security Best Practices

When using this package:

1. **Keep dependencies updated** - Regularly run `npm audit` and update packages
2. **Use TLS** - Always enable TLS in production environments
3. **Secure credentials** - Use environment variables or secure vaults for authentication tokens
4. **Limit permissions** - Use minimal Pulsar permissions required for your use case
