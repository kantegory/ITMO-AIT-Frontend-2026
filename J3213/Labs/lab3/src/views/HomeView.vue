<template>
  <section class="hero" aria-label="Городская учеба">
    <div class="container">
      <p class="eyebrow">Barbie mood, Manhattan rhythm</p>
      <h1>Учеба в розовом ритме большого города</h1>
      <p>Курсы, материалы и прогресс под рукой, пока день несется от кофе до вечерних планов.</p>
      <RouterLink class="btn" to="/courses">Хочу учиться</RouterLink>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <h2 class="section-title">Популярные курсы</h2>

      <LoadingState v-if="loading" />
      <p v-else-if="error" class="state-message error">{{ error }}</p>
      <div v-else class="cards">
        <CourseCard v-for="course in featuredCourses" :key="course.id" :course="course" />
      </div>
    </div>
  </section>

  <section class="section accent-section">
    <div class="container feature-grid">
      <article>
        <h3>Материалы рядом</h3>
        <p>Лекции, задания и обсуждения собраны как любимые заметки в городской сумке.</p>
      </article>
      <article>
        <h3>Фильтры помогают</h3>
        <p>Предмет, уровень и цена быстро оставляют только те курсы, которые подходят к твоему дню.</p>
      </article>
      <article>
        <h3>Кабинет помнит</h3>
        <p>Купленные курсы, прогресс и сертификаты остаются в одном аккуратном месте.</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import CourseCard from '../components/CourseCard.vue';
import LoadingState from '../components/LoadingState.vue';
import { getCourses } from '../services/api';

const courses = ref([]);
const loading = ref(true);
const error = ref('');

const featuredCourses = computed(() => courses.value.slice(0, 3));

onMounted(async () => {
  try {
    courses.value = await getCourses();
  } catch {
    error.value = 'Не удалось загрузить популярные курсы. Запустите моковый API.';
  } finally {
    loading.value = false;
  }
});
</script>
