<template>
  <div class="container-xl page-shell">
    <h1 class="page-title">Каталог моделей</h1>
    <p class="page-subtitle">
      Готовые модели для компьютерного зрения, NLP и работы с табличными данными.
    </p>

    <SearchBar placeholder="Поиск моделей..." @search="handleSearch" />

    <FiltersBar :categories="categories" v-model="activeCategory" />

    <LoadingState
      :loading="loading"
      :error="error"
      :empty="!filtered.length && !loading"
      empty-text="Модели не найдены. Попробуйте изменить фильтры."
    >
      <div class="cards-grid">
        <ItemCard
          v-for="model in filtered"
          :key="model.id"
          :item="model"
          :to="`/models/${model.id}`"
          :is-liked-item="isLiked(model.id)"
          @toggle-like="toggle(model.id)"
        />
      </div>
    </LoadingState>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '@/composables/useApi'
import { useFilters } from '@/composables/useFilters'
import { useLike } from '@/composables/useLike'
import { getModels } from '@/api/models'
import SearchBar from '@/components/SearchBar.vue'
import FiltersBar from '@/components/FiltersBar.vue'
import ItemCard from '@/components/ItemCard.vue'
import LoadingState from '@/components/LoadingState.vue'

const route = useRoute()
const { data, loading, error, execute } = useApi(getModels)
const items = ref([])
watch(data, (v) => { if (v) items.value = v })

const { searchQuery, activeCategory, filtered, setCategory } = useFilters(items, ['title', 'description', 'tagLabel'])
const { toggle, isLiked } = useLike('liked_models')

const categories = [
  { label: 'Все модели', value: '' },
  { label: 'NLP', value: 'nlp' },
  { label: 'CV', value: 'cv' },
  { label: 'Tabular', value: 'tabular' },
  { label: 'Gen', value: 'gen' },
  { label: 'Audio', value: 'audio' },
  { label: 'Multimodal', value: 'multimodal' }
]

watch(activeCategory, (cat) => {
  execute(cat ? { category: cat } : {})
})

function handleSearch(q) {
  searchQuery.value = q
}

onMounted(() => {
  if (route.query.search) searchQuery.value = String(route.query.search)
  execute({})
})
</script>
