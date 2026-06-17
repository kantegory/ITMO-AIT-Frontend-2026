<template>
  <article class="edu-card course-card p-3 h-100 d-flex flex-column">
    <h5 class="card-title">{{ course.title }}</h5>
    <p class="card-text text-muted">{{ course.description }}</p>
    
    <div v-if="isEnrolled" class="progress mb-3" style="height: 20px;">
      <div class="progress-bar bg-success" role="progressbar" :style="{ width: course.progress + '%' }" :aria-valuenow="course.progress" aria-valuemin="0" aria-valuemax="100">
        {{ course.progress }}%
      </div>
    </div>
    
    <div class="mt-auto d-flex justify-content-between align-items-center">
      <span v-if="!isEnrolled" class="course-price">{{ course.price }}</span>
      <button v-if="isEnrolled" type="button" class="btn-brand btn-sm w-100">
        <svg class="icon me-1"><use href="#icon-book"></use></svg>Продолжить
      </button>
      <button v-else type="button" class="btn-brand" @click="$emit('enroll', course)">
        <svg class="icon me-1"><use href="#icon-book"></use></svg>Записаться
      </button>
    </div>
  </article>
</template>

<script setup>
defineProps({
  course: Object,
  isEnrolled: Boolean
})
defineEmits(['enroll'])
</script>
