<template>
  <div class="container py-4">
    <h2 class="fw-bold mb-1">Кабинет преподавателя</h2>
    <p class="text-muted mb-4">Управляйте своими курсами</p>

    <div class="row g-4">
      <!-- Create Course Form -->
      <div class="col-lg-4">
        <div class="card shadow-sm p-3">
          <h5 class="fw-bold mb-3">Создать курс</h5>
          <div v-if="createError" class="alert alert-danger py-2 small">{{ createError }}</div>
          <div v-if="createSuccess" class="alert alert-success py-2 small">{{ createSuccess }}</div>

          <form @submit.prevent="handleCreate">
            <div class="mb-2">
              <label class="form-label small">Название</label>
              <input v-model="form.title" type="text" class="form-control form-control-sm" required />
            </div>
            <div class="mb-2">
              <label class="form-label small">Описание</label>
              <textarea v-model="form.description" class="form-control form-control-sm" rows="3" required></textarea>
            </div>
            <div class="mb-2">
              <label class="form-label small">Категория</label>
              <select v-model="form.category" class="form-select form-select-sm">
                <option value="programming">Программирование</option>
                <option value="design">Дизайн</option>
                <option value="data">Data Science</option>
              </select>
            </div>
            <div class="mb-2">
              <label class="form-label small">Уровень</label>
              <select v-model="form.level" class="form-select form-select-sm">
                <option value="beginner">Начинающий</option>
                <option value="intermediate">Средний</option>
                <option value="advanced">Продвинутый</option>
              </select>
            </div>
            <div class="row mb-2 g-2">
              <div class="col-6">
                <label class="form-label small">Тип цены</label>
                <select v-model="form.priceType" class="form-select form-select-sm">
                  <option value="free">Бесплатно</option>
                  <option value="paid">Платный</option>
                </select>
              </div>
              <div class="col-6">
                <label class="form-label small">Цена (₽)</label>
                <input v-model.number="form.price" type="number" min="0" class="form-control form-control-sm" :disabled="form.priceType === 'free'" />
              </div>
            </div>
            <div class="row mb-3 g-2">
              <div class="col-6">
                <label class="form-label small">Длительность</label>
                <input v-model="form.duration" type="text" class="form-control form-control-sm" placeholder="10 часов" />
              </div>
              <div class="col-6">
                <label class="form-label small">Кол-во уроков</label>
                <input v-model.number="form.lessonsCount" type="number" min="1" class="form-control form-control-sm" />
              </div>
            </div>
            <button class="btn btn-warning w-100 btn-sm fw-bold" type="submit" :disabled="creating">
              <span v-if="creating" class="spinner-border spinner-border-sm me-1"></span>
              Создать курс
            </button>
          </form>
        </div>
      </div>

      <!-- My Courses -->
      <div class="col-lg-8">
        <h5 class="fw-bold mb-3">Мои курсы</h5>
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border text-warning"></div>
        </div>
        <div v-else-if="courses.length === 0" class="text-center text-muted py-5">
          <i class="bi bi-journal-plus fs-1 d-block mb-2"></i>
          У вас пока нет курсов. Создайте первый!
        </div>
        <div v-else class="d-flex flex-column gap-3">
          <div v-for="course in courses" :key="course.id" class="card shadow-sm">
            <div class="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 class="fw-semibold mb-1">{{ course.title }}</h6>
                <div class="d-flex gap-2 small text-muted">
                  <span><i class="bi bi-people"></i> {{ course.studentsCount }}</span>
                  <span><i class="bi bi-star-fill text-warning"></i> {{ course.rating.toFixed(1) }}</span>
                  <span class="badge" :class="course.priceType === 'free' ? 'bg-success' : 'bg-primary'">
                    {{ course.priceType === 'free' ? 'Бесплатно' : `${course.price} ₽` }}
                  </span>
                </div>
              </div>
              <RouterLink :to="`/courses/${course.id}`" class="btn btn-outline-warning btn-sm">
                Просмотр
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useApi } from '@/composables/useApi'

const auth = useAuthStore()
const { get, post } = useApi()

const courses = ref([])
const loading = ref(false)
const creating = ref(false)
const createError = ref(null)
const createSuccess = ref(null)

const form = ref({
  title: '',
  description: '',
  category: 'programming',
  level: 'beginner',
  priceType: 'free',
  price: 0,
  duration: '',
  lessonsCount: 10,
})

onMounted(async () => {
  if (!auth.user) return
  loading.value = true
  try {
    courses.value = await get('/courses', { teacherId: auth.user.id })
  } finally {
    loading.value = false
  }
})

async function handleCreate() {
  if (!auth.user) return
  creating.value = true
  createError.value = null
  createSuccess.value = null
  try {
    const newCourse = await post('/courses', {
      ...form.value,
      teacherId: auth.user.id,
      teacherName: auth.user.name,
      rating: 0,
      reviewsCount: 0,
      studentsCount: 0,
      image: '',
    })
    courses.value.unshift(newCourse)
    createSuccess.value = `Курс "${newCourse.title}" создан!`
    form.value = {
      title: '',
      description: '',
      category: 'programming',
      level: 'beginner',
      priceType: 'free',
      price: 0,
      duration: '',
      lessonsCount: 10,
    }
  } catch (e) {
    createError.value = e?.response?.data?.error || 'Ошибка создания курса'
  } finally {
    creating.value = false
  }
}
</script>
