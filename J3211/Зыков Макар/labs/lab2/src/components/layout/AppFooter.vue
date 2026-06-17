<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { useSession } from "../../composables/useSession";

const { isAuthenticated, cabinetRouteName } = useSession();
const currentYear = computed(() => new Date().getFullYear());
const cabinetLinkName = computed(() => isAuthenticated.value ? cabinetRouteName.value : "login");
</script>

<template>
  <footer class="py-4 mt-5">
    <div class="container d-flex flex-column flex-lg-row gap-3 justify-content-between align-items-lg-center">
      <nav class="footer-links" aria-label="Быстрые ссылки в подвале">
        <RouterLink class="footer-link" to="/">Главная</RouterLink>
        <RouterLink class="footer-link" to="/events">Афиша</RouterLink>
        <RouterLink class="footer-link" :to="{ name: cabinetLinkName }">Кабинет</RouterLink>
      </nav>

      <div class="footer-meta text-lg-end">
        <p class="mb-0">Makar`s Event, Vue SPA, {{ currentYear }}</p>
        <p class="mb-0">Выполнил: Зыков Макар, J3211</p>
      </div>
    </div>
  </footer>
</template>
