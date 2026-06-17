<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getCourseById, addEnrollment, getEnrollments } from '../api/api'
import { useAuth } from '../composables/useAuth'

const route = useRoute()
const { currentUser } = useAuth()

const course = ref(null)
const loading = ref(false)
const error = ref('')
const success = ref('')
const alreadyEnrolled = ref(false)

const loadCourse = async () => {
  try {
    loading.value = true

    course.value = await getCourseById(route.params.id)

    if (currentUser.value) {
      const enrollments = await getEnrollments()

      alreadyEnrolled.value = enrollments.some(enrollment => {
        return (
          enrollment.userId === currentUser.value.id &&
          enrollment.courseId === course.value.id
        )
      })
    }
  } catch (err) {
    error.value = 'Ошибка загрузки курса'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const enrollCourse = async () => {
  if (!currentUser.value) {
    error.value = 'Сначала войдите в аккаунт'
    return
  }

  try {
    await addEnrollment({
      userId: currentUser.value.id,
      courseId: course.value.id,
      progress: 0
    })

    alreadyEnrolled.value = true
    success.value = 'Вы успешно записались на курс'
  } catch (err) {
    error.value = 'Ошибка записи на курс'
    console.error(err)
  }
}

onMounted(loadCourse)
</script>

<template>
  <div class="container mt-5">
    <p v-if="loading">Загрузка...</p>
    <p v-if="error" class="text-danger">{{ error }}</p>
    <p v-if="success" class="text-success">{{ success }}</p>

    <div v-if="course" class="card">
      <img
        v-if="course.image"
        :src="course.image"
        class="card-img-top"
        style="max-height: 350px; object-fit: cover;"
        :alt="course.title"
      >

      <div class="card-body">
        <h1>{{ course.title }}</h1>
        <p>{{ course.description }}</p>

        <p><strong>Язык:</strong> {{ course.category }}</p>
        <p><strong>Уровень:</strong> {{ course.level }}</p>
        <p><strong>Длительность:</strong> {{ course.duration }}</p>
        <p><strong>Цена:</strong> {{ course.price }} ₽</p>

        <button
          v-if="!alreadyEnrolled"
          class="btn btn-primary me-2"
          @click="enrollCourse"
        >
          Записаться на курс
        </button>

        <button v-else class="btn btn-success me-2" disabled>
          Вы уже записаны
        </button>

        <RouterLink to="/courses" class="btn btn-secondary">
          Назад к курсам
        </RouterLink>
      </div>
    </div>
  </div>
</template>