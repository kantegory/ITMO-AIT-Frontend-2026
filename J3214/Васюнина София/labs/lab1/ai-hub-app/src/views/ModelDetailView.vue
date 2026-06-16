<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useModels } from '@/composables/useModels'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { fetchModelDetails, fetchModelFiles, toggleLike, isLiked } = useModels()

const model = ref(null)
const files = ref([])
const loading = ref(true)
const error = ref(null)
const activeTab = ref('card')

const modelId = computed(() => route.params.modelId)

const fetchModelData = async () => {
  loading.value = true
  error.value = null

  try {
    const modelData = await fetchModelDetails(modelId.value)
    model.value = modelData

    const filesData = await fetchModelFiles(modelId.value)
    files.value = filesData
  } catch (err) {
    console.error('Error fetching model:', err)
    error.value = 'Не удалось загрузить данные модели'
  } finally {
    loading.value = false
  }
}

const formattedDownloads = computed(() => {
  if (!model.value) return '0'
  const downloads = model.value.downloads || 0
  if (downloads >= 1000) {
    return (downloads / 1000).toFixed(1) + 'k'
  }
  return downloads
})

const modelName = computed(() => {
  return modelId.value.split('/').pop() || 'Unknown Model'
})

const author = computed(() => {
  return model.value?.author || 'Community'
})

const task = computed(() => {
  return model.value?.pipeline_tag || 'Generic Model'
})

onMounted(() => {
  fetchModelData()
})
</script>

<template>
  <div class="model-detail-page container my-5">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-info" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="error" class="text-center py-5 text-danger">
      {{ error }}
      <button @click="router.back()" class="btn btn-outline-info mt-3">Go Back</button>
    </div>

    <div v-else-if="model" class="model-detail-page container my-5">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4 gap-3">
        <div>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-2">
              <li class="breadcrumb-item">
                <router-link to="/explore" class="text-info text-decoration-none small">Models</router-link>
              </li>
              <li class="breadcrumb-item active text-secondary small" aria-current="page">
                {{ modelName }}
              </li>
            </ol>
          </nav>
          <h1 class="display-5 fw-bold mb-0" :class="textClass">{{ modelName }}</h1>
          <div class="d-flex align-items-center mt-2 gap-3 flex-wrap">
            <div class="d-flex align-items-center">
              <div class="avatar-sm me-2" style="background: linear-gradient(45deg, #38bdf8, #818cf8);">
                {{ author.charAt(0).toUpperCase() }}
              </div>
              <span class="text-secondary">{{ author }}</span>
            </div>
            <span class="badge badge-ai">{{ task }}</span>
            <span class="text-secondary small">
              ⭐ {{ formattedDownloads }} downloads
            </span>
          </div>
        </div>
        
        <div class="d-flex gap-2">
          <button 
            @click="toggleLike(model)" 
            :class="isLiked(model.id) ? 'btn-danger' : 'btn-outline-light'"
            class="btn"
          >
            {{ isLiked(model.id) ? '❤️ Liked' : '🤍 Like' }}
          </button>
          <button class="btn btn-primary">Use in Transformers</button>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-8">
          <ul class="nav nav-tabs border-secondary mb-4" id="modelTab" role="tablist">
            <li class="nav-item" role="presentation">
              <button 
                class="nav-link"
                :class="{ 
                  active: activeTab === 'card',
                  'text-white border-bottom border-3 border-info': activeTab === 'card',
                  'text-secondary': activeTab !== 'card'
                }"
                @click="activeTab = 'card'"
                type="button"
              >
                Model Card
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button 
                class="nav-link"
                :class="{ 
                  active: activeTab === 'files',
                  'text-white border-bottom border-3 border-info': activeTab === 'files',
                  'text-secondary': activeTab !== 'files'
                }"
                @click="activeTab = 'files'"
                type="button"
              >
                Files
              </button>
            </li>
          </ul>

          <div v-if="activeTab === 'card'" class="card bg-transparent border-0">
            <h3 class="h5 fw-bold mb-3 card-title" :class="textClass">Model description</h3>
            <p class="text-white-50">
              {{ modelId }} - современная модель машинного обучения из Hugging Face Hub.
              Теги: {{ (model.tags || []).slice(0, 5).join(', ') || 'AI' }}.
            </p>
            <div class="bg-dark p-3 rounded-3 border border-secondary my-4">
              <code class="text-info">pip install transformers</code>
            </div>
          </div>

          <div v-if="activeTab === 'files'" class="card bg-transparent border-secondary mt-4">
            <div class="card-header border-secondary text-info fw-bold d-flex align-items-center">
              <span class="me-2">📁</span> Files and Versions
            </div>
            <div class="card-body p-0">
              <div v-if="files.length === 0" class="text-center py-4 text-muted">
                Файлы не найдены.
              </div>
              <div v-else v-for="file in files" :key="file.path" 
                   class="d-flex justify-content-between align-items-center border-bottom border-secondary py-3 px-4">
                <div class="d-flex align-items-center text-truncate pe-3">
                  <span class="fs-5 me-3">📄</span>
                  <span class="font-monospace text-light">{{ file.path }}</span>
                </div>
                <div class="d-flex align-items-center flex-shrink-0">
                  <a 
                    :href="`https://huggingface.co/${modelId}/resolve/main/${file.path}?download=true`"
                    class="btn btn-sm btn-outline-info" 
                    download
                    target="_blank"
                  >
                    ⬇ Скачать
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside class="col-lg-4">
          <div class="card p-4 border-secondary bg-dark shadow-sm">
            <h5 class="fw-bold mb-3" :class="textClass">Metadata</h5>
            <div class="mb-3">
              <label class="small text-secondary d-block">License</label>
              <span class="text-white">Apache-2.0</span>
            </div>
            <div class="mb-3">
              <label class="small text-secondary d-block">Language</label>
              <span class="text-white">English (en)</span>
            </div>
            <hr class="border-secondary">
            <button class="btn btn-sm btn-outline-secondary w-100">Report issue</button>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  setup() {
    const textClass = computed(() => {
      return document.documentElement.getAttribute('data-theme') === 'light' ? 'text-dark' : 'text-white'
    })

    return { textClass }
  }
}
</script>
