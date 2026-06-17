<template>
  <div>
    <section class="bg-dark text-white py-5">
      <div class="container">
        <h1 class="mb-3">AI Model &amp; Dataset Hub</h1>
        <p class="lead mb-4">Платформа для публикации и поиска моделей и датасетов машинного обучения</p>
        <div class="row g-2 mb-4" style="max-width:500px;">
          <div class="col">
            <input v-model="searchQ" type="text" class="form-control" placeholder="Поиск...">
          </div>
          <div class="col-auto">
            <button class="btn btn-primary" @click="goSearch">Найти</button>
          </div>
        </div>
        <div class="d-flex gap-4">
          <div><h4 class="mb-0">47K+</h4><small class="text-secondary">Моделей</small></div>
          <div><h4 class="mb-0">12K+</h4><small class="text-secondary">Датасетов</small></div>
          <div><h4 class="mb-0">180K+</h4><small class="text-secondary">Пользователей</small></div>
        </div>
      </div>
    </section>

    <div class="container py-4">
      <h2 class="h4 mb-3">Популярные модели</h2>
      <div v-if="loading" class="text-muted">Загрузка...</div>
      <div v-else class="row g-3">
        <ModelCard v-for="m in topModels" :key="m.id" :model="m" col="col-md-4" />
      </div>

      <h2 class="h4 mt-5 mb-3">Категории</h2>
      <div class="d-flex flex-wrap gap-2">
        <RouterLink v-for="cat in categories" :key="cat" :to="'/search?task=' + cat"
          class="btn btn-outline-secondary btn-sm">{{ cat }}</RouterLink>
      </div>

      <h2 class="h4 mt-5 mb-3">Новые датасеты</h2>
      <div class="row g-3">
        <ModelCard v-for="d in topDatasets" :key="d.id" :model="d" col="col-md-4" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '../composables/useApi.js'
import ModelCard from '../components/ModelCard.vue'

const router = useRouter()
const { getModels } = useApi()

const models = ref([])
const loading = ref(true)
const searchQ = ref('')

const categories = ['NLP', 'Computer Vision', 'Tabular', 'Audio', 'Multimodal']

const topModels = computed(() =>
  [...models.value].filter(m => m.type === 'model').sort((a, b) => b.stars - a.stars).slice(0, 3)
)
const topDatasets = computed(() =>
  models.value.filter(m => m.type === 'dataset').slice(0, 3)
)

function goSearch() {
  router.push('/search?q=' + searchQ.value)
}

onMounted(async () => {
  try {
    models.value = await getModels()
  } catch {
    models.value = []
  } finally {
    loading.value = false
  }
})
</script>
