document.addEventListener('DOMContentLoaded', function() {
    loadEvents();
});

function loadEvents() {
    // In production, fetch from backend API
    // For now, check localStorage for events
    const events = JSON.parse(localStorage.getItem('allVolunteerEvents') || '[]');
    
    displayEvents(events);
}

function displayEvents(events) {
    const container = document.getElementById('eventsContainer');
    const noEvents = document.getElementById('noEvents');
    
    if (!events || events.length === 0) {
        container.style.display = 'none';
        noEvents.style.display = 'block';
        return;
    }
    
    container.style.display = 'grid';
    noEvents.style.display = 'none';
    container.innerHTML = '';
    
    // Get registered events to check if user already registered
    const registeredEvents = JSON.parse(localStorage.getItem('volunteerEvents') || '[]');
    const registeredEventIds = registeredEvents.map(e => e.id);
    
    events.forEach(event => {
        const isRegistered = registeredEventIds.includes(event.id);
        const eventCard = createEventCard(event, isRegistered);
        container.appendChild(eventCard);
    });
}

function createEventCard(event, isRegistered) {
    const card = document.createElement('div');
    card.className = 'event-card';
    
    const buttonText = isRegistered ? 'Already Registered' : 'Register to Volunteer';
    const buttonClass = isRegistered ? 'register-btn registered' : 'register-btn';
    const buttonDisabled = isRegistered ? 'disabled' : '';
    
    card.innerHTML = `
        <h3 class="event-title">${event.title}</h3>
        
        <div class="event-details">
            <div class="event-detail">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span>${formatDate(event.date)} at ${event.time}</span>
            </div>
            
            <div class="event-detail">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>${event.location}</span>
            </div>
            
            <div class="event-detail">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>${event.duration || 'Duration not specified'}</span>
            </div>
        </div>
        
        <p class="event-description">${event.description}</p>
        
        <div class="volunteers-needed">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <span>Volunteers needed: ${event.volunteersNeeded || 'Not specified'}</span>
        </div>
        
        <button class="${buttonClass}" onclick="registerForEvent(${event.id})" ${buttonDisabled}>
            ${buttonText}
        </button>
    `;
    
    return card;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function registerForEvent(eventId) {
    // Check if volunteer profile exists
    const volunteers = JSON.parse(localStorage.getItem('volunteers') || '[]');
    if (volunteers.length === 0) {
        alert('Please complete your volunteer registration first!');
        window.location.href = 'volunteer.html';
        return;
    }
    
    // Get the event details
    const allEvents = JSON.parse(localStorage.getItem('allVolunteerEvents') || '[]');
    const event = allEvents.find(e => e.id === eventId);
    
    if (!event) {
        alert('Event not found!');
        return;
    }
    
    // Get current registered events
    const registeredEvents = JSON.parse(localStorage.getItem('volunteerEvents') || '[]');
    
    // Check if already registered
    if (registeredEvents.some(e => e.id === eventId)) {
        alert('You are already registered for this event!');
        return;
    }
    
    // Add event to registered events with status
    const eventWithStatus = {
        ...event,
        status: 'upcoming',
        registeredDate: new Date().toISOString()
    };
    
    registeredEvents.push(eventWithStatus);
    localStorage.setItem('volunteerEvents', JSON.stringify(registeredEvents));
    
    // Show success message
    showNotification('Successfully registered for ' + event.title + '!');
    
    // Reload the page to update button states
    setTimeout(() => {
        loadEvents();
    }, 1000);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: rgba(46, 204, 113, 0.9);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);