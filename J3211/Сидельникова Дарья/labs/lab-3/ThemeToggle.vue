<script setup>
import { useTheme } from '@/composables/useTheme'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <button
    id="theme-toggle"
    class="btn btn-outline-light btn-sm"
    type="button"
    @click="toggleTheme"
  >
    {{ theme === 'light' ? 'Dark theme' : 'Light theme' }}
  </button>
</template>