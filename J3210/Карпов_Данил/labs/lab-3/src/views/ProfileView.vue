<template>
  <div class="container py-4">
    <div v-if="!auth.user" class="text-center py-5">
      <div class="spinner-border text-warning"></div>
    </div>

    <template v-else>
      <div class="row g-4 mb-4">
        <!-- User Info -->
        <div class="col-md-4">
          <div class="card shadow-sm text-center p-4">
            <div class="rounded-circle bg-warning mx-auto mb-3 d-flex align-items-center justify-content-center fs-1 fw-bold" style="width:80px;height:80px">
              {{ auth.user.name.charAt(0) }}
            </div>
            <h5 class="fw-bold mb-1">{{ auth.user.name }}</h5>
            <p class="text-muted small mb-2">{{ auth.user.email }}</p>
            <span class="badge" :class="auth.user.role === 'teacher' ? 'bg-warning text-dark' : 'bg-primary'">
              {{ auth.user.role === 'teacher' ? 'Преподаватель' : 'Студент' }}
            </span>
          </div>

          <div class="card shadow-sm mt-3 p-3">
            <h6 class="fw-bold mb-3">Статистика</h6>
            <div class="d-flex justify-content-between mb-2 small">
              <span class="text-muted">Записан на курсы</span>
              <span class="fw-semibold">{{ enrollments.length }}</span>
            </div>
            <div class="d-flex justify-content-between mb-2 small">
              <span class="text-muted">Завершено</span>
              <span class="fw-semibold">{{ completedCount }}</span>
            </div>
            <div class="d-flex justify-content-between small">
              <span class="text-muted">Сертификатов</span>
              <span class="fw-semibold">{{ certificates.length }}</span>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="col-md-8">
          <ul class="nav nav-tabs mb-3">
            <li class="nav-item">
              <button class="nav-link" :class="{ active: tab === 'courses' }" @click="tab = 'courses'">
                Мои курсы
              </button>
            </li>
            <li class="nav-item">
              <button class="nav-link" :class="{ active: tab === 'certificates' }" @click="tab = 'certificates'">
                Сертификаты
              </button>
            </li>
          </ul>

          <!-- Courses Tab -->
          <div v-if="tab === 'courses'">
            <div v-if="loadingEnrollments" class="text-center py-4">
              <div class="spinner-border spinner-border-sm text-warning"></div>
            </div>
            <div v-else-if="enrollments.length === 0" class="text-center text-muted py-4">
              <i class="bi bi-book fs-1 d-block mb-2"></i>
              Вы ещё не записаны ни на один курс.<br />
              <RouterLink to="/courses" class="btn btn-warning btn-sm mt-2">Найти курсы</RouterLink>
            </div>
            <div v-else class="d-flex flex-column gap-3">
              <div v-for="item in enrollments" :key="item.id" class="card shadow-sm">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 class="mb-1 fw-semibold">{{ item.course?.title ?? `Курс #${item.courseId}` }}</h6>
                      <span class="badge" :class="item.progress >= 100 ? 'bg-success' : 'bg-warning text-dark'">
                        {{ item.progress >= 100 ? 'Завершён' : 'В процессе' }}
                      </span>
                    </div>
                    <RouterLink :to="`/courses/${item.courseId}`" class="btn btn-outline-warning btn-sm">
                      Продолжить
                    </RouterLink>
                  </div>
                  <div class="progress" style="height: 6px">
                    <div
                      class="progress-bar bg-warning"
                      :style="{ width: `${item.progress}%` }"
                    ></div>
                  </div>
                  <div class="text-end small text-muted mt-1">{{ item.progress }}%</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Certificates Tab -->
          <div v-if="tab === 'certificates'">
            <div v-if="loadingCerts" class="text-center py-4">
              <div class="spinner-border spinner-border-sm text-warning"></div>
            </div>
            <div v-else-if="certificates.length === 0" class="text-center text-muted py-4">
              <i class="bi bi-award fs-1 d-block mb-2"></i>
              Сертификатов пока нет. Завершите курс, чтобы получить сертификат.
            </div>
            <div v-else class="row g-3">
              <div v-for="cert in certificates" :key="cert.id" class="col-md-6">
                <div class="card border-warning shadow-sm text-center p-3">
                  <i class="bi bi-award-fill text-warning fs-1 mb-2"></i>
                  <h6 class="fw-bold mb-1">{{ cert.courseTitle }}</h6>
                  <p class="text-muted small mb-0">
                    Выдан: {{ new Date(cert.issuedAt).toLocaleDateString('ru-RU') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useApi } from '@/composables/useApi'

const auth = useAuthStore()
const { get } = useApi()

const tab = ref('courses')
const enrollments = ref([])
const certificates = ref([])
const loadingEnrollments = ref(false)
const loadingCerts = ref(false)

const completedCount = computed(() => enrollments.value.filter((e) => e.progress >= 100).length)

onMounted(async () => {
  loadingEnrollments.value = true
  try {
    const raw = await get('/my-enrollments')
    const courses = await get('/courses')
    enrollments.value = raw.map((e) => ({
      ...e,
      course: courses.find((c) => c.id === e.courseId),
    }))
  } finally {
    loadingEnrollments.value = false
  }

  loadingCerts.value = true
  try {
    certificates.value = await get('/certificates')
  } finally {
    loadingCerts.value = false
  }
})
</script>
