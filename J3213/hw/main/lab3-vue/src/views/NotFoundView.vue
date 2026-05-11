<template>
  <section class="container">
    <div class="auth-card text-center">
      <div class="badge-soft mb-3">
        <svg class="icon-inline" aria-hidden="true"><use href="/icons/sprite.svg#icon-filter"></use></svg>
        404
      </div>
      <h1 class="section-title mb-3">Страница не найдена</h1>
      <p class="muted mb-4">Похоже, адрес был введён неверно или страница была перемещена.</p>
      <RouterLink class="btn btn-primary" to="/">Вернуться на главную</RouterLink>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
