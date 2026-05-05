<template>
  <div class="dashboard-page">
    <div class="app">
      <Sidebar />

      <div class="main">
        <TopBar search-placeholder="Поиск курсов, уроков и материалов..." />

        <main class="content" id="main-content" tabindex="-1" aria-label="Содержимое личного кабинета">
          <section aria-label="Приветственное сообщение">
            <div class="card welcome-card">
              <h1 class="page-title">
                Привет, {{ userName }} 👋
              </h1>
              <p class="page-subtitle">
                Учите новые навыки и создавайте свои курсы — всё в одном месте.
              </p>
            </div>
          </section>

          <section aria-label="Статистика обучения">
            <div class="row g-4">
              <div class="col-md-3 col-6">
                <div class="card stat-card">
                  <div class="stat-label">Изучаю</div>
                  <div class="stat-value">{{ enrolledCourses.length }}</div>
                  <div class="stat-note">Курсов</div>
                </div>
              </div>
              <div class="col-md-3 col-6">
                <div class="card stat-card">
                  <div class="stat-label">Завершено</div>
                  <div class="stat-value">{{ finishedCount }}</div>
                  <div class="stat-note">Пройдено</div>
                </div>
              </div>
              <div class="col-md-3 col-6">
                <div class="card stat-card">
                  <div class="stat-label">Создано</div>
                  <div class="stat-value">{{ createdCourses.length }}</div>
                  <div class="stat-note">Моих курсов</div>
                </div>
              </div>
              <div class="col-md-3 col-6">
                <div class="card stat-card">
                  <div class="stat-label">Сертификаты</div>
                  <div class="stat-value">0</div>
                  <div class="stat-note">Получено</div>
                </div>
              </div>
            </div>
          </section>

          <section class="section" id="myCoursesSection">
            <div class="section-header">
              <h2 class="section-title">Моё обучение</h2>
            </div>

            <div v-if="loading" class="col-12 text-center my-5 py-5">
              <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Загрузка...</span></div>
              <p class="mt-3 text-muted">Загрузка данных...</p>
            </div>

            <div v-else-if="enrolledCourses.length === 0" class="row g-4">
              <div class="col-12">
                <div class="card p-5 text-center border-0 shadow-sm">
                  <div class="empty-state-icon mb-3">📚</div>
                  <h5>Вы ещё не записались ни на один курс</h5>
                  <p class="text-muted">Запишитесь на интересующие курсы в каталоге</p>
                  <router-link to="/" class="btn btn-primary-custom mt-3">Перейти в каталог</router-link>
                </div>
              </div>
            </div>

              <div v-else class="row g-4">  
                <article v-for="item in enrolledCourses" :key="item.id" class="col-md-6 col-xl-4">
                  <!-- Показываем только если курс существует -->
                  <div v-if="item.course" class="card dashboard-course-card h-100 shadow-sm">
                    <div class="card-body d-flex flex-column">
                      <div class="d-flex justify-content-between mb-3">
                        <span class="badge badge-subject">{{ item.course.subject || 'Без категории' }}</span>
                        <span v-if="item.completed" class="badge bg-success text-white">Завершён</span>
                        <span v-else class="badge bg-light text-dark">{{ item.course.level || '—' }}</span>
                      </div>
                      <h3 class="card-title mb-2 h5">{{ item.course.title }}</h3>
                      <p class="dashboard-course-description flex-grow-1">{{ item.course.desc || 'Описание отсутствует' }}</p>
                      <div v-if="!item.completed" class="mb-3">
                        <div class="d-flex justify-content-between small text-muted mb-1">
                          <span>Прогресс</span><span>{{ item.progress }}%</span>
                        </div>
                        <div class="progress" role="progressbar" :aria-valuenow="item.progress" aria-valuemin="0" aria-valuemax="100">
                          <div class="progress-bar" :style="{ width: item.progress + '%' }"></div>
                        </div>
                      </div>
                      <div class="mt-auto">
                        <router-link :to="'/course/' + item.course.id" class="btn btn-primary-custom w-100">
                          {{ item.completed ? 'Повторить курс' : 'Продолжить обучение →' }}
                        </router-link>
                      </div>
                    </div>
                  </div>
                  <div v-else class="card dashboard-course-card h-100 shadow-sm">
                    <div class="card-body d-flex flex-column">
                      <h3 class="card-title mb-2 h5 text-muted">Курс недоступен</h3>
                      <p class="text-muted">Этот курс был удалён</p>
                    </div>
                  </div>
                </article>
              </div>
          </section>

          <section class="section" id="createdCoursesSection">
            <div class="section-header">
              <h2 class="section-title">Мои курсы</h2>
            </div>

            <div v-if="createdCourses.length === 0" class="row g-4">
              <div class="col-12">
                <div class="card p-5 text-center border-0 shadow-sm">
                  <div class="empty-state-icon mb-3">✏️</div>
                  <h5>У вас пока нет своих курсов</h5>
                  <p class="text-muted">Создайте свой первый курс и делитесь знаниями</p>
                  <router-link to="/teacher" class="btn btn-primary-custom mt-3">Создать курс</router-link>
                </div>
              </div>
            </div>

            <div v-else class="row g-4">
              <article v-for="course in createdCourses" :key="course.id" class="col-md-6 col-xl-4">
                <div class="card dashboard-course-card h-100 shadow-sm">
                  <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between mb-3">
                      <span class="badge badge-subject">{{ course.subject || 'Без категории' }}</span>
                      <span class="badge bg-light text-dark">{{ course.level || '—' }}</span>
                    </div>
                    <h3 class="card-title mb-2 h5">{{ course.title }}</h3>
                    <p class="dashboard-course-description flex-grow-1">{{ course.desc || 'Описание отсутствует' }}</p>
                    <div class="mt-auto d-flex gap-2">
                      <router-link :to="'/course/' + course.id" class="btn btn-outline-custom flex-fill">Открыть</router-link>
                      <router-link to="/teacher" class="btn btn-primary-custom flex-fill">Управление</router-link>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section class="section" id="certificatesSection">
            <div class="section-header">
              <h2 class="section-title">Сертификаты</h2>
            </div>
            <div class="row g-4">
              <div class="col-12">
                <div class="card p-5 text-center border-0 shadow-sm">
                  <div class="certificate-icon mb-3">🏆</div>
                  <h5>Сертификатов пока нет</h5>
                  <p class="text-muted">Завершите хотя бы один курс, и сертификат появится здесь</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import TopBar from '@/components/TopBar.vue'
import { useAuth, useCourses } from '@/composables'

const { userName, user } = useAuth()
const { getUserCourses, loading: coursesLoading } = useCourses()

const loading = ref(true)
const enrolledData = ref([])
const createdCourses = ref([])

const enrolledCourses = computed(() => enrolledData.value)
const finishedCount = computed(() => enrolledData.value.filter(e => e.completed).length)

onMounted(async () => {
  try {
    if (!user.value?.id) {
      loading.value = false
      return
    }

    const result = await getUserCourses(user.value.id)
    if (result.success) {
      enrolledData.value = result.data.enrolled
      createdCourses.value = result.data.created
    }
  } catch (err) {
    console.error('Dashboard error:', err)
  } finally {
    loading.value = false
  }
})
</script>