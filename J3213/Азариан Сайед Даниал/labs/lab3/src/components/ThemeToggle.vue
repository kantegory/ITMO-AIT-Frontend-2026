<script setup>
import { computed } from 'vue'
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()

const iconId = computed(() => (theme.value === 'dark' ? 'icon-sun' : 'icon-moon'))
const label = computed(() => (theme.value === 'dark' ? 'Переключить на светлую тему' : 'Переключить на темную тему'))
</script>

<template>
  <button class="btn btn-sm btn-outline-secondary theme-toggle-btn" type="button" :aria-label="label" @click="toggleTheme">
    <svg class="theme-toggle-icon" aria-hidden="true">
      <use :href="`/assets/icons-sprite.svg#${iconId}`"></use>
    </svg>
  </button>
</template>
