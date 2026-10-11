/**
 * SnatchOut contact form → live mother mailer (Abbey-style) → bay192@gmail.com
 *
 * Vercel Production must set one of:
 *   MOTHER_EMAIL_SECRET (or FRONT_EMAIL_SECRET / HTNET_EMAIL_SECRET)
 * plus MOTHER_SITE_TOKEN (preferred on Vercel) OR MOTHER_DEVICE_ID + MOTHER_DEVICE_TOKEN
 *
 * Optional fallback: HTNET_EMAIL_SECRET alone → htnet send-email.jsp
 *
 * Deploy: vercel --prod
 */
import type { VercelRequest, VercelResponse } from '@vercel/node'

const MOTHER_EMAIL_API = (
  process.env.MOTHER_EMAIL_API || 'https://hometolive.com/api/front/send-email.jsp'
).trim()
const HTNET_EMAIL_API = 'https://htnet.hometolive.com/api/htnet/send-email.jsp'
const CONTACT_TO = 'bay192@gmail.com'

const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const RATE_LIMIT_MAX = 5

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim()
  if (Array.isArray(forwarded)) return String(forwarded[0] || '').trim()
  return req.socket?.remoteAddress || 'unknown'
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowStart = now - RATE_LIMIT_WINDOW_MS
  const requests = (rateLimitMap.get(ip) || []).filter((t) => t > windowStart)
  if (requests.length >= RATE_LIMIT_MAX) return false
  requests.push(now)
  rateLimitMap.set(ip, requests)
  return true
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function mailSecret(): string {
  return (
    process.env.MOTHER_EMAIL_SECRET ||
    process.env.FRONT_EMAIL_SECRET ||
    process.env.HTNET_EMAIL_SECRET ||
    ''
  ).trim()
}

async function sendViaMother(opts: {
  to: string
  subject: string
  body: string
}): Promise<{ ok: boolean; status: number; text: string; via: string }> {
  const secret = mailSecret()
  if (!secret) {
    return { ok: false, status: 500, text: 'Mail secret not configured', via: 'mother' }
  }

  const params = new URLSearchParams()
  params.set('secret', secret)
  params.set('to', opts.to)
  params.set('subject', opts.subject)
  params.set('body', opts.body)
  params.set('html', '1')
  params.set('brand', 'snatchout')
  params.set('replyto', 'bay192@gmail.com')

  const siteToken = (process.env.MOTHER_SITE_TOKEN || '').trim()
  const deviceId = (process.env.MOTHER_DEVICE_ID || '').trim()
  const deviceToken = (process.env.MOTHER_DEVICE_TOKEN || '').trim()
  if (siteToken) {
    params.set('site_token', siteToken)
  } else if (deviceId && deviceToken) {
    params.set('device_id', deviceId)
    params.set('device_token', deviceToken)
  }

  const res = await fetch(MOTHER_EMAIL_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Origin: 'https://snatchout.com',
      Referer: 'https://snatchout.com/',
    },
    body: params.toString(),
  })
  const text = await res.text()
  let parsed: { success?: boolean; error?: string } = {}
  try {
    parsed = JSON.parse(text) as { success?: boolean; error?: string }
  } catch {
    parsed = {}
  }
  const ok = res.ok && parsed.success === true
  return {
    ok,
    status: res.status,
    text: (parsed.error || text).slice(0, 240),
    via: 'mother',
  }
}

