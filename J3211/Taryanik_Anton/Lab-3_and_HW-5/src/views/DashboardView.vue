<template>
  <div>
    <AppNavbar />
    <main class="container my-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h3 fw-bold mb-1">Обзор рабочего пространства</h1>
          <p class="text-muted mb-0">Управляйте вашими датасетами и задачами разметки.</p>
        </div>
        <button class="btn btn-primary shadow-sm" @click="showProjectModal">
          Создать проект
        </button>
      </div>

      <div class="row mb-5 g-3">
        <div class="col-md-4">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body">
              <p class="text-muted small fw-medium mb-1 text-uppercase">Активные проекты</p>
              <h2 class="display-6 fw-bold mb-0">{{ projects.length }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body">
              <p class="text-muted small fw-medium mb-1 text-uppercase">Размечено файлов</p>
              <h2 class="display-6 fw-bold mb-0">0</h2>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body">
              <p class="text-muted small fw-medium mb-1 text-uppercase">Среднее качество</p>
              <div class="d-flex align-items-center gap-2">
                <h2 class="display-6 fw-bold mb-0">0%</h2>
                <span class="badge bg-secondary">Нет данных</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h4 class="fw-bold mb-3">Ваши проекты</h4>
      <div class="row g-4">
        <div v-if="projects.length === 0" class="col-12 text-muted py-4">У вас пока нет проектов. Создайте первый!</div>
        <div v-for="project in projects" :key="project.id" class="col-md-6 col-lg-4">
          <div class="card h-100 border-0 shadow-sm" style="animation: fadeIn 0.5s;">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="card-title fw-bold mb-0">{{ project.name }}</h5>
                <span :class="['badge', getBadgeStyle(project.type)]">{{ getTypeText(project.type) }}</span>
              </div>
              <p class="text-muted small mb-3">{{ project.images || 0 }} изображений</p>
              <div class="progress mb-3" style="height: 6px;">
                <div :class="['progress-bar', getBadgeStyle(project.type)]" role="progressbar" :style="{ width: (project.progress || 0) + '%' }"></div>
              </div>
              <router-link to="/annotation" class="btn btn-outline-primary btn-sm w-100">Перейти к разметке</router-link>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div class="modal fade" id="newProjectModal" ref="modalRef" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg" style="border-radius: var(--lf-radius-lg);">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">Новый проект разметки</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="createProject">
              <div class="mb-3">
                <label class="form-label">Название проекта</label>
                <input v-model="newProjectName" type="text" class="form-control" placeholder="Например: Дефекты на производстве" required>
              </div>
              <div class="mb-4">
                <label class="form-label">Тип аннотации</label>
                <select v-model="newProjectType" class="form-select" required>
                  <option value="bbox">Bounding Box</option>
                  <option value="polygon">Polygon</option>
                  <option value="classification">Classification</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary w-100">Создать проект</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import AppNavbar from '../components/AppNavbar.vue'
import * as bootstrap from 'bootstrap'

const authStore = useAuthStore()
const projects = ref([])
const newProjectName = ref('')
const newProjectType = ref('bbox')
const modalRef = ref(null)

const getBadgeStyle = (type) => type === 'polygon' ? 'bg-success' : (type === 'classification' ? 'bg-info text-dark' : 'bg-primary')
const getTypeText = (type) => type === 'polygon' ? 'Segmentation' : (type === 'classification' ? 'Classification' : 'Bounding Box')

const loadProjects = async () => {
  const { data } = await axios.get(`/projects?userId=${authStore.user.id}`)
  projects.value = data
}


let modalInstance = null

const showProjectModal = () => {
  modalInstance.show()
}

const createProject = async () => {
  const newProject = {
    userId: authStore.user.id,
    name: newProjectName.value.trim(),
    type: newProjectType.value,
    images: 0,
    progress: 0
  }
  await axios.post('/projects', newProject)
  newProjectName.value = ''
  newProjectType.value = 'bbox'

  modalInstance.hide()

  loadProjects()
}


onMounted(() => {
  modalInstance = new bootstrap.Modal(modalRef.value)
  loadProjects()
})
</script>