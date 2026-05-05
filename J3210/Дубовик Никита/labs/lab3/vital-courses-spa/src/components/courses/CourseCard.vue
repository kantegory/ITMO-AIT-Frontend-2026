<template>
  <div class="col-md-6 col-lg-4" role="listitem">
    <div class="course-card card h-100">
      <div class="card-img-wrapper">
        <img :src="course.image" class="card-img-top" :alt="course.title">
      </div>
      <div class="card-body d-flex flex-column">
        <div class="d-flex align-items-center mb-3">
          <span :class="['badge', subjectBadgeClass, 'me-2']">
            <svg class="icon icon-lg me-1" aria-hidden="true">
              <use :href="`#${subjectIcon}`"></use>
            </svg>
            {{ subjectName }}
          </span>
          <small class="text-muted ms-auto">
            <svg class="icon icon-lg me-1" aria-hidden="true"><use href="#icon-clock"></use></svg>
            {{ course.duration_hours }} ч
          </small>
        </div>
        <h3 class="fs-5">{{ course.title }}</h3>
        <p class="fs-6 flex-grow-1 text-muted">{{ course.description_short }}</p>
        <div class="card-footer-custom d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center">
            <img
              :src="instructorAvatar"
              class="instructor-img me-2"
              :alt="instructorName"
            >
            <div>
              <div class="small fw-bold instructor-name">{{ instructorName }}</div>
              <div class="small">
                <svg class="icon icon-lg text-warning" aria-hidden="true"><use href="#icon-star"></use></svg>
                <span class="text-body">{{ course.rating }}</span>
              </div>
            </div>
          </div>
          <div class="text-end">
            <div v-if="course.price === 0" class="fs-5 fw-bold mb-1 text-success text-nowrap">Бесплатно</div>
            <div v-else class="fs-5 fw-bold mb-1 text-nowrap">{{ formattedPrice }} ₽</div>
            <button class="btn btn-buy btn-sm" aria-label="Добавить в корзину">
              <svg class="icon icon-lg" aria-hidden="true"><use href="#icon-cart-plus"></use></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getSubjectName, getSubjectIcon, getSubjectBadgeClass } from '@/utils/helpers'

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
})

const subjectName = computed(() => getSubjectName(props.course.subject))
const subjectIcon = computed(() => getSubjectIcon(props.course.subject))
const subjectBadgeClass = computed(() => getSubjectBadgeClass(props.course.subject))

const instructor = computed(() => props.course.instructor || {})
const instructorName = computed(() =>
  `${instructor.value.firstName || ''} ${instructor.value.lastName || ''}`.trim()
)
const instructorAvatar = computed(() =>
  instructor.value.avatar || 'img/default-avatar.png'
)
const formattedPrice = computed(() =>
  props.course.price.toLocaleString()
)
</script>
