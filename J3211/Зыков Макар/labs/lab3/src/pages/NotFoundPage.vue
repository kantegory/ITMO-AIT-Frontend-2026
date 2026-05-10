<template>
  <div class="container">
    <div class="card">
      <div class="card-body p-4 p-lg-5">
        <h1 class="h3 fw-bold mb-3">Страница не найдена</h1>
        <p class="text-secondary mb-4">
          Такой страницы в SPA нет. Вернитесь на главную и продолжите работу с приложением.
        </p>
        <RouterLink class="btn btn-primary" to="/">На главную</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>
