<script setup>
import TheNavbar from './components/Navbar.vue'
import TheFooter from './components/Footer.vue'
import { onMounted } from 'vue'

onMounted(() => {
  const currentTheme = localStorage.getItem('theme') || 'dark'
  document.documentElement.setAttribute('data-theme', currentTheme)
})
</script>

<template>
  <div class="app-wrapper">
    <TheNavbar />
    
    <main>
      <router-view />
    </main>

    <TheFooter />
  </div>
</template>