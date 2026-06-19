<template>
  <section class="view-section view-section--narrow">
    <p class="eyebrow">404</p>
    <h1>Страница не найдена</h1>
    <p class="view-description">
      Проверьте адрес или вернитесь в каталог мероприятий.
    </p>
    <div class="not-found-actions">
      <RouterLink class="button-link" to="/">На главную</RouterLink>
      <RouterLink class="button-link button-link--ghost" to="/orders">Мои билеты</RouterLink>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>
