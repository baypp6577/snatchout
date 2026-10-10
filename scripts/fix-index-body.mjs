import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public')
const file = path.join(root, 'index.html')
let html = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n')
const HQ = 'Evangelists For Christ Ministries, Plaistow, London, Newham, UK'

const contactBlock = `
            <div class="contact-section">
                <h2><i class="fas fa-building"></i> Headquarters</h2>
                <div class="contact-info">
                    <div class="info-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span><strong>${HQ}</strong></span>
                    </div>
                </div>
            </div>

            <div class="contact-section">
                <h2><i class="fas fa-envelope"></i> Send us a message</h2>
                <form class="contact-form" data-snatchout-contact>
                    <input type="text" name="website" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px;height:0;width:0;opacity:0" aria-hidden="true">
                    <div class="form-group">
                        <label for="contact-name">Name</label>
                        <input id="contact-name" type="text" name="name" required placeholder="Your name" autocomplete="name">
                    </div>
                    <div class="form-group">
                        <label for="contact-email">Email</label>
                        <input id="contact-email" type="email" name="email" required placeholder="you@example.com" autocomplete="email">
                    </div>
                    <div class="form-group">
                        <label for="contact-message">Message</label>
                        <textarea id="contact-message" name="message" required placeholder="How can we help?"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Send message</button>
                    <div class="contact-message" data-contact-status style="display:none"></div>
                </form>
            </div>
`

function replaceBetween(src, startMarker, endMarker, replacement) {
  const start = src.indexOf(startMarker)
  if (start < 0) throw new Error('start not found: ' + JSON.stringify(startMarker))
  const end = src.indexOf(endMarker, start)
  if (end < 0) throw new Error('end not found: ' + JSON.stringify(endMarker))
  return src.slice(0, start) + replacement + src.slice(end)
}

html = html.replace(
  /<h1>SnatchOut 2026<\/h1>\s*<p class="subtitle">April 2026<\/p>/,
  `<h1>SnatchOut</h1>
            <p class="subtitle">Worship events with Evangelists For Christ Ministries</p>`,
)

html = replaceBetween(
  html,
  '            <div class="event-details-hero">',
  '            <div class="hero-description">',
  `            <div class="event-details-hero">
                <div class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span><strong>${HQ}</strong></span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-heart"></i>
                    <a href="donate.html" style="color: inherit; text-decoration: none;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">
                        <strong>Donations Welcome</strong>
                    </a>
                </div>
            </div>

`,
)

html = replaceBetween(
  html,
  '            <div class="hero-buttons">',
  '    <!-- Booking Section -->',
  `            <div class="hero-buttons">
                <a href="#events" class="btn btn-primary">Previous Events</a>
                <a href="artists.html" class="btn btn-secondary">Watch Artist Videos</a>
                <a href="donate.html" class="btn btn-primary" style="background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);">
                    <i class="fas fa-heart"></i> Support Our Ministry
                </a>
                <a href="#contact" class="btn btn-primary">Contact Us</a>
            </div>
        </div>
    </section>

`,
)

html = replaceBetween(
  html,
  '    <!-- Booking Section -->',
  '    <!-- Events Section -->',
  `    <!-- Stay in touch -->
    <section class="booking-section" id="booking">
        <div class="container">
            <div class="booking-content">
                <div class="booking-text">
                    <h2 class="booking-title">Stay connected with SnatchOut</h2>
                    <p class="booking-subtitle">Our April 2026 gathering has finished. Support the ministry and get in touch for future updates.</p>
                    <div class="booking-highlights">
                        <div class="highlight-item">
                            <i class="fas fa-check-circle"></i>
                            <span>Based in Plaistow, London (Newham)</span>
                        </div>
                        <div class="highlight-item">
                            <i class="fas fa-check-circle"></i>
                            <span>Donations help fund future worship events</span>
                        </div>
                        <div class="highlight-item">
                            <i class="fas fa-check-circle"></i>
                            <span>Contact us for partnership and enquiries</span>
                        </div>
                    </div>
                </div>
                <div class="booking-action">
                    <a href="#contact" class="booking-btn">
                        <i class="fas fa-envelope"></i>
                        Contact SnatchOut
                    </a>
                    <p class="booking-note">Or <a href="donate.html">support the ministry</a> with a donation.</p>
                </div>
            </div>
        </div>
    </section>

`,
)

html = replaceBetween(
  html,
  '    <!-- Events Section -->',
  '    <!-- Contact Section -->',
  `    <!-- Events Section -->
    <section class="events" id="events">
        <div class="container">
            <h2 class="section-title">Previous Events</h2>
            <div class="events-grid">
                <div class="event-card">
                    <span class="event-status status-past">PREVIOUS</span>
                    <img src="/images/2026_snatchout.jpeg" alt="SnatchOut 2026" class="event-image">
                    <div class="event-content">
                        <div class="event-date">April 2026</div>
                        <h3 class="event-title">SnatchOut 2026</h3>
                        <p class="event-description">Held in Nottingham. An unforgettable worship experience to King Jesus, featuring humble worship leaders and ministers, an amazing atmosphere, and memories that will last a lifetime.</p>
                        <a href="#contact" class="btn btn-primary">Get in touch</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

`,
)

html = replaceBetween(
  html,
  '    <!-- Contact Section -->',
  '    <!-- Footer Include -->',
  `    <!-- Contact Section -->
    <section class="contact-container" id="contact">
        <div class="contact-header">
            <h1>Contact SnatchOut</h1>
            <p>Get in touch for ministry information and updates</p>
        </div>
        <div class="contact-content">
${contactBlock}
            <div class="contact-section">
                <h2><i class="fas fa-share-alt"></i> Connect With Us</h2>
                <div class="social-media">
                    <a href="https://www.facebook.com/snatchout.ukconcerts" target="_blank" class="social-link">
                        <i class="fab fa-facebook-f"></i>
                    </a>
                </div>
            </div>
            <div class="contact-section">
                <h2><i class="fas fa-users"></i> Event Organisers</h2>
                <div class="organizers-grid">
                    <div class="organizer-card">
                        <div class="organizer-icon"><i class="fas fa-cross"></i></div>
                        <h3>Evangelists For Christ Ministries</h3>
                        <p>Headquarters in Plaistow, London, Newham, UK - creating powerful worship experiences and spreading the gospel.</p>
                    </div>
                    <div class="organizer-card">
                        <div class="organizer-icon"><i class="fas fa-calendar-star"></i></div>
                        <h3>SnatchOut</h3>
                        <p>Worship event ministry dedicated to bringing people closer to God through live worship gatherings.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

`,
)

if (!html.includes('js/contact-form.js')) {
  html = html.replace(
    '<script src="common.js"></script>',
    '<script src="common.js"></script>\n    <script src="js/contact-form.js" defer></script>',
  )
}

fs.writeFileSync(file, html)
console.log('index body fixed ok')
