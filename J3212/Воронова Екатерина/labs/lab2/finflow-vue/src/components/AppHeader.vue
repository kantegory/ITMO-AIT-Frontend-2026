<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue'

defineProps<{
  theme: 'light' | 'dark'
}>()

defineEmits<{
  (e: 'toggle-theme'): void
}>()
</script>

<template>
  <header class="site-header">
    <div class="container header-row">
      <div class="brand">FinFlow</div>

      <nav class="main-nav">
        <a href="#features">Возможности</a>
        <a href="#how">Как это работает</a>
        <a href="#reports">Отчёты</a>
        <a href="#integrations">Интеграции</a>
      </nav>

      <div class="header-actions">
        <ThemeToggle :theme="theme" @toggle-theme="$emit('toggle-theme')" />
        <button class="btn btn-outline">Вход</button>
        <button class="btn btn-main">Регистрация</button>
      </div>
    </div>
  </header>
</template>