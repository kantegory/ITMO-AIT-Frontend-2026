<template>
  <Navbar />
  <main class="container" role="main">
    <slot />
  </main>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
</script>