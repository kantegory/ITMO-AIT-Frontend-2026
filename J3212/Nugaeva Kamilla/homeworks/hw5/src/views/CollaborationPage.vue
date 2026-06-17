<template>
  <BaseLayout>
    <AppNavbar />
    <h1 class="fw-bold mb-3">Совместное планирование</h1>
    <p class="text-muted">Здесь будет обмен маршрутами и заметками.</p>
  </BaseLayout>
</template>

<script>
import BaseLayout from '../layouts/BaseLayout.vue'
import AppNavbar from '../components/AppNavbar.vue'

export default {
  name: 'CollaborationPage',
  components: { BaseLayout, AppNavbar },
}
</script>
