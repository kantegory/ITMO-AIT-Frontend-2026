<script setup>
defineProps({ items: { type: Array, default: () => [] } })
</script>

<template>
  <section class="stats-panel">
    <h2>Статистика</h2>
    <div class="stat-row">
      <span>↓ Загрузок</span>
      <strong>{{ items.reduce((sum, item) => sum + Number(item.downloads || 0), 0) }}</strong>
    </div>
    <div class="stat-row">
      <span>☆ Звёзд</span>
      <strong>{{ items.reduce((sum, item) => sum + Number(item.stars || 0), 0) }}</strong>
    </div>
    <div class="stat-row">
      <span>⌘ Форков</span>
      <strong>{{ items.reduce((sum, item) => sum + Number(item.forks || 0), 0) }}</strong>
    </div>
  </section>
</template>