async function sendViaHtnet(opts: {
  to: string
  subject: string
  body: string
}): Promise<{ ok: boolean; status: number; text: string; via: string }> {
  const secret = mailSecret()
  if (!secret) {
    return { ok: false, status: 500, text: 'Mail secret not configured', via: 'htnet' }
  }

  const params = new URLSearchParams()
  params.set('to', opts.to)
  params.set('subject', opts.subject)
  params.set('body', opts.body)
  params.set('html', '1')
  params.set('secret', secret)
  params.set('brand', 'snatchout')
  params.set('replyto', 'bay192@gmail.com')

  const res = await fetch(HTNET_EMAIL_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Htnet-Secret': secret,
      Origin: 'https://snatchout.com',
      Referer: 'https://snatchout.com/',
    },
    body: params.toString(),
  })
  const text = await res.text()
  let parsed: { ok?: boolean; success?: boolean; error?: string } = {}
  try {
    parsed = JSON.parse(text) as { ok?: boolean; success?: boolean; error?: string }
  } catch {
    parsed = {}
  }
  const ok = res.ok && (parsed.ok === true || parsed.success === true)
  return {
    ok,
    status: res.status,
    text: (parsed.error || text).slice(0, 240),
    via: 'htnet',
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = typeof req.headers.origin === 'string' ? req.headers.origin : ''
  const allow =
    origin === 'https://snatchout.com' ||
    origin === 'https://www.snatchout.com' ||
    /^https?:\/\/localhost(:\d+)?$/.test(origin) ||
    /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)
  if (allow) res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  if (!checkRateLimit(getClientIp(req))) {
    return res.status(429).json({ error: 'Too many messages. Please try again later.' })
  }

  let body: Record<string, unknown> = {}
  if (typeof req.body === 'string') {
    try {
      body = JSON.parse(req.body || '{}') as Record<string, unknown>
    } catch {
      body = {}
    }
  } else if (req.body && typeof req.body === 'object') {
    body = req.body as Record<string, unknown>
  }

  const name = String(body.name || '').trim()
  const email = String(body.email || '').trim().toLowerCase()
  const message = String(body.message || '').trim()
  const website = String(body.website || '').trim()

  if (website) {
    return res.status(400).json({ error: 'Rejected' })
  }
  if (!name || name.length < 2 || name.length > 100) {
    return res.status(400).json({ error: 'Please enter your name' })
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email' })
  }
  if (!message || message.length < 10 || message.length > 2000) {
    return res.status(400).json({ error: 'Message must be between 10 and 2000 characters' })
  }

  if (!mailSecret()) {
    console.error('snatchout contact: MOTHER_EMAIL_SECRET / HTNET_EMAIL_SECRET missing on Vercel')
    return res.status(503).json({
      error: 'Mail is not configured yet. Set MOTHER_EMAIL_SECRET and MOTHER_SITE_TOKEN on Vercel.',
    })
  }

  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />')

  const html = `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;color:#222;line-height:1.5;">
  <p style="margin:0 0 12px;"><img src="https://hometolive.net/hometolive-logo.png" alt="Home to Live" width="160" /></p>
  <h2 style="margin:0 0 12px;">SnatchOut website contact</h2>
  <p style="margin:0 0 8px;"><strong>Name:</strong> ${safeName}</p>
  <p style="margin:0 0 8px;"><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
  <p style="margin:16px 0 8px;"><strong>Message:</strong></p>
  <p style="margin:0 0 20px;">${safeMessage}</p>
  <p style="margin:24px 0 0;font-size:13px;color:#555;">
    Adebayo Odutola<br />Director<br />Home to Live Ltd<br />
    <a href="https://hometolive.net">hometolive.net</a>
  </p>
</body></html>`

  let sent = await sendViaMother({
    to: CONTACT_TO,
    subject: 'SnatchOut website contact',
    body: html,
  })

  if (!sent.ok) {
    console.error('snatchout contact mother mail failed', sent.status, sent.text)
    sent = await sendViaHtnet({
      to: CONTACT_TO,
      subject: 'SnatchOut website contact',
      body: html,
    })
  }

  if (!sent.ok) {
    console.error('snatchout contact htnet mail failed', sent.status, sent.text)
    return res.status(502).json({
      error: 'Could not send message right now',
      detail: sent.text.slice(0, 120),
    })
  }

  return res.status(200).json({ ok: true, via: sent.via })
}
