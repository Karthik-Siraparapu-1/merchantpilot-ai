# AI Decision Audit Trail

## Purpose and guarantees

The audit trail makes every AI-assisted commerce decision reconstructable without storing private reasoning traces. It records who/what triggered it, approved data considered, products rejected and why, policy/model versions applied, output displayed, and measured commerce outcome.

Records are append-only, tenant-scoped, tamper-evident through immutable event IDs and restricted write paths, and redacted before operational viewing. Historical records are never altered for later catalog or policy changes.

## Decision record

| Field                                                                                                      | Purpose                                              |
| ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `decision_id`, `occurred_at`, `request_id`, `trace_id`                                                     | Immutable trace and timeline                         |
| `tenant_id`, `storefront_id`, `session_id`, `customer_id_hash`, `conversation_id`, `message_id`, `cart_id` | Tenant-safe journey linkage                          |
| `decision_type`, `outcome`, `input_fingerprint`, `intent_snapshot`                                         | Decision and privacy-minimised input context         |
| `catalog_snapshot_version`, `retrieval_index_version`                                                      | Evidence freshness                                   |
| `retrieved_products`, `rejected_products`, `selected_products`                                             | Candidate provenance and stage-specific reasons      |
| `ranking_score_components`, `score_version`                                                                | Relevance/revenue score explanation                  |
| `merchant_policy_version`, `policy_checks`, `override_id`                                                  | Policy applied, rejected, and human-control trace    |
| `offer_evaluation`                                                                                         | Eligibility, discount basis, expected basket delta   |
| `confidence_score`, `confidence_version`, `customer_explanation`, `evidence_links`                         | Required explainability envelope                     |
| `model_metadata`, `fallback_state`, `error_code`, `execution_ms`                                           | Provider/template/index version and operations trace |

## Outcome linkage

The system appends—not updates—impression, click, cart add/remove, checkout start, provider-order creation, payment confirmation/failure, refund, and experiment-exposure events. They carry `decision_id` plus session/cart/order IDs when available. Reporting derives associated revenue and AOV effects; it labels causal lift only after an approved controlled experiment.

## Broader events, access, and retention

Mandatory non-decision events include policy/override changes, catalog/index lifecycle, authentication/authorization failures, prompt-injection flags, payment/webhook lifecycle, and job retry/dead-letter actions. Merchant owner/admin and authorized analyst roles may query their own tenant; support sees redacted fields; platform access is time-bound break-glass with additional audit. Retention follows data classification. Permitted deletion/anonymization removes customer-linked personal data while retaining minimally necessary non-identifying financial and audit evidence. Audit export is asynchronous, permission-checked, watermarkable, and audited.
