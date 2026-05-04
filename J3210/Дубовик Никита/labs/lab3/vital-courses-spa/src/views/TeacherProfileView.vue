<template>
  <main class="flex-grow-1">
    <!-- Шапка профиля преподавателя -->
    <section class="profile-header py-5 mb-4">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-3 text-center text-lg-start mb-4 mb-lg-0">
            <div class="profile-avatar mx-auto mx-lg-0">
              <svg class="icon icon-lg" aria-hidden="true"><use href="#icon-chalkboard-user"></use></svg>
            </div>
          </div>
          <div class="col-lg-9">
            <h1 class="text-white fw-bold mb-2">{{ fullName }}</h1>
            <p class="text-white-50 mb-3">
              <svg class="icon icon-lg me-2" aria-hidden="true"><use href="#icon-envelope"></use></svg>
              <span>{{ userRecord?.email }}</span>
              <span class="mx-3">|</span>
              <svg class="icon icon-lg me-2" aria-hidden="true"><use href="#icon-calendar"></use></svg>
              <span>{{ registrationText }}</span>
            </p>
            <div class="d-flex flex-wrap gap-3">
              <div class="stat-badge px-4 py-2 text-white">
                <div class="fw-bold fs-4 mb-0">{{ totalCourses }}</div>
                <small class="text-white-50">Курсов создано</small>
              </div>
              <div class="stat-badge px-4 py-2 text-white">
                <div class="fw-bold fs-4 mb-0">{{ totalStudents }}</div>
                <small class="text-white-50">Всего студентов</small>
              </div>
              <div class="stat-badge px-4 py-2 text-white">
                <div class="fw-bold fs-4 mb-0">{{ avgRating }}</div>
                <small class="text-white-50">Средний рейтинг</small>
              </div>
              <div class="stat-badge px-4 py-2 text-white">
                <div class="fw-bold fs-4 mb-0">{{ completedStudents }}</div>
                <small class="text-white-50">Завершили курс</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Табы -->
    <section class="container mb-5">
      <div class="row">
        <div class="col-12 mb-4">
          <ul class="nav nav-pills nav-pills-custom gap-2" id="teacherTabs" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link active px-4 py-2" id="courses-tab" data-bs-toggle="pill"
                      data-bs-target="#courses" type="button" role="tab">
                <svg class="icon icon-lg me-2" aria-hidden="true"><use href="#icon-book"></use></svg>Мои курсы
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link px-4 py-2" id="materials-tab" data-bs-toggle="pill"
                      data-bs-target="#materials-content" type="button" role="tab">
                <svg class="icon icon-lg me-2" aria-hidden="true"><use href="#icon-folder-open"></use></svg>Материалы
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link px-4 py-2" id="students-tab" data-bs-toggle="pill"
                      data-bs-target="#students-content" type="button" role="tab">
                <svg class="icon icon-lg me-2" aria-hidden="true"><use href="#icon-users"></use></svg>Студенты
              </button>
            </li>
          </ul>
        </div>

        <div class="tab-content" id="teacherTabsContent">
          <!-- Вкладка "Мои курсы" -->
          <div class="tab-pane fade show active" id="courses" role="tabpanel">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h2 class="fw-bold mb-0">Управление курсами</h2>
              <button class="btn btn-primary">
                <svg class="icon icon-lg me-2" aria-hidden="true"><use href="#icon-plus"></use></svg>Создать курс
              </button>
            </div>
            <div class="row g-4" v-if="courses.length">
              <div v-for="course in courses" :key="course.id" class="col-md-6 col-lg-4">
                <div class="card course-card h-100">
                  <div class="card-body d-flex flex-column">
                    <h3>{{ course.title }}</h3>
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <div class="d-flex align-items-center">
                        <svg class="icon icon-lg text-muted me-2" aria-hidden="true"><use href="#icon-users"></use></svg>
                        <small class="text-muted">{{ course.studentsCount || 0 }} студента</small>
                      </div>
                      <div class="d-flex align-items-center">
                        <svg class="icon icon-lg text-warning me-1" aria-hidden="true"><use href="#icon-star"></use></svg>
                        <small class="fw-bold">{{ course.rating }}</small>
                      </div>
                    </div>
                    <div class="progress mb-3" style="height: 6px;">
                      <div
                        class="progress-bar"
                        :class="completionPercentClass(course.id)"
                        role="progressbar"
                        :style="{ width: completionPercent(course.id) + '%' }"
                        :aria-valuenow="completionPercent(course.id)"
                        aria-valuemin="0" aria-valuemax="100"
                        :aria-label="completionPercent(course.id) + '% студентов завершили курс'"
                      ></div>
                    </div>
                    <div class="d-flex justify-content-between small text-muted mb-3">
                      <span>{{ completionPercent(course.id) }}% завершили</span>
                      <span>{{ course.duration_hours }} часов</span>
                    </div>
                  </div>
                  <div class="card-footer card-footer-custom bg-body-tertiary border-0">
                    <div class="d-flex gap-2">
                      <button class="btn btn-outline-primary flex-grow-1">
                        <svg class="icon icon-lg me-1" aria-hidden="true"><use href="#icon-pen"></use></svg>Редактировать
                      </button>
                      <button class="btn btn-outline-secondary" aria-label="Показать статистику курса">
                        <svg class="icon icon-lg" aria-hidden="true"><use href="#icon-chart-line"></use></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p v-else class="text-muted">У вас пока нет курсов</p>
          </div>

          <!-- Вкладка "Материалы" -->
          <div class="tab-pane fade" id="materials-content" role="tabpanel">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h3 class="fw-bold mb-0">Материалы курсов</h3>
              <button class="btn btn-primary">
                <svg class="icon icon-lg me-2" aria-hidden="true"><use href="#icon-cloud-upload-alt"></use></svg>Загрузить материал
              </button>
            </div>

            <div class="card border-0 shadow-sm mb-4">
              <div class="card-body p-5">
                <div class="text-center">
                  <div class="mb-3">
                    <svg class="icon text-primary" style="width: 3em; height: 3em;" aria-hidden="true"><use href="#icon-cloud-arrow-up"></use></svg>
                  </div>
                  <h3 class="fw-bold mb-2">Перетащите файлы сюда</h3>
                  <p class="text-muted mb-3">или нажмите для выбора файлов</p>
                  <button class="btn btn-outline-primary px-4">
                    <svg class="icon icon-lg me-2" aria-hidden="true"><use href="#icon-folder-open"></use></svg>Выбрать файлы
                  </button>
                </div>
              </div>
            </div>

            <div class="card border-0 shadow-sm">
              <div class="card-header bg-body-tertiary border-bottom py-3">
                <h3 class="fw-bold mb-0">Загруженные материалы</h3>
              </div>
              <div class="card-body p-0">
                <div v-if="materials.length" class="table-responsive">
                  <table class="table table-hover mb-0">
                    <thead class="bg-light">
                    <tr>
                      <th class="ps-4">Название</th>
                      <th>Курс</th>
                      <th>Тип</th>
                      <th>Размер</th>
                      <th>Дата загрузки</th>
                      <th class="text-end pe-4">Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="m in materials" :key="m.id">
                      <td class="ps-4">
                        <div class="d-flex align-items-center">
                          <svg :class="['icon me-3', materialIconClass(m.type)]" style="width: 1.5em; height: 1.5em;" aria-hidden="true">
                            <use :href="`#${materialIconId(m.type)}`"></use>
                          </svg>
                          <span class="fw-medium">{{ m.name }}</span>
                        </div>
                      </td>
                      <td>
                        <span class="badge bg-secondary">{{ courseTitleById(m.courseId) }}</span>
                      </td>
                      <td>{{ (m.type || '').toUpperCase() }}</td>
                      <td>{{ m.size || '—' }}</td>
                      <td>{{ m.uploadedAt || '—' }}</td>
                      <td class="text-end pe-4">
                        <button class="btn btn-sm btn-outline-secondary me-1" aria-label="Скачать файл">
                          <svg class="icon icon-lg" aria-hidden="true"><use href="#icon-download"></use></svg>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" aria-label="Удалить файл">
                          <svg class="icon icon-lg" aria-hidden="true"><use href="#icon-trash"></use></svg>
                        </button>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <p v-else class="text-muted p-3">Материалы отсутствуют</p>
              </div>
            </div>
          </div>

          <!-- Вкладка "Студенты" -->
          <div class="tab-pane fade" id="students-content" role="tabpanel">
            <h3 class="fw-bold mb-4">Статистика студентов</h3>
            <div class="row g-4 mb-5">
              <div class="col-md-3">
                <div class="card border-0 shadow-sm h-100">
                  <div class="card-body text-center py-4">
                    <div class="mb-3"><svg class="icon text-primary" style="width: 2em; height: 2em;" aria-hidden="true"><use href="#icon-users"></use></svg></div>
                    <h2 class="fw-bold mb-1">{{ totalStudents }}</h2>
                    <p class="text-muted mb-0">Всего студентов</p>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card border-0 shadow-sm h-100">
                  <div class="card-body text-center py-4">
                    <div class="mb-3"><svg class="icon text-success" style="width: 2em; height: 2em;" aria-hidden="true"><use href="#icon-user-check"></use></svg></div>
                    <h2 class="fw-bold mb-1">{{ activeStudents }}</h2>
                    <p class="text-muted mb-0">Активные сейчас</p>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card border-0 shadow-sm h-100">
                  <div class="card-body text-center py-4">
                    <div class="mb-3"><svg class="icon text-warning" style="width: 2em; height: 2em;" aria-hidden="true"><use href="#icon-graduation-cap"></use></svg></div>
                    <h2 class="fw-bold mb-1">{{ completedStudents }}</h2>
                    <p class="text-muted mb-0">Завершили курс</p>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card border-0 shadow-sm h-100">
                  <div class="card-body text-center py-4">
                    <div class="mb-3"><svg class="icon text-info" style="width: 2em; height: 2em;" aria-hidden="true"><use href="#icon-star"></use></svg></div>
                    <h2 class="fw-bold mb-1">{{ avgRating }}</h2>
                    <p class="text-muted mb-0">Средний рейтинг</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-lg-8">
                <h4 class="fw-bold mb-4">Отзывы студентов</h4>
                <div v-if="reviews.length">
                  <div v-for="review in latestReviews" :key="review.id" class="card border-0 shadow-sm mb-3">
                    <div class="card-body">
                      <div class="d-flex justify-content-between align-items-center mb-1">
                        <h6 class="fw-bold mb-0">{{ review.userName }}</h6>
                        <div class="text-warning">
                          <svg v-for="n in review.rating" :key="n" class="icon icon-lg" aria-hidden="true"><use href="#icon-star"></use></svg>
                        </div>
                      </div>
                      <p class="text-muted small mb-2">{{ review.courseTitle || 'Курс' }} | {{ review.date }}</p>
                      <p class="mb-0">{{ review.text }}</p>
                    </div>
                  </div>
                  <button class="btn btn-outline-primary">
                    <svg class="icon icon-lg me-2" aria-hidden="true"><use href="#icon-list"></use></svg>Показать все отзывы
                  </button>
                </div>
                <p v-else class="text-muted">Нет отзывов</p>
              </div>
              <div class="col-lg-4">
                <h4 class="fw-bold mb-4">Распределение оценок</h4>
                <div class="card border-0 shadow-sm">
                  <div class="card-body">
                    <div v-if="reviews.length">
                      <div v-for="(_, star) in ratingDistribution" :key="star" class="mb-3">
                        <div class="d-flex align-items-center mb-2">
                          <span class="fw-bold me-2">{{ star }}★</span>
                          <div class="progress flex-grow-1 me-2" style="height: 8px;">
                            <div class="progress-bar bg-warning" role="progressbar"
                                 :style="{ width: ratingPercentage(star) + '%' }"
                                 :aria-valuenow="ratingPercentage(star)"
                                 aria-valuemin="0" aria-valuemax="100"
                                 :aria-label="ratingPercentage(star) + '% оценок - ' + star + ' звёзд'">
                            </div>
                          </div>
                          <span class="text-muted small">{{ ratingPercentage(star) }}%</span>
                        </div>
                      </div>
                      <hr class="my-4">
                      <div class="text-center">
                        <h3 class="fw-bold text-warning mb-1">{{ avgRating }}</h3>
                        <p class="text-muted small mb-0">из 5.0 на основе {{ reviews.length }} отзывов</p>
                      </div>
                    </div>
                    <p v-else class="text-muted">Нет данных</p>
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
import {computed, onMounted, ref} from 'vue'
import {useAuth} from '@/composables/useAuth'
import {
  getCoursesByInstructor,
  getInstructorByUserId,
  getMaterialsByCourseIds,
  getReviewsByCourseIds,
  getUserByEmail,
  getUserCoursesByCourseIds
} from '@/services/api'

