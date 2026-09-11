<template>
  <div class="landing-page">
    <header class="landing-header">
      <ThemeToggle />
    </header>

    <main class="landing-wrapper">
      <section class="card landing-card" aria-labelledby="landingTitle">
        <div class="card-body text-center p-4">
          <h1 id="landingTitle" class="landing-title">Project Manager</h1>
          <p class="landing-subtitle">Управление проектами и командной работой</p>
          <div class="d-grid gap-2">
            <RouterLink class="btn btn-outline-black" to="/login">Вход</RouterLink>
            <RouterLink class="btn btn-outline-black" to="/register">Регистрация</RouterLink>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import ThemeToggle from '@/components/ThemeToggle.vue'
</script>
