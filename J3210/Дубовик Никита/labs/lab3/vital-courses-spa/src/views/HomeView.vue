<template>
  <main class="flex-grow-1" role="main">
    <!-- Hero-секция -->
    <section class="hero position-relative overflow-hidden min-vh-100 d-flex align-items-center" aria-labelledby="hero-title">
      <div class="hero-bg position-absolute w-100 h-100" aria-hidden="true">
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
        <div class="gradient-orb orb-3"></div>
        <div class="hero-overlay"></div>
      </div>

      <div class="floating-elements position-absolute w-100 h-100 pointer-events-none fade-in-up" aria-hidden="true">
        <div class="float-item float-1"><svg class="icon icon-lg"><use href="#icon-brain"></use></svg></div>
        <div class="float-item float-2"><svg class="icon icon-lg"><use href="#icon-code"></use></svg></div>
        <div class="float-item float-3"><svg class="icon icon-lg"><use href="#icon-robot"></use></svg></div>
        <div class="float-item float-4"><svg class="icon icon-lg"><use href="#icon-chart-line"></use></svg></div>
      </div>

      <div class="container position-relative">
        <div class="row align-items-center min-vh-75 py-5">
          <div class="col-lg-6 hero-content pe-lg-5">
            <h1 id="hero-title" class="display-3 fw-bold mb-4 fade-in-up delay-1">
              Освойте
              <span class="text-gradient d-inline-block">машинное обучение</span>
            </h1>

            <p class="lead hero-lead mb-5 fade-in-up delay-2">
              От линейной регрессии до трансформеров: тысячи курсов, которые превратят вас в экспертов этой области.
            </p>

            <ul class="hero-stats d-flex flex-wrap gap-3 list-unstyled fade-in-up delay-5" aria-label="Статистика платформы">
              <li class="stat-card px-4 py-3 rounded-3">
                <div class="stat-value fw-bold text-white fs-4">
                  <data value="50000">50K+</data>
                </div>
                <div class="stat-label small fs-6">ML-инженеров</div>
              </li>
              <li class="stat-card px-4 py-3 rounded-3">
                <div class="stat-value fw-bold text-white fs-4">
                  <data value="666000">666k+</data>
                </div>
                <div class="stat-label small fs-6">Моделей обучено</div>
              </li>
              <li class="stat-card px-4 py-3 rounded-3">
                <div class="stat-value fw-bold text-white fs-4">
                  <data value="0.999">99.9%</data>
                </div>
                <div class="stat-label small fs-6">Успешных запусков</div>
              </li>
            </ul>
          </div>

          <div class="col-lg-6 d-none d-lg-block position-relative" aria-hidden="true">
            <div class="position-relative text-white mx-auto fade-in-up delay-2">
              <div class="floating-card card-1 p-3 rounded-3">
                <div class="d-flex align-items-center gap-2">
                  <svg class="icon fs-4 text-success" aria-hidden="true"><use href="#icon-check-circle"></use></svg>
                  <small class="fw-medium">Курс завершён!</small>
                </div>
              </div>
              <div class="floating-card text-white card-2 p-3 rounded-3">
                <div class="d-flex align-items-center gap-2">
                  <svg class="icon fs-4 text-primary" aria-hidden="true"><use href="#icon-brain"></use></svg>
                  <small class="fw-medium">Accuracy: 98.7%</small>
                </div>
              </div>
              <div class="floating-card text-white card-3 rounded-3">
                <div class="d-flex flex-column align-items-center gap-2">
                  <svg class="icon fs-2 text-warning" aria-hidden="true"><use href="#icon-bolt"></use></svg>
                  <small class="fw-bold">GPU: Active</small>
                  <div class="progress mini-progress">
                    <div class="progress-bar bg-warning" role="progressbar"
                         aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Популярные курсы -->
    <section id="courses" class="bg-body-tertiary py-5" aria-labelledby="courses-heading">
      <div class="container">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5">
          <div class="mb-3 mb-md-0">
            <span class="text-uppercase text-primary fw-bold small ls-1">Образование</span>
            <h2 id="courses-heading" class="mb-2 display-6 fw-bold">Популярные ML-курсы</h2>
            <p class="mb-0 fs-5 text-secondary">Топовые программы для будущих архитекторов ИИ</p>
          </div>
          <router-link to="/catalog" class="btn btn-all-courses fs-6">
            Смотреть все <svg class="icon icon-lg ms-2" aria-hidden="true"><use href="#icon-arrow-right"></use></svg>
          </router-link>
        </div>

        <div class="row g-4" role="list">
          <div v-if="loading" class="col-12 text-center py-5">
            <AppSpinner text="Загрузка популярных курсов..." />
          </div>
          <CourseCard v-for="course in popularCourses" :key="course.id" :course="course" />
        </div>
      </div>
    </section>

    <!-- Как стать ML-гуру -->
    <section class="py-5" aria-labelledby="steps-heading">
      <div class="container">
        <div class="text-center mb-5">
          <h2 id="steps-heading" class="fw-bold mb-3">Как стать ML-гуру</h2>
          <p class="text-muted">Всего 3 шага от «что такое градиент» до полного понимания работы алгоритмов</p>
        </div>
        <div class="row align-items-center g-4">
          <div class="col-lg-4">
            <div class="step-card text-center p-4">
              <div class="step-number bg-primary text-white rounded-circle mb-3 mx-auto d-flex align-items-center justify-content-center fw-bold" style="width: 48px; height: 48px;" aria-hidden="true">1</div>
              <h3 class="fw-bold mb-2">Зарегистрируйтесь</h3>
              <p class="text-muted mb-0">Создайте аккаунт - и наш алгоритм уже подберёт вам идеальный курс (да, мы предсказываем даже это)</p>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="step-card text-center p-4">
              <div class="step-number bg-primary text-white rounded-circle mb-3 mx-auto d-flex align-items-center justify-content-center fw-bold" style="width: 48px; height: 48px;" aria-hidden="true">2</div>
              <h3 class="fw-bold mb-2">Обучайтесь с ИИ-наставником</h3>
              <p class="text-muted mb-0">Наш бот проверяет код, даёт фидбек и шутит про overfitting. Скучно не будет!</p>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="step-card text-center p-4">
              <div class="step-number bg-primary text-white rounded-circle mb-3 mx-auto d-flex align-items-center justify-content-center fw-bold" style="width: 48px; height: 48px;" aria-hidden="true">3</div>
              <h3 class="fw-bold mb-2">Получите NFT-сертификат</h3>
              <p class="text-muted mb-0">Завершите курс - и ваш сертификат запишется в блокчейн. Теперь его не подделать (как и ваши навыки)</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Отзывы -->
    <section class="py-5 bg-body-tertiary" aria-labelledby="testimonials-heading">
      <div class="container">
        <div class="text-center mb-5">
          <h2 id="testimonials-heading" class="fw-bold mb-3">Отзывы на наши курсы</h2>
          <p class="text-muted">Реальные истории людей, чьи жизни изменились.</p>
        </div>
        <div class="row g-4" role="list">
          <div class="col-md-6 col-lg-4" role="listitem">
            <div class="testimonial-card card h-100 border-0 shadow-sm">
              <div class="card-body p-4 d-flex flex-column">
                <div class="d-flex align-items-center mb-3" aria-label="Рейтинг: 5 из 5 звезд" role="img">
                  <span class="text-warning">
                    <svg class="icon icon-lg" aria-hidden="true"><use href="#icon-star"></use></svg>
                    <svg class="icon icon-lg" aria-hidden="true"><use href="#icon-star"></use></svg>
                    <svg class="icon icon-lg" aria-hidden="true"><use href="#icon-star"></use></svg>
                    <svg class="icon icon-lg" aria-hidden="true"><use href="#icon-star"></use></svg>
                    <svg class="icon icon-lg" aria-hidden="true"><use href="#icon-star"></use></svg>
                  </span>
                </div>
                <p class="card-text mb-4 flex-grow-0">Обучил сеть торговать на бирже. Теперь она зарабатывает миллионы, но тратит их только на охлаждение серверов и покупку новых видеокарт. Я стал её обслуживающим персоналом. Мечта сбылась — я работаю на ИИ, а не он на меня! Зарплату не платит, говорит: 'Инвестиция в будущее'.</p>
                <div class="d-flex align-items-center mt-auto">
                  <img src="https://ui-avatars.com/api/?name=Антон+Т&background=random" class="user-avatar rounded-circle me-3" width="40" height="40" alt="Аватар Антона Т.">
                  <div>
                    <h3 class="fw-bold mb-0">Антон Т.</h3>
                    <small class="text-muted">Выпускник курса "Neural Networks: Level God"</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-4" role="listitem">
            <div class="testimonial-card card h-100 border-0 shadow-sm">
              <div class="card-body p-4 d-flex flex-column">
                <div class="d-flex align-items-center mb-3" aria-label="Рейтинг: 5 из 5 звезд" role="img">
                  <span class="text-warning">
                    <svg class="icon icon-lg" aria-hidden="true"><use href="#icon-star"></use></svg>
                    <svg class="icon icon-lg" aria-hidden="true"><use href="#icon-star"></use></svg>
                    <svg class="icon icon-lg" aria-hidden="true"><use href="#icon-star"></use></svg>
                    <svg class="icon icon-lg" aria-hidden="true"><use href="#icon-star"></use></svg>
                    <svg class="icon icon-lg" aria-hidden="true"><use href="#icon-star"></use></svg>
                  </span>
                </div>
                <p class="card-text mb-4 flex-grow-0">Мой бот теперь пишет комментарии в соцсетях лучше троллей. Вчера он ввязался в спор с самим собой в трёх разных аккаунтах и выиграл дискуссию. Семья гордится, психотерапевт в шоке. Теперь бот пишет мне отзывы на курсы, чтобы я не тратил время.</p>
                <div class="d-flex align-items-center mt-auto">
                  <img src="https://ui-avatars.com/api/?name=Никита+Д&background=random" class="user-avatar rounded-circle me-3" width="40" height="40" alt="Аватар Никиты Д.">
                  <div>
                    <h3 class="fw-bold mb-0">Никита Д.</h3>
                    <small class="text-muted">Выпускник курса "NLP: Words Are Magic"</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-4" role="listitem">
            <div class="testimonial-card card h-100 border-0 shadow-sm">
              <div class="card-body p-4 d-flex flex-column">
                <div class="d-flex align-items-center mb-3" aria-label="Рейтинг: 5 из 5 звезд" role="img">
                  <span class="text-warning">
                    <svg class="icon icon-lg" aria-hidden="true"><use href="#icon-star"></use></svg>
                    <svg class="icon icon-lg" aria-hidden="true"><use href="#icon-star"></use></svg>
                    <svg class="icon icon-lg" aria-hidden="true"><use href="#icon-star"></use></svg>
                    <svg class="icon icon-lg" aria-hidden="true"><use href="#icon-star"></use></svg>
                    <svg class="icon icon-lg" aria-hidden="true"><use href="#icon-star"></use></svg>
                  </span>
                </div>
                <p class="card-text mb-4 flex-grow-0">Камера видит всё. Буквально. Вчера система безопасности заблокировала меня на кухне, потому что я пытался съесть котлету после шести. ИИ заботится о моем здоровье агрессивнее, чем мама. Похудел на 5 кг за неделю. Боюсь чихнуть без разрешения.</p>
                <div class="d-flex align-items-center mt-auto">
                  <img src="https://ui-avatars.com/api/?name=Матвей+Е&background=random" class="user-avatar rounded-circle me-3" width="40" height="40" alt="Аватар Матвея Е.">
                  <div>
                    <h3 class="fw-bold mb-0">Матвей Е.</h3>
                    <small class="text-muted">Выпускник курса "CV: See The Future"</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getPopularCourses } from '@/services/api'
import CourseCard from '@/components/courses/CourseCard.vue'
import AppSpinner from '@/components/common/AppSpinner.vue'

const popularCourses = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    popularCourses.value = await getPopularCourses(3)
  } catch (error) {
    console.error('Ошибка загрузки популярных курсов:', error)
  } finally {
    loading.value = false
  }
})
</script>
