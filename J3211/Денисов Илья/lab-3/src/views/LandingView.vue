<script setup>
import { RouterLink } from 'vue-router';
import ThemeToggle from '../components/ThemeToggle.vue';
import SkipLink from '../components/SkipLink.vue';
</script>

<template>
  <div class="landing-page">
    <SkipLink />
    <ThemeToggle floating />

    <main
      id="main-content"
      class="container min-vh-100 d-flex justify-content-center align-items-center text-center"
      aria-labelledby="landing-title"
    >
      <section class="card landing-card" style="width: 20rem; min-height: 18rem;" aria-describedby="landing-description">
        <div class="card-body d-flex flex-column justify-content-center gap-3">
          <h1 class="h4 card-title mb-0" id="landing-title">Добро пожаловать на сайт</h1>
          <p class="text-muted mb-0" id="landing-description">Выберите нужное действие для продолжения работы.</p>
          <nav class="d-flex flex-column gap-2" aria-label="Основные действия на стартовой странице">
            <RouterLink :to="{ name: 'login' }" class="btn btn-primary">Вход</RouterLink>
            <RouterLink :to="{ name: 'register' }" class="btn btn-outline-primary">Регистрация</RouterLink>
          </nav>
        </div>
      </section>
    </main>
  </div>
</template>
