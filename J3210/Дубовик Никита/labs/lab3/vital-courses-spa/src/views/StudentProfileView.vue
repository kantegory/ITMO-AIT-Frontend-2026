<template>
  <main class="flex-grow-1">
    <!-- Шапка профиля -->
    <section class="profile-header py-5 mb-4">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-3 text-center text-lg-start mb-4 mb-lg-0">
            <div class="profile-avatar mx-auto mx-lg-0">
              <svg class="icon icon-lg" aria-hidden="true"><use href="#icon-user"></use></svg>
            </div>
          </div>
          <div class="col-lg-9">
            <h1 class="text-white fw-bold mb-2">{{ fullName }}</h1>
            <p class="text-white-50 mb-3">
              <svg class="icon icon-lg me-2" aria-hidden="true"><use href="#icon-envelope"></use></svg>
              <span>{{ user?.email }}</span>
              <span class="mx-3">|</span>
              <svg class="icon icon-lg me-2" aria-hidden="true"><use href="#icon-calendar"></use></svg>
              <span>{{ registrationText }}</span>
            </p>
            <div class="d-flex flex-wrap gap-3">
              <div class="stat-badge px-4 py-2 text-white">
                <div class="fw-bold fs-4 mb-0">{{ totalCourses }}</div>
                <small class="text-white-50">Курсов куплено</small>
              </div>
              <div class="stat-badge px-4 py-2 text-white">
                <div class="fw-bold fs-4 mb-0">{{ completedCount }}</div>
                <small class="text-white-50">Завершено</small>
              </div>
              <div class="stat-badge px-4 py-2 text-white">
                <div class="fw-bold fs-4 mb-0">{{ activeCount }}</div>
                <small class="text-white-50">В процессе</small>
              </div>
              <div class="stat-badge px-4 py-2 text-white">
                <div class="fw-bold fs-4 mb-0">{{ totalHoursSpent }}</div>
                <small class="text-white-50">Часов обучения</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Табы -->
    <section class="container mb-5">
      <div class="row">
        <div class="col-12 mb-4">
          <ul class="nav nav-pills nav-pills-custom gap-2" id="profileTabs" role="tablist">
            <li class="nav-item" role="presentation">
              <button
                class="nav-link active px-4 py-2"
                id="courses-tab"
                data-bs-toggle="pill"
                data-bs-target="#courses"
                type="button"
                role="tab"
                aria-selected="true"
              >
                <svg class="icon icon-lg me-2" aria-hidden="true"><use href="#icon-book"></use></svg>Мои курсы
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link px-4 py-2"
                id="certificates-tab"
                data-bs-toggle="pill"
                data-bs-target="#certificates"
                type="button"
                role="tab"
                aria-selected="false"
              >
                <svg class="icon icon-lg me-2" aria-hidden="true"><use href="#icon-certificate"></use></svg>Сертификаты
              </button>
            </li>
          </ul>
        </div>

        <div class="tab-content" id="profileTabsContent">
          <!-- Вкладка "Мои курсы" -->
          <div class="tab-pane fade show active" id="courses" role="tabpanel" aria-labelledby="courses-tab">
            <h2 class="fw-bold mb-4">Активные курсы</h2>
            <div class="row g-4">
              <template v-if="activeEnrollments.length">
                <CourseProgressCard
                  v-for="enrollment in activeEnrollments"
                  :key="enrollment.id"
                  :enrollment="enrollment"
                  :course="enrollment.course"
                />
              </template>
              <div v-else class="col-12"><p class="text-muted">Нет активных курсов</p></div>
            </div>

            <h3 class="fw-bold mb-4 mt-5">Завершённые курсы</h3>
            <div class="row g-4">
              <template v-if="completedEnrollments.length">
                <CourseProgressCard
                  v-for="enrollment in completedEnrollments"
                  :key="enrollment.id"
                  :enrollment="enrollment"
                  :course="enrollment.course"
                />
              </template>
              <div v-else class="col-12"><p class="text-muted">Нет завершённых курсов</p></div>
            </div>
          </div>

          <!-- Вкладка "Сертификаты" -->
          <div class="tab-pane fade" id="certificates" role="tabpanel" aria-labelledby="certificates-tab">
            <h3 class="fw-bold mb-4">Мои сертификаты</h3>
            <div class="row g-4">
              <template v-if="certificatesWithCourses.length">
                <CertificateCard
                  v-for="cert in certificatesWithCourses"
                  :key="cert.id"
                  :certificate="cert"
                  :course="cert.course"
                />
              </template>
              <div v-else class="col-12"><p class="text-muted">У вас пока нет сертификатов</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import {
  getUserByEmail,
  getUserCourses,
  getCertificates,
  getCourseById
} from '@/services/api'
import CourseProgressCard from '@/components/profile/CourseProgressCard.vue'
import CertificateCard from '@/components/profile/CertificateCard.vue'

const { user } = useAuth()

const fullUser = ref(null)
const enrollments = ref([])
const certificates = ref([])

onMounted(async () => {
  if (!user.value?.email) return

  try {
    fullUser.value = await getUserByEmail(user.value.email)

    const rawUserCourses = await getUserCourses(fullUser.value.id)
    const courseIds = rawUserCourses.map(uc => uc.courseId)

    const courses = courseIds.length
      ? await Promise.all(courseIds.map(id => getCourseById(id).catch(() => null)))
      : []

    enrollments.value = rawUserCourses.map(uc => ({
      ...uc,
      course: courses.find(c => c && c.id === uc.courseId) || null
    }))

    const rawCerts = await getCertificates(fullUser.value.id)

    certificates.value = rawCerts.map(cert => ({
      ...cert,
      course: courses.find(c => c && c.id === cert.courseId) || null
    }))
  } catch (err) {
    console.error('Ошибка загрузки профиля:', err)
  }
})

// Вычисляемые свойства
const fullName = computed(() => {
  if (fullUser.value) return `${fullUser.value.firstName} ${fullUser.value.lastName}`
  if (user.value) return `${user.value.firstName} ${user.value.lastName}`  // ✅ фикс
  return 'Загрузка...'
})

const registrationText = computed(() => {
  if (fullUser.value?.registeredAt) {
    const date = new Date(fullUser.value.registeredAt)
    const month = date.toLocaleString('ru', { month: 'long' })
    const year = date.getFullYear()
    return `На платформе с ${month} ${year}`
  }
  return 'На платформе с ...'
})

const totalCourses = computed(() => enrollments.value.length)

const completedEnrollments = computed(() =>
  enrollments.value.filter(e => e.status === 'completed' || e.progress === 100)
)
const completedCount = computed(() => completedEnrollments.value.length)

const activeEnrollments = computed(() =>
  enrollments.value.filter(e => e.status === 'active' && e.progress < 100)
)
const activeCount = computed(() => activeEnrollments.value.length)

const totalHoursSpent = computed(() => {
  const hours = enrollments.value.reduce((sum, e) => {
    const courseHours = e.course?.duration_hours || 0
    return sum + (courseHours * (e.progress || 0)) / 100
  }, 0)
  return Math.round(hours)
})

const certificatesWithCourses = computed(() => certificates.value)
</script>
