<template>
  <a href="#main-content" class="skip-link">Перейти к содержимому</a>

  <div class="search-body">
    <!-- Hero с поиском -->
    <section class="search-hero" aria-label="Поиск направлений">
      <h1 class="serif mb-1" style="font-size:1.8rem;">
        Найдите следующее <em style="color:var(--accent);">приключение</em>
      </h1>
      <p style="color:var(--text-muted);font-size:.9rem;margin-bottom:1.5rem;">
        10 тщательно отобранных направлений
      </p>
      <div class="search-bar-wrap" role="search">
        <i class="bi bi-search" style="color:var(--text-light);flex-shrink:0;" aria-hidden="true"></i>
        <input class="search-bar-input" type="search" v-model="filters.query"
          placeholder="Страна, город, тип отдыха..." autocomplete="off"
          aria-label="Поиск направлений" />
        <button class="btn-primary-custom" style="flex-shrink:0;" aria-label="Найти">
          <i class="bi bi-arrow-right" aria-hidden="true"></i>
        </button>
      </div>
      <div class="d-flex gap-2 mt-3 flex-wrap align-items-center"
        role="group" aria-label="Популярные категории">
        <span style="font-size:.8rem;color:var(--text-light);" aria-hidden="true">Популярное:</span>
        <button v-for="tag in popularTags" :key="tag.label"
          class="filter-chip" @click="filters.query = tag.query"
          :aria-label="`Поиск по категории ${tag.label}`">
          {{ tag.label }}
        </button>
      </div>
    </section>

    <div class="search-layout" id="main-content">
      <!-- Панель фильтров -->
      <aside class="filter-panel" aria-label="Фильтры поиска">
        <div class="mb-4">
          <p class="filter-section-title">Тип направления</p>
          <div role="group">
            <button v-for="t in types" :key="t.value"
              class="filter-chip"
              :class="{ 'active selected': filters.type === t.value }"
              :aria-pressed="filters.type === t.value"
              @click="filters.type = t.value">
              {{ t.label }}
            </button>
          </div>
        </div>

        <div class="mb-4">
          <p class="filter-section-title">Бюджет</p>
          <div class="d-flex justify-content-between mb-2" style="font-size:.82rem;" aria-hidden="true">
            <span style="color:var(--text-light);">0 ₽</span>
            <strong style="color:var(--accent);">{{ budgetFormatted }}</strong>
          </div>
          <input type="range" class="w-100" min="0" max="50000" step="1000"
            v-model.number="filters.maxBudget"
            :aria-valuenow="filters.maxBudget" :aria-valuetext="budgetFormatted"
            aria-label="Максимальный бюджет" />
        </div>

        <div class="mb-4">
          <p class="filter-section-title">Континент</p>
          <div role="group">
            <button v-for="c in continents" :key="c"
              class="filter-chip"
              :class="{ 'active selected': filters.query === c }"
              @click="filters.query = filters.query === c ? '' : c">
              {{ c }}
            </button>
          </div>
        </div>

        <div class="mb-4">
          <p class="filter-section-title">Сортировка</p>
          <select class="form-select form-select-sm" v-model="filters.sort"
            aria-label="Сортировка результатов">
            <option value="popular">По популярности</option>
            <option value="rating">По рейтингу ↓</option>
            <option value="price_asc">Цена ↑</option>
            <option value="price_desc">Цена ↓</option>
            <option value="duration_asc">Длительность ↑</option>
            <option value="duration_desc">Длительность ↓</option>
          </select>
        </div>

        <button class="btn-primary-custom w-100 mb-2" style="justify-content:center;">Применить</button>
        <button class="btn-ghost-custom w-100" style="justify-content:center;" @click="handleReset">
          Сбросить
        </button>
      </aside>

      <!-- Результаты -->
      <div class="results-area">
        <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <p style="font-size:.875rem;color:var(--text-muted);margin:0;"
            aria-live="polite" aria-atomic="true">
            Найдено: <strong style="color:var(--text);">{{ filteredDestinations.length }}</strong> направлений
          </p>
        </div>

        <div v-if="filteredDestinations.length" class="row g-3" aria-live="polite"
          aria-label="Список направлений">
          <div v-for="dest in filteredDestinations" :key="dest.id" class="col-sm-6 col-xl-4">
            <DestCard :dest="dest" :saved="savedIds.has(dest.id)" @toggle-save="toggleSave" />
          </div>
        </div>

        <div v-else class="text-center py-5" style="color:var(--text-muted);">
          <div style="font-size:2.5rem;margin-bottom:1rem;opacity:.3;">🔍</div>
          <p>Ничего не найдено — попробуйте изменить фильтры</p>
          <button class="btn-ghost-custom mt-2" style="margin:auto;" @click="handleReset">
            Сбросить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDestinations } from '@/composables/useDestinations'
import { useApi } from '@/composables/useApi'
import { useToast } from '@/composables/useToast'
import DestCard from '@/components/DestCard.vue'

const { filters, filteredDestinations, resetFilters } = useDestinations()
const { getSavedRoutes, saveRoute, unsaveRoute } = useApi()
const { showToast } = useToast()

const types = [
  { value: 'all',    label: 'Все'       },
  { value: 'city',   label: '🏙 Город'  },
  { value: 'nature', label: '🌿 Природа' },
]

const popularTags = [
  { label: '🌍 Европа',  query: 'Европа'  },
  { label: '🌏 Азия',    query: 'Азия'    },
  { label: '🏖 Пляж',    query: 'Пляж'    },
  { label: '🌿 Природа', query: 'Природа' },
  { label: '🥾 Трекинг', query: 'Трекинг' },
]

const continents = ['Европа', 'Азия', 'Америка', 'Африка']

const budgetFormatted = computed(() =>
  Number(filters.value.maxBudget).toLocaleString('ru') + ' ₽'
)

const savedIds = ref(new Set())

async function loadSaved() {
  try {
    const list = await getSavedRoutes()
    savedIds.value = new Set(list.map(r => r.destinationId))
  } catch { }
}

async function toggleSave(destId) {
  const dest = filteredDestinations.value.find(d => d.id === destId)
  if (savedIds.value.has(destId)) {
    savedIds.value = new Set([...savedIds.value].filter(id => id !== destId))
    showToast(`${dest?.name || destId} убран`, 'info')
    unsaveRoute(destId).catch(() => {})
  } else {
    savedIds.value = new Set([...savedIds.value, destId])
    showToast(`${dest?.name || destId} сохранён!`)
    saveRoute(destId).catch(() => {})
  }
}

function handleReset() {
  resetFilters()
  showToast('Фильтры сброшены', 'info')
}

onMounted(loadSaved)
</script>

<style scoped>
html, body { height: 100%; }
.search-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}
.search-layout {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
@media (max-width: 992px) {
  .search-body, .search-layout { overflow: visible; }
}
</style>