const { user } = useAuth()
const userRecord = ref(null)
const instructor = ref(null)
const courses = ref([])
const userCourses = ref([])
const reviews = ref([])
const materials = ref([])

const fullName = computed(() => {
  if (userRecord.value) return `${userRecord.value.firstName} ${userRecord.value.lastName}`
  return 'Загрузка...'
})

const registrationText = computed(() => {
  if (userRecord.value?.registeredAt) {
    const date = new Date(userRecord.value.registeredAt)
    const month = date.toLocaleString('ru', { month: 'long' })
    const year = date.getFullYear()
    return `Преподаватель с ${month} ${year}`
  }
  return ''
})

const totalCourses = computed(() => courses.value.length)
const totalStudents = computed(() =>
  courses.value.reduce((sum, c) => sum + (c.studentsCount || 0), 0)
)
const avgRating = computed(() => {
  if (!courses.value.length) return 0
  const sum = courses.value.reduce((acc, c) => acc + (c.rating || 0), 0)
  return (sum / courses.value.length).toFixed(1)
})
const completedStudents = computed(() =>
  userCourses.value.filter(uc => uc.status === 'completed').length
)
const activeStudents = computed(() =>
  userCourses.value.filter(uc => uc.status === 'active').length
)

function completionPercent(courseId) {
  const enr = userCourses.value.filter(uc => uc.courseId === courseId)
  const students = courses.value.find(c => c.id === courseId)?.studentsCount || 1
  const completed = enr.filter(uc => uc.status === 'completed').length
  return Math.round((completed / students) * 100)
}

