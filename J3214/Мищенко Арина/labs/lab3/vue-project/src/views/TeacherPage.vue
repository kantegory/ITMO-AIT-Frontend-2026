<template>
  <base-layout>
    <div class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-2">
      <div>
        <h4 class="fw-bold mb-0">Кабинет преподавателя</h4>
        <p class="text-muted mb-0">Управляйте своими курсами</p>
      </div>
      <button class="btn btn-primary" @click="showNewCourse = true">
        <i class="bi bi-plus-lg me-1" aria-hidden="true"></i>Новый курс
      </button>
    </div>

    <!-- Статистика -->
    <div class="row g-3 mb-4">
      <div class="col-6 col-md-3">
        <div class="card border-0 shadow-sm text-center p-3">
          <div class="fs-3 fw-bold text-primary">{{ myCourses.length }}</div>
          <div class="text-muted small">Курсов</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="card border-0 shadow-sm text-center p-3">
          <div class="fs-3 fw-bold text-success">{{ totalStudents }}</div>
          <div class="text-muted small">Студентов</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="card border-0 shadow-sm text-center p-3">
          <div class="fs-3 fw-bold text-warning">{{ avgRating }}</div>
          <div class="text-muted small">Средний рейтинг</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="card border-0 shadow-sm text-center p-3">
          <div class="fs-3 fw-bold text-info">{{ pendingSubmissions.length }}</div>
          <div class="text-muted small">На проверке</div>
        </div>
      </div>
    </div>

    <!-- Вкладки -->
    <ul class="nav nav-tabs mb-4" role="tablist">
      <li class="nav-item"><button class="nav-link" :class="{ active: tab === 'courses'  }" @click="tab = 'courses' ">Мои курсы</button></li>
      <li class="nav-item"><button class="nav-link" :class="{ active: tab === 'reviews'  }" @click="tab = 'reviews' ">Задания студентов</button></li>
      <li class="nav-item"><button class="nav-link" :class="{ active: tab === 'profile'  }" @click="tab = 'profile' ">Профиль</button></li>
    </ul>

    <!-- Мои курсы -->
    <div v-if="tab === 'courses'">
      <div v-if="loading" class="text-center py-4">
        <div class="spinner-border text-primary" role="status"></div>
      </div>
      <div v-else class="d-flex flex-column gap-3">
        <p v-if="myCourses.length === 0" class="text-muted text-center py-4">У вас пока нет курсов.</p>
        <div v-for="course in myCourses" :key="course.id" class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="row align-items-center g-3">
              <div class="col-auto">
                <div :class="`bg-${course.color || 'primary'} rounded d-flex align-items-center justify-content-center text-white`"
                  style="width:56px;height:56px;">
                  <i :class="`bi ${course.icon || 'bi-book'}`" style="font-size:1.5rem;" aria-hidden="true"></i>
                </div>
              </div>
              <div class="col">
                <div class="d-flex flex-wrap gap-2 align-items-center mb-1">
                  <h6 class="fw-bold mb-0">{{ course.title }}</h6>
                  <span class="badge" :class="course.status === 'draft' ? 'bg-warning-subtle text-warning' : 'bg-success-subtle text-success'">
                    {{ course.status === 'draft' ? 'Черновик' : 'Опубликован' }}
                  </span>
                </div>
                <div class="d-flex flex-wrap gap-3 text-muted small">
                  <span><i class="bi bi-tag me-1" aria-hidden="true"></i>{{ course.category }}</span>
                  <span v-if="course.status === 'published'"><i class="bi bi-star me-1" aria-hidden="true"></i>{{ course.rating || '—' }}</span>
                </div>
              </div>
              <div class="col-auto d-flex gap-2 flex-wrap">
                <button v-if="course.status === 'draft'" class="btn btn-success btn-sm" @click="publishCourse(course.id)">Опубликовать</button>
                <button class="btn btn-outline-primary btn-sm" @click="openEdit(course)"><i class="bi bi-pencil" aria-hidden="true"></i></button>
                <button class="btn btn-outline-secondary btn-sm" @click="openTasksModal(course)">
                  <i class="bi bi-list-check me-1" aria-hidden="true"></i>Задания
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Задания студентов -->
    <div v-if="tab === 'reviews'">
      <div v-if="pendingSubmissions.length === 0" class="text-muted text-center py-4">
        Нет заданий, ожидающих проверки.
      </div>
      <div v-else class="d-flex flex-column gap-3">
        <div v-for="sub in pendingSubmissions" :key="sub.ct.id" class="card border-0 shadow-sm">
          <div class="card-body d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <p class="fw-semibold mb-1 small">{{ sub.studentName }} — {{ sub.taskTitle }}</p>
              <p class="text-muted small mb-1">Курс: {{ sub.courseTitle }} · Сдано: {{ sub.ct.createdAt }}</p>
              <p class="small mb-0 text-truncate" style="max-width:400px;">
                <i class="bi bi-chat-quote me-1 text-muted" aria-hidden="true"></i>{{ sub.ct.answer }}
              </p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-success btn-sm" @click="reviewTask(sub.ct, 'accepted')">Принять</button>
              <button class="btn btn-outline-danger btn-sm" @click="reviewTask(sub.ct, 'rejected')">На доработку</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Профиль -->
    <div v-if="tab === 'profile'">
      <div class="row justify-content-center">
        <div class="col-12 col-md-6">
          <div class="card border-0 shadow-sm p-4">
            <div class="text-center mb-4">
              <div class="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center text-white mb-3"
                style="width:80px;height:80px;font-size:2rem;" aria-hidden="true">
                {{ user?.firstName?.charAt(0)?.toUpperCase() }}
              </div>
              <h5 class="fw-bold mb-0">{{ user?.firstName }} {{ user?.lastName }}</h5>
              <p class="text-muted small">Преподаватель</p>
            </div>
            <div class="d-flex flex-column gap-3">
              <div>
                <label for="tFirst" class="form-label">Имя</label>
                <input id="tFirst" type="text" class="form-control" v-model="profFirst" />
              </div>
              <div>
                <label for="tLast" class="form-label">Фамилия</label>
                <input id="tLast" type="text" class="form-control" v-model="profLast" />
              </div>
              <div v-if="profSaved" class="alert alert-success py-2">Изменения сохранены!</div>
              <button class="btn btn-primary w-100" @click="saveProfile">Сохранить</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модалка нового курса -->
    <div v-if="showNewCourse" class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,.5);">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0">
          <div class="modal-header border-0">
            <h5 class="modal-title fw-bold">{{ editingCourse ? 'Редактировать курс' : 'Создать новый курс' }}</h5>
            <button type="button" class="btn-close" @click="closeNewCourse" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Название курса <span class="text-danger">*</span></label>
              <input type="text" class="form-control" v-model="newCourseTitle" placeholder="Например: Основы Python" />
            </div>
            <div class="mb-3">
              <label class="form-label">Описание</label>
              <textarea class="form-control" rows="2" v-model="newCourseDesc"></textarea>
            </div>
            <div class="row g-3">
              <div class="col-md-4">
                <label class="form-label">Категория</label>
                <select class="form-select" v-model="newCourseCategory">
                  <option v-for="c in ['Разработка','Дизайн','Данные','Бизнес']" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label">Уровень</label>
                <select class="form-select" v-model="newCourseLevel">
                  <option v-for="l in ['Начинающий','Средний','Продвинутый']" :key="l" :value="l">{{ l }}</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label">Цена (₽)</label>
                <input type="number" class="form-control" v-model.number="newCoursePrice" min="0" placeholder="0 = бесплатно" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Количество уроков</label>
                <input type="number" class="form-control" v-model.number="newCourseLessons" min="0" placeholder="Например: 24" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Длительность (часов)</label>
                <input type="number" class="form-control" v-model.number="newCourseHours" min="0" placeholder="Например: 12" />
              </div>
            </div>
            <div v-if="newCourseError" class="alert alert-danger mt-3 py-2">Введите название курса.</div>
          </div>
          <div class="modal-footer border-0">
            <button class="btn btn-secondary" @click="closeNewCourse">Отмена</button>
            <template v-if="!editingCourse">
              <button class="btn btn-outline-primary" @click="createCourse('draft')">Сохранить черновик</button>
              <button class="btn btn-primary" @click="createCourse('published')">Опубликовать</button>
            </template>
            <button v-else class="btn btn-primary" @click="saveCourseEdit">Сохранить</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модалка заданий курса -->
    <div v-if="tasksModalCourse" class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,.5);">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0">
          <div class="modal-header border-0">
            <h5 class="modal-title fw-bold">Задания: {{ tasksModalCourse.title }}</h5>
            <button type="button" class="btn-close" @click="tasksModalCourse = null" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body">
            <div v-if="modalTasks.length === 0" class="text-muted small mb-3">Заданий пока нет.</div>
            <ul v-else class="list-group list-group-flush mb-3">
              <li v-for="t in modalTasks" :key="t.id" class="list-group-item d-flex align-items-start gap-2 px-0">
                <i class="bi bi-check2-square text-primary mt-1" aria-hidden="true"></i>
                <div>
                  <p class="mb-0 small fw-semibold">{{ t.title }} <span class="text-muted fw-normal">— {{ t.lesson }}</span></p>
                  <p class="mb-0 small text-muted">{{ t.description }}</p>
                </div>
              </li>
            </ul>
            <hr />
            <h6 class="fw-semibold mb-3">Добавить задание</h6>
            <div class="mb-2">
              <label class="form-label">Урок</label>
              <input type="text" class="form-control form-control-sm" v-model="newTaskLesson" placeholder="Например: Урок 1" />
            </div>
            <div class="mb-2">
              <label class="form-label">Название задания</label>
              <input type="text" class="form-control form-control-sm" v-model="newTaskTitle" placeholder="Задание 1" />
            </div>
            <div class="mb-3">
              <label class="form-label">Описание</label>
              <textarea class="form-control form-control-sm" rows="3" v-model="newTaskDesc" placeholder="Что должен сделать студент..."></textarea>
            </div>
            <div v-if="newTaskError" class="alert alert-danger py-2 mb-2">Заполните все поля.</div>
          </div>
          <div class="modal-footer border-0">
            <button class="btn btn-secondary" @click="tasksModalCourse = null">Закрыть</button>
            <button class="btn btn-primary" @click="addTask">Добавить задание</button>
          </div>
        </div>
      </div>
    </div>
  </base-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs }   from 'pinia'
