<template>
  <div>
    <Navbar />
    <main class="container">
      <div class="row">
        <div class="col-md-3">
          <aside class="filter-sidebar mb-4">
            <h5>Фильтры</h5>
            <hr>
            <div class="mb-3">
              <label class="form-label" for="categorySelect">Категория</label>
              <select class="form-select" v-model="selectedCategory">
                <option value="all">Все</option>
                <option value="programming">Программирование</option>
                <option value="design">Дизайн</option>
              </select>
            </div>
          </aside>
        </div>

        <div class="col-md-9">
          <div class="row">
            <div v-for="course in filteredCourses" :key="course.id" class="col-md-6 mb-4">
              <CourseCard :course="course" :isEnrolled="false" @enroll="openModal(course)" />
            </div>
          </div>
        </div>
      </div>
    </main>

    <div v-if="showModal" class="modal fade show" style="display: block; background: rgba(0,0,0,0.5)" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content edu-card">
          <div class="modal-header border-0">
            <h5 class="modal-title">Подтверждение</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            Вы уверены, что хотите записаться на курс: <strong>{{ selectedCourse?.title }}</strong>?
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-light" @click="closeModal">Отмена</button>
            <button type="button" class="btn-brand" @click="confirmEnrollment">Подтвердить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Navbar from '../components/Navbar.vue'
import CourseCard from '../components/CourseCard.vue'
import { useAuth } from '../composables/useAuth'

const { currentUser } = useAuth()
const allCourses = ref([])
const selectedCategory = ref('all')
const showModal = ref(false)
const selectedCourse = ref(null)

const filteredCourses = computed(() => {
  if (selectedCategory.value === 'all') return allCourses.value
  return allCourses.value.filter(c => c.category === selectedCategory.value)
})

onMounted(async () => {
  const response = await axios.get('http://localhost:3000/courses')
  allCourses.value = response.data
})

const openModal = (course) => {
  selectedCourse.value = course
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedCourse.value = null
}

const confirmEnrollment = async () => {
  try {
    const userRes = await axios.get(`http://localhost:3000/users/${currentUser.value.id}`)
    const userData = userRes.data
    const userCourses = userData.myCourses || []

    if (!userCourses.includes(selectedCourse.value.id)) {
      userCourses.push(selectedCourse.value.id)
      await axios.patch(`http://localhost:3000/users/${currentUser.value.id}`, {
        myCourses: userCourses
      })
      userData.myCourses = userCourses
      localStorage.setItem('user', JSON.stringify(userData))
      currentUser.value = userData
      alert(`Курс "${selectedCourse.value.title}" добавлен в личный кабинет!`)
    } else {
      alert('Вы уже записаны на этот курс.')
    }
    closeModal()
  } catch (error) {
    alert('Не удалось записаться на курс.')
  }
}
</script>
