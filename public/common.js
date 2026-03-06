// Common JavaScript Functions for SnatchOut Website

// Mobile menu toggle
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}

// Eventbrite integration
function openEventbrite() {
    window.open('https://www.eventbrite.com/', '_blank');
}

// Add scroll effect to navigation
function initScrollEffect() {
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('nav');
        if (nav && window.scrollY > 50) {
            nav.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)';
            nav.style.backdropFilter = 'blur(10px)';
        } else if (nav) {
            nav.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            nav.style.backdropFilter = 'none';
        }
    });
}

// HTML Includes Loader
function loadIncludes() {
    // Load navigation include
    fetch('nav.html')
        .then(response => response.text())
        .then(data => {
            const navContainer = document.getElementById('nav-include');
            if (navContainer) {
                navContainer.innerHTML = data;
                
                // Set active link for current page
                const currentPage = window.location.pathname.split('/').pop();
                const activeLink = document.querySelector(`a[href="${currentPage}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
                
                // Handle home page active state
                if (currentPage === '' || currentPage === 'index.html') {
                    const homeLink = document.querySelector('a[href="#home"]');
                    if (homeLink) {
                        homeLink.classList.add('active');
                    }
                }
            }
        })
        .catch(error => console.error('Error loading navigation:', error));
    
    // Load footer include
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            const footerContainer = document.getElementById('footer-include');
            if (footerContainer) {
                footerContainer.innerHTML = data;
            }
        })
        .catch(error => console.error('Error loading footer:', error));
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadIncludes();
    initScrollEffect();
    initClickOutsideMenu();
});

// Close menu when clicking outside
function initClickOutsideMenu() {
    document.addEventListener('click', function(event) {
        const nav = document.querySelector('nav');
        const navLinks = document.getElementById('navLinks');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        // Check if menu is active and click is outside nav
        if (navLinks && navLinks.classList.contains('active') && 
            !nav.contains(event.target)) {
            navLinks.classList.remove('active');
        }
    });
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
