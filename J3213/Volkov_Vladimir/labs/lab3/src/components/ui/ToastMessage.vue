<template>
  <div v-if="uiStore.toast.visible" class="moneyflow-toast">
    <div class="toast show align-items-center border-0 text-bg-dark">
      <div class="d-flex">
        <div class="toast-body">{{ uiStore.toast.message }}</div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          aria-label="Закрыть уведомление"
          @click="uiStore.hideToast()"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()
</script>
