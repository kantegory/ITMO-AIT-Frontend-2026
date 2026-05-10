<template>
  <div class="container py-4">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-warning"></div>
    </div>

    <div v-else-if="!course" class="text-center py-5 text-muted">
      <i class="bi bi-exclamation-circle fs-1 d-block mb-2"></i>
      Курс не найден. <RouterLink to="/courses">Вернуться к каталогу</RouterLink>
    </div>

    <template v-else>
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><RouterLink to="/">Главная</RouterLink></li>
          <li class="breadcrumb-item"><RouterLink to="/courses">Курсы</RouterLink></li>
          <li class="breadcrumb-item active">{{ course.title }}</li>
        </ol>
      </nav>

      <div class="row g-4">
        <!-- Main Content -->
        <div class="col-lg-8">
          <h1 class="fw-bold mb-2">{{ course.title }}</h1>
          <div class="d-flex flex-wrap gap-2 align-items-center mb-3 text-muted small">
            <span class="badge bg-warning text-dark text-capitalize">{{ course.category }}</span>
            <span class="badge bg-secondary-subtle text-secondary-emphasis text-capitalize">{{ course.level }}</span>
            <span><i class="bi bi-star-fill text-warning"></i> {{ course.rating.toFixed(1) }} ({{ course.reviewsCount }} отзывов)</span>
            <span><i class="bi bi-people"></i> {{ course.studentsCount }} студентов</span>
          </div>

          <p class="lead">{{ course.description }}</p>

          <div class="row g-3 my-3">
            <div class="col-6 col-md-3 text-center">
              <div class="h5 fw-bold text-warning">{{ course.duration }}</div>
              <div class="text-muted small">Длительность</div>
            </div>
            <div class="col-6 col-md-3 text-center">
              <div class="h5 fw-bold text-warning">{{ course.lessonsCount }}</div>
              <div class="text-muted small">Уроков</div>
            </div>
            <div class="col-6 col-md-3 text-center">
              <div class="h5 fw-bold text-warning">{{ course.studentsCount }}</div>
              <div class="text-muted small">Студентов</div>
            </div>
            <div class="col-6 col-md-3 text-center">
              <div class="h5 fw-bold text-warning">{{ course.rating.toFixed(1) }}★</div>
              <div class="text-muted small">Рейтинг</div>
            </div>
          </div>

          <div class="card mt-3">
            <div class="card-body">
              <h5 class="fw-bold mb-3">Преподаватель</h5>
              <div class="d-flex align-items-center gap-3">
                <div class="rounded-circle bg-warning d-flex align-items-center justify-content-center" style="width:48px;height:48px;font-size:1.2rem">
                  {{ course.teacherName.charAt(0) }}
                </div>
                <div>
                  <div class="fw-semibold">{{ course.teacherName }}</div>
                  <div class="text-muted small">Преподаватель</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar / Enrollment -->
        <div class="col-lg-4">
          <div class="card shadow sticky-top" style="top: 80px">
            <img
              :src="course.image || 'https://placehold.co/400x220/ffd43b/333?text=Course'"
              class="card-img-top"
              style="height:220px;object-fit:cover"
              :alt="course.title"
              @error="onImgError"
            />
            <div class="card-body text-center">
              <div class="display-6 fw-bold text-warning mb-3">
                {{ course.priceType === 'free' ? 'Бесплатно' : `${course.price} ₽` }}
              </div>

              <div v-if="enrolled" class="alert alert-success py-2 mb-3">
                <i class="bi bi-check-circle me-1"></i> Вы записаны на курс
              </div>

              <button
                v-if="!auth.isLoggedIn"
                class="btn btn-warning w-100 fw-bold mb-2"
                @click="router.push('/login')"
              >
                Войдите чтобы записаться
              </button>
              <button
                v-else-if="!enrolled"
                class="btn btn-warning w-100 fw-bold mb-2"
                :disabled="enrolling"
                @click="handleEnroll"
              >
                <span v-if="enrolling" class="spinner-border spinner-border-sm me-1"></span>
                Записаться на курс
              </button>
              <RouterLink v-else to="/profile" class="btn btn-outline-warning w-100 mb-2">
                Перейти к обучению
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCourses } from '@/composables/useCourses'
import { useApi } from '@/composables/useApi'
import type { Course, Enrollment } from '@/types'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const { fetchCourse, loading } = useCourses()
const { get, post } = useApi()

const course = ref<Course | null>(null)
const enrolled = ref(false)
const enrolling = ref(false)

onMounted(async () => {
  const id = Number(route.params.id)
  course.value = await fetchCourse(id)

  if (auth.isLoggedIn && course.value) {
    try {
      const enrollments = await get<Enrollment[]>('/my-enrollments')
      enrolled.value = enrollments.some((e) => e.courseId === id)
    } catch {
      // not enrolled
    }
  }
})

async function handleEnroll() {
  if (!course.value) return
  enrolling.value = true
  try {
    await post('/enroll', { courseId: course.value.id })
    enrolled.value = true
  } catch (e) {
    console.error(e)
  } finally {
    enrolling.value = false
  }
}

function onImgError(e: Event) {
  ;(e.target as HTMLImageElement).src = 'https://placehold.co/400x220/ffd43b/333?text=Course'
}
</script>
