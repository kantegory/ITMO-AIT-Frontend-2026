<template>
  <BaseLayout>
    <AppNavbar />
    <h1 class="fw-bold mb-3">Личный кабинет</h1>
    <p class="text-muted">Здесь будут сохранённые маршруты и заметки пользователя.</p>
  </BaseLayout>
</template>

<script>
import BaseLayout from '../layouts/BaseLayout.vue'
import AppNavbar from '../components/AppNavbar.vue'

export default {
  name: 'ProfilePage',
  components: { BaseLayout, AppNavbar },
}
</script>
