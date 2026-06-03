import { ref } from 'vue';

export function useAlert() {
  const alert = ref({ type: '', text: '' });

  function showAlert(type, text) {
    alert.value = { type, text };
  }

  function clearAlert() {
    alert.value = { type: '', text: '' };
  }

  return { alert, showAlert, clearAlert };
}
