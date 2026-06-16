<script setup>
import TheHero from '../components/Hero.vue'
</script>

<template>
  <div class="home-page">
    <TheHero />
    <section class="container my-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="h3 fw-bold" :class="textClass">Trending Models</h2>
        <router-link to="/explore" class="text-info text-decoration-none small fw-600">
          Explore all
        </router-link>
      </div>
      <div class="row g-4">
        <div class="col-12 text-center py-5">
          <p class="text-white-50">Explore our collection of AI models. Click "Explore all" to browse more.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  setup() {
    const textClass = computed(() => {
      return document.documentElement.getAttribute('data-theme') === 'light' ? 'text-dark' : 'text-white'
    })

    return { textClass }
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}
</style>
