<template>
  <a
    class="visually-hidden-focusable position-absolute top-0 start-0 p-2 m-2 z-3 rounded skip-link-theme"
    href="#main-content"
  >
    К основному содержимому
  </a>
  <div class="app-layout d-flex flex-column min-vh-100">
    <AppNavbar />
    <main id="main-content" class="flex-grow-1" tabindex="-1">
      <router-view />
    </main>
    <footer class="border-top theme-footer mt-4">
      <div class="container py-3">
        <p class="mb-0 small text-secondary">2026 TicketHub</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import AppNavbar from '@/components/AppNavbar.vue'
</script>
