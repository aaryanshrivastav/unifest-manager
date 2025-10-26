import { api } from './api.js';
import * as Auth from './auth.js';

async function loadAssignPage() {
  const token = Auth.getToken();
  if (!token) return (window.location.href = 'login.html');

  const eventSelect = document.getElementById('eventSelect');
  const volList = document.getElementById('volunteerList');

  const ev = await api.get('/api/coordinator/events');
  if (ev.success && ev.events?.length) {
    eventSelect.innerHTML = ev.events.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
  }

  eventSelect.addEventListener('change', async () => {
    const eventId = eventSelect.value;
    const vols = await api.get(`/api/coordinator/event/${eventId}/volunteers`);
    if (vols.success && vols.volunteers?.length) {
      volList.innerHTML = vols.volunteers.map(v => `
        <div class="event-card">
          <div class="event-details">
            <h3>${v.name}</h3>
            <div class="event-meta">
              <span>📧 ${v.email}</span>
              <span>📞 ${v.phone}</span>
            </div>
          </div>
          <button class="btn primary" onclick="alert('Assigned ${v.name} (mock)')">Assign</button>
        </div>
      `).join('');
    } else {
      volList.innerHTML = `<div class="empty-state"><p>No volunteers available.</p></div>`;
    }
  });
}

document.getElementById('logoutBtn').addEventListener('click', e => {
  e.preventDefault();
  Auth.removeToken();
  window.location.href = 'login.html';
});

loadAssignPage();
