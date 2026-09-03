# Technology Stack

Selections optimize for type safety, operational maturity, maintainable boundaries, and a practical Buildathon delivery path. Versions are pinned during implementation after compatibility review.

| Concern            | Selected technology                  | Why selected                                                                       | Alternatives considered                                                                                |
| ------------------ | ------------------------------------ | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Web application    | Next.js + TypeScript                 | SSR/streaming, mature routing, strong React ecosystem, shared TypeScript contracts | Vite SPA lacks first-class server rendering; Remix is viable but narrower for this team                |
| Core API           | NestJS + TypeScript                  | Modular DI, guards, validation, OpenAPI, testing patterns                          | Express requires more conventions; FastAPI here would split core contracts across runtimes             |
| AI service         | FastAPI + Python                     | Mature AI/retrieval libraries and isolated model-dependency runtime                | NestJS AI module couples rapid AI dependency change to core API; Flask has fewer production ergonomics |
| Transactional data | PostgreSQL                           | ACID, constraints, JSONB, row-level security, pgvector path                        | MongoDB weakens relational integrity; MySQL offers less flexible RLS/indexing strategy                 |
| Vector retrieval   | pgvector initially                   | Tenant filters and catalog metadata stay close to embeddings                       | Pinecone/Weaviate become viable at proven scale/latency need                                           |
| Cache/rate limits  | Redis                                | Low latency cache, atomic counters, distributed limits, queue backing              | In-memory cache fails across replicas; Memcached lacks required structures                             |
| Async work         | BullMQ on Redis                      | Idempotent jobs, retry/backoff, delayed work, low operational footprint            | RabbitMQ adds routing power but greater operational cost; SQS ties cloud choice early                  |
| ORM/migrations     | Prisma or Drizzle after spike        | Typed access and migration discipline                                              | Raw SQL alone slows standard access; active-record ORM blurs domain boundaries                         |
| API contract       | OpenAPI 3.1 + JSON Schema            | Language-neutral validation and generated clients                                  | GraphQL complicates caching, authorization, and payment workflow contracts                             |
| Authentication     | OIDC-compatible managed provider     | MFA, session hardening, standards interoperability                                 | Custom password auth creates unnecessary security burden                                               |
| Observability      | OpenTelemetry + structured JSON logs | Vendor-neutral correlation across API, worker, AI, webhooks                        | Vendor-only SDKs fragment context and create lock-in                                                   |
| CI/CD              | GitHub Actions + registry + IaC      | Repository-adjacent review/policy gates and ecosystem support                      | Jenkins increases maintenance; cloud pipelines are viable after cloud decision                         |

## Deliberate constraints

The core API starts as a modular monolith because catalog, orders, payments, and authorization benefit from one deployment and transaction boundary. AI inference and workers are isolated because their resource and failure characteristics differ. Extract modules only when independent scaling, ownership, or availability requirements are proven.

Razorpay sits behind a payment-provider port. Test Mode payloads never shape domain entities directly, preserving a future provider adapter while retaining provider-specific webhook verification.
