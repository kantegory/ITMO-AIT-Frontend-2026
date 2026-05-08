<template>
  <section>
    <h4 class="mb-4 fw-bold">Избранное</h4>
    <div v-if="isLoading" class="spinner-center">
      <div class="spinner-border text-primary"></div>
    </div>
    <p v-else-if="courses.length === 0" class="text-muted">Нет избранных курсов</p>
    <div v-else class="row g-4">
      <div v-for="course in courses" :key="course.id" class="col-md-6 col-xl-4">
        <div class="course-card-lk">
          <img :src="course.image" :alt="course.title"/>
          <div class="card-body">
            <h3 class="fw-semibold mb-1" style="font-size: 1rem">{{ course.title }}</h3>
            <p class="small text-muted mb-2">{{ course.shortDescription }}</p>
            <div class="d-flex gap-2">
              <router-link :to="`/course/${course.id}`" class="btn btn-primary btn-sm">Подробнее
              </router-link>
              <button class="btn btn-outline-danger btn-sm" @click="removeFavorite(course.id)">
                <svg class="icon">
                  <use href="#icon-heart-fill"></use>
                </svg>
              </button>
            </div>
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

async function loadFavorites() {
  try {
    const {data: userData} = await usersApi.getById(auth.user.id)
    const favorites = userData.favorites || []
    if (favorites.length === 0) {
      courses.value = [];
      return
    }

    const {data} = await coursesApi.getAll({id: favorites})
    courses.value = data
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

async function removeFavorite(courseId) {
  try {
    const {data: userData} = await usersApi.getById(auth.user.id)
    const newFavs = (userData.favorites || []).filter((id) => id !== courseId)
    await usersApi.update(auth.user.id, {favorites: newFavs})
    courses.value = courses.value.filter((c) => c.id !== courseId)
  } catch (err) {
    console.error(err)
  }
}

onMounted(loadFavorites)
</script>
