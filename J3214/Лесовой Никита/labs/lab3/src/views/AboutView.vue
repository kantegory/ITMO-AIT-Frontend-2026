<script setup>
import BaseLayout from "../layouts/BaseLayout.vue";
</script>

<template>
  <BaseLayout>
    <section class="container page-section">
      <div class="about-card">
        <p class="eyebrow text-primary">Лабораторная работа №3</p>
        <h1>О проекте</h1>
        <p>
          «Маршрут» — одностраничное приложение для выбора направления и совместного планирования поездки.
        </p>
        <p class="mb-0">
          Проект создан на Vue 3. Для навигации используется Vue Router, для общего состояния — Pinia,
          а запросы к локальному и внешнему API выполняются через Axios.
        </p>
      </div>
    </section>
  </BaseLayout>
</template>
