<script setup>
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <div class="app-root">
    <AppHeader />
    <main class="page-shell">
      <div class="container py-4 py-md-5">
        <RouterView />
      </div>
    </main>
  </div>
</template>
