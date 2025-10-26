// js/user-events.js
import { api } from './api.js';
import * as Auth from './auth.js';

let allEvents = [];
let currentFilter = 'all';

async function loadEvents() {
  try {
    const token = Auth.getToken();
    if (!token) {
      window.location.href = 'login.html';
      return;
    }

    const response = await api.get('/api/events');
    
    if (response.success && response.events) {
      allEvents = response.events;
      displayEvents(allEvents);
    } else {
      showNoEvents();
    }
  } catch (error) {
    console.error('Error loading events:', error);
    showNoEvents();
  }
}

function displayEvents(events) {
  const grid = document.getElementById('eventsGrid');
  const noEventsDiv = document.getElementById('noEvents');

  if (!events || events.length === 0) {
    showNoEvents();
    return;
  }

  noEventsDiv.style.display = 'none';
  grid.innerHTML = events.map(event => `
    <div class="event-card" data-event-id="${event.id}">
      <div class="event-header">
        <div>
          <h3 class="event-title">${event.name || 'Untitled Event'}</h3>
        </div>
        <span class="event-category">${event.category || 'General'}</span>
      </div>
      
      <p class="event-description">${event.description || 'No description available'}</p>
      
      <div class="event-details">
        <div class="event-detail">
          <span>📅</span>
          <span>${event.date || 'Date TBD'}</span>
        </div>
        <div class="event-detail">
          <span>🕐</span>
          <span>${event.time || 'Time TBD'}</span>
        </div>
        <div class="event-detail">
          <span>📍</span>
          <span>${event.location || 'Location TBD'}</span>
        </div>
        <div class="event-detail">
          <span>👥</span>
          <span>${event.max_participants || 'Unlimited'} participants</span>
        </div>
      </div>
      
      <div class="event-footer">
        <span class="event-price ${event.fee === 0 || event.fee === '0' ? 'free' : ''}">
          ${event.fee === 0 || event.fee === '0' ? 'Free' : `₹${event.fee}`}
        </span>
        <button class="register-btn" onclick="registerForEvent('${event.id}')">
          Register Now
        </button>
      </div>
    </div>
  `).join('');
}

function showNoEvents() {
  document.getElementById('eventsGrid').innerHTML = '';
  document.getElementById('noEvents').style.display = 'block';
}

function filterEvents(category) {
  currentFilter = category;
  
  // Update active filter button
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.filter === category) {
      btn.classList.add('active');
    }
  });

  // Filter events
  if (category === 'all') {
    displayEvents(allEvents);
  } else {
    const filtered = allEvents.filter(event => 
      event.category && event.category.toLowerCase() === category.toLowerCase()
    );
    displayEvents(filtered);
  }
}

function searchEvents(query) {
  const searchTerm = query.toLowerCase().trim();
  
  if (!searchTerm) {
    filterEvents(currentFilter);
    return;
  }

  let eventsToSearch = currentFilter === 'all' ? allEvents : 
    allEvents.filter(event => event.category && event.category.toLowerCase() === currentFilter.toLowerCase());

  const filtered = eventsToSearch.filter(event => 
    (event.name && event.name.toLowerCase().includes(searchTerm)) ||
    (event.description && event.description.toLowerCase().includes(searchTerm)) ||
    (event.location && event.location.toLowerCase().includes(searchTerm))
  );

  displayEvents(filtered);
}

// Make registerForEvent global so it can be called from HTML
window.registerForEvent = function(eventId) {
  window.location.href = `register.html?event_id=${eventId}`;
};

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', (e) => {
  e.preventDefault();
  Auth.removeToken();
  window.location.href = 'login.html';
});

// Search functionality
document.getElementById('searchInput').addEventListener('input', (e) => {
  searchEvents(e.target.value);
});

// Filter functionality
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    filterEvents(btn.dataset.filter);
  });
});
document.getElementById('backBtn').addEventListener('click', () => {
  window.location.href = 'userevent.html';
});

// Load events on page load
loadEvents();
