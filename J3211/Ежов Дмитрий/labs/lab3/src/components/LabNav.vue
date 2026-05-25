<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();

const items = [
  { to: '/', label: 'Вход', icon: '🔐' },
  { to: '/register', label: 'Регистрация', icon: '📝' },
  { to: '/dashboard', label: 'Кабинет', icon: '🏠' },
  { to: '/search', label: 'Поиск задач', icon: '🔍' },
  { to: '/tasks/1', label: 'Задача', icon: '✅' },
];

function isCurrent(to: string): boolean {
  if (to === '/tasks/1') return route.path.startsWith('/tasks/');
  return route.path === to;
}
</script>

<template>
  <nav class="lab-nav" aria-label="Страницы проекта">
    <p class="lab-nav-title" id="labNavTitle">Страницы проекта</p>
    <div class="lab-nav-grid" role="list" aria-labelledby="labNavTitle">
      <RouterLink
        v-for="it in items"
        :key="it.to"
        :to="it.to"
        class="lab-nav-item"
        :class="{ current: isCurrent(it.to) }"
        :aria-current="isCurrent(it.to) ? 'page' : undefined"
        role="listitem"
      >
        <span aria-hidden="true">{{ it.icon }}</span> {{ it.label }}
      </RouterLink>
    </div>
  </nav>
</template>
