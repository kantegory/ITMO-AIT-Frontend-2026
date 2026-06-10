<template>
  <a class="skip-link" href="#main-content">Перейти к основному содержимому</a>
  <div id="appStatus" class="visually-hidden" role="status" aria-live="polite" aria-atomic="true"></div>

  <AppHeader />
  <router-view />
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
</script>


<style scoped></style>
