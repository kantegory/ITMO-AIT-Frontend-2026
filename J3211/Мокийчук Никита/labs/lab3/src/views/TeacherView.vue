<script setup>
import { ref, computed, onMounted } from 'vue'
import { AppAPI } from '../api/api'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'
import { useFormatters } from '../composables/useFormatters'
import TeacherCourseCard from '../components/TeacherCourseCard.vue'
import EmptyState from '../components/EmptyState.vue'

const { currentUser } = useAuth()
const { showToast } = useToast()
const { formatStudents } = useFormatters()

const courses = ref([])
const activeTab = ref('tabMyCourses')

const newCourseTitle = ref('')
const newCourseDescription = ref('')
const newCourseCategory = ref('Программирование')
const newCourseLevel = ref('Начальный')
const newCoursePrice = ref(0)

const newLessonTitle = ref('')

const totalStudents = computed(() =>
  courses.value.reduce((sum, c) => sum + Number(c.students || 0), 0)
)

const avgRating = computed(() => {
  if (!courses.value.length) return '0.0'
  const sum = courses.value.reduce((acc, c) => acc + Number(c.rating || 0), 0)
  return (sum / courses.value.length).toFixed(1)
})

const totalRevenue = computed(() =>
  courses.value.reduce(
    (sum, c) => sum + Number(c.price || 0) * Number(c.students || 0),
    0
  )
)

const subjectMap = {
  Программирование: 'programming',
  Дизайн: 'design',
  Маркетинг: 'marketing',
  Аналитика: 'analytics',
  Языки: 'languages',
  Бизнес: 'business'
}
const levelMap = {
  Начальный: 'beginner',
  Средний: 'intermediate',
  Продвинутый: 'advanced'
}

const loadCourses = async () => {
  if (!currentUser.value) return
  try {
    courses.value = await AppAPI.getTeacherCourses(currentUser.value.id)
  } catch (err) {
    showToast('Не удалось загрузить курсы', 'danger')
  }
}

const handleAddCourse = async () => {
  if (!newCourseTitle.value.trim()) {
    showToast('Введите название курса', 'danger')
    return
  }
  try {
    await AppAPI.createCourse({
      title: newCourseTitle.value.trim(),
      subject: subjectMap[newCourseCategory.value] || 'programming',
      subjectLabel: newCourseCategory.value,
      level: levelMap[newCourseLevel.value] || 'beginner',
      levelLabel: newCourseLevel.value,
      price: Number(newCoursePrice.value) || 0,
      rating: 5.0,
      reviews: 0,
      students: 0,
      durationHours: 10,
      teacherId: currentUser.value.id,
      teacherName: currentUser.value.name,
      shortDescription: newCourseDescription.value.trim() || 'Новый курс преподавателя',
      description: newCourseDescription.value.trim() || 'Описание курса будет добавлено позже',
      gradient: 'bg-gradient-1',
      icon: 'bi-mortarboard',
      isPopular: false,
      isNew: true,
      published: true
    })
    showToast('Курс создан!', 'success')
    newCourseTitle.value = ''
    newCourseDescription.value = ''
    newCoursePrice.value = 0
    await loadCourses()
  } catch (err) {
    showToast('Не удалось создать курс', 'danger')
  }
}

const handleAddLesson = async () => {
  if (!newLessonTitle.value.trim()) {
    showToast('Введите название урока', 'danger')
    return
  }
  if (!courses.value.length) {
    showToast('Сначала создайте хотя бы один курс', 'warning')
    return
  }
  try {
    await AppAPI.createLesson({
      courseId: courses.value[0].id,
      title: newLessonTitle.value.trim(),
      duration: '10:00',
      order: Date.now()
    })
    showToast('Урок добавлен!', 'success')
    newLessonTitle.value = ''
  } catch (err) {
    showToast('Не удалось добавить урок', 'danger')
  }
}

onMounted(loadCourses)
</script>

