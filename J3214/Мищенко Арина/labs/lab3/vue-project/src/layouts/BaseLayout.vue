<template>
  <div class="bg-light min-vh-100">
    <the-navbar />
    <div class="container py-4">
      <slot />
    </div>
  </div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar.vue'
export default {
  name: 'BaseLayout',
  components: { TheNavbar }
}
</script>
