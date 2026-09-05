<div align="center">

# MerchantPilot AI

### The AI Commerce Operating System

**Autonomous digital employees that analyze, reason, forecast, protect, and execute commerce operations.**

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-555?logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

---

</div>

## Overview

MerchantPilot AI replaces static administrative e-commerce dashboards with an **autonomous team of 7 specialized digital executives**. Instead of human managers checking 10 separate tools every morning, MerchantPilot continuously monitors stock velocity, scrapes competitor pricing, intercepts ingress fraud, optimizes payment gateway routing, and executes personalized customer campaigns.

---

## Technical Architecture

```
                               +-----------------------------------+
                               |     Next.js 16 Web Frontend       |
                               | (TailwindCSS, Framer Motion, App) |
                               +-----------------+-----------------+
                                                 |
                                                 v
                               +-----------------+-----------------+
                               |    NestJS Backend API Gateway     |
                               | (JWT Auth, Multi-Tenant RLS)      |
                               +-----------------+-----------------+
                                                 |
                                                 v
                   +-----------------------------+-----------------------------+
                   |                                                           |
                   v                                                           v
+------------------+------------------+                     +------------------+------------------+
|       AI Digital Workforce Mesh     |                     |    PostgreSQL + Prisma Data Layer     |
| - Athena   (Strategy & Chief of Staff)| <-----------------> | - Multi-Tenant Tenant Isolation  |
| - Atlas    (Inventory Velocity & PO)|    Sub-Second       | - Active Catalog & Orders Schema |
| - Vega     (Dynamic Elasticity)     |    Inference        +------------------+------------------+
| - Sentinel (Ingress Fraud Risk)     |                                        ^
| - Pulse    (Checkout Payments)      |                                        |
| - Orion    (Customer Churn & LTV)   |                                        v
| - Nova     (Marketing Campaigns)    |                     +------------------+------------------+
+------------------+------------------+                     |     Redis Pub/Sub Event Bus      |
                   |                                        | - Live Reasoning & Activity Log  |
                   v                                        +----------------------------------+
+------------------+------------------+
|   Deterministic Rollback Engine     |
| - 1-Click Undo Mutation Log         |
+-------------------------------------+
```

---

## 🤖 The Digital Executive Team

| Agent | Name | Role & Specialization | Key Metrics Handled |
| --- | --- | --- | --- |
| 👑 | **Athena** | Chief of Staff & Strategy | Business Health Score (95/100), Executive Verdicts |
| 📦 | **Atlas** | Inventory & PO Specialist | Safety Stock, Out-of-Stock Reduction, Lead Times |
| 🏷️ | **Vega** | Dynamic Pricing & Elasticity | Monte Carlo Curves, Gross Margin Lift % |
| 🛡️ | **Sentinel** | Fraud & Security Sentinel | IP/VPN Ingress Scoring, Fraud Holds |
| ⚡ | **Pulse** | Checkout Payment Intelligence | Gateway Routing (Razorpay/Cashfree/PayU SLA) |
| 🎯 | **Orion** | Customer Retention & LTV | RFM Matrix, Churn Mitigation Offers |
| 🚀 | **Nova** | Marketing & Campaign AI | WhatsApp VIP Blasts, Promotional Coupons |

---

## Key Features

### 1. Autonomous Executive Command Center
- Daily briefing greeting ("Good Afternoon Karthik"), Business Health Score (95/100), and ₹82,000 uncaptured profit opportunity cards.

### 2. Multi-Agent Debate & Consensus Engine
- Agents cross-examine business tradeoffs live (Atlas vs Vega vs Pulse) before Athena issues an executive verdict.

### 3. Business Digital Twin & Scenario Lab
- Monte Carlo price elasticity simulations modeling revenue, order volume, margin, and risk across custom growth scenarios.

### 4. Hands-Free Voice AI Assistant (`⌘.`)
- Web Speech API integration with wake-phrase detection, interruption ("Stop"), and multi-turn context memory.

### 5. AI AutoPilot Governance Center
- Per-domain guardrail controls (`Manual`, `Semi-Auto (1-Click Approval)`, `Fully Autonomous`).

### 6. AI Trust & Transparency Center
- Real-time decision accuracy (98.4%), sub-second decision latency (420ms), SOC2 compliance badges, and 1-click deterministic rollback.

---

## Quick Start & Local Setup

### Prerequisites
- Node.js 20+
- pnpm 9+
- PostgreSQL 16 & Redis (or Docker)

### Installation Commands
```bash
# 1. Clone the repository
git clone https://github.com/merchantpilot/merchantpilot-ai.git
cd merchantpilot-ai

# 2. Install workspace dependencies
pnpm install

# 3. Environment configuration
cp .env.example .env

# 4. Run database migrations
pnpm prisma migrate dev

# 5. Launch development servers
pnpm dev
```

The web dashboard will be accessible at `http://localhost:3000` and the API gateway at `http://localhost:3001`.

---

## Project Sitemap (26 Production Routes)

- `/dashboard` — AI Command Center & Executive Cockpit
- `/ai-workforce` — Digital Employee Grid, Org Chart, Goals & Task Pipeline
- `/trust` — AI Trust & Transparency Center
- `/autopilot` — Domain Autonomy & Human-in-the-Loop Governance Matrix
- `/marketplace` — Modular AI Agent & Plugin Store
- `/system` — Real-Time Microservice Diagnostics & SOC2 Compliance
- `/copilot` — Conversational Business Copilot with Context Memory & Streaming
- `/scenario-lab` — Business Digital Twin Sandbox Simulator
- `/predictions` — Predictive Demand & Dynamic Pricing Elasticity
- `/marketing` — Autonomous Campaign Generator & VIP WhatsApp Blast
- `/audit-log` — Immutable AI Action Log & Rollback Manager
- `/reports` — Executive PDF & CSV Report Generator
- `/landing` — High-Impact Live Interactive Demo Landing Page

---

## 🔮 Future Roadmap

- [ ] **Mobile Native Companion App** (iOS / Android React Native)
- [ ] **Model Context Protocol (MCP)** integration for custom ERP connections
- [ ] **Autonomous Procurement Engine** with direct supplier API dispatch
- [ ] **LangGraph Multi-Agent Mesh** integration for complex multi-turn workflows

---

## 📄 License & Security

This project is licensed under the [MIT License](LICENSE). For security disclosures, please refer to [SECURITY.md](SECURITY.md).
