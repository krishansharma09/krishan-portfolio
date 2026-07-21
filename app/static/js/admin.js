/* ============================================================
   FreelanceHub — Admin Panel JavaScript
   CRUD modals, table actions, Chart.js dashboard
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── CSRF token helper ───────────────────────────────────────
  async function adminFetch(url, options = {}) {
    const defaults = {
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', ...options.headers }
    };
    return fetch(url, { ...defaults, ...options });
  }

  // ── Modal helpers ───────────────────────────────────────────
  window.openModal = function(id) {
    const overlay = document.getElementById(id);
    if (overlay) overlay.classList.add('open');
  };

  window.closeModal = function(id) {
    const overlay = document.getElementById(id);
    if (overlay) {
      overlay.classList.remove('open');
      const form = overlay.querySelector('form');
      if (form) form.reset();
    }
  };

  // Close on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });

  // ── Mobile sidebar toggle ───────────────────────────────────
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar       = document.querySelector('.admin-sidebar');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  }

  // ── Dashboard Charts (Chart.js) ─────────────────────────────
  const activityCanvas = document.getElementById('activityChart');
  if (activityCanvas && window.Chart) {
    const ctx = activityCanvas.getContext('2d');
    const labels = generateLast7Days();
    const messagesData = activityCanvas.dataset.messages
      ? JSON.parse(activityCanvas.dataset.messages) : new Array(7).fill(0);
    const requestsData = activityCanvas.dataset.requests
      ? JSON.parse(activityCanvas.dataset.requests) : new Array(7).fill(0);

    new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Messages',
            data: messagesData,
            borderColor: '#7c3aed',
            backgroundColor: 'rgba(124,58,237,0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#7c3aed',
            pointRadius: 4,
          },
          {
            label: 'Client Requests',
            data: requestsData,
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6,182,212,0.08)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#06b6d4',
            pointRadius: 4,
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: '#a0a0c0', font: { family: 'Inter', size: 12 } }
          },
          tooltip: {
            backgroundColor: '#111118',
            borderColor: 'rgba(255,255,255,0.08)',
            borderWidth: 1,
            titleColor: '#f0f0ff',
            bodyColor: '#a0a0c0',
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#666688', font: { size: 11 } }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#666688', font: { size: 11 }, stepSize: 1 },
            beginAtZero: true
          }
        }
      }
    });
  }

  function generateLast7Days() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toLocaleDateString('en', { month: 'short', day: 'numeric' }));
    }
    return days;
  }

  // ── Confirm Delete ──────────────────────────────────────────
  document.querySelectorAll('[data-confirm-delete]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const url = btn.dataset.confirmDelete;
      const label = btn.dataset.label || 'this item';
      if (!confirm(`Are you sure you want to delete ${label}? This cannot be undone.`)) return;

      try {
        const res = await adminFetch(url, { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          showToast(`${label} deleted.`, 'success');
          const row = btn.closest('tr, .admin-item');
          if (row) row.remove();
        } else {
          showToast(data.message || 'Delete failed.', 'error');
        }
      } catch {
        showToast('Network error.', 'error');
      }
    });
  });

  // ── Mark message as read ────────────────────────────────────
  document.querySelectorAll('[data-mark-read]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const url = btn.dataset.markRead;
      try {
        await adminFetch(url, { method: 'POST' });
        const row = btn.closest('tr');
        if (row) {
          row.classList.remove('unread');
          btn.remove();
        }
        showToast('Marked as read.', 'success');
      } catch {
        showToast('Failed.', 'error');
      }
    });
  });

  // ── Status update (requests) ────────────────────────────────
  document.querySelectorAll('[data-status-url]').forEach(select => {
    select.addEventListener('change', async () => {
      const url = select.dataset.statusUrl;
      try {
        const res = await adminFetch(url, {
          method: 'POST',
          body: JSON.stringify({ status: select.value })
        });
        const data = await res.json();
        if (data.success) {
          showToast('Status updated.', 'success');
        }
      } catch {
        showToast('Failed to update status.', 'error');
      }
    });
  });

  // ── Service / Project AJAX forms ────────────────────────────
  const crudForms = document.querySelectorAll('[data-crud-form]');
  crudForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const url = form.action;
      const btn = form.querySelector('[type=submit]');
      const original = btn?.innerHTML;
      if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>'; }

      try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        const res = await adminFetch(url, {
          method: 'POST',
          body: JSON.stringify(data)
        });
        const json = await res.json();

        if (json.success) {
          showToast('Saved successfully!', 'success');
          const modalId = form.closest('.modal-overlay')?.id;
          if (modalId) closeModal(modalId);
          setTimeout(() => location.reload(), 800);
        } else {
          showToast(json.message || 'Save failed.', 'error');
        }
      } catch {
        showToast('Network error.', 'error');
      } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = original; }
      }
    });
  });

  // ── Populate edit modal with existing data ──────────────────
  document.querySelectorAll('[data-edit-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      const data = JSON.parse(btn.dataset.editData || '{}');
      const modalId = btn.dataset.editModal;
      const modal = document.getElementById(modalId);
      if (!modal) return;

      Object.entries(data).forEach(([key, val]) => {
        const input = modal.querySelector(`[name="${key}"]`);
        if (input) {
          if (input.type === 'checkbox') {
            input.checked = !!val;
          } else {
            input.value = Array.isArray(val) ? val.join(', ') : (val ?? '');
          }
        }
      });

      openModal(modalId);
    });
  });

  console.log('%cAdmin Panel ⚙️', 'color:#06b6d4;font-size:14px;font-weight:bold;');
});
