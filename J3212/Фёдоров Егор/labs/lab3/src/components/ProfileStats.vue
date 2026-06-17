<script setup>
defineProps({
  stats: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="row g-3 text-center">
    <div class="col-6">
      <div class="inner-box">
        <div class="mini-stat-value">{{ stats.favorites }}</div>
        <div class="muted small">избранное</div>
      </div>
    </div>
    <div class="col-6">
      <div class="inner-box">
        <div class="mini-stat-value">{{ stats.comments }}</div>
        <div class="muted small">комментарии</div>
      </div>
    </div>
    <div class="col-6">
      <div class="inner-box">
        <div class="mini-stat-value">{{ stats.publications }}</div>
        <div class="muted small">публикации</div>
      </div>
    </div>
    <div class="col-6">
      <div class="inner-box">
        <div class="mini-stat-value">{{ stats.subscriptions }}</div>
        <div class="muted small">подписки</div>
      </div>
    </div>
  </div>
</template>
