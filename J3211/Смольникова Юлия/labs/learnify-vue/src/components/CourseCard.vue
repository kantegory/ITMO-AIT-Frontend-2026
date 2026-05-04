<template>
  <article class="col-md-6 col-xl-4 mb-4" :aria-label="'Карточка курса: ' + course.title">
    <div class="card course-card h-100 shadow-sm">
      <div class="card-category-bar" aria-hidden="true"></div>
      <div class="card-body d-flex flex-column">
        <div class="d-flex justify-content-between mb-3">
          <span class="badge badge-subject">{{ course.subject || 'Без категории' }}</span>
          <span class="badge badge-price">{{ priceLabel }}</span>
        </div>
        <h3 class="card-title h5">{{ course.title }}</h3>
        <p class="course-description flex-grow-1">{{ course.desc || 'Описание отсутствует' }}</p>

        <div class="course-info mb-3">
          <span class="text-muted small">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; vertical-align: -3px;">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            {{ lessonsCount }} уроков
          </span>
          <span class="badge bg-secondary ms-2">{{ course.level || 'Любой уровень' }}</span>
        </div>

        <div class="course-actions mt-auto d-flex gap-2">
          <router-link :to="'/course/' + course.id" class="btn btn-outline-custom btn-sm flex-fill">
            Подробнее
          </router-link>
          <button 
            v-if="showEnrollButton" 
            class="btn btn-primary-custom btn-sm flex-fill"
            @click="$emit('enroll', course)"
          >
            Записаться
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  course: { type: Object, required: true },
  showEnrollButton: { type: Boolean, default: true }
})

defineEmits(['enroll'])

const priceLabel = computed(() => {
  return Number(props.course.price) > 0 ? `${props.course.price} ₽` : 'Бесплатно'
})

const lessonsCount = computed(() => {
  return props.course.lessons?.length || 0
})
</script>

<style scoped>
.course-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.course-info .text-muted {
  display: inline-flex;
  align-items: center;
}

.course-actions {
  display: flex;
  gap: 8px;
}
</style>