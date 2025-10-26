// js/register.js
import { api } from './api.js';
import * as Auth from './auth.js';

export function init(){
  const params = new URLSearchParams(location.search);
  const id = params.get('event_id');
  const form = document.getElementById('regForm');
  if (!form){
    return;
  }
  document.getElementById('event_id').value = id || '';
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const event_id = document.getElementById('event_id').value;
    const reg_type = document.getElementById('reg_type').value;
    const team_name = document.getElementById('team_name').value;
    const contact = document.getElementById('contact').value;
    const msg = document.getElementById('regMsg');
    msg.textContent = '';
    try{
      // user must be logged in
      const token = Auth.getToken();
      if (!token) {
        msg.textContent = 'You must login before registering.';
        return;
      }
      const res = await api.post(`/api/events/${event_id}/register`, { registration_type: reg_type, team_name, contact });
      if (res.success){
        msg.textContent = 'Registration successful! ID: ' + (res.registration_id || '—');
      } else {
        msg.textContent = 'Failed: ' + (res.message || 'Unknown');
      }
    }catch(err){
      msg.textContent = 'Error: ' + err.message;
    }
  });
}