import useAuthStore      from '@/stores/auth'
import useCoursesStore   from '@/stores/courses'
import { enrollmentsApi, tasksApi, completedTasksApi, usersApi, authApi } from '@/api'
import { useLoading }    from '@/composables/useLoading'
import BaseLayout from '@/layouts/BaseLayout.vue'

const authStore   = useAuthStore()
const coursesStore = useCoursesStore()
const { user }    = storeToRefs(authStore)
const { courses } = storeToRefs(coursesStore)
const { loading, withLoading } = useLoading()

const tab = ref('courses')

// Курсы текущего преподавателя — все курсы (включая черновики)
const myCourses = computed(() =>
  courses.value.filter(c => String(c.teacherId) === String(user.value?.id))
)

// Статистика
const totalStudents = ref(0)
const avgRating = computed(() => {
  const rated = myCourses.value.filter(c => c.rating > 0 && c.status === 'published')
  return rated.length ? (rated.reduce((s, c) => s + c.rating, 0) / rated.length).toFixed(1) : '—'
})

// Задания студентов на проверке
const pendingSubmissions = ref([])

// Форма нового/редактируемого курса
const showNewCourse    = ref(false)
const editingCourse    = ref(null)
const newCourseTitle   = ref('')
const newCourseDesc    = ref('')
const newCourseCategory = ref('Разработка')
const newCourseLevel   = ref('Начинающий')
const newCoursePrice   = ref(0)
const newCourseLessons = ref(0)
const newCourseHours   = ref(0)
const newCourseError   = ref(false)

