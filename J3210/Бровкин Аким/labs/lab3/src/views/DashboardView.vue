<template>
  <div>
    <Navbar />
    <main class="container">
      <h2 class="mb-4">Личный кабинет</h2>
      <div class="row">
        <div v-for="course in enrolledCourses" :key="course.id" class="col-md-6 mb-4">
          <CourseCard :course="course" :isEnrolled="true" />
        </div>
        
        <div class="col-md-6 mb-4">
          <div class="edu-card course-card p-3 border rounded text-center d-flex flex-column justify-content-center h-100" style="border-style: dashed !important; background: transparent;">
            <p class="text-muted">Хотите изучить что-то новое?</p>
            <router-link to="/search" class="btn btn-outline-primary d-inline-flex align-items-center mx-auto">
              <svg class="icon me-1"><use href="#icon-search"></use></svg>Найти новый курс
            </router-link>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Navbar from '../components/Navbar.vue'
import CourseCard from '../components/CourseCard.vue'
import { useAuth } from '../composables/useAuth'

const { currentUser } = useAuth()
const enrolledCourses = ref([])

onMounted(async () => {
  const userRes = await axios.get(`http://localhost:3000/users/${currentUser.value.id}`)
  const userData = userRes.data
  const coursesRes = await axios.get('http://localhost:3000/courses')
  const allCourses = coursesRes.data
  const userCourseIds = userData.myCourses || []
  enrolledCourses.value = allCourses.filter(c => userCourseIds.includes(c.id))
})
</script>
