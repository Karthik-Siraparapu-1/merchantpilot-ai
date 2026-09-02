# Failure Handling and Safe Degradation

## Principles

Customer trust, payment correctness, and tenant isolation take priority over conversion. The system fails closed for authorization, policy, payment confirmation, and unsupported AI claims; it fails gracefully for discovery by using deterministic catalog results where safe. Every terminal failure has an error code, correlation ID, audit event, metric, and operational owner.

## Failure matrix

| Scenario | Customer/API behavior | System action | Signal |
|---|---|---|---|
| LLM timeout/unavailable | Deterministic search/filter results if retrieval works; otherwise temporary-unavailable response | Circuit-break provider; one bounded safe retry; persist fallback | Alert on threshold breach; fallback-rate metric |
| Retrieval/index unavailable | Do not invent results; offer category browse/search | Use last healthy tenant-scoped lexical index if available | Critical alert if no safe path |
| Empty catalog | State no products are available | Skip AI call and recommendation creation | Merchant catalog alert |
| Low confidence | Ask focused clarification or show safe browse results | Persist threshold/suppression reason | Confidence metric |
| Inventory mismatch | Remove unavailable item; reprice/revalidate checkout | Transactional stock recheck; release failed reservation | Audit and mismatch metric |
| Duplicate checkout | Return original response | Enforce idempotency replay; no second provider call | Duplicate metric |
| Razorpay API timeout/failure | Processing/unavailable status; never payment success | Persist retry-safe pending state; reconcile via webhook | Payment alert |
| Payment failure | Show non-paid retry route where allowed | Mark attempt failed; no paid attribution | Failure metric/audit |
| Webhook duplicate | Successful already-processed acknowledgement | Deduplicate provider event ID | Duplicate metric |
| Invalid webhook signature | Reject; no state change | Record minimal rejected metadata | Security alert policy |
| Database timeout | Retryable error with request ID | Roll back; no partial cart/order/payment state | Database alert |
| Rate limiting | 429 with retry hint | Apply scoped quota | Abuse/quota metric |

## Fallback hierarchy

1. Evidence-bound AI recommendation at threshold.
2. Deterministic catalog filters/search using explicit intent.
3. Category browse and availability message.
4. Clear temporary-unavailable response with no fabricated advice.

Responses never expose provider names, raw exceptions, internal policies, or security information. They include a support-safe request reference where useful.

## Retry, idempotency, and recovery

External calls use bounded timeout, exponential backoff with jitter, circuit breaker, and provider idempotency where supported. Jobs retry only transient classified failures and dead-letter after a bounded count; terminal jobs retain context and authorized replay path. Payments reconcile from verified provider events/provider query—not client retry. Outbox events ensure analytics/audit work follows committed source state.

Merchant-visible catalog warnings occur when no active sellable variants exist or indexing exhausts retries. Operator alerts cover signature failures, webhook backlog, persistent Razorpay/DB errors, cross-tenant violation, and high AI fallback/suppression. Incident closure requires health recovery, reconciliation, root-cause review, owner/action, and added regression test or monitor.
