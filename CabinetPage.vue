<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { getCourses, getEnrollments } from '../api/api'

const router = useRouter()
const { currentUser, logout } = useAuth()

const courses = ref([])
const enrollments = ref([])
const loading = ref(false)

const handleLogout = () => {
  logout()
  router.push('/login')
}

const loadCabinetData = async () => {
  if (!currentUser.value) return

  try {
    loading.value = true
    courses.value = await getCourses()
    enrollments.value = await getEnrollments()
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const myCourses = computed(() => {
  if (!currentUser.value) return []

  const userEnrollments = enrollments.value.filter(enrollment => {
    return enrollment.userId === currentUser.value.id
  })

  return userEnrollments
    .map(enrollment => {
      const course = courses.value.find(course => course.id === enrollment.courseId)

      if (!course) return null

      return {
        ...course,
        progress: enrollment.progress
      }
    })
    .filter(Boolean)
})

onMounted(loadCabinetData)
</script>

<template>
  <div class="container mt-5">
    <h2 class="mb-4">Личный кабинет</h2>

    <div v-if="currentUser">
      <div class="card mb-4">
        <div class="card-body">
          <p><strong>Имя:</strong> {{ currentUser.name }}</p>
          <p><strong>Email:</strong> {{ currentUser.email }}</p>

          <button class="btn btn-danger mt-3" @click="handleLogout">
            Выйти
          </button>
        </div>
      </div>

      <h3 class="mb-3">Мои курсы</h3>

      <p v-if="loading">Загрузка...</p>

      <div v-if="!loading && myCourses.length" class="row g-4">
        <div
          v-for="course in myCourses"
          :key="course.id"
          class="col-md-4"
        >
          <div class="card h-100 shadow-sm">
            <img
              v-if="course.image"
              :src="course.image"
              class="card-img-top"
              style="height: 180px; object-fit: cover;"
              :alt="course.title"
            >

            <div class="card-body d-flex flex-column">
              <h5>{{ course.title }}</h5>
              <p>{{ course.description }}</p>

              <p>
                <strong>Прогресс:</strong> {{ course.progress }}%
              </p>

              <RouterLink
                :to="`/courses/${course.id}`"
                class="btn btn-primary mt-auto"
              >
                Перейти к курсу
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <p v-if="!loading && myCourses.length === 0">
        Вы пока не записаны ни на один курс.
      </p>
    </div>

    <div v-else>
      <p>Вы не авторизованы.</p>
      <RouterLink to="/login" class="btn btn-primary">
        Войти
      </RouterLink>
    </div>
  </div>
</template>