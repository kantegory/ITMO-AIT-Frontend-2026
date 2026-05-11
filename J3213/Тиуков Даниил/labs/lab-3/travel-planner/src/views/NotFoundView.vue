<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="section-space">
    <div class="container text-center">
      <span class="section-badge">404</span>
      <h1 class="section-title">Страница не найдена</h1>
      <p class="section-text mx-auto" style="max-width: 540px;">
        Возможно, ссылка устарела или адрес введён с ошибкой. Вернитесь на главную или откройте каталог направлений.
      </p>
      <div class="d-flex justify-content-center gap-2">
        <RouterLink class="btn btn-primary" to="/">На главную</RouterLink>
        <RouterLink class="btn btn-outline-primary" to="/destinations">К каталогу</RouterLink>
      </div>
    </div>
  </section>
</template>
