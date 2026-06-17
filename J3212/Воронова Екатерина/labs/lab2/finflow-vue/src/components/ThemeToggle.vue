<script setup lang="ts">
defineProps<{
  theme: 'light' | 'dark'
}>()

defineEmits<{
  (e: 'toggle-theme'): void
}>()
</script>

<template>
  <button class="theme-toggle" @click="$emit('toggle-theme')">
    <span v-if="theme === 'dark'">☀ Светлая тема</span>
    <span v-else>🌙 Тёмная тема</span>
  </button>
</template>