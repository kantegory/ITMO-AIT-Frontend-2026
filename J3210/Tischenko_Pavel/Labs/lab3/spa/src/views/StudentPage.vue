<template>
  <base-layout>
    <h1 class="h4 mb-3">Кабинет студента</h1>
    <div v-if="statusMessage" class="alert py-2 mb-3" :class="statusType">{{ statusMessage }}</div>
    <section class="card shadow-sm mb-3">
      <div class="card-body">
        <div class="mb-2 fw-medium">{{ fullName }}</div>
        <div class="small student-stat-line">Активных курсов: {{ enrollments.length }}</div>
        <div class="small student-stat-line">Средний прогресс: {{ avgProgress }}%</div>
        <div class="small student-stat-line">Последняя активность: {{ lastActivity }}</div>
        <div class="student-next-step mt-3 pt-3">
          <div class="student-next-step-label">Следующий шаг</div>
          <p class="student-next-step-main mb-0">{{ nextStep }}</p>
        </div>
      </div>
    </section>
    <section class="card shadow-sm mb-3">
      <div class="card-body">
        <h2 class="h5">Мои курсы</h2>
        <div v-if="enrollments.length" class="list-group">
          <router-link
            v-for="e in enrollments"
            :key="e.id"
            class="list-group-item list-group-item-action"
            :to="{ name: 'learn', params: { courseId: e.courseId } }"
          >
            {{ courseTitle(e.courseId) }} — прогресс {{ Math.round((e.progress || 0) * 100) }}%
          </router-link>
        </div>
        <div v-else class="text-secondary">Пока нет купленных курсов.</div>
      </div>
    </section>
    <section class="card shadow-sm">
      <div class="card-body">
        <h2 class="h5">Сертификаты</h2>
        <div v-if="certificates.length" class="list-group">
          <router-link
            v-for="c in certificates"
            :key="c.id"
            class="list-group-item list-group-item-action"
            :to="{ name: 'certificate', params: { id: c.id } }"
          >
            {{ c.title }}
          </router-link>
        </div>
        <div v-else class="text-secondary">Пока нет сертификатов.</div>
      </div>
    </section>
  </base-layout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { certificatesApi, coursesApi, enrollmentsApi } from '../api'
import BaseLayout from '../layouts/BaseLayout.vue'
import useAuthStore from '../stores/auth'

const authStore = useAuthStore()
const enrollments = ref([])
const certificates = ref([])
const courses = ref([])
const statusMessage = ref('')
const statusType = ref('alert-secondary')
const fullName = computed(() =>
  [authStore.user?.firstName, authStore.user?.lastName].filter(Boolean).join(' ') || authStore.user?.email
)
const avgProgress = computed(() => {
  if (!enrollments.value.length) return 0
  const sum = enrollments.value.reduce((acc, e) => acc + (Number(e.progress) || 0), 0)
  return Math.round((sum / enrollments.value.length) * 100)
})
const lastActivity = computed(() => {
  if (!enrollments.value.length) return '—'
  const last = [...enrollments.value].sort((a, b) =>
    String(b.updatedAt || b.createdAt || '').localeCompare(String(a.updatedAt || a.createdAt || ''))
  )[0]
  return courseTitle(last.courseId)
})
const nextStep = computed(() => {
  if (!enrollments.value.length) return 'Купить первый курс в каталоге'
  const next = [...enrollments.value].sort((a, b) => (Number(a.progress) || 0) - (Number(b.progress) || 0))[0]
  return `Продолжить курс «${courseTitle(next.courseId)}»`
})

function courseTitle(courseId) {
  return courses.value.find((c) => c.id === courseId)?.title || courseId
}

onMounted(async () => {
  statusMessage.value = ''
  try {
    const [enrRes, certRes, coursesRes] = await Promise.all([
      enrollmentsApi.listByUserId(authStore.user.id),
      certificatesApi.listByUserId(authStore.user.id),
      coursesApi.getAll()
    ])
    enrollments.value = Array.isArray(enrRes.data) ? enrRes.data : []
    certificates.value = Array.isArray(certRes.data) ? certRes.data : []
    courses.value = Array.isArray(coursesRes.data) ? coursesRes.data : []
    statusType.value = 'alert-secondary'
    statusMessage.value = 'Данные кабинета загружены.'
  } catch (error) {
    statusType.value = 'alert-danger'
    statusMessage.value = error?.response?.data?.message || 'Не удалось загрузить данные кабинета.'
  }
})
</script>
