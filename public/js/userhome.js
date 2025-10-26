// js/user-home.js
import { api } from './api.js';
import * as Auth from './auth.js';

async function loadUserProfile() {
  try {
    const token = Auth.getToken();
    if (!token) {
      window.location.href = 'login.html';
      return;
    }

    // Load user profile
    const userRes = await api.get('/api/user/profile');
    if (userRes.success && userRes.user) {
      const user = userRes.user;
      
      // Update profile header
      const fullName = `${user.first_name} ${user.last_name}`;
      document.getElementById('userName').textContent = fullName;
      document.getElementById('userEmail').textContent = user.email;
      
      // Update avatar with initials
      const initials = `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
      document.getElementById('userAvatar').textContent = initials;
      
      // Update info grid
      document.getElementById('userFirstName').textContent = user.first_name;
      document.getElementById('userLastName').textContent = user.last_name;
      document.getElementById('userEmailInfo').textContent = user.email;
      document.getElementById('userPhone').textContent = user.phone;
    }

    // Load registered events
    const eventsRes = await api.get('/api/user/registrations');
    const container = document.getElementById('eventsContainer');
    
    if (eventsRes.success && eventsRes.registrations && eventsRes.registrations.length > 0) {
      container.innerHTML = eventsRes.registrations.map(reg => `
        <div class="event-card">
          <div class="event-details">
            <h3>${reg.event_name || 'Event'}</h3>
            <div class="event-meta">
              <span>📅 ${reg.event_date || 'Date TBD'}</span>
              <span>📍 ${reg.event_location || 'Location TBD'}</span>
              ${reg.team_name ? `<span>👥 ${reg.team_name}</span>` : ''}
            </div>
          </div>
          <span class="badge ${reg.registration_type?.toLowerCase() || 'individual'}">
            ${reg.registration_type || 'Individual'}
          </span>
        </div>
      `).join('');
    } else {
      container.innerHTML = `
        <div class="empty-state">
          <p>You haven't registered for any events yet.</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error loading profile:', error);
    document.getElementById('eventsContainer').innerHTML = `
      <div class="empty-state">
        <p style="color: var(--danger);">Error loading profile data.</p>
      </div>
    `;
  }
}

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', (e) => {
  e.preventDefault();
  Auth.removeToken();
  window.location.href = 'login.html';
});

// Load profile on page load
loadUserProfile();