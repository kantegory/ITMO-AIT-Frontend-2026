<script setup>
import { computed } from 'vue';

const props = defineProps({
  courses: {
    type: Array,
    required: true,
  },
  selectedCourse: {
    type: Object,
    default: null,
  },
});

const completedCourses = computed(() => {
  return props.courses.filter((course) => course.progress === 100).length;
});

const averageProgress = computed(() => {
  const total = props.courses.reduce((sum, course) => sum + course.progress, 0);
  return Math.round(total / props.courses.length);
});
</script>

<template>
  <aside id="progress" class="progress-panel">
    <div class="panel-stat">
      <span>Курсов</span>
      <strong>{{ courses.length }}</strong>
    </div>
    <div class="panel-stat">
      <span>Завершено</span>
      <strong>{{ completedCourses }}</strong>
    </div>
    <div class="panel-stat">
      <span>Средний прогресс</span>
      <strong>{{ averageProgress }}%</strong>
    </div>

    <div v-if="selectedCourse" class="selected-course">
      <span>Выбранный курс</span>
      <strong>{{ selectedCourse.title }}</strong>
      <small>{{ selectedCourse.progress }}% прохождения</small>
    </div>
  </aside>
</template>
