<script setup>
import { onMounted, ref } from 'vue'
import { AppAPI } from '../api/api'
import CourseCard from '../components/CourseCard.vue'
import EmptyState from '../components/EmptyState.vue'

const popularCourses = ref([])
const error = ref(null)

const categories = [
  { key: 'programming', label: 'Разработка', icon: 'bi-code-slash', color: 'color-primary' },
  { key: 'design', label: 'Дизайн', icon: 'bi-brush', color: 'color-accent' },
  { key: 'marketing', label: 'Маркетинг', icon: 'bi-graph-up-arrow', color: 'color-green' },
  { key: 'analytics', label: 'Аналитика', icon: 'bi-database', color: 'color-teal' },
  { key: 'languages', label: 'Языки', icon: 'bi-translate', color: 'color-orange' },
  { key: 'business', label: 'Бизнес', icon: 'bi-briefcase', color: 'color-secondary' }
]

onMounted(async () => {
  try {
    popularCourses.value = await AppAPI.getPopularCourses(4)
  } catch (err) {
    error.value = err.message
  }
})
</script>

<template>
  <section class="hero-section mt-navbar" aria-labelledby="hero-heading">
    <div class="container position-relative z-1">
      <div class="row align-items-center">
        <div class="col-lg-7">
          <h1 id="hero-heading">Учитесь новому<br />с лучшими преподавателями</h1>
          <p>
            Более 500 онлайн-курсов по программированию, дизайну, маркетингу, аналитике данных
            и другим направлениям. Начните обучение уже сегодня!
          </p>
          <div class="d-flex gap-3 flex-wrap">
            <router-link :to="{ name: 'catalog' }" class="btn btn-light-custom btn-lg">
              <i class="bi bi-search me-2" aria-hidden="true"></i>Найти курс
            </router-link>
            <router-link :to="{ name: 'register' }" class="btn btn-accent btn-lg">
              Начать бесплатно
            </router-link>
          </div>
        </div>
        <div class="col-lg-5 d-none d-lg-block text-center" aria-hidden="true">
          <div class="hero-decoration"><i class="bi bi-laptop"></i></div>
        </div>
      </div>
    </div>
  </section>

  <section class="stats-section" aria-label="Статистика платформы">
    <div class="container">
      <div class="row">
        <div class="col-6 col-md-3">
          <div class="stat-item">
            <div class="stat-number">500+</div>
            <div class="stat-label">Курсов</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-item">
            <div class="stat-number">120+</div>
            <div class="stat-label">Преподавателей</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-item">
            <div class="stat-number">50K</div>
            <div class="stat-label">Студентов</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-item">
            <div class="stat-number">98%</div>
            <div class="stat-label">Довольных</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section bg-gray-100" aria-labelledby="popular-courses-heading">
    <div class="container">
      <h2 class="section-title" id="popular-courses-heading">Популярные курсы</h2>
      <p class="section-subtitle">Самые востребованные программы обучения на платформе</p>
      <div class="row g-4">
        <CourseCard
          v-for="course in popularCourses"
          :key="course.id"
          :course="course"
          mode="home"
        />
        <EmptyState v-if="error" :text="error" variant="danger" />
      </div>
      <div class="text-center mt-5">
        <router-link :to="{ name: 'catalog' }" class="btn btn-primary btn-lg">
          <i class="bi bi-grid me-2" aria-hidden="true"></i>Все курсы
        </router-link>
      </div>
    </div>
  </section>

  <section class="section bg-white-bordered" aria-labelledby="how-it-works-heading">
    <div class="container">
      <h2 class="section-title text-center" id="how-it-works-heading">Как это работает</h2>
      <p class="section-subtitle text-center">Три простых шага до новых знаний</p>
      <ol class="row g-4 mt-2 list-unstyled">
        <li class="col-md-4 text-center">
          <div class="step-icon step-icon-primary"><i class="bi bi-person-plus"></i></div>
          <h3 class="h5 fw-bold">1. Зарегистрируйтесь</h3>
          <p class="text-muted">
            Создайте аккаунт за 30 секунд и получите доступ к бесплатным курсам
          </p>
        </li>
        <li class="col-md-4 text-center">
          <div class="step-icon step-icon-accent"><i class="bi bi-search"></i></div>
          <h3 class="h5 fw-bold">2. Выберите курс</h3>
          <p class="text-muted">
            Найдите подходящий курс с помощью удобных фильтров и рекомендаций
          </p>
        </li>
        <li class="col-md-4 text-center">
          <div class="step-icon step-icon-teal"><i class="bi bi-award"></i></div>
          <h3 class="h5 fw-bold">3. Получите сертификат</h3>
          <p class="text-muted">Пройдите курс, выполните задания и получите сертификат</p>
        </li>
      </ol>
    </div>
  </section>

  <section class="section bg-gray-100" aria-labelledby="categories-heading">
    <div class="container">
      <h2 class="section-title" id="categories-heading">Направления обучения</h2>
      <p class="section-subtitle">Выберите интересующую вас область</p>
      <div class="row g-3">
        <div
          v-for="category in categories"
          :key="category.key"
          class="col-6 col-md-4 col-lg-2"
        >
          <router-link
            :to="{ name: 'catalog', query: { category: category.key } }"
            class="text-decoration-none"
          >
            <div class="card-custom text-center p-4">
              <i class="bi category-icon" :class="[category.icon, category.color]" aria-hidden="true"></i>
              <div class="fw-bold mt-2 category-label">{{ category.label }}</div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>
