# MerchantPilot AI - Database Schema Guide

This document provides complete documentation for the PostgreSQL database schema implemented via Prisma 6 for **MerchantPilot AI**.

---

## Architectural Principles

1. **Strict Normalization:** Third Normal Form (3NF) is maintained across all transactional domain entities. Unstructured metadata is stored in queryable `JSONB` fields where variability is inherent (e.g., model configurations, analytics metadata, and state snapshots).
2. **UUID Primary Keys:** Every table uses PostgreSQL native `UUID` (`uuid_generate_v4()`) primary keys for decentralized key generation and secure identifier exposure.
3. **Monetary Precision:** All prices and payment amounts are stored as integer minor units (`priceMinor`, `amountMinor`, e.g., Paise for INR). Floating point types are avoided for currency values to prevent rounding errors.
4. **Auditability & Compliance:** All compliance, payment, and AI decision models (`AuditLog`, `AIExecution`, `WebhookEvent`, `AnalyticsEvent`) are append-only ledgers. Foreign keys linking to transactional entities use `ON DELETE SET NULL` or `ON DELETE RESTRICT` to preserve history even if master records change.
5. **Cascade Scoping:** Container hierarchies (`Store` -> `Catalog` -> `Category` -> `Product` -> `Inventory`) employ `ON DELETE CASCADE` to clean up child resources when a store or product is intentionally removed.

---

## Detailed Model Specifications

### 1. Identity & RBAC Domain

#### `Merchant`

Top-level multi-tenant account boundary.

- **`id`**: `UUID` (PK)
- **`slug`**: `String` (UNIQUE) - URL-safe merchant handle.
- **Indexes**: `(createdAt)`, `(status)`

#### `User`

Human user identities (merchant owners, support staff, merchandisers, and shoppers).

- **`id`**: `UUID` (PK)
- **`email`**: `String` (UNIQUE) - Case-normalized unique user email.
- **Indexes**: `(email)`, `(status)`, `(createdAt)`

#### `Role`

Multi-tenant Role-Based Access Control (RBAC) mapping.

- **`merchantId`**, **`userId`**: Foreign keys mapping user to merchant with assigned `UserRole` enum (`MERCHANT_OWNER`, `MERCHANDISER`, `SUPPORT_AGENT`, `PLATFORM_OPERATOR`, `SHOPPER`).
- **Constraints**: `UNIQUE(merchantId, userId)`

---

### 2. Store & Catalog Domain

#### `Store`

Storefront configuration instance owned by a merchant.

- **`publicKey`**: `UUID` (UNIQUE) - Client-facing API key for storefront SDKs.
- **`status`**: `StoreStatus` enum (`ACTIVE`, `INACTIVE`, `MAINTENANCE`).

#### `Catalog` & `Category`

Product organization hierarchy. `Category` contains a self-referencing `parentId` for nested subcategories.

- **Constraints**: `UNIQUE(catalogId, slug)`

#### `Product`

Sellable catalog items.

- **`priceMinor`**: Integer price in minor units (e.g., 1499900 = ₹14,999.00).
- **Constraints**: `UNIQUE(storeId, sku)` - Guarantees unique SKU per store.

#### `Inventory`

Real-time stock balance tracking with concurrent reservation capability.

- **`availableQuantity`**: Stock available for purchase.
- **`reservedQuantity`**: Stock locked in active checkouts.
- **`reorderThreshold`**: Inventory trigger level for merchant restock alerts.

---

### 3. Merchandising & Commercial Policies

#### `MerchantPolicy`

Structured rules defining AI decision boundaries.

- **`maxDiscountPercent`**: Cap on automated discounts (e.g., `15.0`%).
- **`minCartValueForUpsell`**: Basket threshold (minor units) required before triggering upsell suggestions.
- **`blacklistedCategoryIds`**: JSON array of category UUIDs excluded from AI processing.
- **`minConfidenceThreshold`**: Minimum AI model score required before displaying recommendations.

