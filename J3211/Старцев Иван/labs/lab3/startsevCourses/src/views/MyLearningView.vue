<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import api from '@/api/api'
import { useAuth } from '@/composables/useAuth'

const { requireAuth } = useAuth()

const searchInput = ref('')
const learningCourses = ref([])
const filteredCourses = ref([])

const emptyState = ref({
  visible: false,
  text: 'Курсы не найдены.',
  type: 'secondary',
})

const getCourseRating = (course) => {
  if (!course.comments.length) {
    return 0
  }

  const total = course.comments.reduce((sum, comment) => sum + comment.rating, 0)
  return total / course.comments.length
}

const render = () => {
  filteredCourses.value = learningCourses.value.filter((course) =>
    course.title.toLowerCase().includes(searchInput.value.trim().toLowerCase()),
  )

  emptyState.value = {
    visible: filteredCourses.value.length === 0,
    text: 'Курсы не найдены.',
    type: 'secondary',
  }
}

const handleSearchSubmit = () => {
  render()
}

const init = async () => {
  const user = await requireAuth()

  if (!user) {
    return
  }

  const courses = await api.getCourses()
  learningCourses.value = courses.filter((course) => user.learningCourseIds.includes(course.id))
  render()
}

onMounted(async () => {
  document.title = 'Моё обучение'

  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', 'Ваши активные курсы.')
  }

  try {
    await init()
  } catch {
    emptyState.value = {
      visible: true,
      text: 'Не удалось загрузить информацию.',
      type: 'danger',
    }
  }
})
</script>

<template>
  <main class="container pt-2 pb-4">
    <h1 class="h3 mb-3">Моё обучение</h1>

    <form id="searchForm" role="search" class="input-group mb-3" @submit.prevent="handleSearchSubmit">
      <label for="searchInput" class="visually-hidden">Поиск курса по названию</label>
      <input
        id="searchInput"
        v-model="searchInput"
        type="search"
        class="form-control"
        placeholder="Введите название курса"
      >
      <button class="btn btn-primary" type="submit">
        <svg class="default_svg" aria-hidden="true">
          <use href="/sprites.svg#lupa"></use>
        </svg>
        Искать
      </button>
    </form>

    <div
      v-if="emptyState.visible"
      :class="`alert alert-${emptyState.type}`"
      role="alert"
    >
      {{ emptyState.text }}
    </div>

    <ul id="learningCoursesContainer" class="row g-3 list-unstyled">
      <li
        v-for="course in filteredCourses"
        :key="course.id"
        class="col-12 col-md-6 col-xl-4"
      >
        <article class="card h-100">
          <img :src="course.image" class="card-img-top" :alt="course.title">

          <div class="card-body d-flex flex-column">
            <h2 class="card-title">{{ course.title }}</h2>
            <p class="card-text text-muted small mb-1">{{ course.description }}</p>

            <p class="card-text mb-2">
              <svg class="rating__star" aria-hidden="true">
                <use href="/sprites.svg#ratingStar"></use>
              </svg>
              {{ getCourseRating(course).toFixed(1) }} / 5
            </p>

            <div class="mt-auto">
              <RouterLink
                :to="{ name: 'lesson', params: { id: course.id } }"
                class="btn btn-success btn-sm"
              >
                Продолжить
              </RouterLink>

              <RouterLink
                :to="{ name: 'course', params: { id: course.id } }"
                class="btn btn-outline-primary btn-sm ms-1"
              >
                О курсе
              </RouterLink>
            </div>
          </div>
        </article>
      </li>
    </ul>
  </main>
</template>
