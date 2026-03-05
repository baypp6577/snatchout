// Mobile menu toggle
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

// Eventbrite integration
function openEventbrite() {
    // Replace with your actual Eventbrite URL
    window.open('https://www.eventbrite.com/', '_blank');
}

// Flyer Modal Functions
function openFlyerModal() {
    const modal = document.getElementById('flyerModal');
    const container = modal.querySelector('.flyer-container');
    
    // Remove closing classes if they exist
    modal.classList.remove('closing');
    container.classList.remove('closing');
    
    // Add active classes
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeFlyerModal() {
    const modal = document.getElementById('flyerModal');
    const container = modal.querySelector('.flyer-container');
    
    // Add closing classes for animation
    modal.classList.add('closing');
    container.classList.add('closing');
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
        modal.classList.remove('active', 'closing');
        container.classList.remove('closing');
        document.body.style.overflow = 'auto'; // Restore scrolling
    }, 300);
}

// Dynamic event status update
function updateEventStatus() {
    const eventDate = new Date('2026-04-25T17:30:00'); // April 25, 2026 at 5:30 PM
    const currentDate = new Date();
    
    // Find the event card
    const eventCard = document.querySelector('.event-card');
    const statusBadge = eventCard.querySelector('.event-status');
    
    if (currentDate >= eventDate) {
        // Change to LIVE status
        statusBadge.className = 'event-status status-present';
        statusBadge.textContent = 'LIVE NOW';
        
        // Update button text
        const actionButton = eventCard.querySelector('.btn');
        actionButton.textContent = 'Join Now';
        actionButton.onclick = openEventbrite;
    }
}

// Initialize flyer modal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Close flyer when clicking outside
    const flyerModal = document.getElementById('flyerModal');
    if (flyerModal) {
        flyerModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeFlyerModal();
            }
        });

        // Close flyer with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeFlyerModal();
            }
        });
    }
});
