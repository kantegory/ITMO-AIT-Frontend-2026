import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', () => {
  const visible = ref(false)
  const kind = ref('info')
  const payload = ref({})

  function openInfo(title, message) {
    kind.value = 'info'
    payload.value = { title, message }
    visible.value = true
  }

  function openTransaction(accounts, categories, onSubmit) {
    kind.value = 'transaction'
    payload.value = { accounts, categories, onSubmit }
    visible.value = true
  }

  function openRule(settings, onSubmit) {
    kind.value = 'rule'
    payload.value = { settings, onSubmit }
    visible.value = true
  }

  function close() {
    visible.value = false
  }

  return {
    visible,
    kind,
    payload,
    openInfo,
    openTransaction,
    openRule,
    close
  }
})
