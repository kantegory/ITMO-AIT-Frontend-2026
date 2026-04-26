<template>
  <div>
    <AppNavbar />
    <main class="container my-4">
      <h1 class="h3 fw-bold mb-4">Поиск проектов</h1>
      <form @submit.prevent="filterProjects" class="row g-3 mb-5 p-4 bg-white rounded shadow-sm border">
        <div class="col-md-5">
          <label class="form-label text-muted small fw-bold text-uppercase">Название</label>
          <input v-model="searchQuery" type="text" class="form-control" placeholder="Введите название проекта...">
        </div>
        <div class="col-md-4">
          <label class="form-label text-muted small fw-bold text-uppercase">Тип разметки</label>
          <select v-model="filterType" class="form-select">
            <option value="">Все типы</option>
            <option value="bbox">Bounding Box</option>
            <option value="polygon">Сегментация</option>
            <option value="classification">Классификация</option>
          </select>
        </div>
        <div class="col-md-3 d-flex align-items-end">
          <button type="submit" class="btn btn-primary w-100 me-2">Найти</button>
          <button type="button" @click="resetSearch" class="btn btn-light w-100">Сбросить</button>
        </div>
      </form>

      <div class="row g-4">
        <div v-if="filteredProjects.length === 0" class="col-12">
          <p class="text-muted text-center py-5">Проекты не найдены. Попробуйте изменить фильтры.</p>
        </div>
        <div v-for="p in filteredProjects" :key="p.id" class="col-md-6 col-lg-4">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body">
              <h5 class="fw-bold mb-2">{{ p.name }}</h5>
              <span :class="['badge mb-3', getBadgeStyle(p.type)]">{{ getTypeText(p.type) }}</span>
              <router-link to="/annotation" class="btn btn-outline-primary btn-sm w-100">Перейти</router-link>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import AppNavbar from '../components/AppNavbar.vue'

const authStore = useAuthStore()
const projects = ref([])
const filteredProjects = ref([])
const searchQuery = ref('')
const filterType = ref('')

const getBadgeStyle = (type) => type === 'polygon' ? 'bg-success' : (type === 'classification' ? 'bg-info text-dark' : 'bg-primary')
const getTypeText = (type) => type === 'polygon' ? 'Segmentation' : (type === 'classification' ? 'Classification' : 'Bounding Box')

const loadProjects = async () => {
  const { data } = await axios.get(`/projects?userId=${authStore.user.id}`)
  projects.value = data
  filteredProjects.value = data
}

const filterProjects = () => {
  let result = projects.value
  if (searchQuery.value) {
    result = result.filter(p => p.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
  }
  if (filterType.value) {
    result = result.filter(p => p.type.toLowerCase() === filterType.value.toLowerCase())
  }
  filteredProjects.value = result
}

const resetSearch = () => {
  searchQuery.value = ''
  filterType.value = ''
  filteredProjects.value = projects.value
}

onMounted(loadProjects)
</script>