# MerchantPilot AI

MerchantPilot AI is an explainable AI commerce platform for Indian merchants. It turns browsing and purchase intent into measurable revenue opportunities through conversational shopping, product recommendations, intelligent upsells, and Razorpay Test Mode payment flows.

## Problem statement

Merchants often have product data and transaction data but no trustworthy, actionable layer that connects customer intent to a better basket. Generic recommendations are hard to inspect, manual merchandising does not scale, and checkout experiences rarely use contextual upsell opportunities. MerchantPilot AI makes those decisions visible, controlled, and measurable.

## Objectives

- Help merchants increase conversion rate, average order value, and repeat purchase rate.
- Give shoppers relevant conversational discovery and recommendations without opaque automation.
- Give merchant teams controls, explanations, experiment results, and audit trails.
- Integrate a safe, idempotent checkout flow using Razorpay Test Mode APIs during the buildathon.
- Establish production-quality foundations for security, observability, and long-term maintenance.

## Features

- Multi-tenant merchant workspace, catalog, inventory, and storefront configuration.
- Conversational shopping assistant grounded in merchant-approved catalog data.
- Explainable product recommendations and basket-aware upsell offers.
- Merchant controls for recommendation policy, offer eligibility, and AI knowledge sources.
- Event instrumentation, experimentation, revenue attribution, and decision audit history.
- Razorpay Test Mode order creation, payment verification, webhook processing, and refunds model.
- Role-based access control, tenant isolation, and operational audit logs.

## Target users

- **Merchant owner:** configures the store, reviews revenue impact, and controls commercial policy.
- **Merchandiser/growth manager:** curates catalog, offers, and experiments.
- **Support agent:** inspects shopper conversations and order state without changing payment controls.
- **Shopper:** discovers products, receives relevant suggestions, and checks out securely.
- **Platform operator:** supports tenants, monitors integrations, and investigates incidents.

## Technology stack

The planned stack is Next.js with TypeScript for the web experience, NestJS for the core API, Python/FastAPI for isolated AI inference and retrieval, PostgreSQL as the transactional system of record, Redis for cache and rate limiting, and a worker queue for asynchronous work. Details and alternatives are in [docs/tech-stack.md](docs/tech-stack.md).

## Architecture summary

MerchantPilot AI is a modular, multi-tenant system. The frontend communicates only with a versioned REST API. The API owns business workflows and persists authoritative commerce data in PostgreSQL. An isolated AI service performs retrieval, ranking, and generation against approved data, returning structured decisions with explanations. Webhooks and analytical work are handled asynchronously. See [docs/architecture.md](docs/architecture.md).

## Folder structure

```text
merchantpilot-ai/
├── apps/
│   ├── web/                 # Next.js merchant console and shopper surfaces
│   ├── api/                 # NestJS modular monolith
│   ├── ai-service/          # FastAPI retrieval, ranking, and explanation service
│   └── worker/              # asynchronous jobs and webhook follow-up
├── packages/
│   ├── contracts/           # versioned API and event contracts
│   ├── domain/              # domain types and invariants
│   ├── config/              # validated shared configuration
│   └── observability/       # logging, tracing, metrics conventions
├── infrastructure/          # IaC and deployment manifests (introduced later)
├── docs/
└── README.md
```

This is the target structure, not scaffolded code. Each deployable application maintains dependency direction toward domain contracts and never imports presentation concerns into the domain layer.

## Development workflow

1. Record an approved architecture decision when a cross-cutting decision changes.
2. Design contracts, database migration, authorization rules, and observability before implementation.
3. Implement vertical slices behind feature flags with unit, integration, and end-to-end coverage.
4. Require review for domain changes, security-sensitive code, schema migrations, and payment workflows.
5. Release progressively; monitor business and technical signals; retain rollback capability.

## Roadmap

Milestones, dependencies, and complexity are defined in [docs/roadmap.md](docs/roadmap.md). The first implementation phase begins only after this architecture is approved.

## Setup instructions

No runnable application is included yet. When implementation is approved, the setup process will require supported Node.js and Python runtimes, Docker for local dependencies, a PostgreSQL database, Redis, an LLM provider credential, and Razorpay Test Mode credentials. Environment-variable contracts and the intended deployment workflow are documented in [docs/deployment.md](docs/deployment.md); these instructions intentionally do not install or configure software.

## Contributing

- Keep changes small, reviewable, and tied to an issue or approved milestone.
- Preserve layer boundaries and update contracts, migrations, and documentation together.
- Add tests at the appropriate boundary; do not merge failing checks or unreviewed security changes.
- Never commit secrets, production data, payment payloads, or personally identifiable information.
- Use conventional commits and require at least one reviewer for non-trivial changes.

## License

Licensed under the [MIT License](LICENSE).
