<script setup>
import ThemeToggle from './ThemeToggle.vue'

defineProps(['theme', 'userName'])
defineEmits(['toggle-theme'])
</script>

<template>
  <div class="topbar">
    <div class="topbar-search">
      <input type="text" placeholder="Поиск..." />
    </div>

    <div class="topbar-user">
      <ThemeToggle :theme="theme" @toggle-theme="$emit('toggle-theme')" />
      <div class="user-chip">{{ userName || 'Пользователь' }}</div>
    </div>
  </div>
</template>