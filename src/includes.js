// HTML Includes Function - Vanilla JavaScript
function includeHTML() {
    const elements = document.querySelectorAll('[data-include]');
    elements.forEach(element => {
        const file = element.getAttribute('data-include');
        fetch(file)
            .then(response => {
                if (response.ok) {
                    return response.text();
                }
                throw new Error('File not found: ' + file);
            })
            .then(html => {
                element.innerHTML = html;
                
                // Re-initialize any scripts that depend on included content
                if (file.includes('header.html')) {
                    initializeNavigation();
                }
            })
            .catch(error => {
                console.error('Error including file:', error);
                element.innerHTML = '<p>Error loading content</p>';
            });
    });
}

// Initialize navigation after header is loaded
function initializeNavigation() {
    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll effect to navigation
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('nav');
        if (window.scrollY > 50) {
            nav.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)';
            nav.style.backdropFilter = 'blur(10px)';
        } else {
            nav.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            nav.style.backdropFilter = 'none';
        }
    });
}

// Initialize includes when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    includeHTML();
    
    // Other initialization code
    console.log('SnatchOut Event Management - Loaded Successfully');
    
    // Update event status dynamically
    updateEventStatus();
    
    // Add animation to event cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all event cards
    document.querySelectorAll('.event-card').forEach(card => {
        observer.observe(card);
    });
});
