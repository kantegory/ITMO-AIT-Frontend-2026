<script setup>
import { useToast } from '../composables/useToast.js'
const { message, visible } = useToast()
</script>

<template>
  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <Transition name="toast">
      <div v-if="visible" class="toast app-toast border-0 show" role="status" aria-live="polite">
        <div class="toast-body">{{ message }}</div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: opacity 0.25s, transform 0.25s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(0.5rem); }
</style>
