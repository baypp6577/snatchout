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

// Lead Capture Function
function handleLeadSubmit(event) {
    event.preventDefault();
    
    const form = document.getElementById('leadForm');
    const messageDiv = document.getElementById('leadMessage');
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const interest = document.getElementById('interest').value;
    
    // Validate form
    if (!name || !email || !interest) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    // Create lead data object
    const leadData = {
        name: name,
        email: email,
        phone: phone,
        interest: interest,
        timestamp: new Date().toISOString(),
        source: 'SnatchOut Website Lead Capture'
    };
    
    // Store lead (in real app, this would send to backend)
    console.log('Lead captured:', leadData);
    
    // Show success message
    showMessage(`Thank you ${name}! We've received your information and will contact you soon about ${interest}.`, 'success');
    
    // Reset form
    form.reset();
    
    // In a real implementation, you would send this to your backend/email service
    // Example: sendToCRM(leadData) or emailToAdmin(leadData)
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('leadMessage');
    messageDiv.textContent = message;
    messageDiv.className = `lead-message ${type}`;
    messageDiv.style.display = 'block';
    
    // Auto-hide message after 5 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}
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
