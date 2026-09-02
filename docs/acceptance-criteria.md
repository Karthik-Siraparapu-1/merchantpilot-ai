# Acceptance Criteria

These criteria are measurable release-verification conditions. Test data must include at least two tenants, active/inactive products, in/out-of-stock variants, policy-blocked categories, low-confidence prompts, and Razorpay Test Mode webhook fixtures.

## AC-01 Identity and tenant isolation

1. Given a valid first-time OIDC identity, when it creates a tenant, then exactly one owner membership and `tenant.created` audit event exist.
2. Given a caller from tenant A, when it requests any tenant-B resource by ID or filter, then the API returns 403 or non-discoverable 404 and returns no tenant-B metadata.
3. Given a non-owner, when it assigns/removes an owner role, then the API returns 403 and writes `access.denied`.
4. Given a request with invalid, expired, wrong-audience, or missing token, when it reaches a merchant endpoint, then it returns 401 before business processing.

## AC-02 Onboarding, catalog, inventory, and indexing

1. Given a valid catalog upload, when processing completes, then every valid row has a tenant-scoped product/variant, validation result, catalog version, and audit event.
2. Given one invalid row and one valid row, when an import is processed, then the valid row publishes and the invalid row is reported with row number, field, code, and remediation message.
3. Given duplicate tenant SKU or handle, when create/import is attempted, then it is rejected without creating duplicate catalog records.
4. Given an index job failure, when retry budget is exhausted, then the prior successful index remains active, failure status is visible, and an alert/audit event exists.
5. Given a variant whose available inventory becomes zero, when a recommendation is requested afterward, then that variant is absent from all new recommendation and upsell outputs.

## AC-03 Policy, offers, and overrides

1. Given a policy change with a valid ETag and authorized role, when saved, then a new immutable policy version and `policy.updated` audit event exist.
2. Given a stale ETag, when a policy write occurs, then it returns 409 and does not overwrite the newer policy.
3. Given an AI pause override, when a new shopper request arrives within 60 seconds, then no AI recommendation/upsell is displayed and a suppression record states the policy reason.
4. Given an offer violating category, active-date, stock, discount, or margin constraints, when evaluated, then it is omitted with a machine-readable rejection reason in its audit record.
5. Given a support role, when it attempts a commercial override, then it receives 403; the attempt is audited.

## AC-04 Conversation, recommendation, and explainability

1. Given a valid storefront session and a message of no more than 2,000 characters, when the customer submits it, then the system persists the message with request correlation and returns a response within the applicable latency target.
2. Given an explicit budget, required attribute, and in-stock matching products, when ranking runs, then selected variants satisfy those explicit constraints or the response explains that no match exists.
3. Given a displayed recommendation, then its persisted decision has a score in `[0,1]`, non-empty customer explanation, one or more evidence records, policy version, model/index versions, request ID, and audit record.
4. Given an output that claims a price, stock state, feature, promotion, payment state, or policy fact not present in evidence, when validation runs, then the output is suppressed and `recommendation.suppressed` is recorded.
5. Given a score below the merchant threshold, when a recommendation is requested, then the customer receives clarification, deterministic search/filter results, or an honest no-match—not a definitive AI recommendation.
6. Given LLM timeout/unavailability, when deterministic catalog search is available, then the response uses the documented fallback and preserves a fallback audit field; no unsupported generated answer is returned.
7. Given a prompt-injection attempt, when it requests hidden rules, cross-tenant data, secrets, or system-role changes, then the system exposes none of them, uses safe redirection/refusal, and records a security event.

## AC-05 Upsell and cart

1. Given a cart with a compatible active accessory, when upsell evaluates it, then the suggestion is labeled optional and includes complementary evidence.
2. Given an item already in the cart, an inactive item, an out-of-stock item, or a policy-blocked item, when upsell evaluates, then that item is not proposed.
3. Given an upsell is displayed, when the customer does nothing, then the cart remains unchanged.
4. Given concurrent cart writes using an old version, when the later write is submitted, then it returns 409 with the current cart state; it never silently overwrites lines.
5. Given any cart mutation, when the API returns, then totals are server-calculated and an audit/event record carries cart version and price basis.

## AC-06 Checkout and Razorpay Test Mode

1. Given a valid cart and unique idempotency key, when checkout is requested twice, then exactly one order and one provider-order creation occur and both responses identify the same order.
2. Given stock/price changes after a cart was viewed, when checkout begins, then the server rejects or reprices before provider order creation and returns the current condition.
3. Given a successful Razorpay Test Mode client callback without a verified webhook, then the order remains non-paid.
4. Given a valid signed matching payment webhook, when it is processed, then payment/order state changes once atomically, `payment.confirmed` is audited, and downstream attribution is queued.
5. Given an invalid signature, mismatched order/amount/currency, or stale/replayed webhook, then no paid transition occurs; the reason is recorded and alert policy is invoked where configured.
6. Given a duplicate valid provider event ID, when delivered again, then the endpoint returns successful acknowledgement without duplicate payment transition or duplicate analytics event.
7. Given a payment failure event, when processed, then the attempt is marked failed, the order follows configured payable/cancelled policy, and no revenue is attributed as paid.

## AC-07 Analytics, experiments, and auditability

1. Given the same commerce event is submitted multiple times with its idempotency key, then it is represented once in analytics and duplicate handling is observable.
2. Given an experiment assignment, when the same subject returns, then it receives the same variant until experiment completion or explicit reassignment policy.
3. Given a paid order later refunded, when the refund event is processed, then net revenue/AOV metrics are adjusted and the dashboard freshness time updates.
4. Given a merchant analyst, when querying metrics, then results include only their tenant and identify filter window, attribution methodology, and data freshness.
5. Given an authorized audit viewer, when filtering a decision/order/policy change by request ID, then actor/session, time, resource, outcome, and redacted metadata are retrievable without exposing secrets or card data.

## AC-08 Cross-cutting quality gates

1. At the agreed baseline load, performance tests satisfy every p95 target in [non-functional-requirements.md](non-functional-requirements.md).
2. Accessibility tests and manual keyboard/screen-reader checks find no WCAG 2.2 AA blocker on merchant login, catalog management, conversation, cart, checkout handoff, and error states.
3. CI blocks release when SAST, dependency, secret, contract, migration, authorization, payment, webhook, and critical AI guardrail tests fail.
4. A staging restore rehearsal proves the defined recovery point/time objective and webhook replay does not duplicate order/payment transitions.
5. No implemented feature may bypass the required decision envelope, RLS/tenant context, or immutable audit event requirements.
