<template>
  <header class="app-topbar navbar navbar-expand-lg bg-white border-bottom px-3">
    <button class="btn btn-outline-secondary d-lg-none me-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileMenu" aria-label="Открыть меню">
      <IconSprite name="icon-menu" size="lg" />
    </button>
    <h1 class="navbar-brand fw-semibold mb-0">{{ title }}</h1>
    <slot />
  </header>
</template>

<script setup>
import IconSprite from './IconSprite.vue';

defineProps({
  title: {
    type: String,
    required: true
  }
});
</script>
