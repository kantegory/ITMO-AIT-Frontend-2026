<template>
  <AppHeader />
  <main id="main-content">
    <RouterView />
  </main>
  <footer class="footer">
    <div class="container">
      <p>2026 Online Courses</p>
    </div>
  </footer>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue';
</script>
