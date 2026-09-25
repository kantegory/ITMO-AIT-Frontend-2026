<template>
  <div class="container-xl hero-wrapper page-shell">
    <div class="row align-items-center mb-5">
      <div class="col-lg-7">
        <h1 class="hero-title">
          Добро пожаловать на<br />
          <span style="background: linear-gradient(120deg,#5eaace,#a86bff);-webkit-background-clip:text;-webkit-text-fill-color:transparent">ML Hub</span>
        </h1>
        <p class="hero-subtitle">
          Платформа для обмена моделями, датасетами и демо-пространствами.
          Делитесь, находите лучшие решения и получайте честный фидбек.
        </p>
        <div class="d-flex gap-2 flex-wrap">
          <RouterLink to="/models" class="btn btn-primary-glass px-4">Смотреть модели</RouterLink>
          <RouterLink to="/datasets" class="btn btn-outline-glass px-4">Датасеты</RouterLink>
        </div>
      </div>
    </div>

    <section class="mb-5">
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h2 class="page-title mb-0">Популярные модели</h2>
        <RouterLink to="/models" class="btn btn-sm btn-outline-glass">Все модели →</RouterLink>
      </div>

      <div class="d-flex gap-2 flex-wrap mb-3">
        <button
          v-for="tag in popularTags"
          :key="tag.value"
          class="pill-filter"
          :class="{ active: activeTag === tag.value }"
          @click="setTag(tag.value)"
        >
          {{ tag.label }}
        </button>
      </div>

      <LoadingState :loading="loading" :error="error" :empty="!models.length" empty-text="Модели не найдены">
        <div class="scroll-container">
          <div class="scroll-track">
            <RouterLink
              v-for="model in models"
              :key="model.id"
              :to="`/models/${model.id}`"
              class="scroll-item"
            >
              <div class="item-badge mb-2" style="font-size:0.72rem">
                <i class="bi bi-cpu"></i> {{ model.tagLabel }}
              </div>
              <div class="item-title" style="font-size:0.95rem">{{ model.title }}</div>
              <div class="item-desc mt-1" style="font-size:0.78rem">{{ model.description }}</div>
              <div class="mt-auto d-flex justify-content-between align-items-center" style="font-size:0.75rem;color:#475569">
                <span><i class="bi bi-download me-1"></i>{{ model.downloads }}</span>
                <span><i class="bi bi-heart me-1"></i>{{ model.likes }}</span>
                <span class="tag-pill">{{ model.badge }}</span>
              </div>
            </RouterLink>
          </div>
        </div>
      </LoadingState>
    </section>

    <section>
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h2 class="page-title mb-0">Пространства</h2>
        <RouterLink to="/spaces" class="btn btn-sm btn-outline-glass">Все →</RouterLink>
      </div>
      <LoadingState :loading="spacesLoading" :error="spacesError" :empty="!spaces.length">
        <div class="cards-grid">
          <ItemCard
            v-for="space in spaces.slice(0,3)"
            :key="space.id"
            :item="space"
            :to="`/spaces`"
            :is-liked-item="false"
          />
        </div>
      </LoadingState>
    </section>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import { getModels } from '@/api/models'
import { getSpaces } from '@/api/spaces'
import LoadingState from '@/components/LoadingState.vue'
import ItemCard from '@/components/ItemCard.vue'

const popularTags = [
  { label: 'Все', value: '' },
  { label: 'NLP', value: 'nlp' },
  { label: 'Computer Vision', value: 'cv' },
  { label: 'Генерация', value: 'gen' },
  { label: 'Аудио', value: 'audio' }
]

const activeTag = ref('')

const { data: modelsData, loading, error, execute: loadModels } = useApi(getModels)
const { data: spacesData, loading: spacesLoading, error: spacesError, execute: loadSpaces } = useApi(getSpaces)

const models = ref([])
const spaces = ref([])

function setTag(val) {
  activeTag.value = val
  loadModels(val ? { category: val } : {})
}

watch(modelsData, (v) => { if (v) models.value = v })
watch(spacesData, (v) => { if (v) spaces.value = v })

onMounted(() => {
  loadModels({})
  loadSpaces({})
})
</script>
