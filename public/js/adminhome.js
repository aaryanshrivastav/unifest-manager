import { api } from './api.js';
import * as Auth from './auth.js';

async function loadAdmin() {
  try {
    const token = Auth.getToken();
    if (!token) return (window.location.href = 'login.html');

    const res = await api.get('/api/admin/profile');
    if (res.success && res.data) {
      const a = res.data;
      document.getElementById('adminName').textContent = a.name;
      document.getElementById('adminEmail').textContent = a.email;
      document.getElementById('adminUsers').textContent = a.total_users;
      document.getElementById('adminEvents').textContent = a.total_events;
      document.getElementById('adminVols').textContent = a.total_volunteers;
      document.getElementById('adminFac').textContent = a.total_faculties;
      document.getElementById('adminAvatar').textContent = a.name[0].toUpperCase();
    }

    const approvals = await api.get('/api/admin/approvals');
    const container = document.getElementById('eventsContainer');
    if (approvals.success && approvals.list?.length) {
      container.innerHTML = approvals.list.map(item => `
        <div class="event-card">
          <div class="event-details">
            <h3>${item.title}</h3>
            <div class="event-meta">
              <span>📅 ${item.date}</span>
              <span>👤 ${item.type}</span>
            </div>
          </div>
          <span class="badge team">${item.status}</span>
        </div>
      `).join('');
    } else {
      container.innerHTML = `<div class="empty-state"><p>No pending approvals.</p></div>`;
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

loadAdmin();
