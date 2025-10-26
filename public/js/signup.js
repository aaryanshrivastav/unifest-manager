// js/signup.js
import { api } from './api.js';
import * as Auth from './auth.js';

export function init(){
  const form = document.getElementById('signupForm');
  if (!form){
    return;
  }

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    
    const firstName = document.getElementById('first_name').value.trim();
    const lastName = document.getElementById('last_name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    const msg = document.getElementById('signupMsg');
    
    // Clear previous messages
    msg.textContent = '';
    msg.className = 'note';
    
    // Validate passwords match
    if (password !== confirmPassword) {
      msg.textContent = 'Passwords do not match!';
      msg.classList.add('error');
      return;
    }
    
    // Validate password length
    if (password.length < 8) {
      msg.textContent = 'Password must be at least 8 characters long.';
      msg.classList.add('error');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      msg.textContent = 'Please enter a valid email address.';
      msg.classList.add('error');
      return;
    }
    
    // Show loading state
    form.classList.add('loading');
    msg.textContent = 'Creating your account...';
    msg.classList.add('info');
    
    try{
      const res = await api.post('/api/auth/signup', { 
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone,
        password: password
      });
      
      if (res.success){
        msg.textContent = 'Account created successfully! Redirecting...';
        msg.className = 'note success';
        
        // If token is returned, save it
        if (res.token) {
          Auth.setToken(res.token);
        }
        
        // Redirect to events page after 1.5 seconds
        setTimeout(() => {
          window.location.href = 'events.html';
        }, 1500);
      } else {
        msg.textContent = 'Failed: ' + (res.message || 'Unable to create account');
        msg.className = 'note error';
      }
    } catch(err) {
      msg.textContent = 'Error: ' + err.message;
      msg.className = 'note error';
    } finally {
      form.classList.remove('loading');
    }
  });
}