<template>
  <footer class="site-footer">
    <div class="container d-flex flex-column flex-md-row justify-content-between gap-3">
      <p class="mb-0">FinFlow</p>
      <nav v-if="isAuthenticated" class="d-flex gap-3" aria-label="Навигация в подвале">
        <RouterLink to="/dashboard">Кабинет</RouterLink>
        <RouterLink to="/reports">Отчёты</RouterLink>
        <RouterLink to="/integrations">Интеграции</RouterLink>
      </nav>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const { isAuthenticated } = useAuth();
</script>

