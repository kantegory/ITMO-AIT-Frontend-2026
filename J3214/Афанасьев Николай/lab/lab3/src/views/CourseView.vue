<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppSidebar  from '../components/AppSidebar.vue'
import LessonItem  from '../components/LessonItem.vue'
import { useApi }  from '../composables/useApi.js'
import { useAuth } from '../composables/useAuth.js'

const route  = useRoute()
const router = useRouter()
const { get, post } = useApi()
const { session } = useAuth()

const courseId   = Number(route.params.id)
const course     = ref(null)
const enrollment = ref(null)
const activeTab  = ref('materials')
const loading    = ref(true)
const enrolling  = ref(false)
const error      = ref('')

onMounted(async () => {
  try {
    course.value = await get(`/courses/${courseId}`)

    if (session.value) {
      const list = await get('/enrollments', { userId: session.value.userId, courseId })
      enrollment.value = list[0] || null
    }
  } catch {
    error.value = 'Ошибка загрузки курса.'
  } finally {
    loading.value = false
  }
})

const lessonsToShow = computed(() => {
  if (!course.value) return []
  const total = Math.max(course.value.lessons || 5, 1)
  const show  = Math.min(total, 6)
  const done  = enrollment.value?.completedLessons || 0
  return Array.from({ length: show }, (_, i) => ({
    index:     i + 1,
    completed: done >= i + 1,
    current:   done + 1 === i + 1,
  }))
})

const moreCount = computed(() => {
  if (!course.value) return 0
  const total = Math.max(course.value.lessons || 5, 1)
  return total > 6 ? total - 6 : 0
})

const progressPct = computed(() => {
  if (!enrollment.value) return 0
  const { completedLessons, totalLessons } = enrollment.value
  return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
})

function formatPrice(p) {
  return p ? new Intl.NumberFormat('ru-RU').format(p) + ' ₽' : 'Бесплатно'
}

async function enroll() {
  if (!session.value) { router.push({ name: 'login' }); return }
  enrolling.value = true
  try {
    await post('/enrollments', {
      userId: session.value.userId,
      courseId,
      completedLessons: 0,
      totalLessons: course.value.lessons || 10,
    })
    const list = await get('/enrollments', { userId: session.value.userId, courseId })
    enrollment.value = list[0] || null
  } catch {
    alert('Ошибка записи на курс.')
  } finally {
    enrolling.value = false
  }
}
</script>

<template>
  <div class="main-wrapper">
    <AppSidebar />

    <div class="main-content">
      <router-link to="/courses" style="font-size:13px;color:var(--muted);display:inline-flex;align-items:center;gap:6px;margin-bottom:1rem;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Назад к каталогу
      </router-link>

      <div v-if="loading" style="color:var(--muted);">Загрузка…</div>
      <div v-else-if="error" style="color:#E24B4A;">{{ error }}</div>

      <div v-else style="display:grid;grid-template-columns:1fr 320px;gap:24px;align-items:start;">
        <!-- Левая колонка: видео + вкладки -->
        <div>
          <!-- Видеоплеер (заглушка) -->
          <div v-if="enrollment" class="video-player mb-3" style="margin-bottom:12px;">
            <div style="position:absolute;top:16px;left:16px;background:rgba(83,74,183,0.85);color:#fff;padding:4px 12px;border-radius:20px;font-size:12px;">
              {{ course.title }}
            </div>
            <div class="play-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
            <div style="position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,0.5);padding:10px 16px;display:flex;align-items:center;gap:12px;">
              <span style="font-size:12px;color:#fff;white-space:nowrap;">12:45 / 28:30</span>
              <div style="flex:1;height:3px;background:rgba(255,255,255,0.3);border-radius:2px;overflow:hidden;">
                <div style="width:45%;height:100%;background:#7F77DD;border-radius:2px;"></div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
            </div>
          </div>

          <!-- Вкладки -->
          <div style="border-bottom:1px solid var(--border);margin-bottom:1rem;">
            <button class="tab-btn" :class="{ active: activeTab === 'materials' }" type="button" @click="activeTab = 'materials'">Материалы</button>
            <button class="tab-btn" :class="{ active: activeTab === 'tasks' }"     type="button" @click="activeTab = 'tasks'">Задания</button>
            <button class="tab-btn" :class="{ active: activeTab === 'discuss' }"   type="button" @click="activeTab = 'discuss'">Обсуждения</button>
          </div>

          <!-- Вкладка: Материалы -->
          <div v-show="activeTab === 'materials'">
            <h2 style="font-size:15px;font-weight:500;color:var(--text);margin-bottom:8px;">{{ course.title }}</h2>
            <p style="font-size:13px;color:var(--muted);line-height:1.7;margin-bottom:16px;">
              {{ course.description || `Курс по теме «${course.subject}». Уровень: ${course.level}. ${course.lessons} уроков.` }}
            </p>
            <div class="file-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#534AB7" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <span style="font-size:13px;color:var(--text);">lesson_01_intro.pdf</span>
              <span style="font-size:12px;color:var(--muted);margin-left:auto;">245 КБ</span>
            </div>

            <!-- Блок записи на курс (если не записан) -->
            <div v-if="!enrollment" style="margin-top:20px;background:var(--surface-2);border:1px solid var(--border);border-radius:12px;padding:20px;">
              <div class="d-flex align-items-center gap-3 mb-3">
                <div style="font-size:40px;">{{ course.emoji || '📚' }}</div>
                <div>
                  <div style="font-size:15px;font-weight:600;color:var(--text);">{{ course.title }}</div>
                  <div style="font-size:12px;color:var(--muted);">{{ course.subject }} · {{ course.level }} · {{ course.lessons }} уроков · ★ {{ (course.rating || 0).toFixed(1) }}</div>
                </div>
              </div>
              <div style="font-size:22px;font-weight:700;color:#534AB7;margin-bottom:14px;">{{ formatPrice(course.price) }}</div>
              <button class="btn-purple w-100" :disabled="enrolling" @click="enroll">
                {{ enrolling ? 'Записываемся…' : 'Записаться на курс' }}
              </button>
            </div>
          </div>

          <!-- Вкладка: Задания -->
          <div v-show="activeTab === 'tasks'">
            <p style="font-size:13px;color:var(--muted);">Задания появятся здесь.</p>
          </div>

          <!-- Вкладка: Обсуждения -->
          <div v-show="activeTab === 'discuss'">
            <p style="font-size:13px;color:var(--muted);">Обсуждения появятся здесь.</p>
          </div>
        </div>

        <!-- Правая колонка: прогресс + уроки -->
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px;">
          <div style="font-size:14px;font-weight:500;color:var(--text);margin-bottom:4px;">{{ course.title }}</div>
          <div style="font-size:12px;color:var(--muted);margin-bottom:8px;">
            <template v-if="enrollment">
              Урок {{ enrollment.completedLessons }} из {{ enrollment.totalLessons }} · {{ progressPct }}%
            </template>
            <template v-else>
              {{ course.lessons || 0 }} уроков · ещё не начат
            </template>
          </div>
          <div class="progress-bar-custom mb-3">
            <div class="progress-fill" :style="{ width: progressPct + '%' }"></div>
          </div>

          <div style="display:flex;flex-direction:column;gap:2px;">
            <LessonItem
              v-for="l in lessonsToShow"
              :key="l.index"
              :index="l.index"
              :completed="l.completed"
              :current="l.current"
            />
            <div v-if="moreCount > 0" style="font-size:12px;color:var(--muted);padding:8px 4px;">
              + ещё {{ moreCount }} уроков
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
