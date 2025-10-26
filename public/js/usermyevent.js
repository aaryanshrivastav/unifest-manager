// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadUserInfo();
    loadEvents();
    setupFilters();
});

// Load user information
function loadUserInfo() {
    // In production, fetch from authentication system
    const userName = localStorage.getItem('userName') || 'Student User';
    document.getElementById('userName').textContent = userName;
}

// Load events from storage or API
function loadEvents() {
    // In production, fetch from backend API
    // For now, check localStorage for user's registered events
    const userEvents = JSON.parse(localStorage.getItem('userEvents') || '[]');
    
    displayEvents(userEvents);
    updateStats(userEvents);
}

// Display events in the grid
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
    
    events.forEach(event => {
        const eventCard = createEventCard(event);
        container.appendChild(eventCard);
    });
}

// Create individual event card
function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.setAttribute('data-status', event.status);
    
    const statusClass = `status-${event.status}`;
    const statusText = event.status.charAt(0).toUpperCase() + event.status.slice(1);
    
    card.innerHTML = `
        <div class="event-header">
            <h3 class="event-title">${event.title}</h3>
            <span class="event-status ${statusClass}">${statusText}</span>
        </div>
        
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
        </div>
        
        <p class="event-description">${event.description}</p>
        
        <div class="event-actions">
            <button class="btn btn-primary" onclick="viewEventDetails(${event.id})">View Details</button>
            <button class="btn btn-secondary" onclick="unregisterEvent(${event.id})">Unregister</button>
        </div>
    `;
    
    return card;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Update statistics
function updateStats(events) {
    const totalEvents = events.length;
    const upcomingEvents = events.filter(e => e.status === 'upcoming').length;
    
    document.getElementById('totalEvents').textContent = totalEvents;
    document.getElementById('upcomingEvents').textContent = upcomingEvents;
}

// Setup filter functionality
function setupFilters() {
    const filterSelect = document.getElementById('filterStatus');
    
    filterSelect.addEventListener('change', function() {
        const filterValue = this.value;
        const allEvents = JSON.parse(localStorage.getItem('userEvents') || '[]');
        
        if (filterValue === 'all') {
            displayEvents(allEvents);
        } else {
            const filteredEvents = allEvents.filter(event => event.status === filterValue);
            displayEvents(filteredEvents);
        }
    });
}

// View event details
function viewEventDetails(eventId) {
    // In production, navigate to event detail page
    console.log('Viewing event details for ID:', eventId);
    alert('Redirecting to event details page...');
    // window.location.href = `event-details.html?id=${eventId}`;
}

// Unregister from event
function unregisterEvent(eventId) {
    if (!confirm('Are you sure you want to unregister from this event?')) {
        return;
    }
    
    // Get current events
    let userEvents = JSON.parse(localStorage.getItem('userEvents') || '[]');
    
    // Remove the event
    userEvents = userEvents.filter(event => event.id !== eventId);
    
    // Save back to localStorage
    localStorage.setItem('userEvents', JSON.stringify(userEvents));
    
    // Reload the page with updated events
    loadEvents();
    
    // Show success message
    showNotification('Successfully unregistered from the event');
}

// Show notification
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

// Add animation styles
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