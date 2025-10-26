import { api } from './api.js';
import * as Auth from './auth.js';

async function loadFaculty() {
  try {
    const token = Auth.getToken();
    if (!token) return (window.location.href = 'login.html');

    const res = await api.get('/api/faculty/profile');
    if (res.success && res.data) {
      const f = res.data;
      document.getElementById('facultyName').textContent = f.name;
      document.getElementById('facultyEmail').textContent = f.email;
      document.getElementById('facultyDept').textContent = f.department;
      document.getElementById('facultyPhone').textContent = f.phone;
      document.getElementById('facultyEvents').textContent = f.total_events;
      document.getElementById('facultyAvatar').textContent = f.name[0].toUpperCase();
    }

    const ev = await api.get('/api/faculty/events');
    const container = document.getElementById('eventsContainer');
    if (ev.success && ev.events?.length) {
      container.innerHTML = ev.events.map(e => `
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

loadFaculty();
