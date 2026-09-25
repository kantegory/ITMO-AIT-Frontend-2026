<template>
  <div>
    <div v-if="isLoading" class="spinner-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>
    <div v-else-if="!course">
      <div class="container py-5"><p class="text-danger">Курс не найден</p></div>
    </div>
    <template v-else>
      <section class="course-hero">
        <div class="container">
          <div class="row g-4 align-items-center">
            <div class="col-lg-7">
              <nav aria-label="breadcrumb" class="mb-2">
                <ol class="breadcrumb mb-0">
                  <li class="breadcrumb-item">
                    <router-link to="/" class="text-white-50 text-decoration-none">Главная
                    </router-link>
                  </li>
                  <li class="breadcrumb-item text-white-50">{{ course.category }}</li>
                  <li class="breadcrumb-item active text-white">{{ course.title }}</li>
                </ol>
              </nav>
              <h1 class="fw-bold mb-3">{{ course.title }}</h1>
              <p class="lead mb-3" style="opacity:0.85">{{ course.shortDescription }}</p>
              <div class="d-flex flex-wrap gap-2 mb-3">
                <span class="badge bg-secondary">{{ course.level }}</span>
                <span class="badge bg-secondary">{{ course.language }}</span>
                <span class="badge bg-secondary">{{ course.duration }}</span>
                <span v-if="course.hasCertificate" class="badge bg-success">Сертификат</span>
              </div>
            </div>
            <div class="col-lg-5">
              <img v-if="course.image" :src="course.image" :alt="course.title"
                   class="img-fluid rounded-3"/>
            </div>
          </div>
        </div>
      </section>

      <div class="container py-5">
        <div class="row g-5">
          <div class="col-lg-8">
            <section v-if="course.whatYouLearn?.length" class="mb-5">
              <h2 class="fw-bold h3 mb-3">Чему вы научитесь</h2>
              <div class="row g-2">
                <div v-for="(item, i) in course.whatYouLearn" :key="i" class="col-md-6">
                  <div class="d-flex gap-2">
                    <svg class="icon text-success mt-1">
                      <use href="#icon-check2"></use>
                    </svg>
                    <span class="small">{{ item }}</span>
                  </div>
                </div>
              </div>
            </section>

            <section class="mb-5">
              <h2 class="fw-bold h3 mb-3">Содержание курса</h2>
              <p v-if="course.modules?.length" class="text-muted small mb-3">
                {{ course.modules.length }} модулей • {{ totalLessons }} уроков • {{
                  course.duration
                }}
              </p>
              <div v-else class="text-muted small">Содержание пока не заполнено</div>
              <div v-if="course.modules?.length" class="accordion" id="courseModules">
                <div v-for="(mod, idx) in course.modules" :key="mod.id" class="accordion-item">
                  <h2 class="accordion-header">
                    <button
                      class="accordion-button"
                      :class="{ collapsed: idx > 0 }"
                      type="button"
                      data-bs-toggle="collapse"
                      :data-bs-target="`#mod${mod.id}`"
                    >
                      Модуль {{ idx + 1 }}: {{ mod.title }}
                      <span class="badge bg-secondary ms-auto me-2">{{
                          mod.lessons.length
                        }} уроков</span>
                    </button>
                  </h2>
                  <div :id="`mod${mod.id}`" class="accordion-collapse collapse"
                       :class="{ show: idx === 0 }">
                    <div class="accordion-body p-0">
                      <div v-for="lesson in mod.lessons" :key="lesson.id"
                           class="d-flex align-items-center gap-2 px-3 py-2 border-bottom">
                        <svg class="icon text-primary">
                          <use :href="`#${lessonIcon(lesson.type)}`"></use>
                        </svg>
                        <span class="small">{{ lesson.title }}</span>
                        <span class="ms-auto small text-muted">{{ lesson.duration }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section class="mb-5">
              <h2 class="fw-bold h3 mb-3">Отзывы студентов</h2>
              <div v-if="reviewsLoading" class="spinner-center">
                <div class="spinner-border spinner-border-sm text-primary"></div>
              </div>
              <p v-else-if="reviews.length === 0" class="text-muted">Пока нет отзывов</p>
              <div v-else class="row g-3">
                <div v-for="r in reviews" :key="r.id" class="col-md-6">
                  <div class="review-card">
                    <div class="d-flex align-items-center gap-2 mb-2">
                      <div class="review-avatar">{{ r.userName?.charAt(0) }}</div>
                      <div>
                        <div class="fw-semibold small">{{ r.userName }}</div>
                        <div class="small text-warning">
                          <svg v-for="n in 5" :key="n" class="icon">
                            <use :href="n <= r.rating ? '#icon-star-fill' : '#icon-star'"></use>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <p class="small mb-0">{{ r.text }}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside class="col-lg-4">
            <div class="sticky-top" style="top:80px;z-index:1">
              <div class="buy-card">
                <div class="h4 fw-bold mb-1">
                  {{ course.price === 0 ? 'Бесплатно' : `${course.price} ₽` }}
                </div>
                <p class="small text-muted mb-3">Полный доступ ко всем материалам</p>
                <button
                  class="btn w-100 py-2 mb-3"
                  :class="isEnrolled ? 'btn-success' : 'btn-primary'"
                  :disabled="enrollLoading"
                  @click="onEnroll"
                >
                  <span v-if="enrollLoading" class="spinner-border spinner-border-sm me-1"></span>
                  <span v-else-if="isEnrolled"><svg class="icon me-1"><use
                    href="#icon-play-fill"></use></svg>Перейти к обучению</span>
                  <span v-else><svg class="icon me-1"><use href="#icon-cart-plus"></use></svg>Записаться на курс</span>
                </button>
                <div v-if="enrollMsg"
                     :class="['small', enrollSuccess ? 'text-success' : 'text-danger']">{{
                    enrollMsg
                  }}
                </div>
                <ul class="list-unstyled small mt-3 mb-0">
                  <li class="mb-2">
                    <svg class="icon text-success me-2">
                      <use href="#icon-check2"></use>
                    </svg>
                    {{ totalLessons }} уроков
                  </li>
                  <li class="mb-2">
                    <svg class="icon text-success me-2">
                      <use href="#icon-check2"></use>
                    </svg>
                    {{ course.duration }} видео
                  </li>
                  <li v-if="course.hasCertificate" class="mb-2">
                    <svg class="icon text-success me-2">
                      <use href="#icon-check2"></use>
                    </svg>
                    Сертификат по окончании
                  </li>
                  <li class="mb-2">
                    <svg class="icon text-success me-2">
                      <use href="#icon-check2"></use>
                    </svg>
                    Пожизненный доступ
                  </li>
                  <li>
                    <svg class="icon text-success me-2">
                      <use href="#icon-check2"></use>
                    </svg>
                    Поддержка преподавателя
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useAuthStore} from '@/stores/auth'
import {coursesApi, usersApi, reviewsApi} from '@/api'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const courseId = parseInt(route.params.id)

