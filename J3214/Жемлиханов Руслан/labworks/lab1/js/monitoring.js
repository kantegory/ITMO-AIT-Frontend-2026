(() => {
  const App = (window.App = window.App || {});

  const initMonitoringPage = async () => {
    const severityFilter = document.getElementById('severityFilter');
    const notificationsList = document.getElementById('notificationsList');
    const markReadBtn = document.getElementById('markRead');
    const resourceBars = document.querySelectorAll('[data-resource-bar]');

    if (!notificationsList && !severityFilter && !markReadBtn && !resourceBars.length) return;

    try {
      const notifications = await App.api.getNotifications();
      App.ui.renderNotifications(notificationsList, 'monitoring', notifications);
    } catch {
      App.ui.renderNotifications(notificationsList, 'monitoring');
    }

    const notifications = document.querySelectorAll('#notificationsList .list-group-item');

    if (severityFilter) {
      severityFilter.addEventListener('change', () => {
        const value = severityFilter.value;
        notifications.forEach((n) => {
          n.classList.toggle('hidden', value !== 'all' && n.dataset.severity !== value);
        });
      });
    }

    if (markReadBtn) {
      markReadBtn.addEventListener('click', () => {
        notifications.forEach((n) => n.classList.add('read'));
        App.ui.showToast('Уведомления помечены как прочитанные.');
      });
    }

    if (resourceBars.length) {
      setInterval(() => {
        resourceBars.forEach((bar) => {
          const next = Math.floor(Math.random() * 71) + 20;
          bar.style.width = `${next}%`;
          bar.textContent = `${next}%`;
        });
      }, 3500);
    }
  };

  App.monitoring = {
    init: initMonitoringPage
  };
})();
