<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import CourseCard from '../components/CourseCard.vue';
import CourseFilters from '../components/CourseFilters.vue';
import StateNotice from '../components/StateNotice.vue';
import { useAuth } from '../composables/useAuth';
import { useCourses } from '../composables/useCourses';

const router = useRouter();
const { isAuthenticated } = useAuth();
const { courses, coursesError, coursesLoading, enroll, getEnrollment } = useCourses();

const query = ref('');
const subject = ref('all');
const level = ref('all');
const price = ref('all');

const filteredCourses = computed(() => {
  const normalizedQuery = query.value.trim().toLowerCase();

  return courses.value.filter((course) => {
    const matchesQuery = course.title.toLowerCase().includes(normalizedQuery);
    const matchesSubject = subject.value === 'all' || course.subject === subject.value;
    const matchesLevel = level.value === 'all' || course.level === level.value;
    const matchesPrice =
      price.value === 'all' || (price.value === 'free' && course.price === 0) || (price.value === 'paid' && course.price > 0);

    return matchesQuery && matchesSubject && matchesLevel && matchesPrice;
  });
});

function resetFilters() {
  query.value = '';
  subject.value = 'all';
  level.value = 'all';
  price.value = 'all';
}

async function handleEnroll(courseId) {
  if (!isAuthenticated.value) {
    router.push({ name: 'login', query: { redirect: `/courses/${courseId}` } });
    return;
  }

  await enroll(courseId);
}
</script>

<template>
  <section class="hero-panel">
    <div>
      <p class="eyebrow">Лабораторная работа 3</p>
      <h1>Vue SPA для платформы онлайн-курсов</h1>
      <p>
        Каталог и личный кабинет перенесены на Vue, маршрутизация работает через Vue Router,
        данные приходят из mock API через axios.
      </p>
    </div>
    <div class="status-card">
      <span>API</span>
      <strong>{{ coursesError ? 'Недоступен' : 'Подключён' }}</strong>
      <small>json-server-auth на 3002 порту</small>
    </div>
  </section>

  <section class="panel" aria-labelledby="catalog-title">
    <div class="section-heading">
      <div>
        <h2 id="catalog-title">Поиск курсов</h2>
        <p>Фильтры работают реактивно через computed-свойство.</p>
      </div>
      <span class="counter" aria-live="polite">{{ filteredCourses.length }} курсов</span>
    </div>

    <CourseFilters
      v-model:query="query"
      v-model:subject="subject"
      v-model:level="level"
      v-model:price="price"
      @reset="resetFilters"
    />

    <StateNotice v-if="coursesLoading" title="Загрузка курсов" text="Запрос к mock API выполняется через axios." />
    <StateNotice v-else-if="coursesError" title="API недоступен" :text="coursesError" />
    <StateNotice v-else-if="!filteredCourses.length" title="Курсы не найдены" text="Измените фильтры или сбросьте поиск." />

    <div v-else class="course-grid">
      <CourseCard
        v-for="course in filteredCourses"
        :key="course.id"
        :course="course"
        :enrollment="getEnrollment(course.id)"
        @enroll="handleEnroll"
      />
    </div>
  </section>
</template>
