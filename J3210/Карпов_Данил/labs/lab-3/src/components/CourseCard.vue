<template>
  <div class="card h-100 shadow-sm course-card">
    <div class="position-relative">
      <img
        :src="course.image || 'https://placehold.co/400x200/ffd43b/333?text=Course'"
        class="card-img-top"
        :alt="course.title"
        style="height: 180px; object-fit: cover"
        @error="onImgError"
      />
      <span
        v-if="course.badge"
        class="badge position-absolute top-0 end-0 m-2"
        :class="`bg-${course.badgeColor || 'warning'}`"
      >
        {{ course.badge }}
      </span>
    </div>
    <div class="card-body d-flex flex-column">
      <div class="d-flex justify-content-between align-items-start mb-1">
        <span class="badge bg-secondary-subtle text-secondary-emphasis text-capitalize">
          {{ categoryLabel }}
        </span>
        <span class="badge bg-light text-dark border text-capitalize">{{ levelLabel }}</span>
      </div>
      <h6 class="card-title mt-2 mb-1">{{ course.title }}</h6>
      <p class="card-text text-muted small mb-2 flex-grow-1">{{ shortDescription }}</p>
      <div class="d-flex align-items-center gap-2 mb-2 small text-muted">
        <span><i class="bi bi-star-fill text-warning"></i> {{ course.rating.toFixed(1) }}</span>
        <span>({{ course.reviewsCount }})</span>
        <span class="ms-auto"><i class="bi bi-people"></i> {{ course.studentsCount }}</span>
      </div>
      <div class="d-flex justify-content-between align-items-center mt-auto">
        <span class="fw-bold text-warning fs-5">
          {{ course.priceType === 'free' ? 'Бесплатно' : `${course.price} ₽` }}
        </span>
        <RouterLink :to="`/courses/${course.id}`" class="btn btn-warning btn-sm">
          Подробнее
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
})

const categoryMap = {
  programming: 'Программирование',
  design: 'Дизайн',
  data: 'Data Science',
}

const levelMap = {
  beginner: 'Начинающий',
  intermediate: 'Средний',
  advanced: 'Продвинутый',
}

const categoryLabel = computed(() => categoryMap[props.course.category] ?? props.course.category)
const levelLabel = computed(() => levelMap[props.course.level] ?? props.course.level)
const shortDescription = computed(() =>
  props.course.description.length > 90
    ? props.course.description.slice(0, 90) + '…'
    : props.course.description,
)

function onImgError(e) {
  e.target.src = 'https://placehold.co/400x200/ffd43b/333?text=Course'
}
</script>
