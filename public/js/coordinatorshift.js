import { api } from './api.js';
import * as Auth from './auth.js';

async function loadShifts() {
  const token = Auth.getToken();
  if (!token) return (window.location.href = 'login.html');

  const res = await api.get('/api/coordinator/shifts');
  const container = document.getElementById('shiftContainer');

  if (res.success && res.shifts?.length) {
    container.innerHTML = res.shifts.map(s => `
      <div class="event-card">
        <div class="event-details">
          <h3>${s.event_name}</h3>
          <div class="event-meta">
            <span>⏰ ${s.time}</span>
            <span>📍 ${s.venue}</span>
            <span>👥 Volunteers: ${s.volunteers}</span>
          </div>
        </div>
      </div>
    `).join('');
  } else {
    container.innerHTML = `<div class="empty-state"><p>No assigned shifts.</p></div>`;
  }
}

document.getElementById('logoutBtn').addEventListener('click', e => {
  e.preventDefault();
  Auth.removeToken();
  window.location.href = 'login.html';
});

loadShifts();
