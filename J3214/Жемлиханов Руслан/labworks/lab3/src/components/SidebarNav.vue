<template>
  <aside class="app-sidebar d-none d-lg-flex flex-column p-3 border-end bg-white" aria-label="Основная навигация">
    <RouterLink class="app-sidebar__brand d-flex align-items-center mb-4 text-decoration-none" to="/dashboard">
      <span class="brand-mark me-2" aria-hidden="true">FO</span>
      <span class="fw-bold text-dark">FlowOrchestrator</span>
    </RouterLink>

    <nav class="nav nav-pills flex-column gap-1" aria-label="Разделы приложения">
      <RouterLink class="nav-link" to="/dashboard">Dashboard</RouterLink>
      <RouterLink class="nav-link" to="/pipelines">Pipelines</RouterLink>
      <RouterLink class="nav-link" to="/monitoring">Monitoring</RouterLink>
      <a class="nav-link" href="#">Connections</a>
      <a class="nav-link" href="#">Variables</a>
      <a class="nav-link" href="#">Settings</a>
      <button class="nav-link text-danger text-start" type="button" @click="$emit('logout')">
        <IconSprite class="me-1" name="icon-logout" size="sm" />
        <span>Выйти</span>
      </button>
    </nav>
  </aside>
</template>

<script setup>
import IconSprite from './IconSprite.vue';

defineEmits(['logout']);
</script>
