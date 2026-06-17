<script setup>
import AppHeader from './components/AppHeader.vue'
import ThemeSwitcher from './components/ThemeSwitcher.vue'
import { useTheme } from './composables/useTheme'

const { theme } = useTheme()
</script>

<template>
  <div :data-theme="theme" class="app-shell">
    <AppHeader />
    <RouterView />
    <ThemeSwitcher />
  </div>
</template>
