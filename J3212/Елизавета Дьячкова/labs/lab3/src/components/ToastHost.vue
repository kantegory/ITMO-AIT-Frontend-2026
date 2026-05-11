<template>
  <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1080">
    <div
      id="tickethub-toast"
      class="toast align-items-center text-bg-primary border-0"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div class="d-flex">
        <div class="toast-body">{{ toastMessage }}</div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Закрыть"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useToast } from '@/composables/useToast'

const { toastMessage } = useToast()
</script>