#### `Offer`

Promotional offers governed by merchant policies.

- **`offerType`**: `PERCENTAGE_DISCOUNT`, `FIXED_AMOUNT_DISCOUNT`, `BUY_X_GET_Y`, `FREE_SHIPPING`.

---

### 4. A/B Testing & Experimentation

#### `Experiment` & `ExperimentVariant`

First-class A/B testing infrastructure enabling quantitative comparison of recommendation models and prompt policies.

- **`trafficAllocation`**: Percentage split for variant assignment (e.g., `0.5` for 50/50 split).
- **`modelConfig`**: JSON payload configuring prompt parameters or AI ranker weights.

---

### 5. Conversational AI & Explainability Engine

#### `Conversation` & `Message`

Dialogue stream between shoppers, AI assistant, and human support agents.

- **`actor`**: `SHOPPER`, `AI_ASSISTANT`, `SUPPORT_AGENT`, `SYSTEM`.

#### `AIExecution`

Detailed trace for every AI retrieval, candidate evaluation, and reranking step.

- **`intent`**: Recognized shopper intent.
- **`retrievedProducts`**: Vector/keyword retrieval candidate product IDs.
- **`candidateProducts`**: Candidates passed to reranker.
- **`rankingScores`**: JSON map of product IDs to relevance scores.
- **`latency`**: Execution duration in milliseconds.
- **`tokensUsed`**: Total LLM tokens consumed.

#### `Recommendation` & `RecommendationReason`

AI-generated product suggestions presented to the shopper.

- **`confidence`**: Floating-point score `[0.0 - 1.0]`.
- **`revenueLiftPrediction`**: Predicted conversion/revenue lift percentage.
- **`reasons`**: Structured explanation codes (e.g., `COLOR_HARMONY`, `BASKET_COMPLEMENT`).

---

### 6. Cart, Orders & Payment Lifecycle

#### `Cart` & `CartItem`

Shopper basket container.

- **Constraints**: `UNIQUE(cartId, productId)`

#### `Order` & `OrderItem`

Immutable commercial purchase commitment.

- **`orderNumber`**: Human-readable unique invoice number.
- **`razorpayOrderId`**: UNIQUE Razorpay Test Mode Order ID.

#### `Payment`

Payment attempt reconciliation ledger.

- **`razorpayPaymentId`**: UNIQUE Razorpay Payment ID.
- **`status`**: `INITIATED`, `AUTHORIZED`, `CAPTURED`, `FAILED`, `REFUNDED`.

---

### 7. Audit, Webhooks & Analytics Stream

#### `AuditLog`

Security and compliance log capturing all administrative and AI mutations.

- **`correlationId`**: HTTP request trace ID linking web requests to async job execution.
- **`beforeState`** & **`afterState`**: JSON state snapshots before and after mutation.

#### `WebhookEvent`

Idempotent webhook processing log for Razorpay payment notifications.

- **`eventId`**: UNIQUE webhook notification ID.

#### `AnalyticsEvent`

Funnel metrics event stream for revenue attribution and conversion tracking.

- **`eventType`**: `RECOMMENDATION_IMPRESSION`, `RECOMMENDATION_CLICK`, `UPSELL_ACCEPTED`, `CHECKOUT_STARTED`, `PAYMENT_SUCCESS`, `PAYMENT_FAILED`, `REVENUE_ATTRIBUTED`.
- **`revenueAmount`**: Attributed financial value in minor units.

---

## Indexing Strategy

Comprehensive B-tree indexes are implemented across all high-frequency query patterns:

1. **Foreign Keys:** Indexes on all `merchantId`, `storeId`, `conversationId`, `orderId`, `paymentId`, `experimentId`, and `productId` fields.
2. **Status Filtering:** Indexes on `status`, `offerStatus`, `eventType`, and `actorType`.
3. **Time-Series Queries:** Indexes on `createdAt` across all ledgers for rapid time-range aggregation and reporting.
