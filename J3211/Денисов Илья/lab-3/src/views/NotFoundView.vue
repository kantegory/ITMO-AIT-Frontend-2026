<script setup>
import { RouterLink } from 'vue-router';
import ThemeToggle from '../components/ThemeToggle.vue';
import SkipLink from '../components/SkipLink.vue';
</script>

<template>
  <div class="landing-page">
    <SkipLink />
    <ThemeToggle floating />

    <main id="main-content" class="container min-vh-100 d-flex justify-content-center align-items-center text-center">
      <section class="card landing-card" style="width: 24rem;">
        <div class="card-body d-flex flex-column gap-3">
          <h1 class="h4 mb-0">Страница не найдена</h1>
          <p class="text-muted mb-0">Такого маршрута нет в приложении.</p>
          <RouterLink :to="{ name: 'home' }" class="btn btn-primary">На главную</RouterLink>
        </div>
      </section>
    </main>
  </div>
</template>
