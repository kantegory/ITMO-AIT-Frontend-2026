import { nextTick, ref } from 'vue'
import { Toast } from 'bootstrap'

const toastMessage = ref('Готово')

export function useToast() {
  async function show(text) {
    toastMessage.value = text
    await nextTick()
    const el = document.getElementById('tickethub-toast')
    if (el) Toast.getOrCreateInstance(el).show()
  }

  return { toastMessage, show }
}
