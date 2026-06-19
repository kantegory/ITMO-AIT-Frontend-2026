<template>
  <base-layout>
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <template v-else-if="course">
      <!-- Шапка курса -->
      <div class="bg-primary text-white rounded p-4 mb-4">
        <nav aria-label="breadcrumb" class="mb-2">
          <ol class="breadcrumb mb-0">
            <li class="breadcrumb-item">
              <router-link to="/courses" class="text-white-50 text-decoration-none">Каталог</router-link>
            </li>
            <li class="breadcrumb-item active text-white">{{ course.title }}</li>
          </ol>
        </nav>
        <h1 class="h3 fw-bold mb-2">{{ course.title }}</h1>
        <p class="mb-3" style="color:rgba(255,255,255,.8)">{{ course.description }}</p>
        <div class="d-flex flex-wrap gap-3 align-items-center">
          <span>
            <i class="bi bi-star-fill text-warning me-1" aria-hidden="true"></i>
            <strong>{{ course.rating }}</strong>
            <span class="text-white-50 small"> ({{ course.reviews }} отзывов)</span>
          </span>
          <span class="text-white-50">·</span>
          <span class="small"><i class="bi bi-play-circle me-1" aria-hidden="true"></i>{{ course.lessons }} уроков · {{ course.hours }} ч.</span>
          <span class="badge bg-secondary">{{ course.level }}</span>
        </div>
        <p class="mt-2 mb-0 small text-white-50">Преподаватель: {{ course.teacher }}</p>
      </div>

      <div class="row g-4">
        <!-- Основной контент -->
        <div class="col-12 col-lg-8">
          <ul class="nav nav-tabs mb-4" role="tablist">
            <li class="nav-item">
              <button class="nav-link" :class="{ active: tab === 'content' }" @click="tab = 'content'">Содержание</button>
            </li>
            <li class="nav-item">
              <button class="nav-link" :class="{ active: tab === 'materials' }" @click="tab = 'materials'">Материалы</button>
            </li>
            <li class="nav-item">
              <button class="nav-link" :class="{ active: tab === 'discuss' }" @click="tab = 'discuss'">Обсуждения</button>
            </li>
          </ul>

          <!-- Содержание -->
          <div v-if="tab === 'content'">
            <!-- Видеоплеер-заглушка -->
            <div class="bg-dark rounded d-flex align-items-center justify-content-center mb-4"
              style="height:280px;cursor:pointer;" @click="playing = !playing">
              <div class="text-center text-white">
                <i :class="`bi ${playing ? 'bi-pause-circle-fill' : 'bi-play-circle-fill'}`"
                  style="font-size:4rem;opacity:.9;" aria-hidden="true"></i>
                <p class="mt-2 mb-0">{{ course.title }} — введение</p>
              </div>
            </div>

            <!-- Программа курса -->
            <h5 class="fw-bold mb-3">Программа курса</h5>

            <div v-if="!currentEnrollment" class="alert alert-info">
              <i class="bi bi-lock me-2" aria-hidden="true"></i>
              Запишитесь на курс, чтобы получить доступ к программе и заданиям.
            </div>

            <template v-else>
              <!-- Прогресс заданий -->
              <div class="mb-4" v-if="allTasks.length > 0">
                <div class="d-flex justify-content-between small text-muted mb-1">
                  <span>Принято преподавателем: {{ acceptedCount }} из {{ allTasks.length }}</span>
                  <span>{{ progressPct }}%</span>
                </div>
                <div class="progress mb-1" style="height:8px;">
                  <div class="progress-bar bg-success" :style="`width:${progressPct}%`"></div>
                </div>
                <p v-if="pendingCount > 0" class="text-muted small mb-0">
                  <i class="bi bi-clock me-1" aria-hidden="true"></i>На проверке: {{ pendingCount }}
                </p>
              </div>

              <!-- Аккордеон уроков -->
              <div class="accordion" id="programAccordion">
                <div v-for="(tasks, lesson, i) in tasksByLesson" :key="lesson"
                  class="accordion-item border-0 shadow-sm mb-2 rounded">
                  <h2 class="accordion-header">
                    <button class="accordion-button fw-semibold" :class="{ collapsed: i > 0 }"
                      data-bs-toggle="collapse" :data-bs-target="`#lesson${i}`">
                      <i class="bi me-2" :class="lessonAllAccepted(tasks) ? 'bi-check-circle-fill text-success' : 'bi-circle text-muted'" aria-hidden="true"></i>
                      {{ lesson }}
                    </button>
                  </h2>
                  <div :id="`lesson${i}`" class="accordion-collapse collapse" :class="{ show: i === 0 }">
                    <div class="accordion-body pt-0">
                      <ul class="list-group list-group-flush">
                        <li v-for="task in tasks" :key="task.id"
                          class="list-group-item d-flex align-items-center gap-3 px-0">
                          <i class="bi" :class="taskIcon(task.id)" aria-hidden="true"></i>
                          <span class="flex-grow-1 small">{{ task.title }}</span>
                          <button class="btn btn-sm" :class="taskBtnClass(task.id)" @click="openTask(task)">
                            {{ taskBtnText(task.id) }}
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- Материалы -->
          <div v-if="tab === 'materials'">
            <h5 class="fw-bold mb-3">Материалы курса</h5>
            <div v-if="!currentEnrollment" class="alert alert-info">
              <i class="bi bi-lock me-2" aria-hidden="true"></i>
              Запишитесь, чтобы получить доступ к материалам.
            </div>
            <div v-else class="list-group list-group-flush">
              <a href="#" class="list-group-item list-group-item-action d-flex align-items-center gap-3 px-0 border-bottom">
                <i class="bi bi-file-earmark-pdf text-danger" style="font-size:1.5rem;" aria-hidden="true"></i>
                <div>
                  <p class="mb-0 small fw-semibold">Конспект: {{ course.title }}</p>
                  <p class="mb-0 text-muted" style="font-size:.75rem;">PDF · 1.2 МБ</p>
                </div>
                <i class="bi bi-download ms-auto text-muted" aria-hidden="true"></i>
              </a>
              <a href="#" class="list-group-item list-group-item-action d-flex align-items-center gap-3 px-0">
                <i class="bi bi-file-earmark-code text-primary" style="font-size:1.5rem;" aria-hidden="true"></i>
                <div>
                  <p class="mb-0 small fw-semibold">Примеры кода</p>
                  <p class="mb-0 text-muted" style="font-size:.75rem;">ZIP · 45 КБ</p>
                </div>
                <i class="bi bi-download ms-auto text-muted" aria-hidden="true"></i>
              </a>
            </div>
          </div>

          <!-- Обсуждения -->
          <div v-if="tab === 'discuss'">
            <h5 class="fw-bold mb-3">Обсуждения</h5>
            <button class="btn btn-primary mb-3" @click="showPostModal = true">
              <i class="bi bi-plus me-1" aria-hidden="true"></i>Новая тема
            </button>

            <div v-if="discussions.length === 0" class="text-muted small">Обсуждений пока нет.</div>
            <div v-for="d in discussions" :key="d.id" class="card border-0 shadow-sm mb-3">
              <div class="card-body d-flex gap-3">
                <div class="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0"
                  style="width:36px;height:36px;font-weight:700;" aria-hidden="true">
                  {{ d.authorName?.charAt(0) }}
                </div>
                <div>
                  <p class="mb-1 fw-semibold small">{{ d.authorName }}
                    <span class="text-muted fw-normal">· {{ d.createdAt }}</span></p>
                  <p class="mb-1 fw-semibold small">{{ d.title }}</p>
                  <p class="mb-0 small text-muted">{{ d.message }}</p>
                </div>
              </div>
            </div>

            <!-- Форма новой темы (inline вместо модалки Bootstrap) -->
            <div v-if="showPostModal" class="card border-0 shadow-sm p-3 mt-3">
              <h6 class="fw-bold mb-3">Новая тема</h6>
              <div class="mb-2">
                <input type="text" class="form-control" v-model="postTitle" placeholder="Заголовок" />
              </div>
              <div class="mb-3">
                <textarea class="form-control" rows="3" v-model="postMessage" placeholder="Сообщение..."></textarea>
              </div>
              <div v-if="postError" class="alert alert-danger py-2 mb-2">Заполните все поля.</div>
              <div class="d-flex gap-2">
                <button class="btn btn-secondary btn-sm" @click="showPostModal = false">Отмена</button>
                <button class="btn btn-primary btn-sm" @click="submitPost">Опубликовать</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Сайдбар -->
        <div class="col-12 col-lg-4">
          <div class="card border-0 shadow-sm sticky-top" style="top:80px;">
            <div class="card-body">
              <div class="text-center mb-3">
                <span :class="course.price === 0 ? 'fw-bold fs-4 text-success' : 'fw-bold fs-4'">
                  {{ course.price === 0 ? 'Бесплатно' : course.price.toLocaleString('ru') + ' ₽' }}
                </span>
              </div>

              <button v-if="currentEnrollment" class="btn btn-success w-100 mb-3" disabled>
                <i class="bi bi-check-circle me-2" aria-hidden="true"></i>Вы записаны
              </button>
              <button v-else class="btn btn-primary w-100 mb-3" @click="enroll" :disabled="enrollLoading">
                <span v-if="enrollLoading" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                Записаться на курс
              </button>

              <ul class="list-unstyled small text-muted">
                <li class="mb-2"><i class="bi bi-play-circle me-2 text-primary" aria-hidden="true"></i>{{ course.lessons }} видеоуроков</li>
                <li class="mb-2"><i class="bi bi-clock me-2 text-primary" aria-hidden="true"></i>{{ course.hours }} часов</li>
                <li class="mb-2"><i class="bi bi-infinity me-2 text-primary" aria-hidden="true"></i>Бессрочный доступ</li>
                <li class="mb-2"><i class="bi bi-award me-2 text-primary" aria-hidden="true"></i>Сертификат</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="text-center py-5">
      <p class="text-muted">Курс не найден.</p>
      <router-link to="/courses" class="btn btn-primary btn-sm">К каталогу</router-link>
    </div>

    <!-- Модалка задания -->
    <div v-if="activeTask" class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,.5);">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0">
          <div class="modal-header border-0">
            <h5 class="modal-title fw-bold">{{ activeTask.title }}</h5>
            <button type="button" class="btn-close" @click="activeTask = null" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body">
            <div class="bg-light rounded p-3 mb-3">
              <p class="mb-0">{{ activeTask.description }}</p>
            </div>

            <!-- Не сдано -->
            <template v-if="!taskStateMap[activeTask.id]">
              <label class="form-label fw-semibold">Ваш ответ</label>
              <textarea class="form-control mb-3" rows="4" v-model="taskAnswer" placeholder="Напишите ответ..."></textarea>
              <input type="file" class="form-control mb-3" @change="taskFile = $event.target.files[0]" />
              <div v-if="taskAnswerError" class="alert alert-danger py-2">Заполните ответ или прикрепите файл.</div>
            </template>

            <!-- На проверке -->
            <div v-else-if="!taskStateMap[activeTask.id].reviewed" class="text-center py-3">
              <i class="bi bi-clock-history text-warning" style="font-size:2.5rem;" aria-hidden="true"></i>
              <p class="fw-semibold mt-2 mb-1">Ответ отправлен, ожидает проверки</p>
              <p class="text-muted small">{{ taskStateMap[activeTask.id].answer }}</p>
            </div>

            <!-- Принято -->
            <div v-else-if="taskStateMap[activeTask.id].result === 'accepted'" class="text-center py-3">
              <i class="bi bi-check-circle-fill text-success" style="font-size:2.5rem;" aria-hidden="true"></i>
              <p class="fw-semibold mt-2 text-success">Задание принято преподавателем!</p>
            </div>

            <!-- На доработку -->
            <template v-else>
              <div class="alert alert-danger py-2 mb-3">
                <strong>На доработку.</strong> Предыдущий ответ: {{ taskStateMap[activeTask.id].answer }}
              </div>
              <label class="form-label fw-semibold">Новый ответ</label>
              <textarea class="form-control mb-3" rows="4" v-model="taskAnswer" placeholder="Переработайте ответ..."></textarea>
            </template>
          </div>
          <div class="modal-footer border-0">
            <button class="btn btn-secondary" @click="activeTask = null">Закрыть</button>
            <button v-if="canSubmitTask" class="btn btn-primary" @click="submitTask">
              {{ taskStateMap[activeTask.id]?.result === 'rejected' ? 'Отправить повторно' : 'Отправить решение' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </base-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute }  from 'vue-router'
import { storeToRefs } from 'pinia'
import useAuthStore  from '@/stores/auth'
import { coursesApi, enrollmentsApi, tasksApi, completedTasksApi, discussionsApi } from '@/api'
import { useLoading } from '@/composables/useLoading'
import BaseLayout from '@/layouts/BaseLayout.vue'

const route    = useRoute()
const courseId = route.params.id
const { user, isLoggedIn } = storeToRefs(useAuthStore())

const course           = ref(null)
const currentEnrollment = ref(null)
const allTasks         = ref([])
const taskStateMap     = ref({})   // { ctId, reviewed, result, answer }
const discussions      = ref([])
const tab              = ref('content')
const playing          = ref(false)

// Задание
const activeTask     = ref(null)
const taskAnswer     = ref('')
const taskFile       = ref(null)
const taskAnswerError = ref(false)

// Обсуждения
const showPostModal = ref(false)
const postTitle     = ref('')
const postMessage   = ref('')
const postError     = ref(false)

const { loading, withLoading } = useLoading()
const { loading: enrollLoading, withLoading: withEnrollLoading } = useLoading()

// Вычисляемые из taskStateMap
const acceptedCount = computed(() =>
  Object.values(taskStateMap.value).filter(s => s.result === 'accepted').length
)
const pendingCount = computed(() =>
  Object.values(taskStateMap.value).filter(s => !s.reviewed).length
)
const progressPct = computed(() =>
  allTasks.value.length > 0 ? Math.round((acceptedCount.value / allTasks.value.length) * 100) : 0
)

// Сгруппированные задания по урокам
const tasksByLesson = computed(() => {
  const map = {}
  allTasks.value.forEach(t => {
    if (!map[t.lesson]) map[t.lesson] = []
    map[t.lesson].push(t)
  })
  return map
})

function lessonAllAccepted(tasks) {
  return tasks.every(t => taskStateMap.value[t.id]?.result === 'accepted')
}

function taskIcon(taskId) {
  const s = taskStateMap.value[taskId]
  if (!s) return 'bi-circle text-muted'
  if (!s.reviewed) return 'bi-clock-history text-warning'
  if (s.result === 'accepted') return 'bi-check-circle-fill text-success'
  return 'bi-x-circle-fill text-danger'
}

function taskBtnText(taskId) {
  const s = taskStateMap.value[taskId]
  if (!s) return 'Открыть'
  if (!s.reviewed) return 'На проверке'
  if (s.result === 'accepted') return 'Просмотр'
  return 'Переотправить'
}

function taskBtnClass(taskId) {
  const s = taskStateMap.value[taskId]
  if (!s) return 'btn-outline-primary'
  if (!s.reviewed) return 'btn-warning disabled'
  if (s.result === 'accepted') return 'btn-outline-secondary'
  return 'btn-outline-danger'
}

const canSubmitTask = computed(() => {
  if (!activeTask.value) return false
  const s = taskStateMap.value[activeTask.value.id]
  return !s || s.result === 'rejected'
})

async function loadPage() {
  const [courseRes, tasksRes, enrollRes, discussRes] = await Promise.all([
    coursesApi.getById(courseId),
    tasksApi.getAll(),
    enrollmentsApi.getAll(),
    discussionsApi.getAll()
  ])
  course.value = courseRes.data
  allTasks.value = tasksRes.data.filter(t => String(t.courseId) === String(courseId))
  discussions.value = discussRes.data.filter(d => String(d.courseId) === String(courseId))

  if (isLoggedIn.value) {
    const all = enrollRes.data
    currentEnrollment.value = all.find(
      e => String(e.userId) === String(user.value?.id) && String(e.courseId) === String(courseId)
    ) || null

    if (currentEnrollment.value) {
      const ctRes = await completedTasksApi.getAll()
      taskStateMap.value = {}
      ctRes.data
        .filter(d => String(d.userId) === String(user.value?.id) && String(d.courseId) === String(courseId))
        .forEach(d => {
          taskStateMap.value[d.taskId] = { ctId: d.id, reviewed: d.reviewed, result: d.result, answer: d.answer }
        })
    }
  }
}

async function enroll() {
  if (!isLoggedIn.value) { return }
  await withEnrollLoading(async () => {
    const res = await enrollmentsApi.create({
      userId: String(user.value.id), courseId: String(courseId), progress: 0, status: 'active'
    })
    currentEnrollment.value = res.data
  })
}

function openTask(task) {
  activeTask.value   = task
  taskAnswer.value   = ''
  taskFile.value     = null
  taskAnswerError.value = false
}

async function submitTask() {
  if (!taskAnswer.value && !taskFile.value) { taskAnswerError.value = true; return }
  taskAnswerError.value = false
  const prev = taskStateMap.value[activeTask.value.id]
  if (prev?.ctId) await completedTasksApi.remove(prev.ctId)

  const res = await completedTasksApi.create({
    userId: String(user.value.id), courseId: String(courseId),
    taskId: activeTask.value.id,
    answer: taskAnswer.value || '(файл)',
    reviewed: false, result: null,
    createdAt: new Date().toISOString().slice(0, 10)
  })
  taskStateMap.value[activeTask.value.id] = { ctId: res.data.id, reviewed: false, result: null, answer: taskAnswer.value || '(файл)' }
  activeTask.value = null
}

async function submitPost() {
  if (!postTitle.value.trim() || !postMessage.value.trim()) { postError.value = true; return }
  postError.value = false
  await discussionsApi.create({
    courseId: String(courseId),
    userId:   String(user.value?.id) || '0',
    authorName: `${user.value?.firstName || ''} ${user.value?.lastName || ''}`.trim(),
    title: postTitle.value, message: postMessage.value,
    createdAt: new Date().toISOString().slice(0, 10)
  })
  postTitle.value = ''
  postMessage.value = ''
  showPostModal.value = false
  const res = await discussionsApi.getAll()
  discussions.value = res.data.filter(d => String(d.courseId) === String(courseId))
}

onMounted(() => withLoading(loadPage))
</script>
