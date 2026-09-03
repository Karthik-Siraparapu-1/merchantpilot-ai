# Security

Security is designed into identity, data boundaries, payment workflows, operations, and the AI pipeline. Threat modeling is required before checkout, external integrations, and capabilities processing personal data.

## Authentication

Merchant users authenticate through an OIDC-compatible provider using Authorization Code Flow with PKCE. The API validates issuer, audience, signature, expiry, nonce/state where relevant, and token revocation/session policy. MFA is mandatory for privileged roles. Shopper sessions use high-entropy opaque, short-lived, rotating tokens stored in secure, `HttpOnly`, `SameSite` cookies where browser architecture permits.

## Authorization

Use deny-by-default RBAC with tenant-scoped permissions: owner, admin, growth_manager, catalog_manager, support_agent, analyst, and read_only. Enforcement happens in application use cases, not only routes. PostgreSQL RLS validates tenant context as a second barrier. Support access is time-bounded, audited, and cannot see payment secrets or unredacted data by default. Service identities receive narrow workload credentials.

## Secrets and environment variables

Secrets live in a managed secret store, never in source control, browser bundles, logs, fixtures, or database plaintext. Use independent credentials per environment; rotate and invalidate exposed values immediately. Startup validates required configuration, provenance, and environment compatibility. Only public storefront identifiers may reach browsers.

| Category       | Example                            | Handling                                |
| -------------- | ---------------------------------- | --------------------------------------- |
| Database       | `DATABASE_URL`                     | Secret; TLS outside local development   |
| Authentication | OIDC issuer/audience/client secret | Client secret server-only               |
| Razorpay       | key ID, key secret, webhook secret | Test Mode initially; secret server-only |
| AI provider    | API key/model identifier           | Restricted scope; redact logs           |
| Encryption     | data-encryption-key reference      | Use KMS reference, not raw key          |
| Runtime        | environment, origins, log level    | Non-secret but strictly validated       |

## Payment security

MerchantPilot AI does not collect, transmit, or store card PAN, CVV, or payment credentials. Browser checkout uses Razorpay's approved client integration with its public Test Mode key. The server creates orders and verifies provider signatures using a webhook secret. Validate order ID, amount, currency, tenant, and state independently; deduplicate provider events; reconcile asynchronous outcomes. Never treat a client success callback as payment confirmation.

## Input validation and AI safety

Apply schema validation, length/size caps, Unicode normalization, allowlisted filters/sorts, parameterized queries, output encoding, and content-type enforcement. Future uploads require malware scanning and object-store isolation. Treat AI inputs as untrusted: redact/minimise PII, isolate tenant retrieval, defend against prompt injection, constrain tools to read-only catalog lookups, and validate structured output against schema and policy. Store reason codes and evidence, never hidden chain-of-thought.

## Rate limiting and abuse prevention

Rate limit by tenant, actor, storefront key, session/IP, and endpoint cost. Conversations and checkout creation have tighter quotas; webhooks verify signatures before expensive work. Return `429` with retry information. Add bot detection, replay protection, request-body caps, circuit breakers, and queue backpressure. Alert on anomalous recommendation volume, payment-signature failures, authorization denials, and data exports.

## OWASP considerations

- **Broken access control:** central policy checks, RLS, tenant tests, non-enumerable IDs.
- **Cryptographic failures:** TLS, KMS-backed encryption at rest, rotation, encrypted sensitive payloads.
- **Injection:** parameterized database access, no dynamic query fragments, strict AI tool schemas.
- **Insecure design:** threat models, state machines, idempotency, approval gates, abuse cases.
- **Misconfiguration/components:** hardened headers, restricted CORS, secure defaults, SBOM, dependency scanning and patch SLA.
- **Authentication failures:** OIDC, MFA, session rotation, rate limits, secure cookies.
- **Integrity failures:** signed webhooks, protected CI, reviewed migrations, provenance checks.
- **Logging/monitoring failures:** structured redacted logs, audits, alerts, incident runbooks.
- **SSRF:** egress allowlists, URL validation, no user-controlled internal fetches, timeouts.

Security testing includes SAST, dependency and secret scanning, DAST against staging, authorization tests, webhook replay tests, and penetration testing before production payments.
