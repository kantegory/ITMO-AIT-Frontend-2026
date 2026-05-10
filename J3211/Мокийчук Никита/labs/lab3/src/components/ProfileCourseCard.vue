<script setup>
defineProps({
  course: { type: Object, required: true }
})
</script>

<template>
  <div class="col-md-6">
    <div class="card-custom p-3 h-100">
      <div class="d-flex gap-3">
        <div
          class="course-img-placeholder-profile rounded"
          :class="course.gradient || 'bg-gradient-1'"
        >
          <i class="bi" :class="course.icon || 'bi-mortarboard'"></i>
        </div>
        <div class="flex-grow-1">
          <h6 class="fw-bold mb-1 text-md-2">{{ course.title || 'Курс без названия' }}</h6>
          <small class="text-muted">{{ course.teacherName || 'Преподаватель не указан' }}</small>
          <div class="progress progress-custom mt-2 progress-thin">
            <div class="progress-bar" :style="{ width: `${course.enrollment?.progress || 0}%` }"></div>
          </div>
          <div class="d-flex justify-content-between mt-1">
            <small class="text-muted">
              {{ course.enrollment?.completedLessons?.length || 0 }} уроков пройдено
            </small>
            <small class="fw-bold text-primary">{{ course.enrollment?.progress || 0 }}%</small>
          </div>
        </div>
      </div>
      <router-link
        :to="{ name: 'course', params: { id: course.id } }"
        class="btn btn-primary btn-sm w-100 mt-3"
      >Продолжить</router-link>
    </div>
  </div>
</template>
