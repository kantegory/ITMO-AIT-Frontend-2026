<script setup>
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <button class="btn btn-outline-secondary mt-3" type="button" aria-label="Переключить тему" @click="toggleTheme">
    <svg class="bi" width="17" height="17"><use :href="isDark ? '#sun' : '#moon'" /></svg>
    <span class="ms-2">{{ isDark ? 'Светлая тема' : 'Тёмная тема' }}</span>
  </button>
</template>
