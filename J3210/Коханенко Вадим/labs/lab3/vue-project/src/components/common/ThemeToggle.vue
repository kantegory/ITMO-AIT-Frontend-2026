<template>
  <button class="theme-toggle-btn" @click="toggleTheme">
    <svg class="icon"><use xlink:href="/sprite.svg#icon-arrow-repeat"></use></svg>
    {{ theme === 'light' ? 'Тёмная' : 'Светлая' }}
  </button>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme'

const { theme, toggleTheme } = useTheme()
</script>