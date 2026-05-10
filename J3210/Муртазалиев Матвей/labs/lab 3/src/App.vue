<template>
  <a class="skip-link" href="#main-content">Перейти к основному содержимому</a>
  <AppHeader />
  <RouterView />
  <AppFooter />
</template>

<script setup>
import { RouterView } from "vue-router";
import AppFooter from "@/components/layout/AppFooter.vue";
import AppHeader from "@/components/layout/AppHeader.vue";
import { useTheme } from "@/composables/useTheme";

useTheme().initTheme();
</script>
