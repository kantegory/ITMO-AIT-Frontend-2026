<script setup>
import { ref, provide } from 'vue'
import AppHeader from './components/AppHeader.vue'
import CourseList from './components/CourseList.vue'
import StatsCard from './components/StatsCard.vue'

const theme = ref(localStorage.getItem('theme') || 'light')

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', theme.value)
}

provide('theme', theme)
provide('toggleTheme', toggleTheme)

const stats = [
  { label: 'Активных курсов', value: '4',   sub: '2 почти завершены' },
  { label: 'Часов обучения',  value: '47',  sub: '+3 ч на этой неделе' },
  { label: 'Сертификатов',    value: '2',   sub: 'Последний — 2 нед. назад' },
  { label: 'Средний балл',    value: '91%', sub: 'По всем заданиям' },
]
</script>

<template>
  <div class="app" :data-theme="theme">
    <AppHeader />

    <main class="main-content">
      <section class="stats-grid">
        <StatsCard
          v-for="stat in stats"
          :key="stat.label"
          :label="stat.label"
          :value="stat.value"
          :sub="stat.sub"
        />
      </section>

      <CourseList />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  transition: background 0.25s, color 0.25s;
}

.main-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2.5rem;
}
</style>
