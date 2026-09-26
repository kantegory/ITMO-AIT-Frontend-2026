<template>
  <div v-if="message" class="app-alert" :class="`app-alert--${type}`" role="alert">
    <span>{{ message }}</span>
    <button type="button" aria-label="Закрыть сообщение" @click="$emit('close')">×</button>
  </div>
</template>

<script setup>
defineProps({
  message: { type: String, default: '' },
  type: { type: String, default: 'error' },
})

defineEmits(['close'])
</script>
