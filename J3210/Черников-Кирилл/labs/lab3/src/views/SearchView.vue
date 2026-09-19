<template>
  <main id="main-content" role="main" class="container py-4 py-lg-5" tabindex="-1">
    <section class="hero p-4 p-lg-5 mb-4 fade-up">
      <h1 class="display-6 fw-bold mb-3">Поиск проектов и заданий</h1>
      <p class="text-secondary mb-0" role="status" aria-live="polite">{{ summary }}</p>
    </section>

    <div class="row g-4">
      <aside class="col-lg-4 col-xl-3" aria-label="Панель фильтров">
        <section class="glass-card p-4 filter-panel fade-up fade-up-delay">
          <h2 class="h5 mb-3">Фильтры</h2>
          <form class="d-grid gap-3" role="search" aria-describedby="filter-help">
            <p id="filter-help" class="visually-hidden">Фильтры обновляют список проектов по статусу, типу аннотации и исполнителю.</p>
            <div>
              <label for="filter-status" class="form-label">Статус</label>
              <select id="filter-status" v-model="filters.status" class="form-select">
                <option value="">Все</option>
                <option value="new">Новые</option>
                <option value="in-progress">В работе</option>
                <option value="review">На проверке</option>
              </select>
            </div>
            <div>
              <label for="filter-type" class="form-label">Тип аннотации</label>
              <select id="filter-type" v-model="filters.type" class="form-select">
                <option value="">Все</option>
                <option value="bbox">Bounding Box</option>
                <option value="class">Классификация</option>
                <option value="segmentation">Segmentation</option>
              </select>
            </div>
            <div>
              <label for="filter-worker" class="form-label">Исполнитель</label>
              <input id="filter-worker" v-model="filters.worker" type="text" class="form-control" placeholder="Например, Петров" autocomplete="off" />
            </div>
            <button type="button" class="btn btn-outline-brand" @click="resetFilters">Сбросить фильтры</button>
          </form>
        </section>
      </aside>

      <section class="col-lg-8 col-xl-9 d-grid gap-3" aria-live="polite" aria-label="Результаты поиска">
        <div v-if="error" class="glass-card p-4 text-danger">{{ error }}</div>
        <template v-else-if="projects.length === 0">
          <div class="glass-card p-4 text-secondary">Загрузка проектов...</div>
        </template>
        <template v-else>
          <ProjectCard
            v-for="project in filteredProjects"
            :key="project.id"
            :project="project"
          />
          <div v-if="filteredProjects.length === 0" class="glass-card p-4 text-center">
            <h3 class="h5">Ничего не найдено</h3>
            <p class="text-secondary mb-0">Попробуйте изменить фильтры или сбросить их.</p>
          </div>
        </template>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ProjectCard from '../components/ProjectCard.vue'
import { useApi } from '../composables/useApi'

const { get } = useApi()

const projects = ref([])
const error = ref('')
const filters = ref({ status: '', type: '', worker: '' })

const filteredProjects = computed(() => {
  return projects.value.filter((p) => {
    const statusMatch = !filters.value.status || p.status === filters.value.status
    const typeMatch = !filters.value.type || p.typeCode === filters.value.type
    const workerMatch = !filters.value.worker || p.worker.toLowerCase().includes(filters.value.worker.toLowerCase())
    return statusMatch && typeMatch && workerMatch
  })
})

const summary = computed(() => {
  if (!projects.value.length) return 'Используйте фильтрацию по статусу, типу аннотации и исполнителю, чтобы быстро найти нужные задачи.'
  return `Показано ${filteredProjects.value.length} из ${projects.value.length} проектов.`
})

function resetFilters() {
  filters.value = { status: '', type: '', worker: '' }
}

onMounted(async () => {
  try {
    projects.value = await get('/projects')
  } catch (err) {
    error.value = err.message
  }
})
</script>
