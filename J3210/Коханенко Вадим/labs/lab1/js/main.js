// Уведы
let notificationTimeout = null;

function showNotification(message, isError = false) {
    // Предыдущее уведомление
    const existingNotification = document.querySelector('.notification-toast');
    if (existingNotification) {
        existingNotification.remove();
        if (notificationTimeout) clearTimeout(notificationTimeout);
    }
    
    // Новое уведомление
    const notification = document.createElement('div');
    notification.className = `notification-toast ${isError ? 'error' : 'success'}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    const icon = isError ? 'bi-exclamation-circle' : 'bi-check-circle';
    const iconColor = isError ? 'text-danger' : 'text-success';
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="bi ${icon} ${iconColor} notification-icon" aria-hidden="true"></i>
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Закрыть уведомление">
                <i class="bi bi-x" aria-hidden="true"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    notificationTimeout = setTimeout(() => {
        closeNotification(notification);
    }, 4000);
}

function closeNotification(notification) {
    if (notificationTimeout) clearTimeout(notificationTimeout);
    
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
        if (notification.parentNode) notification.remove();
    }, 300);
}