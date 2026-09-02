# REST API Design

Base path: `/api/v1`. JSON uses `application/json`; timestamps are ISO 8601 UTC; IDs are UUIDv7. Collections use cursor pagination (`limit`, `cursor`). APIs are tenant-scoped through authenticated merchant membership or a public storefront key; clients cannot supply arbitrary tenant IDs.

## Conventions

- State-changing requests require an `Idempotency-Key` UUID and return the original result on replay within its retention window.
- Every response carries `X-Request-Id`; clients may supply one for trace correlation.
- Writes use optimistic concurrency through `If-Match`/ETag where merchant edits conflict.
- Webhooks require verified Razorpay signature, timestamp checks, and event deduplication.

## Authentication and authorization

Merchant APIs use OIDC bearer access tokens. The API verifies issuer, audience, expiry, signature, tenant membership, and scopes. Shopper APIs use a signed short-lived storefront session; anonymous sessions receive a rotating opaque identifier. Permission is evaluated server-side for every resource. Payment actions additionally validate order tenant, shopper/session, currency, amount, and state.

## Endpoints

| Area | Method and path | Authorization | Purpose |
|---|---|---|---|
| Identity | `GET /me` | authenticated | Current actor and memberships |
| Tenants | `GET /tenants/{tenantId}` | `tenant:read` | Tenant configuration |
| Catalog | `GET /products` | storefront or `catalog:read` | Filtered product listing |
| Catalog | `POST /products` | `catalog:write` | Create product |
| Catalog | `PATCH /products/{productId}` | `catalog:write` | Update product with ETag |
| Inventory | `PATCH /variants/{variantId}/inventory` | `inventory:write` | Adjust inventory with reason |
| Conversations | `POST /storefront/conversations` | storefront | Start conversation |
| Conversations | `POST /storefront/conversations/{id}/messages` | storefront | Send message and receive grounded answer |
| Recommendations | `GET /storefront/recommendations` | storefront | Get basket-aware recommendations |
| Offers | `POST /storefront/offers/evaluate` | storefront | Evaluate eligible upsells |
| Cart | `POST /storefront/carts` | storefront | Create cart |
| Cart | `PATCH /storefront/carts/{id}/items` | storefront | Add, update, or remove item |
| Checkout | `POST /storefront/orders` | storefront | Create pending order and Razorpay order |
| Checkout | `GET /storefront/orders/{id}` | storefront | Read permitted order state |
| Payments | `POST /webhooks/razorpay` | Razorpay signature | Receive provider event |
| Experiments | `POST /experiments` | `experiment:write` | Create controlled experiment |
| Analytics | `GET /analytics/revenue-attribution` | `analytics:read` | Explain decision/offer impact |
| Audit | `GET /audit-events` | `audit:read` | Search auditable activity |

## Request and response

`POST /api/v1/storefront/conversations/{id}/messages`

```json
{
  "message": "I need a lightweight office backpack under ₹3000",
  "locale": "en-IN",
  "context": { "cartId": "018f3c76-9b9c-7a82-a3d3-a863a2e36f5e" }
}
```

```json
{
  "data": {
    "messageId": "018f3c77-0d4f-7cb0-9876-636e1af0a24e",
    "answer": "These options match your budget and laptop-size preference.",
    "recommendations": [{
      "productId": "018f3c72-dc1a-7748-a843-9b2b12b2c417",
      "variantId": "018f3c73-73f4-7b1e-a4d3-5ef36d304af9",
      "rank": 1,
      "explanation": {
        "reasonCodes": ["BUDGET_MATCH", "USE_CASE_MATCH", "IN_STOCK"],
        "evidence": ["Price ₹2,799", "15-inch laptop compartment", "Available inventory"]
      }
    }]
  },
  "meta": { "requestId": "...", "decisionId": "..." }
}
```

`POST /api/v1/storefront/orders` includes `cartId`, shipping details, and an idempotency-key header. Its response exposes only public Razorpay checkout-order fields required by the browser; server secret values are never returned.

## Errors and validation

All failures use RFC 9457 problem details:

```json
{
  "type": "https://merchantpilot.ai/problems/validation-failed",
  "title": "Request validation failed",
  "status": 422,
  "code": "VALIDATION_FAILED",
  "detail": "One or more fields are invalid.",
  "errors": [{ "field": "message", "code": "MAX_LENGTH", "message": "Must not exceed 2000 characters." }],
  "requestId": "..."
}
```

Use `400` malformed request, `401` invalid/absent identity, `403` denied permission, `404` non-discoverable resource, `409` conflicting state/ETag, `422` semantic validation, `429` quota exceeded, and `5xx` unexpected/upstream failure. Validate schemas at the edge; normalize strings; constrain pagination and filter allowlists; validate money as integer minor units plus ISO currency; ignore unknown fields; and repeat domain validation in the application layer.
