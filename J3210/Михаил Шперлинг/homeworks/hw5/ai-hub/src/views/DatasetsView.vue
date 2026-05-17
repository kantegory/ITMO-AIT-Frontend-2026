<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseLayout from '@/layouts/BaseLayout.vue'
import FilterPanel from '@/components/FilterPanel.vue'
import ResourceCard from '@/components/ResourceCard.vue'
import CreateResourceModal from '@/components/CreateResourceModal.vue'
import { datasetsApi } from '@/api'
import { useFilters } from '@/composables/useFilters'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const createModal = ref(null)

const items = ref([])
const loading = ref(false)
const error = ref(null)

const { search, activeTasks, selectedFormat, filtered } = useFilters(items)

async function loadItems() {
  loading.value = true
  error.value = null
  try {
    const res = await datasetsApi.getAll()
    items.value = res.data
  } catch {
    error.value = 'Ошибка сети. Убедитесь, что json-server запущен (npm run api).'
  } finally {
    loading.value = false
  }
}

function openCreateModal() {
  if (!authStore.isLoggedIn) {
    router.push('/login')
    return
  }
  createModal.value.open()
}

onMounted(loadItems)
</script>

<template>
  <base-layout>
    <div class="row">
      <aside class="col-md-3 mb-4" aria-label="Фильтры">
        <filter-panel
          :show-framework="false"
          v-model:active-tasks="activeTasks"
          v-model:selected-format="selectedFormat"
        />
      </aside>

      <main class="col-md-9" aria-label="Список датасетов">
        <div class="input-group mb-4 shadow-sm">
          <span class="input-group-text border-end-0">
            <svg class="svg-icon" aria-hidden="true"><use href="/sprite.svg#icon-search"></use></svg>
          </span>
          <input
            v-model="search"
            type="text"
            class="form-control border-start-0 ps-0"
            placeholder="Поиск по датасетам..."
            aria-label="Поиск датасетов"
          >
          <button @click="openCreateModal" class="btn btn-success ms-2 rounded" type="button">
            Загрузить датасет
          </button>
        </div>

        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Загрузка...</span>
          </div>
        </div>
        <div v-else-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
        <div v-else class="row row-cols-1 row-cols-md-2 g-4" aria-live="polite">
          <div v-for="item in filtered" :key="item.id" class="col">
            <resource-card :item="item" type="datasets" />
          </div>
          <div v-if="filtered.length === 0" class="col-12">
            <p class="text-muted">По вашему запросу ничего не найдено.</p>
          </div>
        </div>
      </main>
    </div>

    <create-resource-modal ref="createModal" type="datasets" @created="loadItems" />
  </base-layout>
</template>
