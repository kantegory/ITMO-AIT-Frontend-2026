<template>
  <div class="col-md-6 col-lg-4">
    <div class="card course-card h-100 d-flex flex-column">
      <div class="card-body p-4 d-flex flex-column">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <span :class="['badge', subjectBadgeClass]">{{ subjectName }}</span>
          <span :class="['badge', statusBadgeClass]">
            <svg v-if="isCompleted" class="icon icon-lg me-1" aria-hidden="true">
              <use href="#icon-check"></use>
            </svg>
            {{ isCompleted ? 'Завершено' : 'В процессе' }}
          </span>
        </div>
        <h3>{{ course.title }}</h3>
        <div class="mb-2">
          <div class="d-flex justify-content-between small mb-1">
            <span>Прогресс</span>
            <span class="fw-medium">{{ progressPercent }}%</span>
          </div>
          <div class="progress" style="height: 6px;">
            <div
              class="progress-bar"
              :class="progressBarColor"
              role="progressbar"
              :style="{ width: progressPercent + '%' }"
              :aria-label="`Прогресс: ${progressPercent}%`"
            ></div>
          </div>
        </div>
        <div class="d-flex justify-content-between small text-muted mb-3">
          <span>
            <svg class="icon icon-lg me-1" aria-hidden="true"><use href="#icon-clock"></use></svg>
            {{ hoursSpent }}/{{ course.duration_hours }} ч
          </span>
          <span>
            <svg class="icon icon-lg me-1" aria-hidden="true"><use href="#icon-layer-group"></use></svg>
            {{ progressPercent }}%
          </span>
        </div>
        <router-link
          v-if="!isCompleted"
          :to="`/course/${course.id}`"
          class="btn btn-primary w-100 mt-auto"
        >
          <svg class="icon icon-lg me-1" aria-hidden="true"><use href="#icon-play"></use></svg>
          Продолжить
        </router-link>
        <button v-else class="btn btn-outline-success w-100 mt-auto">
          <svg class="icon icon-lg me-1" aria-hidden="true"><use href="#icon-certificate"></use></svg>
          Сертификат
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getSubjectName, getSubjectBadgeClass } from '@/utils/helpers'

const props = defineProps({
  enrollment: { type: Object, required: true },
  course: { type: Object, required: true }
})

const progressPercent = computed(() => Math.round(props.enrollment.progress))
const isCompleted = computed(() =>
  props.enrollment.status === 'completed' || props.enrollment.progress === 100
)

const subjectName = computed(() => getSubjectName(props.course.subject))
const subjectBadgeClass = computed(() => getSubjectBadgeClass(props.course.subject))

const statusBadgeClass = computed(() =>
  isCompleted.value ? 'badge-soft-success' : 'badge-soft-warning'
)

const progressBarColor = computed(() =>
  isCompleted.value ? 'bg-success' : ''
)

const hoursSpent = computed(() =>
  Math.round((props.course.duration_hours * progressPercent.value) / 100)
)
</script>