function completionPercentClass(courseId) {
  const percent = completionPercent(courseId)
  if (percent > 70) return 'bg-success'
  if (percent > 30) return 'bg-warning'
  return 'bg-danger'
}

function courseTitleById(courseId) {
  return courses.value.find(c => c.id === courseId)?.title || 'Неизвестный курс'
}
function materialIconId(type) {
  const map = { pdf: 'icon-file-pdf', code: 'icon-file-code', notebook: 'icon-file-code', default: 'icon-file' }
  return map[type] || map.default
}
function materialIconClass(type) {
  const map = { pdf: 'text-danger', code: 'text-primary', notebook: 'text-primary', default: 'text-secondary' }
  return map[type] || map.default
}

const latestReviews = computed(() => reviews.value.slice(0, 3))

const ratingDistribution = computed(() => {
  const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.value.forEach(r => {
    if (dist[r.rating] !== undefined) dist[r.rating]++
  })
  return dist
})
function ratingPercentage(star) {
  if (!reviews.value.length) return 0
  return Math.round((ratingDistribution.value[star] / reviews.value.length) * 100)
}

onMounted(async () => {
  try {
    if (!user.value?.email) return

    const fullUser = await getUserByEmail(user.value.email)
    if (!fullUser) throw new Error('Пользователь не найден')
    userRecord.value = fullUser

    const inst = await getInstructorByUserId(userRecord.value.id)
    if (!inst) throw new Error('Профиль преподавателя не найден')
    instructor.value = inst

    const teacherCourses = await getCoursesByInstructor(inst.id)
    courses.value = teacherCourses
    const courseIds = teacherCourses.map(c => c.id)

    const [uc, rev] = await Promise.all([
      courseIds.length ? getUserCoursesByCourseIds(courseIds) : [],
      courseIds.length ? getReviewsByCourseIds(courseIds) : []
    ])
    userCourses.value = uc
    reviews.value = rev

    materials.value = courseIds.length ? await getMaterialsByCourseIds(courseIds) : []
  } catch (err) {
    console.error('Ошибка загрузки профиля преподавателя:', err)
  }
})
</script>
