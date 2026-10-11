# SnatchOut agents

## Contact form mailer

- Live endpoint: `POST /api/contact` → mother `send-email.jsp` first (`brand=snatchout`), htnet fallback
- Inbox: `bay192@gmail.com`
- From: `SnatchOut <noreply@hometolive.com>` (Abbey-style)
- `vercel.json` must build `api/**/*.ts` with `@vercel/node` (otherwise `/api/contact` is 404)
- Vercel Production must set:
  - `MOTHER_EMAIL_SECRET` (or `FRONT_EMAIL_SECRET` / `HTNET_EMAIL_SECRET`)
  - `MOTHER_SITE_TOKEN` (preferred on Vercel) — same site token other HTL apps use for mother
- Deploy from repo root: `vercel --prod`

## Headquarters copy

Evangelists For Christ Ministries, Plaistow, London, Newham, UK

Nottingham appears only under previous events (city name only).
