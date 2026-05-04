<template>
  <div>
    <Navbar />
    <main class="container mt-4">
      <div class="row">
        <aside class="col-md-3">
          <div class="card mb-3 shadow-sm">
            <div class="card-body">
              <h5>Фильтры</h5>
              <div class="mb-3">
                <label class="form-label small">Роль</label>
                <select class="form-select form-select-sm" v-model="filters.role">
                  <option value="Все">Все</option>
                  <option value="Attacker">Attacker</option>
                  <option value="Defender">Defender</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label small">Агрессия до ({{ filters.aggro }})</label>
                <input type="range" class="form-range" min="0" max="2" step="0.1" v-model="filters.aggro">
              </div>
            </div>
          </div>

          <div class="card shadow-sm">
            <div class="card-body">
              <h5>Новый агент</h5>
              <form @submit.prevent="createAgent">
                <input type="text" class="form-control form-control-sm mb-2" placeholder="Имя" v-model="form.name" required>
                <select class="form-select form-select-sm mb-2" v-model="form.role">
                  <option value="Attacker">Attacker</option>
                  <option value="Defender">Defender</option>
                </select>
                <input type="text" class="form-control form-control-sm mb-2" placeholder="Промпт" v-model="form.description" required>
                <input type="text" class="form-control form-control-sm mb-2" v-model="form.icon" required>
                <input type="number" class="form-control form-control-sm mb-2" step="0.1" v-model="form.aggressiveness" required>
                <input type="text" class="form-control form-control-sm mb-2" placeholder="Навыки" v-model="form.skills">
                <button type="submit" class="btn btn-success btn-sm w-100">Создать</button>
              </form>
            </div>
          </div>
        </aside>

        <div class="col-md-9">
          <h4 class="mb-3">Библиотека агентов</h4>
          <div class="row">
            <div class="col-md-4 mb-3" v-for="agent in filteredAgents" :key="agent.id">
              <AgentCard :agent="agent" />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '@/api'
import { useAuth } from '@/composables/useAuth'
import Navbar from '@/components/Navbar.vue'
import AgentCard from '@/components/AgentCard.vue'

const { checkAuth } = useAuth()
const allAgents = ref([])
const filters = ref({ role: 'Все', aggro: 2.0 })
const form = ref({ name: '', role: 'Attacker', description: '', icon: 'robot', aggressiveness: 0.5, skills: '' })

onMounted(() => {
  checkAuth()
  loadAgents()
})

const loadAgents = async () => {
  const res = await api.get('/agents')
  allAgents.value = res.data
}

const filteredAgents = computed(() => {
  return allAgents.value.filter(a => 
    (filters.value.role === 'Все' || a.role === filters.value.role) && 
    a.aggressiveness <= parseFloat(filters.value.aggro)
  )
})

const createAgent = async () => {
  try {
    await api.post('/agents', form.value)
    form.value = { name: '', role: 'Attacker', description: '', icon: 'robot', aggressiveness: 0.5, skills: '' }
    loadAgents()
  } catch (e) {
    alert("Ошибка создания агента")
  }
}
</script>
