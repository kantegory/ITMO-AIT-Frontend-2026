<template>
  <a class="skip-link" href="#main-content">Перейти к основному содержимому</a>
  <AppNavbar />
  <RouterView />
</template>

<script setup>
import AppNavbar from './components/AppNavbar.vue'
import { useTheme } from './composables/useTheme'

const { initTheme } = useTheme()
initTheme()
</script>
