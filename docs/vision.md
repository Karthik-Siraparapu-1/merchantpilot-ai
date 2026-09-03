# Product Vision

## Business vision

MerchantPilot AI is the decision layer between a merchant's catalog and a shopper's purchase intent. It helps merchants grow revenue responsibly by making every recommendation, upsell, and AI-generated answer traceable to merchant-approved data and measurable commercial outcomes. The product is designed for Indian digital merchants first and uses Razorpay Test Mode for payment integration validation during the buildathon.

## User personas

| Persona          | Primary need                                 | Key outcome                                          |
| ---------------- | -------------------------------------------- | ---------------------------------------------------- |
| Merchant owner   | Confident growth without a data-science team | Revenue visibility, governance, simple controls      |
| Growth manager   | Faster experimentation and merchandising     | Attributable, targeted offers                        |
| Catalog manager  | Accurate discovery                           | Structured catalog in natural language               |
| Shopper          | Low-friction selection                       | Relevant, truthful answers and simple checkout       |
| Support operator | Explain decisions and payment state          | Searchable conversation, decision, and order history |

## Merchant problems

- Product catalogs are difficult to browse when filters do not express shopper intent.
- Merchants cannot deploy recommendations confidently when selection reasons are hidden.
- Blanket discounts erode margin and do not distinguish high intent from casual browsing.
- Checkout recovery and payment lifecycle visibility are weak.
- Growth teams cannot reliably link an AI decision to conversion, revenue, and refunds.

## Success metrics

| Area                   | Metric                             | Success criterion                                        |
| ---------------------- | ---------------------------------- | -------------------------------------------------------- |
| Commerce               | Conversion rate                    | Credible improvement against control                     |
| Basket growth          | Average order value                | Positive incremental AOV after offer cost                |
| Recommendation quality | Click-through and add-to-cart rate | Improvement over baseline merchandising                  |
| Trust                  | Explanation coverage               | 100% of displayed recommendations stored with evidence   |
| AI safety              | Unsupported-answer rate            | Below agreed operational threshold; incidents reviewable |
| Reliability            | Checkout API success               | 99.9% excluding provider incidents                       |
| Latency                | Recommendation p95                 | Under 800 ms for cached/ranked results                   |

Experiment conclusions require sufficient sample size, stable instrumentation, and segmentation review.

## Product scope

### Included

- Tenant-aware merchant administration, catalog ingestion, product search, and inventory awareness.
- Conversational discovery grounded in catalog, merchant policy, and approved FAQs.
- Recommendations, complementary-product upsells, configurable eligibility, and explanations.
- Event collection, controlled experiments, attribution, reporting, and audit trails.
- Razorpay Test Mode order lifecycle integration and signed webhook verification.

### Excluded from the first release

- Lending, settlement, payouts, card data handling, or financial advice.
- Autonomous price changes, inventory purchasing, or merchant-account actions without approval.
- Production payment credentials and live payment collection.
- Cross-merchant data training or recommendation sharing.

## Future scope

- Additional sales channels, CRM/inventory integrations, and multilingual commerce.
- Merchant-approved segmentation and lifecycle campaigns.
- Bandit optimization with human-readable policy constraints.
- Marketplace-scale catalog ingestion, vector search sharding, and warehouse analytics.
- Production Razorpay rollout after security, reconciliation, and business-readiness review.
