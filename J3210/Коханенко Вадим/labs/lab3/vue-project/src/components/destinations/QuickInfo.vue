<template>
  <aside class="card info-card mb-4">
    <div class="card-header">
      <h2 class="h5 mb-0">
        <svg class="icon"><use xlink:href="/sprite.svg#icon-clock"></use></svg>
        Быстрая информация
      </h2>
    </div>
    <div class="card-body">
      <div class="quick-info-item text-center">
        <div class="quick-info-icon">
          <svg class="icon"><use xlink:href="/sprite.svg#icon-wallet"></use></svg>
        </div>
        <h3 class="h6">Стоимость</h3>
        <div class="price-large">{{ destination.price }}</div>
      </div>
      <hr>
      <div class="row g-3">
        <div class="col-6">
          <div class="quick-info-icon small">
            <svg class="icon"><use xlink:href="/sprite.svg#icon-calendar"></use></svg>
          </div>
          <h3 class="h6 small">Лучший сезон</h3>
          <p class="fw-bold">{{ destination.bestSeason }}</p>
        </div>
        <div class="col-6">
          <div class="quick-info-icon small">
            <svg class="icon"><use xlink:href="/sprite.svg#icon-person"></use></svg>
          </div>
          <h3 class="h6 small">Язык</h3>
          <p class="fw-bold">{{ destination.language }}</p>
        </div>
        <div class="col-6">
          <div class="quick-info-icon small">
            <svg class="icon"><use xlink:href="/sprite.svg#icon-wallet"></use></svg>
          </div>
          <h3 class="h6 small">Валюта</h3>
          <p class="fw-bold">{{ destination.currency }}</p>
        </div>
        <div class="col-6">
          <div class="quick-info-icon small">
            <svg class="icon"><use xlink:href="/sprite.svg#icon-clock"></use></svg>
          </div>
          <h3 class="h6 small">Часовой пояс</h3>
          <p class="fw-bold">{{ destination.timezone }}</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  destination: {
    type: Object,
    required: true
  }
})
</script>