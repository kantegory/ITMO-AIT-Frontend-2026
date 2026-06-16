<script setup>
import AppNavbar from './components/AppNavbar.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<template>
  <a class="skip-link" href="#mainContent">Перейти к содержимому</a>
  <AppNavbar />
  <RouterView />
  <AppFooter />
</template>
