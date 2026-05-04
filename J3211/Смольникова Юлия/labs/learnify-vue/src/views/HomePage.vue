<template>
  <div class="page-with-footer">
    <NavBar />
    <a href="#main-content" class="skip-link">Перейти к основному содержимому</a>

    <section class="hero" aria-label="Баннер каталога курсов">
      <div class="container text-center">
        <h1 class="display-5 fw-bold mb-3">Каталог онлайн-курсов</h1>
        <p class="lead mb-0">
          Учитесь программированию, дизайну и веб-разработке в удобном формате.
        </p>
      </div>
    </section>

    <main class="container my-5" id="main-content" tabindex="-1">
      <section class="catalog-section">
        <div class="section-header mb-3">
          <div>
            <h2 class="section-title mb-1">Найти курс</h2>
          </div>
        </div>

        <form @submit.prevent="applyFilters" class="filter-card row g-3 mb-4">
          <div class="col-md-3">
            <label for="filter-search" class="form-label">Поиск</label>
            <input type="text" id="filter-search" class="form-control" placeholder="Название курса" v-model="filters.search" />
          </div>
          <div class="col-md-3">
            <label for="filter-subject" class="form-label">Предмет</label>
            <select id="filter-subject" class="form-select" v-model="filters.subject">
              <option value="">Все</option>
              <option value="Веб-разработка">Веб-разработка</option>
              <option value="Программирование">Программирование</option>
              <option value="Дизайн">Дизайн</option>
              <option value="Маркетинг">Маркетинг</option>
            </select>
          </div>
          <div class="col-md-3">
            <label for="filter-level" class="form-label">Уровень</label>
            <select id="filter-level" class="form-select" v-model="filters.level">
              <option value="">Все</option>
              <option value="Новичок">Новичок</option>
              <option value="Средний">Средний</option>
              <option value="Продвинутый">Продвинутый</option>
            </select>
          </div>
          <div class="col-md-3">
            <label for="filter-price" class="form-label">Максимальная цена</label>
            <input type="number" id="filter-price" class="form-control" min="0" placeholder="Например 2000" v-model.number="filters.price" />
          </div>
          <div class="col-12 d-flex justify-content-end gap-2">
            <button type="submit" class="btn btn-primary-custom">Найти</button>
            <button type="button" class="btn btn-outline-custom" @click="resetFilters">Сбросить</button>
          </div>
        </form>

        <div class="section-header mb-3">
          <div>
            <h2 class="section-title mb-1">Все курсы</h2>
          </div>
        </div>

        <div v-if="store.loading" class="col-12 text-center my-5 py-5">
          <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Загрузка...</span></div>
          <p class="mt-3 text-muted">Загрузка каталога курсов...</p>
        </div>

        <div v-else-if="store.error" class="col-12">
          <div class="alert alert-danger text-center p-4" role="alert">
            <h5>Не удалось загрузить курсы</h5>
            <p class="mb-3">{{ store.error }}</p>
            <button class="btn btn-outline-custom btn-sm" @click="loadCourses">Повторить попытку</button>
          </div>
        </div>

        <div v-else class="row g-4" id="courseList">
          <div v-if="filteredCourses.length === 0" class="col-12">
            <div class="card text-center p-5">
              <h3>Курсы не найдены</h3>
              <p class="text-muted">Попробуйте изменить фильтры</p>
            </div>
          </div>
          <CourseCard
            v-for="course in paginatedCourses"
            :key="course.id"
            :course="course"
            @enroll="handleEnroll"
          />
        </div>

        <nav v-if="totalPages > 1" class="mt-4" aria-label="Пагинация каталога">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="currentPage--" aria-label="Назад">Назад</a>
            </li>
            <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
              <a class="page-link" href="#" @click.prevent="currentPage = page">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="currentPage++" aria-label="Вперёд">Вперёд</a>
            </li>
          </ul>
        </nav>
      </section>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import NavBar from '@/components/NavBar.vue'
import AppFooter from '@/components/AppFooter.vue'
import CourseCard from '@/components/CourseCard.vue'
import { useCoursesStore } from '@/stores/courses'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const store = useCoursesStore()
const auth = useAuthStore()
const router = useRouter()

const coursesPerPage = 6
const currentPage = ref(1)
const activeFilters = ref(false)

const filters = ref({
  search: '',
  subject: '',
  level: '',
  price: null
})

const allCourses = computed(() => store.allCourses)

const filteredCourses = computed(() => {
  if (!activeFilters.value) return allCourses.value

  return allCourses.value.filter(course => {
    const matchSearch = !filters.value.search ||
      (course.title + (course.desc || '')).toLowerCase().includes(filters.value.search.toLowerCase())
    const matchSubject = !filters.value.subject || course.subject === filters.value.subject
    const matchLevel = !filters.value.level || course.level === filters.value.level
    const matchPrice = (course.price || 0) <= (filters.value.price || Infinity)
    return matchSearch && matchSubject && matchLevel && matchPrice
  })
})

const totalPages = computed(() => Math.ceil(filteredCourses.value.length / coursesPerPage))

const paginatedCourses = computed(() => {
  const start = (currentPage.value - 1) * coursesPerPage
  return filteredCourses.value.slice(start, start + coursesPerPage)
})

function applyFilters() {
  activeFilters.value = true
  currentPage.value = 1
}

function resetFilters() {
  filters.value = { search: '', subject: '', level: '', price: null }
  activeFilters.value = false
  currentPage.value = 1
}

async function handleEnroll(course) {
  if (!auth.isAuthenticated) {
    alert('Сначала войдите в аккаунт')
    return
  }
  if (!auth.user?.id) {
    alert('Данные пользователя загружаются. Попробуйте ещё раз.')
    return
  }
  if (course.price > 0) {
    alert(`Этот курс платный (${course.price} ₽). Модуль оплаты временно недоступен.`)
    return
  }
  try {
    const alreadyEnrolled = await store.checkEnrollment(auth.user.id, course.id)
    if (alreadyEnrolled) {
      alert('Вы уже записаны на этот курс!')
      return
    }
    await store.enroll({
      userId: auth.user.id,
      courseId: course.id,
      progress: 0,
      completed: false,
      enrolledAt: new Date().toISOString()
    })
    alert('Вы успешно записались на курс!')
    router.push('/dashboard')
  } catch (err) {
    alert('Ошибка записи: ' + err.message)
  }
}

async function loadCourses() {
  await store.loadCourses()
}

onMounted(() => {
  loadCourses()
})
</script>