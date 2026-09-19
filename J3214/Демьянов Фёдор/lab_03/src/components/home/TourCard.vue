<template>
  <div class="col mission-card-item">
    <article class="glass-panel h-100 p-4 d-flex flex-column justify-content-between" :aria-label="`Экспедиция: ${tour.title}`">
      <div>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span :class="[tour.badgeClass, 'px-2 py-1 fs-7 rounded']">{{ tour.badge }}</span>
          <span class="text-muted-custom fs-7" :aria-label="`Шифр экспедиции: ${tour.code}`">{{ tour.code }}</span>
        </div>
        <h3 class="text-main fs-5 mb-2">{{ tour.title }}</h3>
        <p class="text-muted-custom fs-7 mb-4">{{ tour.shortDesc }}</p>

        <div class="border-top border-secondary border-opacity-25 pt-3 mb-4">
          <div class="d-flex justify-content-between fs-7 mb-2">
            <span class="text-muted-custom">Дистанция:</span>
            <span class="text-main">{{ tour.specs.distance }}</span>
          </div>
          <div class="d-flex justify-content-between fs-7 mb-2">
            <span class="text-muted-custom">Гравитация:</span>
            <span class="text-main">{{ tour.specs.gravity }}</span>
          </div>
          <div class="d-flex justify-content-between fs-7">
            <span class="text-muted-custom">Длительность:</span>
            <span class="text-main">{{ tour.durationText }}</span>
          </div>
        </div>
      </div>

      <div>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="text-muted-custom fs-7">Стоимость</span>
          <span class="fs-5 fw-bold text-main">{{ tour.price.toLocaleString('ru-RU') }} $</span>
        </div>
        <router-link
          :to="`/tours/${tour.id}`"
          class="btn btn-glass w-100 py-2 fs-7 text-center"
          :aria-label="`Подробнее об экспедиции ${tour.title}`"
        >
          Подробнее
        </router-link>
      </div>
    </article>
  </div>
</template>

<script setup>
defineProps({
  tour: {
    type: Object,
    required: true
  }
})
</script>