const course = ref(null)
const reviews = ref([])
const isLoading = ref(true)
const reviewsLoading = ref(true)
const isEnrolled = ref(false)
const enrollLoading = ref(false)
const enrollMsg = ref('')
const enrollSuccess = ref(false)

const totalLessons = computed(() =>
  course.value?.modules?.reduce((sum, m) => sum + m.lessons.length, 0) || 0
)

function lessonIcon(type) {
  if (type === 'video') return 'icon-play-circle'
  if (type === 'quiz') return 'icon-pencil-square'
  return 'icon-file-text'
}

async function onEnroll() {
  if (!auth.isLoggedIn) {
    router.push('/sign-in');
    return
  }
  if (isEnrolled.value) {
    router.push(`/course/${courseId}/learn`);
    return
  }

  enrollLoading.value = true
  enrollMsg.value = ''
  try {
    const enrolled = [...(auth.user.enrolledCourses || [])]
    if (!enrolled.includes(courseId)) {
      enrolled.push(courseId)
      await usersApi.update(auth.user.id, {enrolledCourses: enrolled})
      await coursesApi.update(courseId, {studentsCount: (course.value.studentsCount || 0) + 1})
      auth.refreshUser({enrolledCourses: enrolled})
    }
    isEnrolled.value = true
    enrollSuccess.value = true
    enrollMsg.value = 'Вы записаны! Переходим к обучению...'
    setTimeout(() => router.push(`/course/${courseId}/learn`), 1200)
  } catch {
    enrollSuccess.value = false
    enrollMsg.value = 'Ошибка записи. Попробуйте ещё раз.'
  } finally {
    enrollLoading.value = false
  }
}

onMounted(async () => {
  try {
    const {data} = await coursesApi.getById(courseId)
    course.value = data
  } catch {
    course.value = null
  } finally {
    isLoading.value = false
  }

  try {
    const {data} = await reviewsApi.getByCourse(courseId)
    reviews.value = data
  } finally {
    reviewsLoading.value = false
  }

  if (auth.isLoggedIn) {
    isEnrolled.value = (auth.user.enrolledCourses || []).includes(courseId)
  }
})
</script>
