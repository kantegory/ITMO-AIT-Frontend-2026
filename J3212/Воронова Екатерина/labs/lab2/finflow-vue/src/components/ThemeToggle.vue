<script setup>
defineProps(['theme'])
defineEmits(['toggle-theme'])
</script>

<template>
  <button class="theme-toggle" @click="$emit('toggle-theme')">
    <span v-if="theme === 'dark'">☀ Светлая тема</span>
    <span v-else>🌙 Тёмная тема</span>
  </button>
</template>