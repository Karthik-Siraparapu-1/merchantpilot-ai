# Non-Functional Requirements

Requirements are release gates unless explicitly marked as a capacity-planning target. Measurements use production-like staging load, synthetic data, and distributed traces with upstream-provider latency reported separately.

## Performance and latency

| ID | Requirement | Target / measurement |
|---|---|---|
| NFR-P01 | Standard catalog, cart, and merchant read APIs shall meet p95 latency. | ≤ 400 ms at agreed baseline load, excluding client network |
| NFR-P02 | Cart mutation and order creation shall meet p95 latency excluding Razorpay provider wait. | ≤ 700 ms; provider latency separately traced |
| NFR-P03 | A cached/ranked recommendation response shall meet p95 latency. | ≤ 800 ms |
| NFR-P04 | A generated conversational response shall provide a first response/fallback within bounded time. | ≤ 3 s p95; hard timeout at 8 s |
| NFR-P05 | Webhook acknowledgement shall not wait for downstream analytics. | ≤ 500 ms p95 after signature validation |

## Availability, resilience, and recovery

| ID | Requirement | Target / measurement |
|---|---|---|
| NFR-A01 | Customer storefront/API availability shall be measured monthly. | 99.9%, excluding announced maintenance and provider outages |
| NFR-A02 | Payment webhook ingestion shall remain replay-safe during restarts/failures. | No duplicate state transition in replay test suite |
| NFR-A03 | State-changing operations shall be idempotent. | Replayed request returns original outcome or documented conflict |
| NFR-A04 | Background jobs shall use bounded retries and dead-letter handling. | Retry policy observable; failed terminal jobs alert within 5 min |
| NFR-A05 | Backups and recovery shall be tested. | Quarterly restore rehearsal; RPO ≤ 15 min, RTO ≤ 4 h for planned production target |

## Scalability

| ID | Requirement | Target / measurement |
|---|---|---|
| NFR-S01 | Stateless web/API services shall scale horizontally without session affinity. | Load test proves replica scale-out preserves correctness |
| NFR-S02 | Tenant data isolation shall remain effective under concurrent tenant traffic. | Automated cross-tenant negative tests pass on every release |
| NFR-S03 | Event, audit, and webhook workloads shall not degrade transactional checkout queries. | Partition/outbox plan; checkout query p95 remains within NFR-P02 |
| NFR-S04 | Indexing shall be asynchronous and versioned. | Partial/failed index never replaces last successful active index |

## Security and privacy

| ID | Requirement | Target / measurement |
|---|---|---|
| NFR-SC01 | All external traffic shall use current TLS; secrets shall not be exposed client-side. | Automated header/config and secret scan pass |
| NFR-SC02 | Authorization shall be deny-by-default and tenant-aware. | 100% protected endpoint test coverage for role/tenant matrix |
| NFR-SC03 | Payment card data shall not enter application storage/logs. | Payload/log inspection and integration test evidence |
| NFR-SC04 | Webhook signatures and event uniqueness shall be enforced. | Valid, invalid, stale, and duplicate fixture tests pass |
| NFR-SC05 | Sensitive fields shall be redacted from logs and AI-provider payloads unless explicitly approved. | Log and provider-payload test assertions pass |

## Explainability and AI quality

| ID | Requirement | Target / measurement |
|---|---|---|
| NFR-E01 | Displayed AI decisions shall be explainable and auditable. | 100% contain confidence, explanation, evidence, policy/model version, audit ID |
| NFR-E02 | AI may not claim price, stock, promotion, policy, or payment facts lacking evidence. | Zero critical unsupported-claim findings in release evaluation set |
| NFR-E03 | Low-confidence decisions shall fail safely. | Below-threshold fixtures show clarification/fallback, never definitive recommendation |
| NFR-E04 | AI output shall be schema and policy validated before display. | 100% of production decision paths pass validator or suppress |
| NFR-E05 | Merchant override/pause shall take effect for new requests quickly. | ≤ 60 seconds end-to-end propagation |

## Maintainability and delivery quality

| ID | Requirement | Target / measurement |
|---|---|---|
| NFR-M01 | Domain logic shall not depend on framework or provider SDKs. | Architecture tests/review enforce dependency rule |
| NFR-M02 | API and event contracts shall be versioned and compatibility tested. | Contract test suite on every pull request |
| NFR-M03 | Database migrations shall be backwards compatible and reversible by application rollout. | Migration review checklist; staging migration test |
| NFR-M04 | Critical payment, authorization, and policy paths shall have automated tests. | 100% requirement-to-test mapping in acceptance matrix |
| NFR-M05 | Releases shall be attributable and rollback-ready. | Immutable artifact, change record, rollback procedure per release |

## Observability

Every API request, AI decision, job, and provider interaction shall carry a correlation ID. Logs shall be structured, redacted, and tenant-safe. Metrics shall include request/error/latency, rate-limit events, policy rejections, AI-stage latency/confidence/fallback, queue depth/retry/DLQ, payment/webhook state, and business funnel events. Distributed traces must join storefront request, API, AI stage, database query, Razorpay call, webhook, and worker event when applicable. Alerting thresholds are owned by operations and reviewed after each incident.

## Accessibility and usability

Shopper and merchant experiences shall conform to WCAG 2.2 AA for implemented interfaces: keyboard operation, focus order/visibility, semantic controls, contrast, form labels/errors, non-color-only status, screen-reader announcements for conversational responses, and accessible payment handoff. Explanations must use concise plain language and never depend on an icon or color alone. Responsive layouts support current desktop and mobile viewport ranges defined by the frontend design system.
