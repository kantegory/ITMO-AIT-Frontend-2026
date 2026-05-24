<template>
  <main>
    <!-- Hero -->
    <section class="hero-section py-5 text-center text-white">
      <div class="container py-4">
        <h1 class="display-4 fw-bold mb-3">
          Учись у лучших.<br />Стань <span class="text-warning">экспертом</span>.
        </h1>
        <p class="lead mb-4 opacity-75">
          Тысячи онлайн-курсов от профессионалов. Начни свой путь к знаниям сегодня.
        </p>
        <RouterLink to="/courses" class="btn btn-warning btn-lg px-5 shadow">
          Начать обучение
        </RouterLink>
      </div>
    </section>

    <!-- Stats -->
    <section class="py-4 border-bottom">
      <div class="container">
        <div class="row text-center g-3">
          <div class="col-6 col-md-3">
            <div class="h3 fw-bold text-warning mb-0">500+</div>
            <div class="text-muted small">Курсов</div>
          </div>
          <div class="col-6 col-md-3">
            <div class="h3 fw-bold text-warning mb-0">50K+</div>
            <div class="text-muted small">Студентов</div>
          </div>
          <div class="col-6 col-md-3">
            <div class="h3 fw-bold text-warning mb-0">200+</div>
            <div class="text-muted small">Преподавателей</div>
          </div>
          <div class="col-6 col-md-3">
            <div class="h3 fw-bold text-warning mb-0">4.8★</div>
            <div class="text-muted small">Средний рейтинг</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Courses -->
    <section class="py-5">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="fw-bold mb-0">Популярные курсы</h2>
          <RouterLink to="/courses" class="btn btn-outline-warning btn-sm">Все курсы →</RouterLink>
        </div>
        <div class="row g-4">
          <template v-if="loading">
            <div v-for="n in 3" :key="n" class="col-md-4">
              <SkeletonCard />
            </div>
          </template>
          <template v-else>
            <div v-for="course in courses" :key="course.id" class="col-md-4">
              <CourseCard :course="course" />
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-5 bg-warning-subtle">
      <div class="container text-center py-3">
        <h2 class="fw-bold mb-3">Готов начать?</h2>
        <p class="text-muted mb-4">Зарегистрируйся бесплатно и открой доступ к сотням курсов.</p>
        <RouterLink to="/register" class="btn btn-warning btn-lg px-5">
          Зарегистрироваться бесплатно
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import CourseCard from '@/components/CourseCard.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'
import { useCourses } from '@/composables/useCourses'

const { courses, loading, fetchCourses } = useCourses()

onMounted(() => fetchCourses({ _limit: 3, _sort: 'rating', _order: 'desc' }))
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  min-height: 400px;
  display: flex;
  align-items: center;
}
</style>
