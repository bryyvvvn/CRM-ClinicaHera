# CRM Clínica Hera

Dashboard de atención médica con IA y WhatsApp Cloud API.

## Stack

- Frontend: React + TypeScript + Tailwind CSS (Vite)
- Backend: NestJS
- Base de datos: PostgreSQL (Neon u otro cloud) + Prisma

## Requisitos

- Node.js 20+
- pnpm (`corepack enable` o `npm install -g pnpm`)
- Una cadena de conexión PostgreSQL

## Backend

```bash
pnpm --dir backend install
```

Copia `backend/.env.example` a `backend/.env` y reemplaza `DATABASE_URL` por tu conexión de Neon.

```bash
pnpm --dir backend prisma:generate
pnpm --dir backend start:dev
```

API en `http://localhost:3000/api`. Webhook de WhatsApp: `GET/POST /api/whatsapp/webhook`.

Cuando tengas la base lista:

```bash
pnpm --dir backend prisma:migrate
```

## Frontend

```bash
pnpm --dir frontend install
pnpm --dir frontend dev
```

Dashboard en `http://localhost:5173`. Variables en `frontend/.env.example`.
