(() => {
  const App = (window.App = window.App || {});

  const defaultNotificationsFeed = [
    { severity: 'critical', text: 'Pipeline daily_sales_etl failed' },
    { severity: 'warning', text: 'SLA missed for customer_sync' },
    { severity: 'warning', text: 'Worker capacity is near limit' },
    { severity: 'info', text: 'Connection restored' }
  ];

  const severityBadgeClass = (severity) => {
    if (severity === 'critical') return 'danger';
    if (severity === 'warning') return 'warning';
    return 'success';
  };

  const severityLabel = (severity) => {
    if (severity === 'critical') return 'Critical';
    if (severity === 'warning') return 'Warning';
    return 'Info';
  };

  App.ui = {
    showToast(message) {
      const toastEl = document.getElementById('actionToast');
      const body = document.getElementById('toastBody');
      if (!toastEl || !body || !window.bootstrap) return;
      body.textContent = message;
      bootstrap.Toast.getOrCreateInstance(toastEl).show();
    },

    severityBadgeClass,
    severityLabel,

    renderNotifications(listEl, mode, feed = defaultNotificationsFeed) {
      if (!listEl) return;
      listEl.innerHTML = feed
        .map((item) => {
          const badge = `<span class="badge text-bg-${severityBadgeClass(item.severity)}">${severityLabel(item.severity)}</span>`;
          if (mode === 'dashboard') {
            return `<li class="list-group-item d-flex align-items-center gap-2 small">${badge}<span>${item.text}</span></li>`;
          }
          return `<li class="list-group-item" data-severity="${item.severity}">${badge} ${item.text}</li>`;
        })
        .join('');
    }
  };
})();
