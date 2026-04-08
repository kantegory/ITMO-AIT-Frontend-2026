<template>
  <base-layout>
    <h1 class="h4 mb-3">Кабинет студента</h1>
    <section class="card shadow-sm mb-3">
      <div class="card-body">
        <div class="mb-2">{{ fullName }}</div>
        <div class="small text-secondary">Активных курсов: {{ enrollments.length }}</div>
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
const fullName = computed(() =>
  [authStore.user?.firstName, authStore.user?.lastName].filter(Boolean).join(' ') || authStore.user?.email
)

function courseTitle(courseId) {
  return courses.value.find((c) => c.id === courseId)?.title || courseId
}

onMounted(async () => {
  const [enrRes, certRes, coursesRes] = await Promise.all([
    enrollmentsApi.listByUserId(authStore.user.id),
    certificatesApi.listByUserId(authStore.user.id),
    coursesApi.getAll()
  ])
  enrollments.value = Array.isArray(enrRes.data) ? enrRes.data : []
  certificates.value = Array.isArray(certRes.data) ? certRes.data : []
  courses.value = Array.isArray(coursesRes.data) ? coursesRes.data : []
})
</script>
