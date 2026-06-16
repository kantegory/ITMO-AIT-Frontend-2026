<script setup>
import ThemeToggle from './ThemeToggle.vue';
import SkipLink from './SkipLink.vue';

defineProps({
  title: {
    type: String,
    required: true
  },
  width: {
    type: String,
    default: '30rem'
  }
});
</script>

<template>
  <div class="auth-page">
    <SkipLink />
    <ThemeToggle floating />

    <main id="main-content" class="container min-vh-100 d-flex justify-content-center align-items-center text-center">
      <section class="card auth-card" :style="{ width }">
        <div class="card-body d-flex flex-column justify-content-center">
          <h1 class="h4 mb-4">{{ title }}</h1>
          <slot />
        </div>
      </section>
    </main>
  </div>
</template>
