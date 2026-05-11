<script setup>
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <div class="app-shell">
    <a class="skip-link" href="#main-content">Перейти к основному содержимому</a>
    <AppHeader />
    <main id="main-content" class="app-main">
      <RouterView />
    </main>
    <footer class="site-footer">
      <div class="container d-flex flex-column flex-md-row justify-content-between gap-2">
        <p class="mb-0">Vue SPA для курса по фронтенду.</p>
        <p class="mb-0">Компоненты, роутер, composable и axios.</p>
      </div>
    </footer>
  </div>
</template>
