<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppSidebar from '../components/AppSidebar.vue'
import StatCard   from '../components/StatCard.vue'
import { useApi }  from '../composables/useApi.js'
import { useAuth } from '../composables/useAuth.js'

const router = useRouter()
const { get } = useApi()
const { session, isTeacher, getInitials } = useAuth()

const enrollments = ref([])
const certs       = ref([])
const loading     = ref(true)
const error       = ref('')

const myCourses = ref([])

onMounted(async () => {
  try {
    const [enrs, cs] = await Promise.all([
      get('/enrollments', { userId: session.value.userId }),
      get('/certificates', { userId: session.value.userId }),
    ])
    enrollments.value = enrs
    certs.value       = cs

    myCourses.value = await Promise.all(
      enrs.map(async e => {
        const course = await get(`/courses/${e.courseId}`)
        return { ...e, course }
      })
    )
  } catch {
    error.value = 'Ошибка загрузки. Убедитесь, что json-server запущен (npm run api).'
  } finally {
    loading.value = false
  }
})

function pct(e) {
  return e.totalLessons > 0 ? Math.round((e.completedLessons / e.totalLessons) * 100) : 0
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<template>
  <div class="main-wrapper">
    <AppSidebar />

    <div class="main-content">
      <!-- Topbar -->
      <div class="topbar">
        <div>
          <h1 class="page-title">Привет, {{ session?.firstName }}!</h1>
          <p class="page-subtitle">Продолжай обучение — ты на правильном пути</p>
        </div>
        <div class="d-flex align-items-center gap-3">
          <button class="icon-button" type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span class="dot"></span>
          </button>
          <div class="avatar">{{ getInitials() }}</div>
        </div>
      </div>

      <!-- Баннер для преподавателя -->
      <div v-if="!isTeacher" class="banner mb-4">
        <div>
          <div class="banner-title">📚 Вы также преподаватель?</div>
          <div class="banner-subtitle">Управляйте курсами и студентами в кабинете преподавателя</div>
        </div>
        <router-link to="/teacher" class="btn-white">Перейти →</router-link>
      </div>

      <!-- Статистика -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:24px;">
        <StatCard label="Активных курсов"  :value="enrollments.length" sub="Всего записей"        />
        <StatCard label="Часов обучения"   value="47"                  sub="+3 ч на этой неделе"  />
        <StatCard label="Сертификатов"     :value="certs.length"       sub="Получено"              />
        <StatCard label="Средний балл"     value="91%"                 sub="По всем заданиям"      />
      </div>

      <!-- Мои курсы -->
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h2 class="section-title">Мои курсы</h2>
        <router-link to="/courses" style="font-size:13px;color:#534AB7;">Каталог курсов →</router-link>
      </div>

      <div v-if="loading" style="color:var(--muted);font-size:14px;margin-bottom:24px;">Загрузка…</div>
      <div v-else-if="error" style="color:#E24B4A;font-size:14px;margin-bottom:24px;">{{ error }}</div>
      <div v-else-if="myCourses.length === 0" style="color:var(--muted);font-size:14px;margin-bottom:24px;">
        Вы ещё не записаны ни на один курс.
        <router-link to="/courses" style="color:#534AB7;">Найти курсы →</router-link>
      </div>
      <div v-else style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;margin-bottom:24px;">
        <div v-for="e in myCourses" :key="e.id"
          class="course-card-teacher"
          style="cursor:pointer;"
          @click="router.push({ name: 'course', params: { id: e.courseId } })"
        >
          <div class="course-thumb" :style="{ background: e.course?.thumbBg || '#edeaf8', height: '100px', borderRadius: '12px', marginBottom: '12px' }">
            {{ e.course?.emoji || '📚' }}
          </div>
          <div style="font-size:13px;font-weight:500;color:var(--text);margin-bottom:4px;">{{ e.course?.title || 'Курс' }}</div>
          <div style="font-size:12px;color:var(--muted);">Урок {{ e.completedLessons }} из {{ e.totalLessons }}</div>
          <div class="progress-bar-custom">
            <div class="progress-fill" :style="{ width: pct(e) + '%' }"></div>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <span style="font-size:12px;color:#534AB7;font-weight:500;">{{ pct(e) }}%</span>
            <span style="font-size:12px;color:#534AB7;">Продолжить →</span>
          </div>
        </div>
      </div>

      <!-- Сертификаты -->
      <h2 class="section-title mb-3">Сертификаты</h2>
      <div v-if="loading" style="color:var(--muted);font-size:14px;">Загрузка…</div>
      <div v-else-if="certs.length === 0" style="color:var(--muted);font-size:14px;">Сертификатов пока нет</div>
      <div v-else style="display:flex;flex-direction:column;gap:8px;">
        <div v-for="cert in certs" :key="cert.id" class="cert-card">
          <div class="cert-icon">🏆</div>
          <div style="flex:1;">
            <div style="font-size:14px;font-weight:500;color:var(--text);">{{ cert.courseTitle }}</div>
            <div style="font-size:12px;color:var(--muted);">Выдан {{ formatDate(cert.issuedAt) }}</div>
          </div>
          <span class="badge-pill" style="background:#e1f5ee;color:#0F6E56;">Получен</span>
        </div>
      </div>
    </div>
  </div>
</template>
