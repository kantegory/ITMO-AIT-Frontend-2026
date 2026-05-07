<template>
  <div class="bg-light min-vh-100">
    <AppNavbar />
    <main class="container my-4" id="main-content">
      <h1 class="h4 mb-3">Поиск</h1>

      <form @submit.prevent="doSearch" class="row g-3 mb-4">
        <div class="col-md-4">
          <label class="form-label" for="search-query">Запрос</label>
          <input id="search-query" type="text" class="form-control" v-model="query" placeholder="Название" autocomplete="off" />
        </div>
        <div class="col-md-4">
          <label class="form-label" for="filter-type">Тип</label>
          <select id="filter-type" class="form-select" v-model="filterType">
            <option value="">Все</option>
            <option value="marketing">Marketing</option>
            <option value="dev">Dev</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="col-md-4 d-flex align-items-end gap-2">
          <button type="submit" class="btn btn-primary">Найти</button>
          <button type="button" class="btn btn-outline-secondary" @click="reset">Сбросить</button>
        </div>
      </form>

      <section aria-labelledby="search-results-title">
        <h2 id="search-results-title" class="visually-hidden">Результаты поиска</h2>
        <p class="small text-muted">Найдено: {{ results.length }}</p>
        <ul v-if="results.length" class="list-group">
          <li v-for="item in results" :key="item.id" class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <div class="fw-semibold">{{ item.name }}</div>
              <div v-if="item.description" class="small text-muted">{{ item.description }}</div>
            </div>
            <span class="badge bg-secondary text-capitalize">{{ item.type }}</span>
          </li>
        </ul>
        <EmptyState v-else-if="searched" title="Ничего не найдено" />
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppNavbar from '@/components/AppNavbar.vue'
import EmptyState from '@/components/EmptyState.vue'
import { getWorkspaces } from '@/api/workspaces'

const query = ref('')
const filterType = ref('')
const all = ref([])
const results = ref([])
const searched = ref(false)

onMounted(async () => {
  const { data } = await getWorkspaces()
  all.value = data
  results.value = data
})

function doSearch() {
  searched.value = true
  const q = query.value.trim().toLowerCase()
  const t = filterType.value
  results.value = all.value.filter(item => {
    const byName = !q || item.name.toLowerCase().includes(q)
    const byType = !t || item.type === t
    return byName && byType
  })
}

function reset() {
  query.value = ''
  filterType.value = ''
  results.value = all.value
  searched.value = false
}
</script>