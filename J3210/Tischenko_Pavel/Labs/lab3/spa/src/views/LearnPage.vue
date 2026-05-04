<template>
  <base-layout>
    <div class="mb-3">
      <router-link class="small text-decoration-none" :to="{ name: 'course', params: { id: courseId } }">
        ← Назад к курсу
      </router-link>
    </div>
    <section class="card shadow-sm mb-3">
      <div class="card-body">
        <h1 class="h4 mb-2">{{ course?.title || 'Обучение' }}</h1>
        <p class="small text-secondary mb-0">Прогресс: {{ progressPercent }}%</p>
      </div>
    </section>

    <section class="card shadow-sm">
      <div class="card-body">
        <div class="btn-group btn-group-sm mb-3">
          <button class="btn" :class="tab==='lessons'?'btn-primary':'btn-outline-primary'" @click="tab='lessons'">
            Лекции
          </button>
          <button class="btn" :class="tab==='seminars'?'btn-primary':'btn-outline-primary'" @click="tab='seminars'">
            Семинары
          </button>
        </div>
        <ul class="list-group mb-3" v-if="items.length">
          <li class="list-group-item d-flex justify-content-between align-items-center" v-for="it in items" :key="it.id">
            <span>{{ it.title }}</span>
            <button class="btn btn-sm btn-outline-success" :disabled="isDone(it.id)" @click="complete(it.id)">
              {{ isDone(it.id) ? 'Выполнено' : 'Отметить выполненным' }}
            </button>
          </li>
        </ul>
        <div v-else class="text-secondary">Нет элементов для текущей вкладки.</div>
      </div>
    </section>
  </base-layout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { assignmentsApi, certificatesApi, coursesApi, enrollmentsApi, lessonsApi } from '../api'
import BaseLayout from '../layouts/BaseLayout.vue'
import useAuthStore from '../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const courseId = route.params.courseId
const course = ref(null)
const enrollment = ref(null)
const lessons = ref([])
const seminars = ref([])
const tab = ref('lessons')

const items = computed(() => (tab.value === 'lessons' ? lessons.value : seminars.value))
const progressPercent = computed(() => {
  const total = lessons.value.length + seminars.value.length
  const done = (enrollment.value?.completedLessons || []).length + (enrollment.value?.completedSeminars || []).length
  return total ? Math.round((done / total) * 100) : 0
})

function isDone(id) {
  if (!enrollment.value) return false
  if (tab.value === 'lessons') return (enrollment.value.completedLessons || []).includes(id)
  return (enrollment.value.completedSeminars || []).includes(id)
}

onMounted(async () => {
  try {
    const [courseRes, lessonsRes, seminarsRes, enrRes] = await Promise.all([
      coursesApi.getOne(courseId),
      lessonsApi.getByCourseId(courseId),
      assignmentsApi.getByCourseId(courseId),
      enrollmentsApi.getByUserAndCourse(authStore.user.id, courseId)
    ])
    course.value = courseRes.data
    lessons.value = Array.isArray(lessonsRes.data) ? lessonsRes.data : []
    seminars.value = Array.isArray(seminarsRes.data) ? seminarsRes.data : []
    enrollment.value = Array.isArray(enrRes.data) ? enrRes.data[0] : null
    if (!enrollment.value?.id) {
      router.push({ name: 'checkout', params: { courseId } })
    }
  } catch {
    router.push({ name: 'catalog' })
  }
})

async function complete(id) {
  if (!enrollment.value) return
  const completedLessons = [...(enrollment.value.completedLessons || [])]
  const completedSeminars = [...(enrollment.value.completedSeminars || [])]
  if (tab.value === 'lessons' && !completedLessons.includes(id)) completedLessons.push(id)
  if (tab.value === 'seminars' && !completedSeminars.includes(id)) completedSeminars.push(id)
  const total = lessons.value.length + seminars.value.length
  const done = completedLessons.length + completedSeminars.length
  const progress = total ? done / total : 0
  await enrollmentsApi.patch(enrollment.value.id, { completedLessons, completedSeminars, progress })
  enrollment.value = { ...enrollment.value, completedLessons, completedSeminars, progress }

  if (progress >= 1) {
    const certsRes = await certificatesApi.listByUserId(authStore.user.id)
    const exists = Array.isArray(certsRes.data) && certsRes.data.some((c) => c.courseId === courseId)
    if (!exists) {
      const cert = await certificatesApi.create({
        id: `cert_${Date.now()}`,
        userId: authStore.user.id,
        courseId,
        title: `Сертификат: ${course.value.title}`,
        issuedAt: new Date().toISOString()
      })
      router.push({ name: 'certificate', params: { id: cert.data.id } })
    }
  }
}
</script>
