/* ============================================================
   FreelanceHub — Live Notifications (Admin polling)
   Polls /api/notifications/count every 30 seconds
============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const badge = document.getElementById('notifBadge');
  if (!badge) return; // Only active on admin pages

  let previousCount = 0;
  let audio = null;

  async function fetchNotifications() {
    try {
      const res = await fetch('/api/notifications/count', { credentials: 'same-origin' });
      if (!res.ok) return;
      const data = await res.json();

      const total = data.total || 0;

      // Update badge
      if (total > 0) {
        badge.textContent = total > 99 ? '99+' : total;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }

      // Show toast if new notifications arrived since last check
      if (total > previousCount && previousCount !== 0) {
        const diff = total - previousCount;
        if (window.showToast) {
          showToast(`${diff} new notification${diff > 1 ? 's' : ''} received!`, 'info');
        }
      }

      previousCount = total;

      // Update sidebar badges
      const msgBadge = document.getElementById('sidebarMsgBadge');
      if (msgBadge) {
        msgBadge.textContent = data.unread_messages || 0;
        msgBadge.style.display = data.unread_messages > 0 ? 'flex' : 'none';
      }
      const reqBadge = document.getElementById('sidebarReqBadge');
      if (reqBadge) {
        reqBadge.textContent = data.pending_requests || 0;
        reqBadge.style.display = data.pending_requests > 0 ? 'flex' : 'none';
      }

    } catch (err) {
      // Silently fail — network or auth error
    }
  }

  fetchNotifications();
  setInterval(fetchNotifications, 30000); // Every 30 seconds
});
