<script setup>
import { ref, computed, watch } from 'vue';
import { getModels } from '@/api/models';
import { getDatasets } from '@/api/datasets';
import { useFilters } from '@/composables/useFilters';
import ItemCard from '@/components/ui/ItemCard.vue';
import SearchFilters from '@/components/search/SearchFilters.vue';

const props = defineProps({
  type: { type: String, required: true }, // 'models' | 'datasets'
});

const items = ref([]);
const error = ref('');
const loading = ref(false);

const tagFields = computed(() =>
  props.type === 'models' ? ['task', 'framework'] : ['task', 'license'],
);

const itemType = computed(() => (props.type === 'models' ? 'model' : 'dataset'));
const pageTitle = computed(() => (props.type === 'models' ? 'Модели' : 'Датасеты'));

const {
  query,
  sort,
  activeTags,
  toggleTag,
  clearFilters,
  availableTags,
  filteredItems,
} = useFilters(items, tagFields);

async function load() {
  loading.value = true;
  error.value = '';
  try {
    items.value = await (props.type === 'models' ? getModels() : getDatasets());
  } catch {
    error.value = 'Не удалось загрузить данные. Убедитесь, что json-server запущен.';
    items.value = [];
  } finally {
    loading.value = false;
  }
}

watch(
  () => props.type,
  () => {
    clearFilters();
    load();
  },
  { immediate: true },
);
</script>

<template>
  <main id="main-content" class="container py-5">
    <h1 class="h3 mb-4">{{ pageTitle }}</h1>

    <SearchFilters
      v-model:query="query"
      v-model:sort="sort"
      :available-tags="availableTags"
      :active-tags="activeTags"
      @toggle-tag="toggleTag"
    />

    <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>

    <p v-if="!error" class="text-muted small mb-3">
      Найдено: <span>{{ filteredItems.length }}</span>
    </p>

    <div class="row g-3" aria-live="polite">
      <ItemCard
        v-for="item in filteredItems"
        :key="item.id"
        :item="item"
        :type="itemType"
        layout="list"
      />
      <p v-if="!loading && !error && filteredItems.length === 0" class="text-muted">
        Ничего не найдено.
      </p>
    </div>
  </main>
</template>
