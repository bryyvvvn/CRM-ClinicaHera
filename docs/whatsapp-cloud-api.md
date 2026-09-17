# WhatsApp Cloud API — referencia (ejemplos)

Fuentes oficiales:

- [Create a webhook endpoint](https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/create-webhook-endpoint/)
- [Webhooks / messages](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/set-up-webhooks/)
- [Get started](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started)

Base Graph: `https://graph.facebook.com/v21.0`

Auth envío: `Authorization: Bearer <WHATSAPP_TOKEN>`

Callback local (este repo): `https://<tunel>/api/whatsapp/webhook`

El endpoint debe ser **HTTPS público**. Meta no acepta `localhost` ni certificados self-signed.

## Número de prueba

Al crear una app Business y agregar el producto WhatsApp, Meta entrega un **número de prueba** en **WhatsApp → API Setup** (no es un SIM).

En modo desarrollo solo puedes hablar con hasta **5 destinatarios**. En **To** agregas tu celular; te llega un código por WhatsApp.

Datos a copiar de esa pantalla:

- número de prueba (el que recibe los mensajes)
- Phone number ID → `WHATSAPP_PHONE_NUMBER_ID`
- Temporary access token (o token de sistema) → `WHATSAPP_TOKEN`
- App secret (Configuración de la app) → `WHATSAPP_APP_SECRET`

El número real de la clínica (producción / WABA) es un paso posterior.

## Handshake GET (verificar webhook)

Cada vez que guardas Callback URL o Verify token, Meta manda un GET.

### Entrada

```
GET https://<tu-dominio>/api/whatsapp/webhook
  ?hub.mode=subscribe
  &hub.challenge=1158201444
  &hub.verify_token=vibecoding
```

`hub.verify_token` debe coincidir con `WHATSAPP_VERIFY_TOKEN`.

### Salida

HTTP `200` y el body **solo** el challenge, en texto plano (no JSON):

```
1158201444
```

Si el token no calza: cualquier status distinto de 200 (acá usamos `403`).

## POST mensaje de texto (lo que guardamos)

Meta manda esto cuando alguien escribe al número de la clínica / de prueba. Hay que responder **HTTP 200** rápido; si no, reintenta varios días.

Header de firma (validar con el app secret):

```
POST /api/whatsapp/webhook
Content-Type: application/json
X-Hub-Signature-256: sha256=<HMAC_SHA256_del_body>
```

### Entrada (ejemplo oficial)

```json
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "102290129340398",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "15550783881",
              "phone_number_id": "106540352242922"
            },
            "contacts": [
              {
                "profile": {
                  "name": "Sheena Nelson"
                },
                "wa_id": "16505551234"
              }
            ],
            "messages": [
              {
                "from": "16505551234",
                "id": "wamid.HBgLMTY1MDM4Nzk0MzkVAgASGBQzQTRBNjU5OUFFRTAzODEwMTQ0RgA=",
                "timestamp": "1749416383",
                "type": "text",
                "text": {
                  "body": "Does it come in another color?"
                }
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
}
```

Campos útiles:

- `contacts[].wa_id` / `messages[].from` → teléfono del paciente
- `contacts[].profile.name` → nombre de WhatsApp
- `messages[].text.body` → texto
- `messages[].id` → id de Meta (deduplicar reintentos)

Este backend **solo persiste** `type === "text"`. El resto se ignora por ahora.

### Salida hacia Meta

```json
{ "status": "ok" }
```

## POST statuses (se ignora)

Llega en el mismo webhook cuando un mensaje **nuestro** se envía / entrega / lee. No describe el texto, solo el estado.

```json
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "102290129340398",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "15550783881",
              "phone_number_id": "106540352242922"
            },
            "statuses": [
              {
                "id": "wamid.HBgL...",
                "status": "delivered",
                "timestamp": "1749416400",
                "recipient_id": "16505551234"
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
}
```

## Enviar texto (después; aún no está cableado en el CRM)

```javascript
var settings = {
  url: "https://graph.facebook.com/v21.0/" + phoneNumberId + "/messages",
  method: "POST",
  headers: {
    Authorization: "Bearer " + token,
    "Content-Type": "application/json"
  },
  data: JSON.stringify({
    messaging_product: "whatsapp",
    to: "16505551234",
    type: "text",
    text: { body: "Hola, te confirmo tu hora." }
  })
};
```

### Salida típica

```json
{
  "messaging_product": "whatsapp",
  "contacts": [{ "input": "16505551234", "wa_id": "16505551234" }],
  "messages": [{ "id": "wamid.ID" }]
}
```

Fuera de la ventana de 24 h hay que usar **plantillas** aprobadas, no texto libre.

## Túnel local

```bash
cloudflared tunnel --url http://localhost:3000
```

En Meta → WhatsApp → Configuration:

- Callback URL: `https://<tu-tunel>/api/whatsapp/webhook`
- Verify token: el mismo `WHATSAPP_VERIFY_TOKEN`
- Suscribir el campo **messages** → Verify and save
