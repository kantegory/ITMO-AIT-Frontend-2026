<template>
  <div class="toast-container position-fixed top-0 end-0 p-3" role="region" aria-live="polite" aria-label="Уведомления">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="toast show align-items-center border-0 mb-2"
      :class="`text-bg-${toast.variant}`"
      role="status"
    >
      <div class="d-flex">
        <div class="toast-body">{{ toast.message }}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" aria-label="Закрыть" @click="removeToast(toast.id)"></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useToast } from '../composables/useToast';

const { toasts, removeToast } = useToast();
</script>
