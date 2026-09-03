# Functional Requirements

All requirements use the normative term **shall**. Each state-changing operation emits an immutable audit event with tenant, actor/session, request ID, target, outcome, and redacted metadata.

## FR-01 Identity, tenant, and access management

| Field             | Requirement                                                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Purpose           | Establish merchant tenants and enforce role-based, tenant-scoped access.                                                                   |
| Inputs            | Valid OIDC claims; tenant profile; invited user identity; requested role.                                                                  |
| Outputs           | Tenant, membership, authenticated session, authorization decision.                                                                         |
| Validation        | Verify token issuer/audience/signature/expiry; normalize unique tenant slug; role must be allowlisted.                                     |
| Business rules    | Owner role is required while a tenant is active; only owner/admin may change membership; callers cannot select a different tenant context. |
| Failure scenarios | Invalid token → 401; unavailable/expired invite → 422; forbidden role change → 403; duplicate membership → 409.                            |
| Audit events      | `tenant.created`, `membership.invited`, `membership.role_changed`, `access.denied`.                                                        |
| Dependencies      | OIDC provider, PostgreSQL RLS, audit service.                                                                                              |

## FR-02 Onboarding, catalog, and indexing

| Field             | Requirement                                                                                                                                                                              |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Purpose           | Create a merchant-ready storefront and a valid, AI-retrievable catalog.                                                                                                                  |
| Inputs            | Storefront configuration; product/variant rows; price/currency; inventory; attributes; policy-approved knowledge.                                                                        |
| Outputs           | Published catalog records; row-level validation report; indexing job/status/version.                                                                                                     |
| Validation        | SKU and handle unique per tenant; money is non-negative integer minor units; currency is supported; required title/category/variant present; inventory non-negative.                     |
| Business rules    | Only active published variants with available stock can be recommended; invalid uploads do not publish invalid rows; a published catalog version remains traceable after a later update. |
| Failure scenarios | Schema violation → row error/422; duplicate SKU → conflict; index failure → retryable failed status and no partial index promotion.                                                      |
| Audit events      | `catalog.created`, `catalog.imported`, `catalog.row_rejected`, `catalog.published`, `catalog.indexed`, `catalog.index_failed`.                                                           |
| Dependencies      | Catalog repository, object storage if upload is used, job queue, embedding provider/vector index.                                                                                        |

## FR-03 Merchant policy, offer, and human override

| Field             | Requirement                                                                                                                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Purpose           | Let merchants constrain what the agent may recommend and offer.                                                                                                                                           |
| Inputs            | Confidence thresholds; blocked categories/claims; knowledge-source approval; discount/margin limits; offer rules; override command.                                                                       |
| Outputs           | Versioned active policy; offer eligibility result; override state.                                                                                                                                        |
| Validation        | Policy schema and rule operators allowlisted; thresholds 0–1; active ranges valid; only authorized roles alter policy.                                                                                    |
| Business rules    | Latest active policy is evaluated before display; a pause overrides all model output; an override cannot alter historical records; offer must satisfy price, stock, category, and experiment constraints. |
| Failure scenarios | Invalid rule → 422; stale ETag → 409; denied user → 403; policy lookup failure → safe no-recommendation response.                                                                                         |
| Audit events      | `policy.updated`, `offer.created`, `offer.paused`, `override.applied`, `override.revoked`.                                                                                                                |
| Dependencies      | Authorization, catalog/inventory, experiment assignment, audit service.                                                                                                                                   |

## FR-04 Conversation, intent, and recommendations

| Field             | Requirement                                                                                                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Purpose           | Convert a customer question into grounded product recommendations.                                                                                                                                     |
| Inputs            | Storefront/session, message up to 2,000 normalized characters, locale, cart context, active policy.                                                                                                    |
| Outputs           | Persisted assistant message; structured intent; ranked products; confidence, explanation, evidence, decision ID.                                                                                       |
| Validation        | Conversation belongs to session/storefront; message content/type/size valid; cart belongs to session; rate-limit not exceeded.                                                                         |
| Business rules    | Retrieval is tenant-scoped; rank only active in-stock variants; candidate policy filter precedes generation; output may not state unsupported facts; absent required decision fields means no display. |
| Failure scenarios | Low confidence → clarification/fallback; no candidates → honest no-match; LLM failure/timeout → deterministic search fallback; retrieval unavailable → retryable unavailable response.                 |
| Audit events      | `conversation.started`, `message.received`, `intent.detected`, `recommendation.generated`, `recommendation.suppressed`, `ai.fallback_used`.                                                            |
| Dependencies      | Session service, catalog/search, inventory, AI service, policy engine, Redis, decision repository.                                                                                                     |

