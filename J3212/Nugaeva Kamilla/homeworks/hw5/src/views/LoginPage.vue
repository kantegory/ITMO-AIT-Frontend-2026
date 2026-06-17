<template>
  <BaseLayout>
    <AppNavbar />
    <h1 class="fw-bold mb-3">Вход</h1>
    <p class="text-muted">Здесь будет форма входа.</p>
  </BaseLayout>
</template>

<script>
import BaseLayout from '../layouts/BaseLayout.vue'
import AppNavbar from '../components/AppNavbar.vue'

export default {
  name: 'LoginPage',
  components: { BaseLayout, AppNavbar },
}
</script>
