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
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Закрыть уведомление">
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