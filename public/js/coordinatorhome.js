import { api } from './api.js';
import * as Auth from './auth.js';

async function loadCoordinator() {
  try {
    const token = Auth.getToken();
    if (!token) return (window.location.href = 'login.html');

    const res = await api.get('/api/coordinator/profile');
    if (res.success && res.data) {
      const c = res.data;
      document.getElementById('coordName').textContent = c.name;
      document.getElementById('coordEmail').textContent = c.email;
      document.getElementById('coordDept').textContent = c.department;
      document.getElementById('coordPhone').textContent = c.phone;
      document.getElementById('coordEvents').textContent = c.total_events;
      document.getElementById('coordVolunteers').textContent = c.total_volunteers;
      document.getElementById('coordAvatar').textContent = c.name[0].toUpperCase();
    }

    const ev = await api.get('/api/coordinator/events');
    const container = document.getElementById('eventsContainer');
    if (ev.success && ev.events?.length) {
      const limited = ev.events.slice(0, 5);
      container.innerHTML = limited.map(e => `
        <div class="event-card">
          <div class="event-details">
            <h3>${e.name}</h3>
            <div class="event-meta">
              <span>📅 ${e.date}</span>
              <span>📍 ${e.venue}</span>
            </div>
          </div>
          <span class="badge individual">${e.status || 'Active'}</span>
        </div>
      `).join('');
    } else {
      container.innerHTML = `<div class="empty-state"><p>No events found.</p></div>`;
    }
  } catch (err) {
    console.error(err);
  }
}

document.getElementById('logoutBtn').addEventListener('click', e => {
  e.preventDefault();
  Auth.removeToken();
  window.location.href = 'login.html';
});

loadCoordinator();
