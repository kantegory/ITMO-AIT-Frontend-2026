<template>
  <aside class="sidebar">
    <div class="sidebar-brand">FinFlow</div>

    <nav class="sidebar-nav">
      <RouterLink to="/dashboard" class="sidebar-link">Кабинет</RouterLink>
      <RouterLink to="/transactions" class="sidebar-link">Транзакции</RouterLink>
      <RouterLink to="/reports" class="sidebar-link">Отчёты</RouterLink>
      <RouterLink to="/integrations" class="sidebar-link">Интеграции</RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>