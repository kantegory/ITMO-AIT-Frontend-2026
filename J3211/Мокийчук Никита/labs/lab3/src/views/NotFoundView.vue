<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="container py-5 text-center mt-navbar-lg">
    <h1 class="display-1 fw-bold text-primary">404</h1>
    <h2 class="h3 mb-3">Страница не найдена</h2>
    <p class="text-muted mb-4">Возможно, вы перешли по неверной ссылке или страница была удалена.</p>
    <button class="btn btn-primary" @click="router.push({ name: 'home' })">
      <i class="bi bi-house me-2"></i>На главную
    </button>
  </div>
</template>
