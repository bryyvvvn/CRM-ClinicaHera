# CRM Clínica Hera

Dashboard de atención médica con IA y WhatsApp Cloud API.

## Stack

- Frontend: React + TypeScript + Tailwind CSS (Vite)
- Backend: NestJS
- Base de datos: PostgreSQL (Neon u otro cloud) + Prisma

Referencia de APIs: [docs/whatsapp-cloud-api.md](docs/whatsapp-cloud-api.md) y [docs/medilink-endpoints.md](docs/medilink-endpoints.md).

## Requisitos

- Node.js 20+
- pnpm (`corepack enable` o `npm install -g pnpm`)
- Una cadena de conexión PostgreSQL (Neon)
- (Opcional para el webhook) ngrok o [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/get-started/create-local-tunnel/)

## Backend

```bash
pnpm --dir backend install
```

Copia `backend/.env.example` a `backend/.env` y completa `DATABASE_URL`.

```bash
pnpm --dir backend prisma:generate
pnpm --dir backend prisma:migrate
pnpm --dir backend start:dev
```

API: `http://localhost:3000/api`  
Webhook: `GET/POST http://localhost:3000/api/whatsapp/webhook`  
Sesiones: `GET http://localhost:3000/api/chat/sessions`

## Frontend

```bash
pnpm --dir frontend install
pnpm --dir frontend dev
```

Dashboard: `http://localhost:5173`.

## WhatsApp Cloud API (número de prueba)

Meta te da un número de prueba al crear la app. No es un SIM. En desarrollo solo puedes hablar con hasta 5 números que autorices (el tuyo).

1. [developers.facebook.com](https://developers.facebook.com/) → app **Business** → producto **WhatsApp**.
2. En **WhatsApp → API Setup** copia el número de prueba, **Phone number ID** y el token. En **To** agrega tu celular.
3. En `backend/.env`:

```
WHATSAPP_VERIFY_TOKEN=un-string-secreto-tuyo
WHATSAPP_TOKEN=EAAG...
WHATSAPP_PHONE_NUMBER_ID=...
WHATSAPP_APP_SECRET=...
```

4. Túnel HTTPS (Meta no pega a localhost):

```bash
cloudflared tunnel --url http://localhost:3000
```

5. En **WhatsApp → Configuration**:
   - Callback URL: `https://<tu-tunel>/api/whatsapp/webhook`
   - Verify token: el mismo `WHATSAPP_VERIFY_TOKEN`
   - Suscribir **messages** → Verify and save

6. Desde tu celular, escribe al número de prueba. El dashboard debería mostrar tu número y el mensaje.

La IA y el envío de respuestas desde el CRM van en un paso posterior.
