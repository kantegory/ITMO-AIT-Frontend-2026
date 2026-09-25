<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'
import { usePageTitle } from '@/composables/usePageTitle'
import ItemCard from '../components/ItemCard.vue'

const authStore = useAuthStore()

const activeTab = ref('models')

const userStats = ref({
  starsCount: 0,
  modelIds: [],
  datasetIds: [],
  subscriptions: []
})

const models = ref([])
const datasets = ref([])

usePageTitle(computed(() => authStore.displayName ? `Профиль ${authStore.displayName}` : 'Мой профиль'))

async function fetchItemsByIds(resource, ids) {
  if (!ids || ids.length === 0) return []
  const params = new URLSearchParams()
  ids.forEach(id => params.append('id', String(id)))
  const response = await api.get(`/${resource}`, { params })
  return response.data
}

async function loadProfile() {
  if (!authStore.user?.id) return

  try {
    const userRes = await api.get(`/users/${authStore.user.id}`)
    userStats.value = userRes.data

    models.value = await fetchItemsByIds('models', userStats.value.modelIds)
    datasets.value = await fetchItemsByIds('datasets', userStats.value.datasetIds)
  } catch (err) {
    console.error('Ошибка загрузки профиля:', err)
  }
}

onMounted(() => {
  loadProfile()
})
</script>

<template>
  <div>
    <section class="profile-header mb-5" id="profileHeader">
      <div class="d-flex align-items-center">
        <img src="https://www.placekittens.com/80/80" alt="Avatar" class="rounded-circle me-4" id="profileAvatar">
        <div>
          <h1 class="display-6 fw-bold">{{ authStore.displayName }}</h1>
          <div class="d-flex gap-3 small text-contrast">
            <span><strong>{{ userStats.modelIds?.length || 0 }}</strong> Моделей</span>
            <span><strong>{{ userStats.datasetIds?.length || 0 }}</strong> Датасетов</span>
            <router-link to="/subscriptions" class="link-primary link-underline-opacity-0 link-underline-opacity-100-hover text-reset">
                <strong>{{ userStats.subscriptions?.length || 0 }}</strong> Подписок
            </router-link>
            <span>
              <strong>{{ userStats.starsCount || 0 }}</strong> 
              <svg class="svg-icon" aria-hidden="true"><use href="/icons.svg#star-fill"></use></svg>
            </span>
          </div>
        </div>
      </div>
    </section>

    <section>
      <ul class="nav nav-tabs mb-4" id="profileTabs">
        <li class="nav-item">
            <button class="nav-link text-reset" :class="{ active: activeTab === 'models' }" @click="activeTab = 'models'" type="button">
                Мои Модели
            </button>
        </li>
        <li class="nav-item">
            <button class="nav-link text-reset" :class="{ active: activeTab === 'datasets' }" @click="activeTab = 'datasets'" type="button">
                Мои Датасеты
            </button>
        </li>
      </ul>

      <div class="tab-content bg-transparent" id="profileTabsContent">
        
        <div v-show="activeTab === 'models'">
          <div v-if="models.length > 0" class="row g-4">
            <ItemCard v-for="model in models" :key="model.id" :item="model" type="model" />
          </div>
          <div v-else class="text-center py-5">
            <svg class="svg-icon display-1 text-blunted opacity-25" aria-hidden="true"><use href="/icons.svg#cpu"></use></svg>
            <p class="text-blunted mt-3">Вы пока не загрузили ни одной модели.</p>
            <button class="btn bg-primary text-white mt-1" type="button">Загрузить модель</button>
          </div>
        </div>

        <div v-show="activeTab === 'datasets'">
          <div v-if="datasets.length > 0" class="row g-4">
            <ItemCard v-for="dataset in datasets" :key="dataset.id" :item="dataset" type="dataset" />
          </div>
          <div v-else class="text-center py-5">
            <svg class="svg-icon display-1 text-blunted opacity-25" aria-hidden="true"><use href="/icons.svg#database"></use></svg>
            <p class="text-blunted mt-3">Вы пока не загрузили ни одного датасета.</p>
            <button class="btn bg-primary text-white mt-1" type="button">Загрузить датасет</button>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>