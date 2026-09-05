# MerchantPilot AI — Deployment Guide

This guide covers deploying **MerchantPilot AI** to production using Docker, Railway, Render, or AWS/Azure.

---

## 1. Docker Compose Deployment (Recommended)

### Prerequisites
- Docker Engine 24.0+ & Docker Compose v2+

### Quickstart Command
```bash
git clone https://github.com/merchantpilot/merchantpilot-ai.git
cd merchantpilot-ai
cp .env.example .env

# Build and start web app, backend API, PostgreSQL, and Redis
docker compose up -d --build
```

---

## 2. Cloud Platform Deployment (Railway / Render)

### Database Setup
1. Provision a PostgreSQL 16 database with Row Level Security enabled.
2. Provision a Redis 7 instance.
3. Run database migrations:
```bash
pnpm prisma migrate deploy
```

### Web App Deployment (Next.js)
- **Build Command:** `pnpm build --filter @merchantpilot/web`
- **Start Command:** `pnpm start --filter @merchantpilot/web`

### Backend API Deployment (NestJS)
- **Build Command:** `pnpm build --filter @merchantpilot/api`
- **Start Command:** `node apps/api/dist/main.js`

---

## 3. Environment Variables Verification
Ensure all secrets (`JWT_SECRET`, `GEMINI_API_KEY`, `DATABASE_URL`, `REDIS_URL`) are set securely in production vault environments.