<template>
  <div class="container">
    <header class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
      <div>
        <h1 class="h3 fw-bold mb-1">Кабинет преподавателя</h1>
        <p class="text-muted mb-0">Управляйте своими курсами и отслеживайте статистику</p>
      </div>
      <div class="d-flex gap-2">
        <button
          class="btn btn-outline-primary"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#addLessonModal"
        >
          <i class="bi bi-plus-circle me-1"></i>Добавить урок
        </button>
        <button
          class="btn btn-accent"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#addCourseModal"
        >
          <svg class="svg-icon" aria-hidden="true">
            <use href="/sprite/sprite.svg#icon-plus-circle"></use>
          </svg>Создать курс
        </button>
      </div>
    </header>

    <div class="row g-3 mb-4">
      <div class="col-6 col-lg-3">
        <div class="teacher-stat-card">
          <div class="d-flex align-items-center gap-3">
            <div class="icon-wrap icon-wrap-primary"><i class="bi bi-collection-play"></i></div>
            <div>
              <div class="fw-bold stat-number-sm">{{ courses.length }}</div>
              <small class="text-muted">Курсов</small>
            </div>
          </div>
        </div>
      </div>
      <div class="col-6 col-lg-3">
        <div class="teacher-stat-card">
          <div class="d-flex align-items-center gap-3">
            <div class="icon-wrap icon-wrap-accent"><i class="bi bi-people"></i></div>
            <div>
              <div class="fw-bold stat-number-sm">{{ formatStudents(totalStudents) }}</div>
              <small class="text-muted">Студентов</small>
            </div>
          </div>
        </div>
      </div>
      <div class="col-6 col-lg-3">
        <div class="teacher-stat-card">
          <div class="d-flex align-items-center gap-3">
            <div class="icon-wrap icon-wrap-green"><i class="bi bi-currency-dollar"></i></div>
            <div>
              <div class="fw-bold stat-number-sm">{{ totalRevenue.toLocaleString('ru-RU') }} ₽</div>
              <small class="text-muted">Доход</small>
            </div>
          </div>
        </div>
      </div>
      <div class="col-6 col-lg-3">
        <div class="teacher-stat-card">
          <div class="d-flex align-items-center gap-3">
            <div class="icon-wrap icon-wrap-teal"><i class="bi bi-star"></i></div>
            <div>
              <div class="fw-bold stat-number-sm">{{ avgRating }}</div>
              <small class="text-muted">Рейтинг</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ul class="nav nav-tabs-custom mb-4" role="tablist">
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeTab === 'tabMyCourses' }"
          href="#"
          @click.prevent="activeTab = 'tabMyCourses'"
        >Мои курсы</a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeTab === 'tabStudents' }"
          href="#"
          @click.prevent="activeTab = 'tabStudents'"
        >Студенты</a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeTab === 'tabAnalytics' }"
          href="#"
          @click.prevent="activeTab = 'tabAnalytics'"
        >Аналитика</a>
      </li>
    </ul>

    <section v-show="activeTab === 'tabMyCourses'">
      <div class="row g-3">
        <TeacherCourseCard
          v-for="course in courses"
          :key="course.id"
          :course="course"
        />
        <EmptyState
          v-if="courses.length === 0"
          text="У вас пока нет созданных курсов"
        />
      </div>
    </section>

    <section v-show="activeTab === 'tabStudents'">
      <div v-if="!courses.length" class="card-custom p-4 text-center text-muted">
        У вас пока нет студентов
      </div>
      <div v-else class="card-custom p-4">
        <p class="text-muted mb-0">
          Список студентов и их прогресс будет доступен после интеграции с системой обучения.
        </p>
      </div>
    </section>

    <section v-show="activeTab === 'tabAnalytics'">
      <div v-if="!courses.length" class="card-custom p-4 text-center text-muted">
        У вас пока нет аналитики
      </div>
      <div v-else class="row g-4">
        <div class="col-md-4">
          <div class="card-custom p-4 text-center">
            <div class="fw-bold text-primary mb-2" style="font-size: 2rem;">
              {{ formatStudents(totalStudents) }}
            </div>
            <div class="text-muted">Всего студентов</div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card-custom p-4 text-center">
            <div class="fw-bold text-success mb-2" style="font-size: 2rem;">{{ avgRating }}</div>
            <div class="text-muted">Средний рейтинг</div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card-custom p-4 text-center">
            <div class="fw-bold text-primary mb-2" style="font-size: 2rem;">{{ courses.length }}</div>
            <div class="text-muted">Опубликованных курсов</div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <div class="modal fade" id="addCourseModal" tabindex="-1" aria-modal="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title h5">
            <svg class="svg-icon" aria-hidden="true">
              <use href="/sprite/sprite.svg#icon-plus-circle"></use>
            </svg>Создать новый курс
          </h2>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
        </div>
        <form @submit.prevent="handleAddCourse">
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label fw-bold" for="newCourseTitle">Название курса</label>
                <input
                  type="text"
                  class="form-control"
                  id="newCourseTitle"
                  placeholder="Например: React для продвинутых"
                  required
                  v-model="newCourseTitle"
                />
              </div>
              <div class="col-12">
                <label class="form-label fw-bold" for="newCourseDescription">Описание</label>
                <textarea
                  class="form-control"
                  id="newCourseDescription"
                  rows="3"
                  placeholder="Опишите чему научатся студенты..."
                  v-model="newCourseDescription"
                ></textarea>
              </div>
              <div class="col-md-4">
                <label class="form-label fw-bold" for="newCourseCategory">Категория</label>
                <select
                  class="form-select"
                  id="newCourseCategory"
                  v-model="newCourseCategory"
                >
                  <option>Программирование</option>
                  <option>Дизайн</option>
                  <option>Маркетинг</option>
                  <option>Аналитика</option>
                  <option>Языки</option>
                  <option>Бизнес</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label fw-bold" for="newCourseLevel">Уровень</label>
                <select class="form-select" id="newCourseLevel" v-model="newCourseLevel">
                  <option>Начальный</option>
                  <option>Средний</option>
                  <option>Продвинутый</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label fw-bold" for="newCoursePrice">Цена (₽)</label>
                <input
                  type="number"
                  class="form-control"
                  id="newCoursePrice"
                  placeholder="0 = бесплатно"
                  min="0"
                  v-model.number="newCoursePrice"
                />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Отмена</button>
            <button type="submit" class="btn btn-accent" data-bs-dismiss="modal">Создать курс</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="modal fade" id="addLessonModal" tabindex="-1" aria-modal="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title h5">Добавить урок</h2>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
        </div>
        <form @submit.prevent="handleAddLesson">
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-bold" for="newLessonTitle">Название урока</label>
              <input
                type="text"
                class="form-control"
                id="newLessonTitle"
                placeholder="Например: Введение в React Hooks"
                required
                v-model="newLessonTitle"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Отмена</button>
            <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Добавить урок</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="spacer-bottom"></div>
</template>
