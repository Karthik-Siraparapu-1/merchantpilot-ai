# User Stories

Each story is independently testable and maps to functional requirements and acceptance criteria.

## Merchant setup and governance

| ID    | Story                                                                                                                           | Priority |
| ----- | ------------------------------------------------------------------------------------------------------------------------------- | -------- |
| US-01 | As a merchant owner, I want to register and create a tenant so my store data is isolated.                                       | Must     |
| US-02 | As an owner, I want to invite and assign roles so my team has only the access it needs.                                         | Must     |
| US-03 | As an owner, I want to configure storefront origins, currency, and checkout settings so shoppers interact with the right store. | Must     |
| US-04 | As a growth manager, I want to configure recommendation, offer, and safety policies so the agent follows commercial rules.      | Must     |
| US-05 | As an owner, I want to pause AI recommendations or an offer immediately so I can manage risk.                                   | Must     |
| US-06 | As a support agent, I want to inspect redacted decision and order history so I can resolve issues.                              | Must     |

## Catalog and inventory

| ID    | Story                                                                                                                          | Priority |
| ----- | ------------------------------------------------------------------------------------------------------------------------------ | -------- |
| US-07 | As a catalog manager, I want to upload products and variants with structured attributes so the AI can retrieve suitable items. | Must     |
| US-08 | As a catalog manager, I want invalid rows identified without blocking valid rows so catalog correction is efficient.           | Should   |
| US-09 | As a catalog manager, I want to see indexing status and source version so I know which catalog data powers the agent.          | Must     |
| US-10 | As an inventory manager, I want stock updates to affect recommendations and checkout so unavailable items are not sold.        | Must     |

## Customer discovery and conversion

| ID    | Story                                                                                                                                      | Priority |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| US-11 | As a customer, I want to describe what I need naturally so I can discover suitable products without knowing catalog filters.               | Must     |
| US-12 | As a customer, I want to see why an item was recommended so I can assess its fit.                                                          | Must     |
| US-13 | As a customer, I want recommendations that respect budget, availability, and explicit constraints so results are useful.                   | Must     |
| US-14 | As a customer, I want complementary suggestions that are relevant to my basket and optional so I can improve my purchase without coercion. | Must     |
| US-15 | As a customer, I want a server-confirmed cart total before payment so I do not pay an unexpected amount.                                   | Must     |
| US-16 | As a customer, I want reliable payment status so I know whether my order is confirmed.                                                     | Must     |

## Growth, measurement, and operations

| ID    | Story                                                                                                                     | Priority |
| ----- | ------------------------------------------------------------------------------------------------------------------------- | -------- |
| US-17 | As a growth manager, I want to create an experiment with stable assignment so I can compare AI strategies fairly.         | Should   |
| US-18 | As a growth manager, I want attribution from AI decision through paid order/refund so I can evaluate incremental impact.  | Must     |
| US-19 | As an owner, I want to override an AI decision or policy within my authority so human judgment remains in control.        | Must     |
| US-20 | As a platform admin, I want to monitor failures and replay-safe jobs so I can operate the platform reliably.              | Must     |
| US-21 | As an auditor, I want to trace administrative changes and payment-state transitions to actor, time, request, and outcome. | Must     |

## Story-level rules

- Must-priority stories form the release-critical product path; Should stories may be feature flagged until their dependencies and measurement plan are complete.
- Stories involving a merchant or support user require authenticated tenant membership; customer stories require only valid storefront/session context.
- Every story that displays an AI decision inherits the evidence, confidence, explanation, and audit-record requirement.
