<div align="center">

# MerchantPilot AI

### The AI Commerce Operating System

**Autonomous digital employees that analyze, reason, forecast, protect, and execute commerce operations.**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-merchantpilot--ai--web.vercel.app-6366f1?style=for-the-badge&logo=vercel)](https://merchantpilot-ai-web.vercel.app)

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-555?logo=prisma)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

---

### 🌐 Live Production Application & Demo Sandbox

> **Live Web App:** [https://merchantpilot-ai-web.vercel.app](https://merchantpilot-ai-web.vercel.app)  
> **Executive Login:** `demo@merchantpilot.ai`  
> **Password:** `Demo@123!`

---

</div>

## Overview

MerchantPilot AI replaces static e-commerce dashboards with an **autonomous digital workforce of 7 specialized AI executives**. Instead of human managers checking 10 separate tools every morning, MerchantPilot continuously monitors stock velocity, scrapes competitor pricing, intercepts ingress fraud, optimizes checkout routing, and executes personalized customer campaigns.

---

## 🏛️ System Architecture

```mermaid
graph TD
    %% Node Definitions
    UI["💻 Next.js 16 Web Frontend<br/><i>(TailwindCSS, Framer Motion, App Router)</i>"]
    API["⚡ NestJS Backend API Gateway<br/><i>(JWT Auth, Multi-Tenant RLS)</i>"]

    subgraph AI_Mesh["🤖 AI Digital Workforce Mesh"]
        Athena["👑 Athena (Strategy & Chief of Staff)"]
        Atlas["📦 Atlas (Inventory Velocity & POs)"]
        Vega["🏷️ Vega (Dynamic Price Elasticity)"]
        Sentinel["🛡️ Sentinel (Ingress Fraud Risk)"]
        Pulse["⚡ Pulse (Checkout Payment Routing)"]
        Orion["🎯 Orion (Customer Retention & LTV)"]
        Nova["🚀 Nova (Marketing AI Campaigns)"]
    end

    DB[("🛢️ PostgreSQL + Prisma Data Layer<br/><i>(Multi-Tenant Isolation & Catalog Schema)</i>")]
    BUS["📡 Redis Pub/Sub Event Bus<br/><i>(Live Reasoning & Activity Log Stream)</i>"]
    ROLLBACK["↺ Deterministic Rollback Engine<br/><i>(1-Click Undo Mutation Log)</i>"]

    %% Connections
    UI -->|HTTPS / REST / WebSocket| API
    API --> AI_Mesh
    API --> DB
    AI_Mesh <-->|Sub-Second Inference| DB
    DB <--> BUS
    AI_Mesh --> ROLLBACK
```

---

## 🤖 AI Workforce Hierarchy

```mermaid
graph TD
    CEO["👤 Merchant Store CEO<br/><i>(Human Executive Oversight)</i>"]
    ATHENA["👑 Athena<br/><i>(Chief of Staff & Strategic Verdicts)</i>"]

    ATLAS["📦 Atlas<br/><i>Inventory Velocity & POs</i>"]
    VEGA["🏷️ Vega<br/><i>Dynamic Price Elasticity</i>"]
    SENTINEL["🛡️ Sentinel<br/><i>Ingress Fraud Risk</i>"]
    PULSE["⚡ Pulse<br/><i>Checkout Payment Routing</i>"]
    ORION["🎯 Orion<br/><i>Customer Churn & LTV</i>"]
    NOVA["🚀 Nova<br/><i>Marketing & VIP Blasts</i>"]

    CEO -->|Configures Strategy & Autonomy Level| ATHENA
    ATHENA -->|Delegates Autonomous PO Tasks| ATLAS
    ATHENA -->|Delegates Price Adjustments| VEGA
    ATHENA -->|Delegates Fraud Holds| SENTINEL
    ATHENA -->|Delegates Route Optimizations| PULSE
    ATHENA -->|Delegates VIP Retention| ORION
    ATHENA -->|Delegates Campaign Triggers| NOVA
```

---

## 🔄 Autonomous Multi-Agent Decision Pattern

```mermaid
sequenceDiagram
    autonumber
    actor Merchant as 👤 Merchant CEO
    participant Athena as 👑 Athena (Chief of Staff)
    participant Atlas as 📦 Atlas (Inventory)
    participant Vega as 🏷️ Vega (Pricing)
    participant DB as 🛢️ Multi-Tenant DB
    participant Rollback as ↺ Rollback Engine

    Merchant->>Athena: Prompt / Auto-Trigger ("Optimize Revenue & Stock")
    Athena->>Atlas: Request Stock Velocity & Out-of-Stock Risk
    Atlas-->>Athena: Stock Alert: Low stock on Laptop Stand (12 units left)
    Athena->>Vega: Request Elasticity Check & Competitor Price Scrape
    Vega-->>Athena: Optimal Strategy: Restock 80 units & Price +4.5%

    rect rgb(30, 30, 45)
        note over Athena,Vega: Multi-Agent Debate & Verdict Synthesis
        Athena->>Athena: Calculate Combined Confidence Score (96%)
    end

    alt AutoPilot Autonomy = Semi-Autonomous (Approval Required)
        Athena->>Merchant: Present Action Plan in AI Action Center
        Merchant->>Athena: Approve Transaction
    else AutoPilot Autonomy = Fully Autonomous
        Athena->>Athena: Auto-Approve Policy Enforced
    end

    Athena->>DB: Execute Catalog Mutation & Update Stock
    Athena->>Rollback: Register Undo State (1-Click Undo Enabled)
    DB-->>Merchant: Real-Time UI Stream & Continuous Thinking Ticker Updated
```

---

## 🤖 Digital Executive Roster

| Agent | Name         | Role & Specialization         | Key Metrics Handled                                |
| ----- | ------------ | ----------------------------- | -------------------------------------------------- |
| 👑    | **Athena**   | Chief of Staff & Strategy     | Business Health Score (95/100), Executive Verdicts |
| 📦    | **Atlas**    | Inventory & PO Specialist     | Safety Stock, Out-of-Stock Reduction, Lead Times   |
| 🏷️    | **Vega**     | Dynamic Pricing & Elasticity  | Monte Carlo Curves, Gross Margin Lift %            |
| 🛡️    | **Sentinel** | Fraud & Security Sentinel     | IP/VPN Ingress Scoring, Fraud Holds                |
| ⚡    | **Pulse**    | Checkout Payment Intelligence | Gateway Routing (Razorpay/Cashfree/PayU SLA)       |
| 🎯    | **Orion**    | Customer Retention & LTV      | RFM Matrix, Customer Lifetime Value (LTV)          |
| 🚀    | **Nova**     | Marketing & Campaign AI       | WhatsApp VIP Blasts, Promotional Coupons           |

---

## Feature Capabilities

### ⚡ AI & Autonomous Operations

- **Multi-Agent Debate Engine:** Deliberative cross-examination between agents before executive verdicts.
- **Action Preview Modal:** Pre-execution simulation showing exact revenue, margin, and risk impact.
- **Deterministic Rollback:** Git-like 1-click undo capability for all automated catalog mutations.
- **Hands-Free Voice AI:** Hands-free speech interaction with live state transitions (`Listening` -> `Transcribing` -> `Reasoning` -> `Executing`).

### 🔒 Enterprise & Security

- **Multi-Tenant Data Isolation:** Row Level Security (RLS) and AES-256 data partitioning.
- **AI AutoPilot Governance:** Per-domain autonomy configuration (`Manual`, `Semi-Auto`, `Fully Autonomous`).
- **Trust Center (`/trust`):** Real-time model accuracy metrics (98.4%), sub-second 420ms decision latency, and SOC2 readiness badges.

---

## 📂 Repository Layout

```
merchantpilot-ai/
├── apps/
│   ├── api/                  # NestJS Multi-Tenant Backend Gateway
│   └── web/                  # Next.js 16 (Turbopack) UI Shell & AI Engines
├── docs/                     # Architecture, API, AI Agents, Deployment & Pitch Script
│   ├── ai-agents.md
│   ├── api.md
│   ├── architecture.md
│   ├── deployment.md
│   └── pitch-script.md
├── packages/                 # Shared Configs & Prisma ORM Schema
├── .env.example              # Environment Configuration Template
├── docker-compose.yml        # Docker Multi-Container Compose Config
├── LICENSE                   # MIT License
├── README.md                 # Project Overview & Setup Guide
└── SECURITY.md               # Vulnerability Reporting & Security Policy
```

---

## ⚡ Quick Start & Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/merchantpilot/merchantpilot-ai.git
cd merchantpilot-ai

# 2. Install workspace dependencies
pnpm install

# 3. Environment configuration
cp .env.example .env

# 4. Database migrations & seed
pnpm prisma migrate dev

# 5. Run development servers
pnpm dev
```

---

## 🗺️ Roadmap

- [x] **v1.0.0** — Autonomous Digital Workforce, Multi-Agent Debate, Voice AI & Trust Center
- [ ] **v1.1.0** — Modular AI Agent Marketplace Extension Store
- [ ] **v1.2.0** — Voice Workflow Automation & Multi-Channel Telephony Routing
- [ ] **v1.3.0** — Autonomous Procurement Engine with direct supplier API dispatch

---

## 📄 License & Security

Licensed under the [MIT License](LICENSE). Refer to [SECURITY.md](SECURITY.md) for vulnerability disclosure policies.
