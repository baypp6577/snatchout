async function submitSnatchoutContact(form) {
  const statusEl = form.querySelector('[data-contact-status]')
  const btn = form.querySelector('[type="submit"]')
  const setStatus = (text, ok) => {
    if (!statusEl) return
    statusEl.textContent = text
    statusEl.className = 'contact-message ' + (ok ? 'success' : 'error')
    statusEl.style.display = 'block'
  }

  const name = String(form.name?.value || '').trim()
  const email = String(form.email?.value || '').trim()
  const message = String(form.message?.value || '').trim()
  const website = String(form.website?.value || '').trim()

  if (btn) btn.disabled = true
  setStatus('Sending…', true)

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message, website }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || 'Could not send message')
    form.reset()
    setStatus('Thank you - your message has been sent.', true)
  } catch (err) {
    setStatus(err instanceof Error ? err.message : 'Could not send message', false)
  } finally {
    if (btn) btn.disabled = false
  }
}

document.addEventListener('submit', (event) => {
  const form = event.target
  if (!(form instanceof HTMLFormElement)) return
  if (!form.matches('[data-snatchout-contact]')) return
  event.preventDefault()
  void submitSnatchoutContact(form)
})
