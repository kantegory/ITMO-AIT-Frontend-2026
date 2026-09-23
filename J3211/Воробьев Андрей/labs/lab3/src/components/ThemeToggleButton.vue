<script setup>
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const baseUrl = import.meta.env.BASE_URL
</script>

<template>
  <button
    type="button"
    class="btn btn-outline-secondary btn-sm fw-bold theme-toggle-btn"
    data-theme-toggle
    :aria-pressed="String(themeStore.isDark)"
    :aria-label="themeStore.isDark ? 'Включить светлую тему' : 'Включить тёмную тему'"
    @click="themeStore.toggleTheme"
  >
    <svg width="18" height="18" fill="currentColor" class="theme-icon theme-icon-moon" viewBox="0 0 16 16" aria-hidden="true">
      <use :href="`${baseUrl}img/sprite.svg#icon-moon`" />
    </svg>
    <svg width="18" height="18" fill="currentColor" class="theme-icon theme-icon-sun" viewBox="0 0 16 16" aria-hidden="true">
      <use :href="`${baseUrl}img/sprite.svg#icon-sun`" />
    </svg>
    <span class="visually-hidden">Переключить тему</span>
  </button>
</template>
