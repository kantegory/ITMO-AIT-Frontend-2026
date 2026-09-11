<template>
  <button class="theme-toggle" type="button" aria-label="Переключить тему" @click="toggleTheme">
    <AppIcon :name="isDark ? 'moon' : 'sun'" :size="20" />
  </button>
</template>

<script setup>
import AppIcon from '@/components/AppIcon.vue'
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>
