import { computed, onMounted, ref } from 'vue'

import { fetchModels, fetchTrendingModels } from '@/api/models'
import { localDetails } from '@/data/appData'

function formatDownloads(value) {
  return Number(value || 0).toLocaleString('ru-RU')
}

function modelIdToSlug(modelId) {
  return modelId
    .split('/')
    .pop()
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-|-$/g, '')
}

function mapRemoteModel(model) {
  const title = model.modelId.split('/').pop()
  const task = model.pipeline_tag || 'AI Model'
  const library = model.library_name || 'Transformers'
  const author = model.modelId.split('/')[0]
  const slug = modelIdToSlug(model.modelId)

  return {
    id: model.id || model.modelId,
    title,
    description: `${task} • Автор: ${author} • Библиотека: ${library}`,
    type: 'Model',
    buttonText: 'Изучить',
    downloads: formatDownloads(model.downloads),
    meta: library,
    author,
    task,
    to: {
      name: 'details',
      params: { slug },
      query: { model: model.modelId }
    }
  }
}

export function useCatalog() {
  const search = ref('')
  const selectedTask = ref('')
  const selectedLicense = ref('')
  const selectedFrameworks = ref([])

  const models = ref([])
  const trends = ref([])
  const loadingModels = ref(false)
  const loadingTrends = ref(false)
  const modelsError = ref('')
  const trendsError = ref('')

  const localFeaturedCards = computed(() => Object.entries(localDetails).map(([slug, item], index) => ({
    id: `local-${slug}-${index}`,
    title: item.title,
    description: item.description[0],
    type: slug.includes('dataset') ? 'Dataset' : 'Model',
    buttonText: 'Изучить',
    downloads: null,
    meta: item.author,
    author: item.author,
    task: '',
    to: {
      name: 'details',
      params: { slug }
    }
  })))

  async function loadModels() {
    loadingModels.value = true
    modelsError.value = ''

    try {
      const remoteModels = await fetchModels({
        search: search.value,
        task: selectedTask.value,
        license: selectedLicense.value,
        frameworks: selectedFrameworks.value
      })

      models.value = remoteModels.map(mapRemoteModel)
    } catch (error) {
      console.error('Ошибка загрузки моделей:', error)
      modelsError.value = 'Не удалось загрузить модели с Hugging Face. Показаны локальные карточки.'
      models.value = localFeaturedCards.value
    } finally {
      loadingModels.value = false
    }
  }

  async function loadTrends() {
    loadingTrends.value = true
    trendsError.value = ''

    try {
      const remoteTrends = await fetchTrendingModels()
      trends.value = remoteTrends.map(mapRemoteModel)
    } catch (error) {
      console.error('Ошибка загрузки трендов:', error)
      trendsError.value = 'Не удалось загрузить мировые тренды.'
      trends.value = localFeaturedCards.value.slice(0, 3)
    } finally {
      loadingTrends.value = false
    }
  }

  function toggleFramework(framework) {
    if (selectedFrameworks.value.includes(framework)) {
      selectedFrameworks.value = selectedFrameworks.value.filter((item) => item !== framework)
      return
    }

    selectedFrameworks.value = [...selectedFrameworks.value, framework]
  }

  async function applyFilters() {
    await loadModels()
  }

  onMounted(async () => {
    await Promise.all([loadModels(), loadTrends()])
  })

  return {
    search,
    selectedTask,
    selectedLicense,
    selectedFrameworks,
    models,
    trends,
    loadingModels,
    loadingTrends,
    modelsError,
    trendsError,
    toggleFramework,
    applyFilters
  }
}
