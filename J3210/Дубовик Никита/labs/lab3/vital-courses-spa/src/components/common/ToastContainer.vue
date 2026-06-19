<template>
  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="['toast align-items-center border-0', toast.bgClass]"
      role="alert"
      ref="toastElements"
    >
      <div class="d-flex">
        <div class="toast-body">{{ toast.message }}</div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          @click="removeToast(toast.id)"
          aria-label="Close"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useToast } from '@/composables/useToast'
import { Toast } from 'bootstrap'
import { watch, ref, nextTick } from 'vue'

const { toasts, removeToast } = useToast()
const toastElements = ref([])

watch(toasts, async () => {
  await nextTick()
  toastElements.value.forEach(el => {
    const toastInstance = new Toast(el, { delay: 4000 })
    toastInstance.show()
  })
}, { deep: true })
</script>
