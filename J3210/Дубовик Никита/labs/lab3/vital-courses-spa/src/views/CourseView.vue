<template>
  <main class="flex-grow-1">
    <!-- Состояние ошибки -->
    <div v-if="error" class="container py-5 text-center">
      <div class="alert alert-danger" role="alert">{{ error }}</div>
      <router-link to="/catalog" class="btn btn-primary">Вернуться в каталог</router-link>
    </div>

    <!-- Загрузка -->
    <div v-else-if="loading" class="container py-5 text-center">
      <AppSpinner text="Загрузка курса..." />
    </div>

    <!-- Основной контент курса -->
    <template v-else-if="course">
      <!-- Шапка курса -->
      <section class="course-header bg-dark text-white py-5">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-8">
              <span :class="['badge', subjectBadgeClass, 'mb-3']">
                <svg class="icon icon-lg me-1" aria-hidden="true"><use :href="`#${subjectIcon}`"></use></svg>
                {{ subjectName }}
              </span>
              <h1 class="display-6 fw-bold mb-3">{{ course.title }}</h1>
              <p class="lead hero-lead text-white-50 mb-4">{{ course.description_short }}</p>

              <div class="d-flex flex-wrap align-items-center gap-4">
                <div class="d-flex align-items-center gap-2">
                  <div>
                    <div class="fw-semibold">{{ instructorFullName }}</div>
                    <div class="small text-white-50">
                      <svg class="icon icon-lg text-warning me-1" aria-hidden="true"><use href="#icon-star"></use></svg>
                      {{ course.rating }}
                    </div>
                  </div>
                </div>

                <div class="d-flex align-items-center gap-2">
                  <svg class="icon icon-lg text-white-50" aria-hidden="true"><use href="#icon-clock"></use></svg>
                  <span>{{ course.duration_hours }} ч</span>
                </div>

                <div class="d-flex align-items-center gap-2">
                  <svg class="icon icon-lg text-white-50" aria-hidden="true"><use href="#icon-users"></use></svg>
                  <span>{{ formattedStudentsCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Контент курса -->
      <section class="course-content py-5">
        <div class="container">
          <div class="row">
            <div class="col-lg-8">
              <!-- Видео-превью -->
              <div class="card border-0 shadow-sm mb-4">
                <div class="card-body p-0">
                  <div class="ratio ratio-16x9 bg-dark">
                    <div class="d-flex align-items-center justify-content-center h-100 text-white">
                      <div class="text-center">
                        <svg class="icon text-white opacity-75 mb-3" style="width: 4em; height: 4em;" aria-hidden="true"><use href="#icon-circle-play"></use></svg>
                        <p class="mb-0">Введение в курс</p>
                        <small class="text-white-50">0:0 / 60:00</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Вкладки -->
              <ul class="nav nav-tabs mb-4" id="courseTabs" role="tablist">
                <li class="nav-item" role="presentation">
                  <button class="nav-link active" id="overview-tab" data-bs-toggle="tab" data-bs-target="#overview" type="button" role="tab">
                    <svg class="icon icon-lg me-2" aria-hidden="true"><use href="#icon-list"></use></svg>Обзор
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" id="materials-tab" data-bs-toggle="tab" data-bs-target="#materials" type="button" role="tab">
                    <svg class="icon icon-lg me-2" aria-hidden="true"><use href="#icon-folder-open"></use></svg>Материалы
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" id="assignments-tab" data-bs-toggle="tab" data-bs-target="#assignments" type="button" role="tab">
                    <svg class="icon icon-lg me-2" aria-hidden="true"><use href="#icon-file-pen"></use></svg>Задания
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" id="discussions-tab" data-bs-toggle="tab" data-bs-target="#discussions" type="button" role="tab">
                    <svg class="icon icon-lg me-2" aria-hidden="true"><use href="#icon-comments"></use></svg>Обсуждения
                    <span class="badge bg-primary ms-1">{{ discussions.length }}</span>
                  </button>
                </li>
              </ul>

              <!-- Содержимое вкладок -->
              <div class="tab-content" id="courseTabsContent">
                <!-- Обзор -->
                <div class="tab-pane fade show active" id="overview" role="tabpanel">
                  <div class="card border-0 shadow-sm mb-4">
                    <div class="card-body">
                      <h2 class="fw-bold mb-3">О курсе</h2>
                      <p class="text-muted mb-4">{{ course.description_full || course.description_short }}</p>

                      <h3 class="fw-semibold mb-3">Что вы изучите:</h3>
                      <ul class="list-unstyled mb-4">
                        <template v-if="course.learning_outcomes && course.learning_outcomes.length">
                          <li v-for="item in course.learning_outcomes" :key="item" class="mb-2">
                            <svg class="icon icon-lg text-success me-2" aria-hidden="true"><use href="#icon-check"></use></svg>
                            {{ item }}
                          </li>
                        </template>
                        <li v-else class="mb-2 text-muted">Информация появится позже</li>
                      </ul>

                      <h3 class="fw-semibold mb-3">Требования:</h3>
                      <ul class="list-unstyled">
                        <template v-if="course.requirements && course.requirements.length">
                          <li v-for="item in course.requirements" :key="item" class="mb-2">
                            <svg class="icon icon-lg text-primary me-2" aria-hidden="true"><use href="#icon-circle-info"></use></svg>
                            {{ item }}
                          </li>
                        </template>
                        <li v-else class="mb-2 text-muted">Требования не указаны</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <!-- Материалы -->
                <div class="tab-pane fade" id="materials" role="tabpanel">
                  <div class="card border-0 shadow-sm mb-4">
                    <div class="card-body">
                      <h5 class="fw-bold mb-4">Материалы лекции</h5>
                      <div class="list-group list-group-flush">
                        <div v-if="materials.length">
                          <a v-for="m in materials" :key="m.id" :href="m.url" class="list-group-item list-group-item-action d-flex align-items-center py-3" target="_blank" rel="noopener">
                            <svg :class="['icon me-3', getMaterialIconClass(m.type)]" style="width: 1.5em; height: 1.5em;" aria-hidden="true">
                              <use :href="`#${getMaterialIconId(m.type)}`"></use>
                            </svg>
                            <div class="flex-grow-1">
                              <div class="fw-semibold">{{ m.name }}</div>
                              <small class="text-muted">{{ m.size }} • {{ m.uploadedAt }}</small>
                            </div>
                            <svg class="icon icon-lg text-muted" aria-hidden="true"><use href="#icon-download"></use></svg>
                          </a>
                        </div>
                        <p v-else class="text-muted">Материалы пока не добавлены.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Задания -->
                <div class="tab-pane fade" id="assignments" role="tabpanel">
                  <div class="card border-0 shadow-sm mb-4">
                    <div class="card-body">
                      <h5 class="fw-bold mb-4">Задания курса</h5>
                      <div v-if="assignments.length">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                          <span class="fw-semibold">Общий прогресс заданий</span>
                          <span class="text-primary">0/{{ assignments.length }}</span>
                        </div>
                        <div class="progress mb-4" style="height: 8px;">
                          <div class="progress-bar bg-success" role="progressbar" style="width: 0"></div>
                        </div>
                      </div>
                      <div class="list-group list-group-flush">
                        <div v-if="assignments.length">
                          <div v-for="a in assignments" :key="a.id" class="list-group-item d-flex align-items-center py-3 border-bottom">
                            <div class="form-check me-3">
                              <input class="form-check-input" type="checkbox">
                            </div>
                            <svg class="icon text-primary me-3" style="width: 1.5em; height: 1.5em;" aria-hidden="true">
                              <use href="#icon-circle-exclamation"></use>
                            </svg>
                            <div class="flex-grow-1">
                              <div class="fw-semibold">{{ a.title }}</div>
                              <small class="text-muted">Срок: {{ a.dueDate }}</small>
                            </div>
                            <span class="badge bg-primary">Новое</span>
                          </div>
                        </div>
                        <p v-else class="text-muted">Заданий пока нет.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Обсуждения -->
                <div class="tab-pane fade" id="discussions" role="tabpanel">
                  <div class="card border-0 shadow-sm mb-4">
                    <div class="card-body">
                      <div class="d-flex justify-content-between align-items-center mb-4">
                        <h5 class="fw-bold mb-0">Обсуждения</h5>
                        <button class="btn btn-primary btn-sm">
                          <svg class="icon icon-lg me-1" aria-hidden="true"><use href="#icon-plus"></use></svg>Новая тема
                        </button>
                      </div>
                      <div class="list-group list-group-flush">
                        <div v-if="discussions.length">
                          <a v-for="d in discussions" :key="d.id" href="#" class="list-group-item list-group-item-action py-3">
                            <div class="d-flex w-100 justify-content-between">
                              <h6 class="mb-1 fw-semibold">{{ d.title }}</h6>
                              <small class="text-muted">{{ d.createdAt }}</small>
                            </div>
                            <div class="d-flex align-items-center mt-2">
                              <img :src="getAvatarUrl(d.user)" class="rounded-circle me-2" width="24" height="24" :alt="getFullName(d.user)">
                              <small class="text-muted me-3">{{ getFullName(d.user) }}
                                <svg v-if="d.user?.role === 'teacher'" class="icon text-primary" style="width:1em;height:1em;"><use href="#icon-certificate"></use></svg>
                              </small>
                              <span class="badge bg-primary me-2">{{ d.repliesCount }} ответов</span>
                              <span class="text-muted small">
                                <svg class="icon me-1" style="width:1em;height:1em;"><use href="#icon-heart"></use></svg>{{ d.likes }}
                              </span>
                            </div>
                          </a>
                        </div>
                        <p v-else class="text-muted">Обсуждений пока нет.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Правая колонка -->
            <div class="col-lg-4 mt-4 mt-lg-0">
              <!-- Преподаватель -->
              <div class="card border-0 shadow-sm mb-4" v-if="course.instructor">
                <div class="card-header bg-transparent border-bottom">
                  <h3 class="fw-bold mb-0">Преподаватель</h3>
                </div>
                <div class="card-body">
                  <div class="d-flex align-items-center mb-3">
                    <div>
                      <div class="fw-semibold">{{ instructorFullName }}</div>
                      <div class="small text-muted">{{ course.instructor.title || '' }}</div>
                    </div>
                  </div>
                  <p class="text-muted small mb-3">{{ course.instructor.bio || '' }}</p>
                  <div class="d-flex gap-2">
                    <a :href="course.instructor.github ? `https://github.com/${course.instructor.github}` : '#'" class="btn btn-outline-secondary btn-sm flex-grow-1" target="_blank" rel="noopener">
                      <svg class="icon icon-lg me-1" aria-hidden="true"><use href="#icon-github"></use></svg>GitHub
                    </a>
                  </div>
                </div>
              </div>

              <!-- Статистика курса -->
              <div class="card border-0 shadow-sm mb-4">
                <div class="card-header bg-transparent border-bottom">
                  <h3 class="fw-bold mb-0">Статистика курса</h3>
                </div>
                <div class="card-body">
                  <div class="row g-3">
                    <div class="col-6">
                      <div class="text-center p-3 rounded">
                        <div class="h4 fw-bold text-primary mb-0">{{ course.rating }}</div>
                        <small class="text-muted">Рейтинг</small>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="text-center p-3 rounded">
                        <div class="h4 fw-bold text-primary mb-0">{{ (course.studentsCount / 1000).toFixed(1) }}K+</div>
                        <small class="text-muted">Студентов</small>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="text-center p-3 rounded">
                        <div class="h4 fw-bold text-primary mb-0">{{ course.duration_hours }}ч</div>
                        <small class="text-muted">Контента</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  getCourseById,
  getMaterials,
  getAssignments,
  getDiscussions
} from '@/services/api'
import {
  getSubjectName,
  getSubjectIcon,
  getSubjectBadgeClass
} from '@/utils/helpers'
import AppSpinner from '@/components/common/AppSpinner.vue'

const route = useRoute()
const courseId = computed(() => route.params.id)

const course = ref(null)
const materials = ref([])
const assignments = ref([])
const discussions = ref([])
const loading = ref(true)
const error = ref(null)

const subjectName = computed(() => course.value ? getSubjectName(course.value.subject) : '')
const subjectIcon = computed(() => course.value ? getSubjectIcon(course.value.subject) : '')
const subjectBadgeClass = computed(() => course.value ? getSubjectBadgeClass(course.value.subject) : '')
const instructorFullName = computed(() => {
  const inst = course.value?.instructor
  return inst ? `${inst.firstName} ${inst.lastName}` : ''
})
const formattedStudentsCount = computed(() => {
  return course.value ? `${course.value.studentsCount.toLocaleString()} студентов` : ''
})

function getMaterialIconId(type) {
  const map = { pdf: 'icon-file-pdf', code: 'icon-file-code', notebook: 'icon-file-code', default: 'icon-book' }
  return map[type] || map.default
}
function getMaterialIconClass(type) {
  const colors = { pdf: 'text-danger', code: 'text-primary', notebook: 'text-primary', default: 'text-success' }
  return colors[type] || colors.default
}
function getAvatarUrl(user) {
  if (!user) return ''
  const name = getFullName(user)
  const bg = user.role === 'teacher' ? '9f78b3&color=fff' : 'random'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}`
}
function getFullName(user) {
  if (!user) return 'Аноним'
  return `${user.firstName || ''} ${user.lastName || ''}`.trim()
}

onMounted(async () => {
  const id = courseId.value
  if (!id) {
    error.value = 'Курс не указан. Вернитесь в каталог.'
    loading.value = false
    return
  }

  try {
    const [courseData, materialsData, assignmentsData, discussionsData] = await Promise.all([
      getCourseById(id),
      getMaterials(id),
      getAssignments(id),
      getDiscussions(id)
    ])
    course.value = courseData
    materials.value = materialsData
    assignments.value = assignmentsData
    discussions.value = discussionsData
  } catch (err) {
    console.error('Ошибка загрузки курса:', err)
    error.value = 'Не удалось загрузить данные курса. Попробуйте позже.'
  } finally {
    loading.value = false
  }
})
</script>
