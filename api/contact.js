/** SnatchOut contact → live htnet mailer → bay192@gmail.com */

const HTNET_EMAIL_API = 'https://htnet.hometolive.com/api/htnet/send-email.jsp'
const CONTACT_TO = 'bay192@gmail.com'

const rateLimitMap = new Map()
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const RATE_LIMIT_MAX = 5

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim()
  if (Array.isArray(forwarded)) return String(forwarded[0] || '').trim()
  return req.socket?.remoteAddress || 'unknown'
}

function checkRateLimit(ip) {
  const now = Date.now()
  const windowStart = now - RATE_LIMIT_WINDOW_MS
  const requests = (rateLimitMap.get(ip) || []).filter((t) => t > windowStart)
  if (requests.length >= RATE_LIMIT_MAX) return false
  requests.push(now)
  rateLimitMap.set(ip, requests)
  return true
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

async function sendViaHtnet({ to, subject, body }) {
  const secret = (
    process.env.HTNET_EMAIL_SECRET ||
    process.env.HTNET_API_SECRET ||
    process.env.MOTHER_EMAIL_SECRET ||
    process.env.FRONT_EMAIL_SECRET ||
    ''
  ).trim()
  if (!secret) {
    return { ok: false, status: 500, text: 'Mail secret not configured' }
  }

  const params = new URLSearchParams()
  params.set('to', to)
  params.set('subject', subject)
  params.set('body', body)
  params.set('html', '1')
  params.set('secret', secret)

  const res = await fetch(HTNET_EMAIL_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })
  const text = await res.text()
  const ok = res.ok && /ok|sent|success/i.test(text)
  return { ok, status: res.status, text: text.slice(0, 240) }
}

module.exports = async function handler(req, res) {
  const origin = req.headers.origin || ''
  const allow =
    origin === 'https://snatchout.com' ||
    origin === 'https://www.snatchout.com' ||
    /^https?:\/\/localhost(:\d+)?$/.test(origin) ||
    /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)
  if (allow) res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    return res.end()
  }
  if (req.method !== 'POST') {
    res.statusCode = 405
    return res.json({ error: 'Method Not Allowed' })
  }

  if (!checkRateLimit(getClientIp(req))) {
    res.statusCode = 429
    return res.json({ error: 'Too many messages. Please try again later.' })
  }

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body || '{}')
    } catch {
      body = {}
    }
  }
  body = body || {}

  const name = String(body.name || '').trim()
  const email = String(body.email || '').trim().toLowerCase()
  const message = String(body.message || '').trim()
  const website = String(body.website || '').trim()

  if (website) {
    res.statusCode = 400
    return res.json({ error: 'Rejected' })
  }
  if (!name || name.length < 2 || name.length > 100) {
    res.statusCode = 400
    return res.json({ error: 'Please enter your name' })
  }
  if (!isValidEmail(email)) {
    res.statusCode = 400
    return res.json({ error: 'Please enter a valid email' })
  }
  if (!message || message.length < 10 || message.length > 2000) {
    res.statusCode = 400
    return res.json({ error: 'Message must be between 10 and 2000 characters' })
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

  const sent = await sendViaHtnet({
    to: CONTACT_TO,
    subject: 'SnatchOut website contact',
    body: html,
  })

  if (!sent.ok) {
    console.error('snatchout contact htnet mail failed', sent.status, sent.text)
    res.statusCode = 502
    return res.json({ error: 'Could not send message right now' })
  }

  res.statusCode = 200
  return res.json({ ok: true })
}
