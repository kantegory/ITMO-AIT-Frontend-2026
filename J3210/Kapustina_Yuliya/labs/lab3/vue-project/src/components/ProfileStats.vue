<template>
  <div class="row g-3 mb-5 text-center">
    <div class="col-6 col-md-3">
      <div class="stats-box-clean p-3 h-100 shadow-sm rounded-3 bg-white">
        <h2 class="display-6 fw-bold text-dark mb-0">{{ stats.ficsCount }}</h2>
        <p class="text-secondary-emphasis mb-0">Фанфиков</p>
      </div>
    </div>
    <div class="col-6 col-md-3">
      <div class="stats-box-clean p-3 h-100 shadow-sm rounded-3 bg-white">
        <h2 class="display-6 fw-bold text-dark mb-0">{{ stats.totalViews }}</h2>
        <p class="text-secondary-emphasis mb-0">Просмотров</p>
      </div>
    </div>
    <div class="col-6 col-md-3">
      <div class="stats-box-clean p-3 h-100 shadow-sm rounded-3 bg-white">
        <h2 class="display-6 fw-bold text-dark mb-0">{{ stats.totalLikes }}</h2>
        <p class="text-secondary-emphasis mb-0">Лайков</p>
      </div>
    </div>
    <div class="col-6 col-md-3">
      <div class="stats-box-clean p-3 h-100 shadow-sm rounded-3 bg-white">
        <h2 class="display-6 fw-bold text-dark mb-0">{{ stats.subscribers }}</h2>
        <p class="text-secondary-emphasis mb-0">Подписчиков</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Object,
    required: true,
    default: () => ({
      ficsCount: 0,
      totalViews: 0,
      totalLikes: 0,
      subscribers: 0
    })
  }
})
</script>