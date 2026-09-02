# Sequence Diagrams

## Conversation flow

```mermaid
sequenceDiagram
  autonumber
  participant C as Customer
  participant W as Storefront
  participant API as API
  participant P as Policy Engine
  participant AI as AI Orchestrator
  participant DB as PostgreSQL
  C->>W: Submit message
  W->>API: POST conversation message (session, request ID)
  API->>API: Authenticate, rate limit, validate ownership/schema
  API->>DB: Load conversation, cart, tenant policy
  API->>P: Evaluate active policy and kill switch
  alt policy paused or denied
    P-->>API: Suppress AI response
    API->>DB: Persist suppression audit
    API-->>W: Safe unavailable response
  else allowed
    API->>AI: Structured context only
    AI-->>API: Intent, candidate decision, evidence, confidence
    API->>P: Validate output against policy and facts
    API->>DB: Persist message and immutable decision
    API-->>W: Grounded response or fallback
  end
```

## Recommendation flow

```mermaid
sequenceDiagram
  autonumber
  participant API as API
  participant I as Intent Agent
  participant R as Retrieval Agent
  participant C as Catalog/Inventory
  participant G as Ranking Agent
  participant E as Explanation Agent
  participant DB as Decision Store
  API->>I: Extract structured intent
  I-->>API: Intent + confidence
  API->>R: Retrieve within tenant and policy scope
  R->>C: Fetch active candidate facts
  C-->>R: Variant IDs, attributes, current status
  R-->>API: Candidates + evidence
  API->>API: Deterministically remove invalid stock/policy candidates
  API->>G: Rank eligible candidates
  G-->>API: Selected variants + score components
  API->>E: Generate evidence-bound explanation
  E-->>API: Explanation + reason codes
  API->>API: Require confidence/evidence/explanation/audit fields
  API->>DB: Persist decision before display
```

## Checkout flow

```mermaid
sequenceDiagram
  autonumber
  participant C as Customer
  participant W as Storefront
  participant API as API
  participant DB as PostgreSQL
  participant R as Razorpay Test Mode
  C->>W: Checkout cart
  W->>API: POST order + Idempotency-Key
  API->>DB: Lock cart; reprice and validate inventory/session
  alt invalid cart or stock mismatch
    API-->>W: 409 current price/availability
  else valid
    API->>DB: Create pending order/payment attempt, reserve stock
    API->>R: Create provider order with server amount
    alt provider responds
      R-->>API: Provider order ID
      API->>DB: Persist provider reference/outbox event
      API-->>W: Public checkout fields
    else timeout
      API->>DB: Persist retry-safe pending outcome
      API-->>W: Retry-safe processing response
    end
  end
```

## Webhook flow

```mermaid
sequenceDiagram
  autonumber
  participant R as Razorpay Test Mode
  participant API as Webhook API
  participant DB as PostgreSQL
  participant Q as Worker Queue
  R->>API: Event payload + signature
  API->>API: Enforce size/time limits; verify signature
  alt invalid signature
    API->>DB: Audit rejected event metadata
    API-->>R: 401/400
  else valid
    API->>DB: Insert provider event idempotently
    alt duplicate event
      API-->>R: 200 already processed
    else new event
      API->>DB: Validate provider/order amount/currency/state; transition atomically
      API->>Q: Enqueue attribution/reconciliation event
      API-->>R: 200 acknowledged
    end
  end
```
