<script setup>
defineProps({
  stats: { type: Object, required: true },
})
</script>

<template>
  <section class="stats-grid" aria-label="Статистика заметок">
    <article class="stat-card stat-total">
      <span class="stat-icon" aria-hidden="true">≡</span>
      <div><small>Всего заметок</small><strong>{{ stats.total }}</strong></div>
      <span class="stat-caption">В коллекции</span>
    </article>
    <article class="stat-card stat-active">
      <span class="stat-icon" aria-hidden="true">↗</span>
      <div><small>В работе</small><strong>{{ stats.active }}</strong></div>
      <span class="stat-caption">Требуют внимания</span>
    </article>
    <article class="stat-card stat-done">
      <span class="stat-icon" aria-hidden="true">✓</span>
      <div><small>Завершено</small><strong>{{ stats.completed }}</strong></div>
      <span class="stat-caption">{{ stats.progress }}% от общего числа</span>
    </article>
    <article class="stat-card stat-pinned">
      <span class="stat-icon" aria-hidden="true">◆</span>
      <div><small>Закреплено</small><strong>{{ stats.pinned }}</strong></div>
      <span class="stat-caption">Всегда наверху</span>
    </article>
  </section>
</template>
