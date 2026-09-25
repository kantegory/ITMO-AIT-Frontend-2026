<script setup>
import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <div>
    <nav-bar />
    <div class="container mt-4 mb-5">
      <slot />
    </div>
  </div>
</template>
