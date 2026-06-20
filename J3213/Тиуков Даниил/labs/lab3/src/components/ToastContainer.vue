<script setup>
import { useToast } from '@/composables/useToast.js'

const { toasts, removeToast } = useToast()

const toneClass = {
  success: 'text-bg-success',
  error: 'text-bg-danger',
  info: 'text-bg-primary'
}
</script>

<template>
  <div class="toast-container position-fixed top-0 end-0 p-3">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast show align-items-center border-0"
        :class="toneClass[toast.type] || 'text-bg-primary'"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="d-flex">
          <div class="toast-body">{{ toast.message }}</div>
          <button
            type="button"
            class="btn-close btn-close-white me-2 m-auto"
            aria-label="Закрыть"
            @click="removeToast(toast.id)"
          />
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
