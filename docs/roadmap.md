# Roadmap

Complexity combines implementation breadth, integration risk, and operational sensitivity; it is not a calendar commitment.

## Milestone 0 — Architecture and delivery baseline

- **Objectives:** ratify product boundaries, security model, APIs, schema, and operational standards.
- **Deliverables:** this documentation set, ADR process, domain glossary, acceptance-criteria template.
- **Dependencies:** merchant journey and Razorpay Test Mode account availability.
- **Estimated complexity:** Medium.

## Milestone 1 — Commerce foundation

- **Objectives:** establish tenant isolation, identity, catalog, inventory, and audited administration.
- **Deliverables:** tenant/RBAC model, catalog/inventory APIs, migrations, seed strategy, audit logging, CI quality gates.
- **Dependencies:** Milestone 0 approval and identity-provider decision.
- **Estimated complexity:** High.

## Milestone 2 — Shopper discovery and conversational commerce

- **Objectives:** enable shopper discovery through search and grounded conversation.
- **Deliverables:** session model, conversation APIs, catalog retrieval, safe-response policy, explanation display, E2E tests.
- **Dependencies:** catalog foundation, approved LLM provider/content policy.
- **Estimated complexity:** High.

## Milestone 3 — Recommendations and intelligent upsell

- **Objectives:** deliver controlled recommendations and basket-aware offers with measurable outcomes.
- **Deliverables:** candidate/ranking pipeline, offer rules, decision records, experiments, event tracking, merchant controls.
- **Dependencies:** Milestone 2 event model and representative catalog data.
- **Estimated complexity:** Very High.

## Milestone 4 — Razorpay Test Mode checkout

- **Objectives:** connect order and payment state safely to the shopping journey.
- **Deliverables:** idempotent order API, Test Mode adapter, signature verification, webhook ledger, reconciliation views, failure-path tests.
- **Dependencies:** Milestone 1 order model and Test Mode keys/webhook endpoint.
- **Estimated complexity:** High.

## Milestone 5 — Merchant intelligence and reliability

- **Objectives:** make growth impact and system behavior operable.
- **Deliverables:** attribution dashboard, decision explorer, alerting, traces, SLOs, incident runbooks, retention jobs.
- **Dependencies:** stable event taxonomy and milestones 3–4 telemetry.
- **Estimated complexity:** High.

## Milestone 6 — Production readiness review

- **Objectives:** prove controlled production-rollout readiness beyond the buildathon.
- **Deliverables:** threat model, load/recovery tests, backup restore exercise, privacy review, dependency scan, rollout/rollback plan.
- **Dependencies:** all prior milestones; production-payment approval is separate.
- **Estimated complexity:** Very High.
