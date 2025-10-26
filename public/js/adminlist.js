import { api } from './api.js';
import * as Auth from './auth.js';

const listType = document.getElementById('listType');
const listDisplay = document.getElementById('listDisplay');

// Logout
document.getElementById('logoutBtn').addEventListener('click', e => {
    e.preventDefault();
    Auth.removeToken();
    window.location.href = 'login.html';
});

// Load list when dropdown changes
listType.addEventListener('change', async e => {
    const type = e.target.value;
    listDisplay.innerHTML = '';

    if (!type) return;

    const token = Auth.getToken();
    if (!token) return (window.location.href = 'login.html');

    try {
        // Example API: /api/admin/list?type=venues|volunteers|coordinators|faculty|events
        const res = await api.get(`/api/admin/list?type=${type}&limit=10`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.success && res.data.length > 0) {
            res.data.forEach(item => {
                const div = document.createElement('div');
                div.className = 'event-card';
                div.innerHTML = `
                    <strong>${item.name}</strong>
                    <span>${item.email || item.venue || ''}</span>
                `;
                listDisplay.appendChild(div);
            });
        } else {
            listDisplay.innerHTML = '<p class="empty-state">No items found.</p>';
        }
    } catch (err) {
        console.error(err);
        listDisplay.innerHTML = '<p class="empty-state">Error loading list.</p>';
    }
});
