import { onMounted, onUnmounted } from 'vue'

const useEventListener = (target, event, handler) => {
  onMounted(() => target.addEventListener(event, handler))
  onUnmounted(() => target.removeEventListener(event, handler))
}

export default useEventListener
