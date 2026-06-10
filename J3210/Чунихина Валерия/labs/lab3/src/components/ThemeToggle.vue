<script setup>
import { computed } from 'vue'

import { useTheme } from '@/composables/useTheme'

const { theme, toggleTheme } = useTheme()

const buttonLabel = computed(() => (
  theme.value === 'dark' ? 'Светлая тема' : 'Тёмная тема'
))
</script>

<template>
  <button
    type="button"
    class="btn btn-outline-primary ms-lg-3 theme-toggle"
    @click="toggleTheme"
  >
    {{ buttonLabel }}
  </button>
</template>
