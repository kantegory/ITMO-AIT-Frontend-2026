<script setup>
import { CircleCheckBig, ListChecks, Timer, TriangleAlert } from '@lucide/vue'

defineProps({ stats: { type: Object, required: true } })
</script>

<template>
  <section class="stats-grid" aria-label="Статистика задач">
    <article class="stat-card">
      <span class="stat-icon tone-yellow"><ListChecks /></span>
      <div><small>Мои задачи</small><strong>{{ stats.total }}</strong><span class="trend-up">↑ 3 за неделю</span></div>
    </article>
    <article class="stat-card">
      <span class="stat-icon tone-orange"><Timer /></span>
      <div><small>В работе</small><strong>{{ stats.active }}</strong><span>{{ Math.round((stats.active / Math.max(stats.total, 1)) * 100) }}% от всех задач</span></div>
    </article>
    <article class="stat-card">
      <span class="stat-icon tone-green"><CircleCheckBig /></span>
      <div><small>Завершено</small><strong>{{ stats.completed }}</strong><span class="trend-up">↑ 12% за месяц</span></div>
    </article>
    <article class="stat-card">
      <span class="stat-icon tone-red"><TriangleAlert /></span>
      <div><small>Просрочено</small><strong>{{ stats.overdue }}</strong><span class="trend-danger">Нужно внимание</span></div>
    </article>
  </section>
</template>
