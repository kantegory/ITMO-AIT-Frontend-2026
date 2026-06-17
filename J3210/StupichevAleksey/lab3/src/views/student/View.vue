<template>
  <section>
    <h4 class="mb-4 fw-bold">Обзор</h4>

    <div class="row g-4 mb-4">
      <div class="col-sm-6 col-xl-3">
        <div class="stat-card d-flex align-items-center gap-3">
          <div class="stat-icon" style="background: linear-gradient(135deg,#0d6efd,#6610f2)">
            <svg class="icon">
              <use href="#icon-book"></use>
            </svg>
          </div>
          <div>
            <div class="stat-value">{{ stats.active }}</div>
            <div class="stat-label">Активных курсов</div>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="stat-card d-flex align-items-center gap-3">
          <div class="stat-icon" style="background: linear-gradient(135deg,#198754,#20c997)">
            <svg class="icon">
              <use href="#icon-check-circle"></use>
            </svg>
          </div>
          <div>
            <div class="stat-value">{{ stats.completed }}</div>
            <div class="stat-label">Завершённых</div>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="stat-card d-flex align-items-center gap-3">
          <div class="stat-icon" style="background: linear-gradient(135deg,#ffc107,#fd7e14)">
            <svg class="icon">
              <use href="#icon-award"></use>
            </svg>
          </div>
          <div>
            <div class="stat-value">{{ stats.certs }}</div>
            <div class="stat-label">Сертификатов</div>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-xl-3">
        <div class="stat-card d-flex align-items-center gap-3">
          <div class="stat-icon" style="background: linear-gradient(135deg,#dc3545,#e83e8c)">
            <svg class="icon">
              <use href="#icon-clock-history"></use>
            </svg>
          </div>
          <div>
            <div class="stat-value">{{ stats.hours }} ч</div>
            <div class="stat-label">Время обучения</div>
          </div>
        </div>
      </div>
    </div>

    <h5 class="fw-semibold mb-3">Продолжить обучение</h5>
    <div v-if="isLoading" class="spinner-center">
      <div class="spinner-border text-primary"></div>
    </div>
    <p v-else-if="activeCourses.length === 0" class="text-muted">Нет активных курсов</p>
    <div v-else class="row g-4">
      <div v-for="course in activeCourses.slice(0, 3)" :key="course.id" class="col-md-6 col-xl-4">
        <div class="course-card-lk">
          <img :src="course.image" :alt="course.title"/>
          <div class="card-body">
            <h3 class="fw-semibold mb-1" style="font-size: 1rem">{{ course.title }}</h3>
            <p class="small text-muted mb-2">{{ course.shortDescription }}</p>
            <router-link :to="`/course/${course.id}/learn`" class="btn btn-primary btn-sm">
              Продолжить
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useAuthStore} from '@/stores/auth'
import {usersApi, certificatesApi, coursesApi} from '@/api'

const auth = useAuthStore()
const isLoading = ref(true)
const activeCourses = ref([])
const stats = ref({active: 0, completed: 0, certs: 0, hours: 0})

onMounted(async () => {
  const user = auth.user
  if (!user) return

  try {
    const [userResp, certsResp] = await Promise.all([
      usersApi.getById(user.id),
      certificatesApi.getByUser(user.id),
    ])

    const userData = userResp.data
    const enrolled = userData.enrolledCourses || []
    const completed = userData.completedCourses || []

    let enrolledCourses = []
    if (enrolled.length > 0) {
      const {data} = await coursesApi.getAll({id: enrolled})
      enrolledCourses = data
    }

    const active = enrolledCourses.filter((c) => !completed.includes(c.id))
    activeCourses.value = active

    let totalHours = 0
    enrolledCourses.forEach((c) => {
      const match = c.duration?.match(/(\d+)/)
      if (match) totalHours += parseInt(match[1])
    })

    stats.value = {
      active: active.length,
      completed: completed.length,
      certs: certsResp.data.length,
      hours: totalHours,
    }
  } catch (err) {
    console.error('Dashboard load error:', err)
  } finally {
    isLoading.value = false
  }
})
</script>
