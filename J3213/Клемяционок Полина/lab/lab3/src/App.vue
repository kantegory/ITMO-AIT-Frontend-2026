<template>
  <div class="d-flex flex-column min-vh-100">
    <AppHeader />
    <main class="flex-grow-1 container py-4">
      <router-view />
    </main>
    <footer class="text-center py-3 text-muted bg-light mt-auto">
    </footer>
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
</script>