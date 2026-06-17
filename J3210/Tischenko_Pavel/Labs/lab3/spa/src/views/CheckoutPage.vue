<template>
  <base-layout>
    <div class="mb-3">
      <router-link class="small text-decoration-none" :to="{ name: 'course', params: { id: courseId } }">
        ← Назад к курсу
      </router-link>
    </div>
    <section class="card shadow-sm" v-if="course">
      <div class="card-body">
        <h1 class="h4 mb-2">Оформление курса</h1>
        <p class="mb-2">{{ course.title }}</p>
        <p class="small text-secondary mb-3">
          Направление: {{ course.direction }} · Уровень: {{ course.level }}
        </p>
        <div class="fw-semibold fs-5 mb-3">
          {{ Number(course.price || 0).toLocaleString('ru-RU') }} ₽
        </div>
        <button class="btn btn-primary" :disabled="loading" @click="pay">
          {{ loading ? 'Оплачиваем...' : 'Оплатить и начать' }}
        </button>
      </div>
    </section>
  </base-layout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { coursesApi, enrollmentsApi } from '../api'
import BaseLayout from '../layouts/BaseLayout.vue'
import useAuthStore from '../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const courseId = route.params.courseId
const course = ref(null)
const loading = ref(false)

onMounted(async () => {
  const response = await coursesApi.getOne(courseId)
  course.value = response.data
})

async function pay() {
  loading.value = true
  const existing = await enrollmentsApi.getByUserAndCourse(authStore.user.id, courseId)
  if (!Array.isArray(existing.data) || !existing.data.length) {
    await enrollmentsApi.create({
      id: `enr_${Date.now()}`,
      userId: authStore.user.id,
      courseId,
      progress: 0,
      completedLessons: [],
      completedSeminars: [],
      createdAt: new Date().toISOString()
    })
  }
  router.push({ name: 'learn', params: { courseId } })
}
</script>
