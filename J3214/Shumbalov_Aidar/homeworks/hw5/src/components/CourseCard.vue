<script setup>
defineProps({
  course: {
    type: Object,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['select']);
</script>

<template>
  <article class="course-card" :class="{ active }">
    <div class="course-accent" :style="{ background: course.accent }"></div>
    <div class="course-card-body">
      <div class="course-meta">
        <span>{{ course.category }}</span>
        <span>{{ course.level }}</span>
      </div>

      <h3>{{ course.title }}</h3>

      <div class="course-info">
        <span>{{ course.lessons }} лекций</span>
        <strong>{{ course.price === 0 ? 'Бесплатно' : `${course.price} ₽` }}</strong>
      </div>

      <div class="progress-row">
        <span>Прогресс</span>
        <span>{{ course.progress }}%</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: `${course.progress}%` }"></div>
      </div>

      <button type="button" @click="$emit('select', course.id)">
        {{ active ? 'Выбран' : 'Выбрать курс' }}
      </button>
    </div>
  </article>
</template>
