<template>
  <base-layout>
    <div class="mb-3">
      <router-link class="small text-decoration-none" to="/">← В каталог</router-link>
    </div>

    <div v-if="store.loading" class="alert alert-info">Загрузка курса...</div>
    <div v-else-if="store.error" class="alert alert-danger">{{ store.error }}</div>
    <template v-else-if="store.selectedCourse">
      <section class="card shadow-sm mb-3">
        <div class="card-body">
          <h1 class="h4 mb-2">{{ store.selectedCourse.title }}</h1>
          <p class="text-secondary mb-3">{{ store.selectedCourse.shortDescription }}</p>
          <div class="d-flex flex-wrap gap-2 small text-secondary mb-3">
            <span>Категория: {{ store.selectedCourse.category }}</span>
            <span>Уровень: {{ store.selectedCourse.level }}</span>
            <span>Автор: {{ store.selectedCourse.author }}</span>
          </div>
          <p class="mb-3">{{ store.selectedCourse.description }}</p>
          <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div class="fw-semibold fs-5">
              {{ Number(store.selectedCourse.price || 0).toLocaleString('ru-RU') }} ₽
            </div>
            <button class="btn btn-primary btn-sm" @click="handleEnroll">
              {{ enrollText }}
            </button>
          </div>
        </div>
      </section>

      <section class="card shadow-sm">
        <div class="card-body">
          <h2 class="h5 mb-3">Лекции курса</h2>
          <div v-if="loadingLessons" class="alert alert-info py-2 mb-0">Загрузка лекций...</div>
          <div v-else-if="lessonsError" class="alert alert-danger py-2 mb-0">{{ lessonsError }}</div>
          <ul v-else-if="lessons.length" class="list-group list-group-flush">
            <li v-for="lesson in lessons" :key="lesson.id" class="list-group-item px-0">
              <div class="fw-semibold">{{ lesson.title }}</div>
              <p class="small text-secondary mb-2">
                {{ lesson.summary || `Длительность: ${lesson.durationMinutes || '—'} мин.` }}
              </p>
              <a :href="lesson.videoUrl" target="_blank" rel="noreferrer" class="small text-decoration-none">
                Открыть видео
              </a>
            </li>
          </ul>
          <div v-else class="text-secondary">Для этого курса пока нет лекций.</div>
        </div>
      </section>

      <section class="card shadow-sm mt-3">
        <div class="card-body">
          <h2 class="h5 mb-3">Материалы</h2>
          <ul v-if="materials.length" class="mb-0">
            <li v-for="m in materials" :key="m.id">
              <a :href="m.url" target="_blank" rel="noreferrer">{{ m.title }}</a>
            </li>
          </ul>
          <div v-else class="text-secondary">Материалов пока нет.</div>
        </div>
      </section>

      <section class="card shadow-sm mt-3">
        <div class="card-body">
          <h2 class="h5 mb-3">Семинары / задания</h2>
          <ul v-if="assignments.length" class="mb-0">
            <li v-for="a in assignments" :key="a.id" class="mb-2">
              <div class="fw-semibold">{{ a.title }}</div>
              <div class="small text-secondary">{{ a.description }}</div>
            </li>
          </ul>
          <div v-else class="text-secondary">Заданий пока нет.</div>
        </div>
      </section>

      <section class="card shadow-sm mt-3">
        <div class="card-body">
          <h2 class="h5 mb-3">Обсуждения</h2>
          <div v-if="threads.length" class="d-flex flex-wrap gap-2 mb-3">
            <button
              v-for="t in threads"
              :key="t.id"
              class="btn btn-sm"
              :class="selectedThreadId === t.id ? 'btn-primary' : 'btn-outline-primary'"
              @click="selectThread(t.id)"
            >
              {{ t.title }}
            </button>
          </div>
          <div v-if="threadMessages.length">
            <div v-for="m in threadMessages" :key="m.id" class="border rounded p-2 mb-2">
              <span class="small text-secondary">{{ m.authorRole }}:</span> {{ m.text }}
            </div>
          </div>
          <div v-else class="text-secondary">Сообщений пока нет.</div>
        </div>
      </section>
    </template>
  </base-layout>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  assignmentsApi,
  enrollmentsApi,
  lessonsApi,
  materialsApi,
  messagesApi,
  threadsApi
} from '../api'
import useAuthStore from '../stores/auth'
import BaseLayout from '../layouts/BaseLayout.vue'
import useCoursesStore from '../stores/courses'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const store = useCoursesStore()
const lessons = ref([])
const loadingLessons = ref(false)
const lessonsError = ref('')
const materials = ref([])
const assignments = ref([])
const threads = ref([])
const selectedThreadId = ref('')
const threadMessages = ref([])
const enrolled = ref(false)

const enrollText = computed(() => {
  if (!authStore.token) return 'Войти, чтобы купить'
  return enrolled.value ? 'Перейти к обучению' : 'Купить курс'
})

async function selectThread(threadId) {
  selectedThreadId.value = threadId
  const response = await messagesApi.getByThreadId(threadId)
  threadMessages.value = Array.isArray(response.data) ? response.data : []
}

async function handleEnroll() {
  if (!authStore.token) {
    router.push({ name: 'auth' })
    return
  }
  if (enrolled.value) {
    router.push({ name: 'learn', params: { courseId: route.params.id } })
    return
  }
  router.push({ name: 'checkout', params: { courseId: route.params.id } })
}

onMounted(async () => {
  const courseId = route.params.id
  await store.loadCourseById(courseId)
  const styleKey = String(store.selectedCourse?.direction || store.selectedCourse?.category || '').toLowerCase()
  const allowed = new Set(['powerlifting', 'fitness', 'crossfit'])
  if (allowed.has(styleKey)) {
    document.body.setAttribute('data-course-style', styleKey)
  } else {
    document.body.removeAttribute('data-course-style')
  }
  loadingLessons.value = true
  lessonsError.value = ''
  try {
    const response = await lessonsApi.getByCourseId(courseId)
    lessons.value = Array.isArray(response.data) ? response.data : []
    const materialsRes = await materialsApi.getByCourseId(courseId)
    materials.value = Array.isArray(materialsRes.data) ? materialsRes.data : []
    const assignmentsRes = await assignmentsApi.getByCourseId(courseId)
    assignments.value = Array.isArray(assignmentsRes.data) ? assignmentsRes.data : []
    const threadsRes = await threadsApi.getByCourseId(courseId)
    threads.value = Array.isArray(threadsRes.data) ? threadsRes.data : []
    if (threads.value.length) {
      await selectThread(threads.value[0].id)
    }
    if (authStore.user?.id) {
      const enrollRes = await enrollmentsApi.getByUserAndCourse(authStore.user.id, courseId)
      enrolled.value = Array.isArray(enrollRes.data) && enrollRes.data.length > 0
    }
  } catch (error) {
    lessonsError.value = error?.message || 'Не удалось загрузить лекции.'
  } finally {
    loadingLessons.value = false
  }
})

onUnmounted(() => {
  document.body.removeAttribute('data-course-style')
})
</script>
