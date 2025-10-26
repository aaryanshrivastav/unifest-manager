import { api } from './api.js';
import * as Auth from './auth.js';

const form = document.getElementById('eventForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const token = Auth.getToken();
  if (!token) return (window.location.href = 'login.html');

  const data = {
    name: document.getElementById('eventName').value,
    description: document.getElementById('eventDesc').value,
    start_time: document.getElementById('eventStart').value,
    end_time: document.getElementById('eventEnd').value,
    reg_start: document.getElementById('regStart').value,
    reg_end: document.getElementById('regEnd').value,
    max_participants: document.getElementById('maxParticipants').value,
    fees: document.getElementById('eventFees').value,
    venue: document.getElementById('eventVenue').value
  };

  try {
    const res = await api.post('/api/faculty/event/register', data);
    if (res.success) {
      alert('Event registered successfully!');
      form.reset();
    } else {
      alert(res.message || 'Failed to register event.');
    }
  } catch (err) {
    console.error(err);
    alert('Error while registering event.');
  }
});

document.getElementById('logoutBtn').addEventListener('click', e => {
  e.preventDefault();
  Auth.removeToken();
  window.location.href = 'login.html';
});
