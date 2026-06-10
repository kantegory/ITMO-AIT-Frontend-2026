<script setup>
import { computed } from 'vue'
import { useFormatters } from '../composables/useFormatters'

const props = defineProps({
  course: { type: Object, required: true },
  mode: { type: String, default: 'catalog' }
})

const { formatPrice, formatStudents, getLevelBadgeClass } = useFormatters()

const colClass = computed(() =>
  props.mode === 'home' ? 'col-sm-6 col-lg-3' : 'col-sm-6 col-xl-4'
)
</script>

<template>
  <div :class="colClass">
    <router-link :to="{ name: 'course', params: { id: course.id } }" class="text-decoration-none">
      <div class="card card-custom h-100">
        <div class="course-img-placeholder" :class="course.gradient">
          <i class="bi" :class="course.icon"></i>
        </div>
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="badge-level" :class="getLevelBadgeClass(course.level)">{{ course.levelLabel }}</span>
            <div class="rating"><i class="bi bi-star-fill"></i> {{ course.rating }}</div>
          </div>
          <h6 class="card-title">{{ course.title }}</h6>
          <p class="card-text">{{ course.shortDescription }}</p>
          <div class="d-flex justify-content-between align-items-center mt-auto">
            <span v-if="course.price === 0" class="price-free">Бесплатно</span>
            <span v-else class="price-tag">{{ formatPrice(course.price) }}</span>
            <small class="text-muted">
              <i class="bi bi-people me-1"></i>{{ formatStudents(course.students) }}
            </small>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>
