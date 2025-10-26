import { api } from './api.js';
import * as Auth from './auth.js';

const approvalType = document.getElementById('approvalType');
const approvalList = document.getElementById('approvalList');

// Logout
document.getElementById('logoutBtn').addEventListener('click', e => {
    e.preventDefault();
    Auth.removeToken();
    window.location.href = 'login.html';
});

// Load approvals when dropdown changes
approvalType.addEventListener('change', async e => {
    const type = e.target.value;
    approvalList.innerHTML = '';

    if (!type) return;

    const token = Auth.getToken();
    if (!token) return (window.location.href = 'login.html');

    try {
        // Example API: /api/admin/approvals?type=events or volunteers
        const res = await api.get(`/api/admin/approvals?type=${type}&limit=10`, {
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
                approvalList.appendChild(div);
            });
        } else {
            approvalList.innerHTML = '<p class="empty-state">No approvals found.</p>';
        }
    } catch (err) {
        console.error(err);
        approvalList.innerHTML = '<p class="empty-state">Error loading approvals.</p>';
    }
});
