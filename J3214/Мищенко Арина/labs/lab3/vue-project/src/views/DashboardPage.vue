<template>
  <base-layout>
    <div class="row mb-4">
      <div class="col">
        <h4 class="fw-bold mb-0">Добрый день, {{ user?.firstName }} 👋</h4>
        <p class="text-muted">Продолжайте обучение там, где остановились</p>
      </div>
    </div>

    <ul class="nav nav-tabs mb-4" role="tablist">
      <li class="nav-item"><button class="nav-link" :class="{ active: tab === 'courses' }" @click="tab = 'courses'">Мои курсы</button></li>
      <li class="nav-item"><button class="nav-link" :class="{ active: tab === 'certs'   }" @click="tab = 'certs'"  >Сертификаты</button></li>
      <li class="nav-item"><button class="nav-link" :class="{ active: tab === 'profile' }" @click="tab = 'profile'">Профиль</button></li>
    </ul>

    <!-- Мои курсы -->
    <div v-if="tab === 'courses'">
      <div v-if="loading" class="text-center py-4">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="text-muted mt-2">Загрузка курсов...</p>
      </div>
      <div v-else-if="enrollments.length === 0" class="text-center py-4">
        <p class="text-muted">Вы ещё не записаны ни на один курс.</p>
        <router-link to="/courses" class="btn btn-primary btn-sm">Найти курс</router-link>
      </div>
      <div v-else class="row g-3">
        <div class="col-12 col-md-6 col-lg-4" v-for="(enroll, i) in enrollments" :key="enroll.id">
          <div class="card border-0 shadow-sm h-100">
            <div :class="`card-img-top bg-${enrolledCourses[i]?.color || 'primary'} d-flex align-items-center justify-content-center`"
              style="height:120px;">
              <i :class="`bi ${enrolledCourses[i]?.icon || 'bi-book'} text-white`"
                style="font-size:2.5rem;" aria-hidden="true"></i>
            </div>
            <div class="card-body">
              <span class="badge mb-2" :class="enroll.status === 'completed' ? 'bg-primary-subtle text-primary' : 'bg-success-subtle text-success'">
                {{ enroll.status === 'completed' ? 'Завершён' : 'В процессе' }}
              </span>
              <h6 class="fw-bold">{{ enrolledCourses[i]?.title }}</h6>
              <p class="text-muted small">Преподаватель: {{ enrolledCourses[i]?.teacher }}</p>
              <div class="mb-2">
                <div class="d-flex justify-content-between small text-muted mb-1">
                  <span>Прогресс</span><span>{{ enroll.progress }}%</span>
                </div>
                <div class="progress" style="height:6px;">
                  <div class="progress-bar" :style="`width:${enroll.progress}%`"></div>
                </div>
              </div>
              <router-link :to="`/courses/${enrolledCourses[i]?.id}`"
                class="btn btn-primary btn-sm w-100 mt-2">
                {{ enroll.status === 'completed' ? 'Повторить' : 'Продолжить' }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Сертификаты -->
    <div v-if="tab === 'certs'">
      <p v-if="completedEnrollments.length === 0" class="text-muted text-center py-3">
        Завершите курсы, чтобы получить сертификаты
      </p>
      <div v-else class="row g-3">
        <div class="col-12 col-md-6" v-for="enroll in completedEnrollments" :key="enroll.id">
          <div class="card border-0 shadow-sm">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="bg-warning-subtle rounded p-3">
                <i class="bi bi-award text-warning" style="font-size:2rem;" aria-hidden="true"></i>
              </div>
              <div class="flex-grow-1">
                <h6 class="fw-bold mb-0">{{ getCourseForEnroll(enroll)?.title }}</h6>
                <span class="badge bg-success-subtle text-success mt-1">Действителен</span>
              </div>
              <button class="btn btn-outline-primary btn-sm" @click="showCert(getCourseForEnroll(enroll)?.title)">
                <i class="bi bi-download" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Профиль -->
    <div v-if="tab === 'profile'">
      <div class="row justify-content-center">
        <div class="col-12 col-md-6">
          <div class="card border-0 shadow-sm p-4">
            <div class="text-center mb-4">
              <div class="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center text-white mb-3"
                style="width:80px;height:80px;font-size:2rem;" aria-hidden="true">
                {{ user?.firstName?.charAt(0)?.toUpperCase() }}
              </div>
              <h5 class="fw-bold mb-0">{{ user?.firstName }} {{ user?.lastName }}</h5>
              <p class="text-muted small">Студент</p>
            </div>
            <div class="d-flex flex-column gap-3">
              <div>
                <label for="profFirst" class="form-label">Имя</label>
                <input id="profFirst" type="text" class="form-control" v-model="profileFirst" />
              </div>
              <div>
                <label for="profLast" class="form-label">Фамилия</label>
                <input id="profLast" type="text" class="form-control" v-model="profileLast" />
              </div>
              <div v-if="saveSuccess" class="alert alert-success py-2">Изменения сохранены!</div>
              <button type="button" class="btn btn-primary w-100" @click="saveProfile" :disabled="savingProfile">
                Сохранить изменения
              </button>
              <hr class="my-2" />
              <button type="button" class="btn btn-outline-danger w-100" @click="doLogout">
                <i class="bi bi-box-arrow-right me-2" aria-hidden="true"></i>Выйти из аккаунта
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модалка сертификата -->
    <div class="modal fade" id="certModalVue" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0">
          <div class="modal-header border-0">
            <h5 class="modal-title fw-bold">Сертификат</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body text-center p-5 bg-light rounded">
            <i class="bi bi-award text-warning" style="font-size:4rem;" aria-hidden="true"></i>
            <h4 class="fw-bold mt-3">{{ certCourseTitle }}</h4>
            <p class="text-muted">Настоящим подтверждается, что</p>
            <h5 class="fw-bold">{{ user?.firstName }} {{ user?.lastName }}</h5>
            <p class="text-muted">успешно завершил курс</p>
          </div>
          <div class="modal-footer border-0">
            <button class="btn btn-primary w-100">
              <i class="bi bi-download me-2" aria-hidden="true"></i>Скачать PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  </base-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import useAuthStore    from '@/stores/auth'
import { enrollmentsApi, coursesApi } from '@/api'
import { useLoading }  from '@/composables/useLoading'
import { useAuth }     from '@/composables/useAuth'
import BaseLayout from '@/layouts/BaseLayout.vue'

// Bootstrap Modal нужен для сертификата
import { Modal } from 'bootstrap'

const { user }    = storeToRefs(useAuthStore())
const authStore   = useAuthStore()
const { logout }  = useAuth()

const tab            = ref('courses')
const enrollments    = ref([])
const enrolledCourses = ref([])
const profileFirst   = ref(user.value?.firstName || '')
const profileLast    = ref(user.value?.lastName  || '')
const saveSuccess    = ref(false)
const savingProfile  = ref(false)
const certCourseTitle = ref('')

const { loading, withLoading } = useLoading()

const completedEnrollments = computed(() =>
  enrollments.value.filter(e => e.status === 'completed')
)

function getCourseForEnroll(enroll) {
  const idx = enrollments.value.indexOf(enroll)
  return enrolledCourses.value[idx]
}

async function loadEnrollments() {
  const allRes = await enrollmentsApi.getAll()
  const all    = allRes.data
  // String() — как в оригинале dashboard-user.html
  enrollments.value = all.filter(e => String(e.userId) === String(user.value?.id))

  const promises = enrollments.value.map(e =>
    coursesApi.getById(e.courseId).then(r => r.data)
  )
  enrolledCourses.value = await Promise.all(promises)
}

function showCert(title) {
  certCourseTitle.value = title
  new Modal(document.getElementById('certModalVue')).show()
}

async function saveProfile() {
  savingProfile.value = true
  await authStore.updateProfile(user.value.id, profileFirst.value, profileLast.value)
  savingProfile.value = false
  saveSuccess.value   = true
  setTimeout(() => { saveSuccess.value = false }, 2000)
}

function doLogout() {
  logout()
}

onMounted(() => withLoading(loadEnrollments))
</script>
