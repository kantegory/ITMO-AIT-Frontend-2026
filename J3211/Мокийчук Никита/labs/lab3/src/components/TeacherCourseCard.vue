<script setup>
import { useFormatters } from '../composables/useFormatters'
import { useToast } from '../composables/useToast'

defineProps({
  course: { type: Object, required: true }
})

const { formatStudents } = useFormatters()
const { showToast } = useToast()
</script>

<template>
  <div class="col-12">
    <div class="card-custom p-4">
      <div class="row align-items-center">
        <div class="col-auto d-none d-md-block">
          <div
            class="course-img-placeholder-teacher rounded"
            :class="course.gradient"
          >
            <i class="bi" :class="course.icon"></i>
          </div>
        </div>
        <div class="col">
          <div class="d-flex align-items-center gap-2 mb-1">
            <h6 class="fw-bold mb-0">{{ course.title }}</h6>
            <span class="badge bg-success">Опубликован</span>
          </div>
          <small class="text-muted">
            {{ course.durationHours }} часов · {{ formatStudents(course.students) }} студентов · Рейтинг {{ course.rating }}
          </small>
        </div>
        <div class="col-auto d-flex gap-2 mt-2 mt-md-0">
          <router-link
            :to="{ name: 'course', params: { id: course.id } }"
            class="btn btn-sm btn-outline-primary"
          >Открыть</router-link>
          <button
            class="btn btn-sm btn-outline-secondary"
            @click="showToast('Редактирование курса', 'info')"
          >
            <i class="bi bi-pencil"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
