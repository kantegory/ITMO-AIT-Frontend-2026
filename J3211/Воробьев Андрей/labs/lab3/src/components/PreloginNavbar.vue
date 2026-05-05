<script setup>
import { RouterLink } from 'vue-router'
import ThemeToggleButton from '@/components/ThemeToggleButton.vue'

const baseUrl = import.meta.env.BASE_URL
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-custom mb-4 shadow-sm" aria-label="Основная навигация">
    <div class="container d-flex justify-content-between align-items-center">
      <RouterLink class="navbar-brand navbar-brand-custom" :to="{ name: 'login' }">
        <span class="brand-logo-wrap" aria-hidden="true">
          <svg class="brand-logo" viewBox="0 0 24 24" aria-hidden="true">
            <use :href="`${baseUrl}img/sprite.svg#icon-money`" />
          </svg>
        </span>
        <span class="brand-title">Мои прекрасные расходы</span>
      </RouterLink>
      <ThemeToggleButton />
    </div>
  </nav>
</template>
