<template>
  <div class="container py-4">
    <div v-if="loading" class="text-center">Загрузка...</div>
    
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-else-if="course">
      <h1>{{ course.title }}</h1>
      <p>{{ course.description }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import useCourses from '../composables/useCourses';

const route = useRoute();
const course = ref(null);
const loading = ref(true);
const error = ref(null);

const coursesService = useCourses();

onMounted(async () => {
  const id = route.params.id;
  
  try {
    if (typeof coursesService.fetchCourseById === 'function') {
      const data = await coursesService.fetchCourseById(id);
      course.value = data;
    } else {
      error.value = "Ошибка: метод fetchCourseById не найден в useCourses.js";
    }
  } catch (err) {
    error.value = "Ошибка при загрузке курса";
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>