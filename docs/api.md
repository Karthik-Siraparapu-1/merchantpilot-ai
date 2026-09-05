# MerchantPilot AI — API Documentation

## Base URL

```
http://localhost:3001/api/v1
```

## Authentication & Headers

All requests must include standard JWT Bearer authentication and tenant organization headers:

```http
Authorization: Bearer <your_jwt_token>
X-Tenant-Id: <organization_id>
```

---

## Core Endpoints

### 1. Dashboard Metrics

- **`GET /dashboard/metrics`** — Fetch operational metrics, revenue, low stock counts, and recent orders.

### 2. Products Catalog

- **`GET /products`** — Query active catalog items with pagination & search filtering.
- **`POST /products`** — Create a new SKU item.
- **`PATCH /products/:id/price`** — Execute dynamic price adjustment.

### 3. Orders & Transactions

- **`GET /orders`** — Fetch multi-channel orders stream with fraud status filters.
- **`POST /orders/:id/hold`** — Place an automated or manual fraud hold on an order.

### 4. Inventory Telemetry

- **`GET /inventory`** — Query warehouse stock levels, velocity, and low-stock alerts.
- **`POST /inventory/purchase-order`** — Auto-generate purchase order to supplier.

### 5. AI Copilot & Reasoning

- **`POST /ai/copilot/query`** — Send conversational question to Copilot engine; streams step-by-step reasoning and action proposal cards.
- **`GET /ai/workforce`** — Query current status of all 7 digital AI executives.
- **`POST /ai/actions/:id/rollback`** — Undo an executed AI action.

### 6. Reports

- **`POST /reports/generate`** — Generate executive PDF/CSV report summary.
