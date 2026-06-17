import { ref } from 'vue';

export function useNotifications() {
  const notification = ref(null);

  function showNotification(message, type = 'info') {
    notification.value = { message, type };

    if (type === 'success') {
      window.setTimeout(() => {
        notification.value = null;
      }, 4000);
    }
  }

  function clearNotification() {
    notification.value = null;
  }

  return {
    notification,
    showNotification,
    clearNotification,
  };
}