// Профиль
const profFirst  = ref(user.value?.firstName || '')
const profLast   = ref(user.value?.lastName  || '')
const profSaved  = ref(false)

// Задания курса
const tasksModalCourse = ref(null)
const modalTasks       = ref([])
const newTaskLesson    = ref('')
const newTaskTitle     = ref('')
const newTaskDesc      = ref('')
const newTaskError     = ref(false)

const colorMap = {
  'Разработка': { color: 'primary', icon: 'bi-code-slash' },
  'Дизайн':     { color: 'danger',  icon: 'bi-palette'   },
  'Данные':     { color: 'success', icon: 'bi-bar-chart-line' },
  'Бизнес':     { color: 'secondary', icon: 'bi-briefcase' }
}

async function loadAll() {
  // Загружаем все курсы (без фильтра published) — преподавателю нужны черновики тоже
  const res = await import('@/api').then(m => m.coursesApi.getAll())
  coursesStore.courses = res.data

  const [enrollRes, ctRes, tasksRes, usersRes] = await Promise.all([
    enrollmentsApi.getAll(),
    completedTasksApi.getAll(),
    tasksApi.getAll(),
    usersApi.getAll()
  ])

  const myIds = myCourses.value.map(c => String(c.id))

  // Подсчёт студентов
  const myEnrollments = enrollRes.data.filter(e => myIds.includes(String(e.courseId)))
  totalStudents.value = new Set(myEnrollments.map(e => e.userId)).size

  // Непроверенные задания студентов
  const pending = ctRes.data.filter(ct => myIds.includes(String(ct.courseId)) && !ct.reviewed)
  pendingSubmissions.value = pending.map(ct => {
    const task    = tasksRes.data.find(t => t.id === ct.taskId) || {}
    const student = usersRes.data.find(u => String(u.id) === String(ct.userId)) || {}
    const course  = myCourses.value.find(c => String(c.id) === String(ct.courseId)) || {}
    return {
      ct,
      taskTitle:    task.title    || 'Задание',
      studentName:  `${student.firstName || 'Студент'} ${student.lastName || ''}`.trim(),
      courseTitle:  course.title  || '—'
    }
  })
}

