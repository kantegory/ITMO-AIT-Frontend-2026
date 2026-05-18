<script setup>
import Navbar from '@/components/Navbar.vue'
</script>

<template>
  <div class="layout-wrapper">
    <Navbar />
    <main class="container mt-5 pt-3 mb-5">
      <slot />
    </main>
  </div>
</template>