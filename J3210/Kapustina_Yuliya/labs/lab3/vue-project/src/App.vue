<template>
  <div id="app">
    <NavBar />
    <router-view />
    <footer class="footer text-center">
      <p>© 2026 FanFicLib</p>
      <p>Платформа для фанфиков</p>
    </footer>
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
</script>