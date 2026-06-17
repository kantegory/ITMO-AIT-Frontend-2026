<template>
  <section>
    <h4 class="mb-4 fw-bold">Мои курсы</h4>
    <div v-if="isLoading" class="spinner-center">
      <div class="spinner-border text-primary"></div>
    </div>
    <p v-else-if="courses.length === 0" class="text-muted">Вы ещё не записаны ни на один курс</p>
    <div v-else class="row g-4">
      <div v-for="course in courses" :key="course.id" class="col-md-6 col-xl-4">
        <div class="course-card-lk">
          <img :src="course.image" :alt="course.title"/>
          <div class="card-body">
            <h3 class="fw-semibold mb-1" style="font-size: 1rem">{{ course.title }}</h3>
            <p class="small text-muted mb-2">{{ course.shortDescription }}</p>
            <router-link :to="`/course/${course.id}/learn`" class="btn btn-primary btn-sm">Перейти к
              курсу
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
import {usersApi, coursesApi} from '@/api'

const auth = useAuthStore()
const isLoading = ref(true)
const courses = ref([])

onMounted(async () => {
  try {
    const {data: userData} = await usersApi.getById(auth.user.id)
    const enrolled = userData.enrolledCourses || []
    if (enrolled.length === 0) return

    const {data} = await coursesApi.getAll({id: enrolled})
    courses.value = data
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
})
</script>