## FR-05 Upsell and cart

| Field             | Requirement                                                                                                                                                                                           |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Purpose           | Offer optional, relevant complementary items and maintain an authoritative basket.                                                                                                                    |
| Inputs            | Cart lines, current recommendation decision, offer policy, experiment assignment, requested quantity.                                                                                                 |
| Outputs           | Eligible upsell list with explanation; cart version and recalculated totals.                                                                                                                          |
| Validation        | Variant active/in stock; quantity positive and bounded; cart belongs to session; offer eligibility current.                                                                                           |
| Business rules    | Upsells must be complementary rather than duplicate a cart line; no automatic cart addition; price/discount resolved server-side; cart mutation increments version; stock is revalidated at checkout. |
| Failure scenarios | Version conflict → 409 with current cart; stock loss → unavailable item response; expired offer → omit/reprice; policy pause → no offer.                                                              |
| Audit events      | `upsell.evaluated`, `upsell.impressed`, `cart.created`, `cart.item_changed`, `cart.repriced`.                                                                                                         |
| Dependencies      | Catalog, inventory, policy, experiment, recommendation decision, cart repository.                                                                                                                     |

## FR-06 Order, Razorpay Test Mode payment, and webhooks

| Field             | Requirement                                                                                                                                                                                              |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Purpose           | Create an idempotent checkout order and reconcile authoritative payment status.                                                                                                                          |
| Inputs            | Cart ID, shipping/contact fields, idempotency key, Razorpay Test Mode webhook payload/signature.                                                                                                         |
| Outputs           | Pending order, payment attempt, public provider checkout fields, final order/payment state.                                                                                                              |
| Validation        | Idempotency key required; cart/session/tenant ownership; server totals and currency; valid state transition; provider signature and event ID.                                                            |
| Business rules    | Server calculates amount; provider order is created once per idempotency key; client callback cannot mark payment paid; duplicate webhook is a no-op; only verified matching payment can confirm order.  |
| Failure scenarios | Stock mismatch → checkout blocked/repriced; provider timeout → pending/retry-safe result; failed payment → failed attempt/order remains payable if policy permits; signature failure → reject and alert. |
| Audit events      | `order.created`, `inventory.reserved`, `payment.order_created`, `payment.webhook_received`, `payment.confirmed`, `payment.failed`, `payment.duplicate_ignored`.                                          |
| Dependencies      | Cart/inventory transaction, Razorpay adapter, webhook verifier, idempotency store, outbox/worker.                                                                                                        |

## FR-07 Analytics, experiments, and audit explorer

| Field             | Requirement                                                                                                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Purpose           | Measure agent impact and provide traceability.                                                                                                                                       |
| Inputs            | Idempotent commerce events; decision/offer/order references; experiment configuration; date/filter scopes.                                                                           |
| Outputs           | Attributed funnel metrics, experiment metrics, decision trace, audit-event query results.                                                                                            |
| Validation        | Event name/schema/version allowlisted; referenced tenant matches; analyst scope enforced; experiment allocation totals 100%.                                                         |
| Business rules    | Raw events are append-only; attribution records decision lineage without claiming causality outside experiment methodology; refund adjusts net metrics; audit records are immutable. |
| Failure scenarios | Duplicate event → deduplicate; warehouse delay → show freshness timestamp; invalid experiment → remain draft; analytics failure → source transactions unaffected.                    |
| Audit events      | `event.accepted`, `event.deduplicated`, `experiment.created`, `experiment.started`, `analytics.exported`, `audit.viewed`.                                                            |
| Dependencies      | Event outbox, worker, reporting store/replica, authorization, audit repository.                                                                                                      |
