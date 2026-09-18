<template>
  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div class="toast show" role="status" aria-live="polite" aria-atomic="true" v-if="visible">
      <div class="toast-header">
        <strong class="me-auto">FlowOrchestrator</strong>
        <button class="btn-close" type="button" aria-label="Закрыть" @click="visible = false"></button>
      </div>
      <div class="toast-body">{{ message }}</div>
    </div>
  </div>
</template>

<script setup>
import { useToast } from '../composables/useToast';

const { message, visible } = useToast();
</script>
