# SnatchOut

Public site for SnatchOut / Evangelists For Christ Ministries.

## Headquarters

**Evangelists For Christ Ministries, Plaistow, London, Newham, UK**

Nottingham appears only under **Previous events** (city name only).

## Contact form

`POST /api/contact` (Vercel serverless) forwards to the live mother mailer:

`https://hometolive.com/api/front/send-email.jsp` (`brand=snatchout`)

Inbox: `bay192@gmail.com` (no separate admin `[COPY]`).

### Vercel Production env

- `MOTHER_EMAIL_SECRET` (or `FRONT_EMAIL_SECRET`)
- `MOTHER_SITE_TOKEN` (preferred on Vercel)

## Deploy

```bash
vercel --prod
```