async function createCourse(status) {
  if (!newCourseTitle.value.trim()) { newCourseError.value = true; return }
  newCourseError.value = false
  const { color, icon } = colorMap[newCourseCategory.value] || { color: 'primary', icon: 'bi-book' }
  const teacherName = `${user.value.firstName?.charAt(0) || ''}. ${user.value.lastName || ''}`.trim()
  await coursesStore.createCourse({
    title: newCourseTitle.value, description: newCourseDesc.value,
    category: newCourseCategory.value, level: newCourseLevel.value,
    price: newCoursePrice.value, teacherId: String(user.value.id),
    teacher: teacherName, status,
    lessons: newCourseLessons.value, hours: newCourseHours.value, rating: 0, reviews: 0, color, icon
  })
  closeNewCourse()
}

async function publishCourse(id) {
  await coursesStore.updateCourse(id, { status: 'published' })
}

function openEdit(course) {
  editingCourse.value    = course
  newCourseTitle.value   = course.title
  newCourseDesc.value    = course.description || ''
  newCourseCategory.value = course.category
  newCourseLevel.value   = course.level
  newCoursePrice.value   = course.price || 0
  newCourseLessons.value = course.lessons || 0
  newCourseHours.value   = course.hours || 0
  showNewCourse.value    = true
}

async function saveCourseEdit() {
  await coursesStore.updateCourse(editingCourse.value.id, {
    title: newCourseTitle.value, description: newCourseDesc.value,
    category: newCourseCategory.value, level: newCourseLevel.value,
    price: newCoursePrice.value,
    lessons: newCourseLessons.value, hours: newCourseHours.value
  })
  closeNewCourse()
}

function closeNewCourse() {
  showNewCourse.value  = false
  editingCourse.value  = null
  newCourseTitle.value = ''
  newCourseDesc.value  = ''
  newCoursePrice.value = 0
  newCourseLessons.value = 0
  newCourseHours.value = 0
  newCourseError.value = false
}

async function openTasksModal(course) {
  tasksModalCourse.value = course
  const res = await tasksApi.getAll()
  modalTasks.value = res.data.filter(t => String(t.courseId) === String(course.id))
}

async function addTask() {
  if (!newTaskLesson.value.trim() || !newTaskTitle.value.trim() || !newTaskDesc.value.trim()) {
    newTaskError.value = true; return
  }
  newTaskError.value = false
  await tasksApi.create({
    courseId: String(tasksModalCourse.value.id),
    lesson: newTaskLesson.value, number: modalTasks.value.length + 1,
    title: newTaskTitle.value, description: newTaskDesc.value
  })
  newTaskLesson.value = ''
  newTaskTitle.value  = ''
  newTaskDesc.value   = ''
  const res = await tasksApi.getAll()
  modalTasks.value = res.data.filter(t => String(t.courseId) === String(tasksModalCourse.value.id))
}

async function reviewTask(ct, result) {
  // PATCH completedTask
  await completedTasksApi.update(ct.id, { reviewed: true, result })

  // Если принято — пересчитываем прогресс enrollment студента
  if (result === 'accepted') {
    const [ctAllRes, tasksAllRes, enrollAllRes] = await Promise.all([
      completedTasksApi.getAll(),
      tasksApi.getAll(),
      enrollmentsApi.getAll()
    ])
    const courseTasks   = tasksAllRes.data.filter(t => String(t.courseId) === String(ct.courseId))
    const acceptedCount = ctAllRes.data.filter(d =>
      String(d.userId) === String(ct.userId) && String(d.courseId) === String(ct.courseId) && d.result === 'accepted'
    ).length
    const pct        = courseTasks.length > 0 ? Math.round((acceptedCount / courseTasks.length) * 100) : 0
    const enrollment = enrollAllRes.data.find(e =>
      String(e.userId) === String(ct.userId) && String(e.courseId) === String(ct.courseId)
    )
    if (enrollment) {
      await enrollmentsApi.update(enrollment.id, { progress: pct, status: pct === 100 ? 'completed' : 'active' })
    }
  }

  // Убираем из списка
  pendingSubmissions.value = pendingSubmissions.value.filter(s => s.ct.id !== ct.id)
}

async function saveProfile() {
  await authStore.updateProfile(user.value.id, profFirst.value, profLast.value)
  profSaved.value = true
  setTimeout(() => { profSaved.value = false }, 2000)
}

onMounted(() => withLoading(loadAll))
</script>
