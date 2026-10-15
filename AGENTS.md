# SnatchOut agents

## Contact form mailer

- Live endpoint: `POST /api/contact` → mother `send-email.jsp` only (`brand=snatchout`)
- Inbox: `bay192@gmail.com`
- From: `SnatchOut <noreply@hometolive.com>` (Abbey-style)
- `vercel.json` must build `api/**/*.ts` with `@vercel/node` (otherwise `/api/contact` is 404)
- **Always live — never local:** mail secrets only from **Vercel Production** on the deployed app. Never use local `.env` / `.env.local` (or sibling env) to send. If Production secret is missing, stop and tell Adebayo — do not hunt laptop env files.
- Vercel Production must set:
  - `MOTHER_EMAIL_SECRET` (or `FRONT_EMAIL_SECRET`)
  - `MOTHER_SITE_TOKEN` (preferred on Vercel) — same site token other HTL apps use for mother
- Deploy from repo root: `vercel --prod`

## Headquarters copy

Evangelists For Christ Ministries, Plaistow, London, Newham, UK

Nottingham appears only under previous events (city name only).
