# Security Policy

## Supported Versions

| Version | Supported |
| --- | --- |
| v1.0.x | :white_check_mark: |
| < 1.0 | :x: |

## Reporting a Vulnerability

We take the security of **MerchantPilot AI** seriously. If you believe you have found a security vulnerability in any MerchantPilot AI repository, please report it to us as described below.

### Please do NOT file a public issue.

Send an email to `security@merchantpilot.ai` containing:
- Type of issue (e.g. SQL injection, privilege escalation, cross-site scripting)
- Steps to reproduce the issue
- Proof-of-concept code or payload if available

### Response & Timeline
- We will acknowledge receipt of your vulnerability report within 24 hours.
- We will provide an initial assessment within 48 hours.
- A fix will be developed, tested, and released in a patch update.

## Multi-Tenant Data Security & Isolation
MerchantPilot AI enforces Row Level Security (RLS) on PostgreSQL and AES-256 tenant data partitioning. All AI prompt pipelines operate under strict zero-data-retention parameters.
