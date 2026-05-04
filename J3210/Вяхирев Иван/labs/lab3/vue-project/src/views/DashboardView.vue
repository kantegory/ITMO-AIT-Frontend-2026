<template>
  <div>
    <Navbar />
    <main class="container mt-4">
      <div class="row mb-4">
        <div class="col-6">
          <h2>Управление симуляциями</h2>
        </div>
        <div class="col-6 text-end">
          <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#createModal">
            <svg class="icon me-1"><use href="/assets/sprite.svg#plus-circle-fill"></use></svg>
            Создать новую симуляцию
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 mb-3" v-for="sim in simulations" :key="sim.id">
          <div class="card h-100 shadow-sm border-0">
            <div class="card-header bg-dark text-white">
              {{ sim.name }} <span class="badge bg-secondary float-end">{{ sim.status }}</span>
            </div>
            <div class="card-body d-flex flex-column">
              <p class="mb-1"><strong>Blue Team:</strong> {{ sim.blue_team_name }}</p>
              <p class="mb-2"><strong>Red Team:</strong> {{ sim.red_team_name }}</p>
              <p class="small text-muted flex-grow-1">{{ sim.description }}</p>
              <router-link to="/simulation" class="btn btn-primary w-100 mt-2">Войти в симуляцию</router-link>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div class="modal fade" id="createModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Создать симуляцию</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="createSimulation">
              <div class="mb-3">
                <label class="form-label">Название</label>
                <input type="text" class="form-control" v-model="form.name" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Статус</label>
                <select class="form-select" v-model="form.status">
                  <option value="Активно">Активно</option>
                  <option value="Пауза">Приостановлено</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Описание</label>
                <input type="text" class="form-control" v-model="form.description" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Blue Team</label>
                <input type="text" class="form-control" v-model="form.blue_team_name" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Red Team</label>
                <input type="text" class="form-control" v-model="form.red_team_name" required>
              </div>
              <button type="submit" class="btn btn-primary w-100">Создать</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/api'
import { useAuth } from '@/composables/useAuth'
import Navbar from '@/components/Navbar.vue'
import { Modal } from 'bootstrap'

const { checkAuth } = useAuth()
const simulations = ref([])
const form = ref({ name: '', status: 'Активно', description: '', blue_team_name: '', red_team_name: '' })

onMounted(async () => {
  checkAuth()
  loadSimulations()
})

const loadSimulations = async () => {
  const res = await api.get('/simulations')
  simulations.value = res.data
}

const createSimulation = async () => {
  try {
    await api.post('/simulations', form.value)
    form.value = { name: '', status: 'Активно', description: '', blue_team_name: '', red_team_name: '' }
    Modal.getInstance(document.getElementById('createModal')).hide()
    loadSimulations()
  } catch (e) {
    alert("Ошибка создания симуляции")
  }
}
</script>
