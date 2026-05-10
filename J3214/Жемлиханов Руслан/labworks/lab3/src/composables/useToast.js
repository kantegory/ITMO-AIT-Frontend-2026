import { ref } from 'vue';

const message = ref('');
const visible = ref(false);
let timerId = null;

export function useToast() {
  const showToast = (text) => {
    message.value = text;
    visible.value = true;
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      visible.value = false;
    }, 2600);
  };

  return {
    message,
    visible,
    showToast
  };
}
