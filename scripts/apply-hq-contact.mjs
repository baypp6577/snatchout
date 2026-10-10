import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..', 'public')

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

let index = fs.readFileSync(path.join(root, 'index.html'), 'utf8')

index = index
  .replace(/<title>[\s\S]*?<\/title>/, '<title>SnatchOut - Worship Events | Evangelists For Christ Ministries</title>')
  .replace(
    /<meta name="description" content="[^"]*">/,
    '<meta name="description" content="SnatchOut worship events by Evangelists For Christ Ministries. Headquarters in Plaistow, London, Newham, UK.">',
  )
  .replace(
    /<meta name="keywords" content="[^"]*">/,
    '<meta name="keywords" content="SnatchOut, worship, Evangelists For Christ Ministries, Plaistow, London, Newham, Christian events">',
  )
  .replace(
    /<meta property="og:title" content="[^"]*">/,
    '<meta property="og:title" content="SnatchOut - Worship Events | Plaistow, London">',
  )
  .replace(
    /<meta property="og:description" content="[^"]*">/,
    '<meta property="og:description" content="SnatchOut worship events by Evangelists For Christ Ministries. Headquarters in Plaistow, London, Newham, UK.">',
  )
  .replace(
    /<meta property="twitter:title" content="[^"]*">/,
    '<meta property="twitter:title" content="SnatchOut - Worship Events | Plaistow, London">',
  )
  .replace(
    /<meta property="twitter:description" content="[^"]*">/,
    '<meta property="twitter:description" content="SnatchOut worship events by Evangelists For Christ Ministries. Headquarters in Plaistow, London, Newham, UK.">',
  )

const schema = `    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Evangelists For Christ Ministries",
        "alternateName": "SnatchOut",
        "url": "https://snatchout.com",
        "description": "Worship event ministry creating powerful worship experiences.",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Plaistow",
            "addressRegion": "London, Newham",
            "addressCountry": "GB"
        },
        "image": "https://snatchout.com/images/2026_snatchout.jpeg?v=20260308"
    }
    </script>`

index = index.replace(
  /    <!-- Schema\.org Structured Data -->[\s\S]*?    <\/script>/,
  `    <!-- Schema.org Structured Data -->\n${schema}`,
)

index = index.replace(
  /<span><strong>Mission House - The Dome, Unit 1, Ryan Business Park, Radford Road, Nottingham, NG7 7DH<\/strong><\/span>/,
  `<span><strong>${HQ}</strong></span>`,
)

index = index.replace(
  `<h1>SnatchOut 2026</h1>
            <p class="subtitle">April 2026</p>`,
  `<h1>SnatchOut</h1>
            <p class="subtitle">Worship events with Evangelists For Christ Ministries</p>`,
)

index = index.replace(
  `            <div class="event-details-hero">
                <div class="detail-item">
                    <i class="fas fa-calendar"></i>
                    <span><strong>Saturday, April 25, 2026</strong></span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span><strong>5:30 PM Doors Open</strong></span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span><strong>${HQ}</strong></span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-ticket-alt"></i>
                    <a href="donate.html" style="color: inherit; text-decoration: none;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">
                        <strong>Free Entry - Donations Welcome</strong>
                    </a>
                </div>
                <div class="detail-item">
                    <i class="fas fa-microphone"></i>
                    <span><strong>Ministering : JFlow, Christiana, Reethu & Guest Artists</strong></span>
                </div>
            </div>`,
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
            </div>`,
)

index = index.replace(
  `            <div class="hero-buttons">
                <a href="#events" class="btn btn-primary">Explore Events</a>
                <a href="artists.html" class="btn btn-secondary">Watch Artist Videos</a>
                <a href="donate.html" class="btn btn-primary" style="background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);">
                    <i class="fas fa-heart"></i> Support Our Ministry
                </a>
                <a href="#" class="btn btn-primary" onclick="openEventbrite()">Book Now</a>
            </div>`,
  `            <div class="hero-buttons">
                <a href="#events" class="btn btn-primary">Previous Events</a>
                <a href="artists.html" class="btn btn-secondary">Watch Artist Videos</a>
                <a href="donate.html" class="btn btn-primary" style="background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);">
                    <i class="fas fa-heart"></i> Support Our Ministry
                </a>
                <a href="#contact" class="btn btn-primary">Contact Us</a>
            </div>`,
)

index = index.replace(
  /    <!-- Booking Section -->[\s\S]*?    <\/section>\n\n    <!-- Events Section -->/,
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

    <!-- Events Section -->`,
)

index = index.replace(
  `            <h2 class="section-title">Our Events</h2>
            
            <div class="events-grid">
                <!-- Future Event -->
                <div class="event-card">
                    <span class="event-status status-future">UPCOMING</span>
                    <img src="/images/2026_snatchout.jpeg" alt="SnatchOut 2026" class="event-image">
                    <div class="event-content">
                        <div class="event-date">April 2026</div>
                        <h3 class="event-title">SnatchOut 2026 Nottingham</h3>
                        <p class="event-description">An unforgettable worship experience to King Jesus, featuring humble worship leaders and ministers, an amazing atmosphere, and memories that will last a lifetime.</p>
                        <a href="#" class="btn btn-primary" onclick="openEventbrite()">Get Tickets</a>
                    </div>
                </div>
            </div>`,
  `            <h2 class="section-title">Previous Events</h2>
            
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
            </div>`,
)

