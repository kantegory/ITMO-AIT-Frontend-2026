<template>
  <footer class="bg-light text-dark py-4 mt-auto border-top" role="contentinfo">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-6 text-center text-md-start mb-3 mb-md-0">
          <p class="mb-0 text-muted">
            &copy; 2026 OnlineLearning. Все права защищены.
          </p>
        </div>
        
        <div class="col-md-6 text-center text-md-end">
          <ThemeToggle />
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import ThemeToggle from './ThemeToggle.vue';
</script>

<style scoped>
</style>