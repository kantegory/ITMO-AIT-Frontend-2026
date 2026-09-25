<template>
  <div class="container-xl page-shell">
    <h1 class="page-title">Наборы данных</h1>
    <p class="page-subtitle">
      Готовые датасеты для обучения и тестирования моделей: медицинские изображения, тексты, видео.
    </p>

    <SearchBar placeholder="Поиск датасетов..." @search="(q) => (searchQuery = q)" />

    <FiltersBar :categories="categories" v-model="activeCategory" />

    <LoadingState
      :loading="loading"
      :error="error"
      :empty="!filtered.length && !loading"
      empty-text="Датасеты не найдены."
    >
      <div class="cards-grid">
        <ItemCard
          v-for="ds in filtered"
          :key="ds.id"
          :item="ds"
          :to="`/datasets`"
          :is-liked-item="isLiked(ds.id)"
          @toggle-like="toggle(ds.id)"
        />
      </div>
    </LoadingState>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import { useFilters } from '@/composables/useFilters'
import { useLike } from '@/composables/useLike'
import { getDatasets } from '@/api/datasets'
import SearchBar from '@/components/SearchBar.vue'
import FiltersBar from '@/components/FiltersBar.vue'
import ItemCard from '@/components/ItemCard.vue'
import LoadingState from '@/components/LoadingState.vue'

const { data, loading, error, execute } = useApi(getDatasets)
const items = ref([])
watch(data, (v) => { if (v) items.value = v })

const { searchQuery, activeCategory, filtered } = useFilters(items, ['title', 'description', 'tagLabel'])
const { toggle, isLiked } = useLike('liked_datasets')

const categories = [
  { label: 'Все датасеты', value: '' },
  { label: 'Medical', value: 'medical' },
  { label: 'Text', value: 'text' },
  { label: 'Video', value: 'video' },
  { label: 'Tabular', value: 'tabular' },
  { label: 'Audio', value: 'audio' }
]

watch(activeCategory, (cat) => {
  execute(cat ? { category: cat } : {})
})

onMounted(() => execute({}))
</script>
