<template>
  <div>
    <app-navbar />
    <main class="main pt-5">
      <slot />
    </main>
    <app-footer />
  </div>
</template>

<script>
import AppNavbar from '@/components/AppNavbar.vue'
import AppFooter from '@/components/AppFooter.vue'

export default {
  name: 'BaseLayout',
  components: { AppNavbar, AppFooter }
}
</script>