index = index.replace(
  /    <!-- Contact Section -->[\s\S]*?    <\/section>\n\n    <!-- Footer Include -->/,
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

    <!-- Footer Include -->`,
)

if (!index.includes('js/contact-form.js')) {
  index = index.replace(
    '<script src="common.js"></script>',
    '<script src="common.js"></script>\n    <script src="js/contact-form.js" defer></script>',
  )
}

fs.writeFileSync(path.join(root, 'index.html'), index)
console.log('index.html updated')

let contact = fs.readFileSync(path.join(root, 'contact.html'), 'utf8')
contact = contact
  .replace(/<title>[\s\S]*?<\/title>/, '<title>Contact SnatchOut | Evangelists For Christ Ministries</title>')
  .replace(
    /<meta name="description" content="[^"]*">/,
    '<meta name="description" content="Contact SnatchOut / Evangelists For Christ Ministries. Headquarters in Plaistow, London, Newham, UK.">',
  )
  .replace(
    /<meta name="keywords" content="[^"]*">/,
    '<meta name="keywords" content="SnatchOut contact, Evangelists For Christ Ministries, Plaistow, London, Newham">',
  )
  .replace(
    /<meta property="og:title" content="[^"]*">/,
    '<meta property="og:title" content="Contact SnatchOut | Plaistow, London">',
  )
  .replace(
    /<meta property="og:description" content="[^"]*">/,
    '<meta property="og:description" content="Contact SnatchOut / Evangelists For Christ Ministries. Headquarters in Plaistow, London, Newham, UK.">',
  )
  .replace(
    /<meta property="twitter:title" content="[^"]*">/,
    '<meta property="twitter:title" content="Contact SnatchOut | Plaistow, London">',
  )
  .replace(
    /<meta property="twitter:description" content="[^"]*">/,
    '<meta property="twitter:description" content="Contact SnatchOut / Evangelists For Christ Ministries. Headquarters in Plaistow, London, Newham, UK.">',
  )
  .replace(
    '<h1>Contact SnatchOut 2026</h1>\n            <p>Get in touch for event information and updates</p>',
    '<h1>Contact SnatchOut</h1>\n            <p>Get in touch for ministry information and updates</p>',
  )

contact = contact.replace(
  /        <div class="contact-content">[\s\S]*?        <\/div>\n    <\/div>/,
  `        <div class="contact-content">
${contactBlock}
            <div class="contact-section">
                <h2><i class="fas fa-share-alt"></i> Connect With Us</h2>
                <div class="social-media">
                    <a href="https://www.facebook.com/snatchout.ukconcerts" target="_blank" class="social-link" title="Facebook">
                        <i class="fab fa-facebook-f"></i>
                    </a>
                </div>
            </div>
            <div class="contact-section">
                <h2><i class="fas fa-history"></i> Previous events</h2>
                <div class="contact-info">
                    <div class="info-item">
                        <i class="fas fa-calendar"></i>
                        <span><strong>SnatchOut 2026</strong> - April 2026, Nottingham</span>
                    </div>
                </div>
            </div>
        </div>
    </div>`,
)

if (!contact.includes('js/contact-form.js')) {
  contact = contact.replace(
    '<script src="common.js"></script>',
    '<script src="common.js"></script>\n    <script src="js/contact-form.js" defer></script>',
  )
}

fs.writeFileSync(path.join(root, 'contact.html'), contact)
console.log('contact.html updated')

let footer = fs.readFileSync(path.join(root, 'footer.html'), 'utf8')
footer = footer
  .replace('<h3>SnatchOut 2026</h3>', '<h3>SnatchOut</h3>')
  .replace(
    /<li><i class="fas fa-calendar"><\/i> Saturday, April 25, 2026<\/li>\s*<li><i class="fas fa-clock"><\/i> 5:30 PM Doors Open<\/li>\s*<li><i class="fas fa-map-marker-alt"><\/i>[\s\S]*?<\/li>\s*<li><i class="fas fa-ticket-alt"><\/i> Free Entry<\/li>/,
    `<li><i class="fas fa-map-marker-alt"></i> <a href="contact.html" style="color: inherit; text-decoration: none;">${HQ}</a></li>
                    <li><i class="fas fa-heart"></i> Donations welcome</li>`,
  )
  .replace(
    '<p>&copy; 2026 SnatchOut. All rights reserved. | <a href="#" onclick="openEventbrite()">Get Tickets</a></p>',
    '<p>&copy; 2026 SnatchOut / Evangelists For Christ Ministries. All rights reserved. | <a href="contact.html">Contact</a></p>',
  )
fs.writeFileSync(path.join(root, 'footer.html'), footer)
console.log('footer.html updated')

let artists = fs.readFileSync(path.join(root, 'artists.html'), 'utf8')
const before = artists
artists = artists.replace(
  `                        <span><strong>Mission House - The Dome</strong></span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-location-dot"></i>
                        <span><strong>Unit 1, Ryan Business Park, Radford Road, Nottingham, NG7 7DH</strong></span>`,
  `                        <span><strong>${HQ}</strong></span>`,
)
if (artists === before) {
  artists = artists.replace(/Mission House[\s\S]{0,220}?NG7 7DH<\/strong><\/span>/, `<strong>${HQ}</strong></span>`)
}
fs.writeFileSync(path.join(root, 'artists.html'), artists)
console.log('artists.html updated', artists !== before)
console.log('done')
