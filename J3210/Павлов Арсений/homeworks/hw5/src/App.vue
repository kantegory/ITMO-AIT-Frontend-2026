<script setup>
import { ref } from 'vue';
import NavbarTop from './components/NavbarTop.vue';
import CourseCard from './components/CourseCard.vue';
import ProgressPanel from './components/ProgressPanel.vue';

const progress = ref(42);

const courses = [
  {
    id: 1,
    title: 'Введение в Vue',
    description: 'Компоненты, реактивность, шаблоны и props.',
    lessons: 8,
  },
  {
    id: 2,
    title: 'Работа с API',
    description: 'HTTP-запросы, обработка состояния загрузки и ошибок.',
    lessons: 6,
  },
  {
    id: 3,
    title: 'Маршрутизация',
    description: 'Router, переходы между страницами, guards.',
    lessons: 5,
  },
];
</script>

<template>
  <div class="layout">
    <NavbarTop />

    <main>
      <ProgressPanel :value="progress" />

      <section class="grid">
        <CourseCard
          v-for="course in courses"
          :key="course.id"
          :title="course.title"
          :description="course.description"
          :lessons="course.lessons"
        />
      </section>
    </main>
  </div>
</template>
