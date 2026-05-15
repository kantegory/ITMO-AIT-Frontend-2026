<template>
  <div class="page-wrapper">
    
    <a class="skip-link" href="#main-content">Перейти к основному содержимому</a>

    <app-navbar />

    
    <main id="main-content" class="container my-4" tabindex="-1">
      <slot />
    </main>
  </div>
</template>

<script>

import AppNavbar from '@/components/AppNavbar.vue'

export default {
  name: 'BaseLayout',
  components: { AppNavbar }
}

</script>
