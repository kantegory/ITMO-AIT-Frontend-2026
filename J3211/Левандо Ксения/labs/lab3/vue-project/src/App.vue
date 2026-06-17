<script setup>
import Navbar from "@/components/Navbar.vue"
import Footer from "@/components/Footer.vue"
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    
    <Navbar />

    <main class="flex-grow-1">
      <router-view />
    </main>

    <Footer />

  </div>
</template>