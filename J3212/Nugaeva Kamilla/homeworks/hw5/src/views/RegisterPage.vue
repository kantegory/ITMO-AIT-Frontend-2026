<template>
  <BaseLayout>
    <AppNavbar />
    <h1 class="fw-bold mb-3">Регистрация</h1>
    <p class="text-muted">Здесь будет форма регистрации.</p>
  </BaseLayout>
</template>

<script>
import BaseLayout from '../layouts/BaseLayout.vue'
import AppNavbar from '../components/AppNavbar.vue'

export default {
  name: 'RegisterPage',
  components: { BaseLayout, AppNavbar },
}
</script>
