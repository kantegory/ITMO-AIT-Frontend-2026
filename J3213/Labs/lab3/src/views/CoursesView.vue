<template>
  <section class="section">
    <div class="container">
      <h1 class="section-title">Каталог курсов</h1>
      <CourseFilters
        :filters="filters"
        :subjects="subjects"
        :levels="levels"
        @update:filters="setFilter"
      />

      <LoadingState v-if="loading" />
      <p v-else-if="error" class="state-message error">{{ error }}</p>
      <div v-else-if="filteredCourses.length" class="course-list">
        <CourseCard v-for="course in filteredCourses" :key="course.id" :course="course" />
      </div>
      <p v-else class="state-message">Под эти фильтры пока ничего не нашлось.</p>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import CourseCard from '../components/CourseCard.vue';
import CourseFilters from '../components/CourseFilters.vue';
import LoadingState from '../components/LoadingState.vue';
import { getCourses } from '../services/api';

const courses = ref([]);
const loading = ref(true);
const error = ref('');
const filters = reactive({
  search: '',
  subject: 'Все',
  level: 'Все',
  price: 'Все'
});

const subjects = computed(() => [...new Set(courses.value.map((course) => course.subject))]);
const levels = computed(() => [...new Set(courses.value.map((course) => course.level))]);

const filteredCourses = computed(() => {
  const search = filters.search.trim().toLowerCase();

  return courses.value.filter((course) => {
    const matchesSearch = !search || course.title.toLowerCase().includes(search);
    const matchesSubject = filters.subject === 'Все' || course.subject === filters.subject;
    const matchesLevel = filters.level === 'Все' || course.level === filters.level;
    const matchesPrice =
      filters.price === 'Все' ||
      (filters.price === 'Бесплатно' && course.price === 'Бесплатно') ||
      (filters.price === 'Платные' && course.price !== 'Бесплатно');

    return matchesSearch && matchesSubject && matchesLevel && matchesPrice;
  });
});

function setFilter({ key, value }) {
  filters[key] = value;
}

onMounted(async () => {
  try {
    courses.value = await getCourses();
  } catch {
    error.value = 'Каталог не загрузился. Проверьте, что json-server-auth работает на порту 3000.';
  } finally {
    loading.value = false;
  }
});
</script>
