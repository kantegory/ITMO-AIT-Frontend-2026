<template>
  <TheNavbar />
  
  <router-view />
  
  <TheFooter />
</template>

<script setup>
import { onMounted } from 'vue'
import TheNavbar from './components/TheNavbar.vue'
import TheFooter from './components/TheFooter.vue'

onMounted(() => {
  const currentTheme = localStorage.getItem('theme') || 'light'
  document.documentElement.setAttribute('data-theme', currentTheme)
})
</script>