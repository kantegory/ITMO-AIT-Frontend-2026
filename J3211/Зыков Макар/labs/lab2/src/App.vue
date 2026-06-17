<script setup>
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import AppFooter from "./components/layout/AppFooter.vue";
import AppHeader from "./components/layout/AppHeader.vue";
import { useTheme } from "./composables/useTheme";

const { initTheme } = useTheme();

onMounted(() => {
  initTheme();
});
</script>

<template>
  <a class="skip-link" href="#main-content">Перейти к основному содержимому</a>
  <AppHeader />

  <main id="main-content" class="main-content py-4 py-lg-5" tabindex="-1">
    <RouterView />
  </main>

  <AppFooter />
</template>
