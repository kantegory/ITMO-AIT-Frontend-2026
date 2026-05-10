<script setup>
import { useToast } from '../composables/useToast'

const { toasts, dismissToast } = useToast()
</script>

<template>
  <div
    class="toast-container position-fixed top-0 end-0 p-3"
    style="z-index: 2000"
  >
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="toast show align-items-center border-0 mb-2"
      :class="`text-bg-${toast.type}`"
      role="alert"
      aria-live="polite"
    >
      <div class="d-flex">
        <div class="toast-body">{{ toast.message }}</div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          aria-label="Закрыть"
          @click="dismissToast(toast.id)"
        ></button>
      </div>
    </div>
  </div>
</template>
