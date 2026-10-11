# SnatchOut

Public site for SnatchOut / Evangelists For Christ Ministries.

## Headquarters

**Evangelists For Christ Ministries, Plaistow, London, Newham, UK**

Nottingham appears only under **Previous events** (city name only).

## Contact form

`POST /api/contact` (Vercel serverless) forwards to the live htnet mailer:

`https://htnet.hometolive.com/api/htnet/send-email.jsp`

Inbox: `bay192@gmail.com` (no separate admin `[COPY]`).

### Vercel Production env

Set **`HTNET_EMAIL_SECRET`** to the same value htnet `send-email.jsp` expects as the `secret` param (or `X-Htnet-Secret` header). Validated by `htnetSecretValid` in `htnet-cors.inc.jsp`.

Optional fallbacks the API also reads: `MOTHER_EMAIL_SECRET`, `FRONT_EMAIL_SECRET`.

## Deploy

```bash
vercel --prod
```
