<script setup>
import BaseLayout from "../layouts/BaseLayout.vue";
</script>

<template>
  <BaseLayout>
    <section class="container page-section text-center">
      <div class="about-card">
        <p class="display-1 mb-2">404</p>
        <h1>Страница не найдена</h1>
        <p>Такого адреса нет в приложении.</p>
        <RouterLink class="btn btn-primary" to="/">Вернуться на главную</RouterLink>
      </div>
    </section>
  </BaseLayout>
</template>
