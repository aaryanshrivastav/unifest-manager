import { api } from './api.js';
import * as Auth from './auth.js';

async function loadEvent() {
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get('event_id');

  if (!eventId) {
    alert('No event selected!');
    window.location.href = 'userevent.html';
    return;
  }

  try {
    const token = Auth.getToken();
    if (!token) {
      window.location.href = 'login.html';
      return;
    }

    const response = await api.get(`/api/events/${eventId}`);

    if (response.success && response.event) {
      displayEvent(response.event);
    } else {
      alert('Event not found.');
      window.location.href = 'userevent.html';
    }
  } catch (error) {
    console.error('Error loading event:', error);
    alert('Unable to load event details.');
    window.location.href = 'userevent.html';
  }
}

function displayEvent(event) {
  const container = document.getElementById('eventDetails');
  container.innerHTML = `
    <div class="event-card">
      <div class="event-header">
        <h2>${event.name || 'Untitled Event'}</h2>
        <span class="event-category">${event.category || 'General'}</span>
      </div>

      <p class="event-description">${event.description || 'No description available.'}</p>

      <div class="event-details">
        <div class="event-detail"><span>📅</span> ${event.date || 'Date TBD'}</div>
        <div class="event-detail"><span>🕐</span> ${event.time || 'Time TBD'}</div>
        <div class="event-detail"><span>📍</span> ${event.location || 'Location TBD'}</div>
        <div class="event-detail"><span>👥</span> ${event.max_participants || 'Unlimited'} participants</div>
        <div class="event-detail"><span>💰</span> ${event.fee == 0 ? 'Free' : `₹${event.fee}`}</div>
      </div>

      <button class="register-btn" id="registerBtn">Register Now</button>
    </div>
  `;

  document.getElementById('registerBtn').addEventListener('click', () => {
    window.location.href = `register.html?event_id=${event.id}`;
  });
}



// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', (e) => {
  e.preventDefault();
  Auth.removeToken();
  window.location.href = 'login.html';
});

// Load event on page load
loadEvent();
