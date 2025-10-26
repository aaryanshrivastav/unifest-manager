import { api } from './api.js';
import * as Auth from './auth.js';

async function loadEvent() {
  const token = Auth.getToken();
  if (!token) return (window.location.href = 'login.html');

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  if (!id) return alert('No event ID provided.');

  const res = await api.get(`/api/event/details/${id}`);
  if (res.success && res.event) {
    const e = res.event;
    document.getElementById('eventTitle').textContent = e.name;
    document.getElementById('eventDescription').textContent = e.description;
    document.getElementById('eventDate').textContent = e.date;
    document.getElementById('eventVenue').textContent = e.venue;
    document.getElementById('eventCategory').textContent = e.category;
    document.getElementById('eventCoord').textContent = e.coordinator;

    const shifts = e.shifts || [];
    const container = document.getElementById('shiftContainer');
    if (shifts.length) {
      container.innerHTML = shifts.map(s => `
        <div class="event-card">
          <div class="event-details">
            <h3>${s.name}</h3>
            <div class="event-meta">
              <span>⏰ ${s.time}</span>
              <span>👥 Slots: ${s.slots}</span>
            </div>
          </div>
          <button class="btn ghost" onclick="alert('Applied for ${s.name} (mock)')">Apply</button>
        </div>
      `).join('');
    } else {
      container.innerHTML = `<div class="empty-state"><p>No shifts available for this event.</p></div>`;
    }
  }
}

document.getElementById('registerEvent').addEventListener('click', () => alert('Registered (mock)'));
document.getElementById('applyVolunteer').addEventListener('click', () => alert('Applied as Volunteer (mock)'));

document.getElementById('logoutBtn').addEventListener('click', e => {
  e.preventDefault();
  Auth.removeToken();
  window.location.href = 'login.html';
});

loadEvent();
