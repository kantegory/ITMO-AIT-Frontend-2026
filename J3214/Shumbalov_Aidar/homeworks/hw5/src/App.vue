<script setup>
import { computed, ref } from 'vue';
import AppHeader from './components/AppHeader.vue';
import CourseCard from './components/CourseCard.vue';
import CourseFilters from './components/CourseFilters.vue';
import ProgressPanel from './components/ProgressPanel.vue';
import { courses } from './data/courses';

const query = ref('');
const selectedCategory = ref('Все');
const selectedLevel = ref('Все');
const onlyFree = ref(false);
const selectedCourseId = ref(courses[0].id);

const categories = computed(() => ['Все', ...new Set(courses.map((course) => course.category))]);
const levels = computed(() => ['Все', ...new Set(courses.map((course) => course.level))]);

const filteredCourses = computed(() => {
  const normalizedQuery = query.value.trim().toLowerCase();

  return courses.filter((course) => {
    const matchesQuery = course.title.toLowerCase().includes(normalizedQuery);
    const matchesCategory = selectedCategory.value === 'Все' || course.category === selectedCategory.value;
    const matchesLevel = selectedLevel.value === 'Все' || course.level === selectedLevel.value;
    const matchesPrice = !onlyFree.value || course.price === 0;

    return matchesQuery && matchesCategory && matchesLevel && matchesPrice;
  });
});

const selectedCourse = computed(() => {
  return courses.find((course) => course.id === selectedCourseId.value) || filteredCourses.value[0] || null;
});

function resetFilters() {
  query.value = '';
  selectedCategory.value = 'Все';
  selectedLevel.value = 'Все';
  onlyFree.value = false;
}
</script>

<template>
  <AppHeader />

  <main class="page-shell">
    <section class="hero">
      <div>
        <p class="eyebrow">Домашняя работа 5</p>
        <h1>Vue-приложение для платформы онлайн-курсов</h1>
        <p class="hero-text">
          Небольшой SPA-прототип показывает работу npm, Vite, Vue-компонентов, реактивных
          переменных, computed-свойств и передачи данных через props.
        </p>
      </div>
      <ProgressPanel :courses="courses" :selected-course="selectedCourse" />
    </section>

    <CourseFilters
      v-model:query="query"
      v-model:category="selectedCategory"
      v-model:level="selectedLevel"
      v-model:only-free="onlyFree"
      :categories="categories"
      :levels="levels"
      @reset="resetFilters"
    />

    <section class="courses-section">
      <div class="section-heading">
        <h2>Каталог курсов</h2>
        <span>{{ filteredCourses.length }} из {{ courses.length }}</span>
      </div>

      <div v-if="filteredCourses.length" class="course-grid">
        <CourseCard
          v-for="course in filteredCourses"
          :key="course.id"
          :course="course"
          :active="course.id === selectedCourse?.id"
          @select="selectedCourseId = course.id"
        />
      </div>

      <div v-else class="empty-state">
        <strong>Курсы не найдены</strong>
        <p>Измените поисковый запрос или сбросьте фильтры.</p>
        <button type="button" @click="resetFilters">Сбросить фильтры</button>
      </div>
    </section>
  </main>
</template>
