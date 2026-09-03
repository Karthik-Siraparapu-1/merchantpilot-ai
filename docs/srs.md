# Software Requirements Specification — MerchantPilot AI

## 1. Purpose and product boundary

MerchantPilot AI is an explainable AI revenue-growth agent for the Razorpay AI Buildathon 2026, Track 01: AI Growth & Agentic Commerce. It helps a merchant improve conversion rate and average order value by converting customer intent into grounded product discovery, recommendations, and upsell opportunities. It is not a generic marketplace, payment gateway, ERP, or autonomous pricing engine.

The system serves independent merchant tenants and their shopper storefronts. The transactional core owns catalog, cart, order, payment-state, experiment, and audit records. Razorpay Test Mode is the payment provider during this product stage.

## 2. Business problem

### Revenue leakage

Merchants lose revenue when shoppers cannot translate an intention—such as a budget, occasion, compatibility need, or delivery constraint—into the right catalog choice. Search and category navigation force customers to understand merchant taxonomy. Relevant complementary items are surfaced inconsistently, and high-value intent signals vanish at checkout.

### Pain points

- Catalog growth makes manual merchandising and product matching slow and inconsistent.
- Generic “frequently bought together” logic is not aware of shopper intent, inventory, merchant policy, or margin constraints.
- Existing chat widgets often provide unsupported answers or recommendations with no merchant-visible rationale.
- Merchant teams lack an auditable link from AI decision to impression, cart action, purchase, refund, and experiment outcome.
- Payment interfaces often conflate client-side success feedback with authoritative payment state, creating support and reconciliation risk.

### Existing solutions and AI fit

Search, static bundles, rule engines, and generic chatbots solve narrow aspects of discovery but require high manual effort or do not explain their outputs. AI is valuable when constrained to merchant data: it can recognize natural-language intent, retrieve semantically relevant candidates, rank them under business rules, and present a concise explanation. Deterministic policy, inventory, price, and payment validation remain authoritative; the model does not make those facts up.

## 3. Product vision and measurable outcomes

MerchantPilot AI provides a merchant-controlled agent that converts customer intent into qualified commerce decisions, explains why each decision was made, and measures the resulting revenue impact.

| Outcome                    | KPI                                                     | Measurement                                                                        |
| -------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Better purchase completion | Conversion rate                                         | Paid orders / eligible shopper sessions, segmented by experiment                   |
| Larger baskets             | Average order value                                     | Paid order revenue / paid orders, net of refunds and offer cost                    |
| Recommendation relevance   | Recommendation CTR and add-to-cart rate                 | Attributable events divided by eligible impressions                                |
| Commercial integrity       | Discount cost and gross-margin guardrail adherence      | Order/offer ledger against merchant policy                                         |
| Explainability             | Explanation coverage                                    | Decisions with reason codes, evidence, model/policy versions / displayed decisions |
| Reliability                | Checkout completion and webhook-processing success rate | Provider-correlated order attempts and events                                      |

Success claims require a pre-registered baseline/control, consistent event instrumentation, sufficient sample, and segmentation for storefront, channel, and customer state.

## 4. Personas

| Persona        | Goals                                | Authorized capabilities                                                                             |
| -------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------- |
| Merchant owner | Grow revenue while retaining control | Tenant settings, policy approval, roles, analytics, overrides                                       |
| Growth manager | Run offers and experiments           | Configure eligible offers, experiments, recommendation policy within granted limits                 |
| Customer       | Find a suitable product and pay      | Conversation, cart, checkout, order-status access for own session                                   |
| Platform admin | Operate platform safely              | Tenant support and platform health; no default access to sensitive tenant data                      |
| Support agent  | Resolve customer/merchant issues     | Read redacted decisions, conversations, orders, and payment state; no secret/payment-control access |

## 5. End-to-end journey

1. A merchant registers through OIDC and creates a tenant; the owner membership and audit event are created atomically.
2. The owner completes onboarding: business profile, storefront, permitted origin, currency, and roles.
3. A catalog manager uploads or creates products/variants with price, inventory, attributes, media references, and status.
4. The catalog pipeline validates the data, publishes eligible records, creates embeddings, and records index version/status. Invalid rows are isolated with actionable errors.
5. The merchant configures policy: approved knowledge, prohibited claims/categories, offer eligibility, price/discount/margin constraints, confidence thresholds, and human-override status.
6. A customer starts an anonymous or authenticated storefront session and sends a question.
7. The intent agent extracts structured intent; the retrieval agent fetches only tenant-approved, active candidates; inventory and policy filters run before ranking.
8. The recommendation agent ranks candidates; the upsell agent evaluates complementary products and offers against cart, stock, policy, and experiment assignment.
9. The explanation agent produces customer-facing evidence-based reasons. The API persists the complete decision record before it is displayed.
10. The customer creates a cart. Server-side price and stock are authoritative; changes are reflected before checkout.
11. The API reserves the order/payment attempt and creates a Razorpay Test Mode order idempotently. The browser receives only public checkout fields.
12. Razorpay sends a signed webhook. The API verifies, deduplicates, validates order amount/currency/state, and atomically transitions payment/order state.
13. Commerce events feed attribution and analytics workers. Dashboards show funnel, offer, decision, and experiment results without mutating source transactions.

## 6. Scope and assumptions

Included: multi-tenant commerce data, merchant controls, customer conversation, explainable recommendations/upsells, cart/checkout, Razorpay Test Mode lifecycle, experimentation, analytics, and auditability. Excluded: live payment collection, card-data handling, payouts, lending, autonomous pricing, autonomous inventory procurement, and cross-merchant model training.

## 7. System constraints

- A recommendation is displayable only if it has a confidence score, non-empty explanation, retrieved evidence, and immutable audit record.
- AI output is advisory. Policy, eligibility, stock, price, promotion, authorization, and payment state are deterministic server decisions.
- Every tenant-owned request and record is tenant-scoped; cross-tenant retrieval is prohibited.
- State-changing API operations are idempotent. Payment confirmation is webhook-authoritative.

Detailed functional behavior is in [functional-requirements.md](functional-requirements.md), quality targets in [non-functional-requirements.md](non-functional-requirements.md), and verification conditions in [acceptance-criteria.md](acceptance-criteria.md).
