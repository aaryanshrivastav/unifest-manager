import { api } from './api.js';
import * as Auth from './auth.js';

async function loadEvents() {
  const token = Auth.getToken();
  if (!token) return (window.location.href = 'login.html');

  const res = await api.get('/api/faculty/events');
  const container = document.getElementById('eventsContainer');

  if (res.success && res.events?.length) {
    container.innerHTML = res.events.map(e => `
      <div class="event-card">
        <div class="event-details">
          <h3>${e.name}</h3>
          <div class="event-meta">
            <span>📅 ${e.date}</span>
            <span>📍 ${e.venue}</span>
            <span>👥 ${e.participants || 0} Participants</span>
          </div>
        </div>
        <span class="badge individual">${e.status || 'Active'}</span>
      </div>
    `).join('');
  } else {
    container.innerHTML = `<div class="empty-state"><p>No events found under this faculty.</p></div>`;
  }
}

document.getElementById('logoutBtn').addEventListener('click', e => {
  e.preventDefault();
  Auth.removeToken();
  window.location.href = 'login.html';
});

loadEvents();
// Logout
document.getElementById('logoutBtn').addEventListener('click', e => {
    e.preventDefault();
    Auth.removeToken();
    window.location.href = 'login.html';
});