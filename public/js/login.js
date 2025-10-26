// js/login.js
import { login } from './auth.js';

export function init(){
  const form = document.getElementById('loginForm');
  if (!form) return;
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errEl = document.getElementById('loginError');
    errEl.textContent = '';
    try{
      const user = await login(email, password);
      // redirect to dashboard
      window.location.href = 'dashboard.html';
    }catch(ex){
      errEl.textContent = ex.message || 'Login failed';
    }
  });
}
