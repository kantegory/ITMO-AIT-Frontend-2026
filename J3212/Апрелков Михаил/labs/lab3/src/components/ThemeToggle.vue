<template>
  <button
    type="button"
    class="btn btn-outline-secondary btn-sm theme-toggle"
    aria-label="Переключить на тёмную или светлую тему"
    title="Тема оформления"
    @click="toggle"
  >
    <i class="bi bi-moon-stars-fill theme-icon-when-light"></i>
    <i class="bi bi-brightness-high-fill theme-icon-when-dark"></i>
  </button>
</template>

<script setup>
import { useTheme } from "../composables/useTheme.js";
const { toggle } = useTheme();
</script>
