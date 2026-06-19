<!-- Компонент карточки курса — переиспользуется в CoursesPage -->
<template>
  <div class="card border-0 shadow-sm h-100">
    <div :class="`card-img-top bg-${color} d-flex align-items-center justify-content-center`" style="height:100px;">
      <i :class="`bi ${icon} text-white`" style="font-size:2rem;" aria-hidden="true"></i>
    </div>
    <div class="card-body">
      <span class="badge bg-secondary text-white mb-2">{{ level }}</span>
      <h6 class="fw-bold">{{ title }}</h6>
      <p class="text-muted small mb-2">{{ teacher }} · {{ lessons }} уроков · {{ hours }} ч.</p>
      <div class="d-flex align-items-center gap-1 mb-3">
        <i class="bi bi-star-fill text-warning small" aria-hidden="true"></i>
        <span class="small fw-semibold">{{ rating }}</span>
        <span class="text-muted small">({{ reviews }})</span>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <span :class="price === 0 ? 'fw-bold text-success' : 'fw-bold'">
          {{ price === 0 ? 'Бесплатно' : price.toLocaleString('ru') + ' ₽' }}
        </span>
        <router-link :to="`/courses/${id}`" class="btn btn-outline-primary btn-sm">Подробнее</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CourseCard',
  props: {
    id:      { type: [String, Number], required: true },
    title:   { type: String, required: true },
    teacher: { type: String, default: '' },
    level:   { type: String, default: 'Начинающий' },
    price:   { type: Number, default: 0 },
    lessons: { type: Number, default: 0 },
    hours:   { type: Number, default: 0 },
    rating:  { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    color:   { type: String, default: 'primary' },
    icon:    { type: String, default: 'bi-book' }
  }
}
</script>
