<script setup>
import { ref, watch, onMounted } from 'vue'
import api from '@/services/api'
import ItemCard from '@/components/ItemCard.vue'
import { dictionaries } from '@/utils/dictionaries'
import { usePageTitle } from '@/composables/usePageTitle'

const activeTab = ref('models')
const searchQuery = ref('')
const results = ref([])
const errorMsg = ref('')

usePageTitle('Хаб')

const filters = ref({
  model: { task: '', framework: [], license: [] },
  dataset: { task: '', modality: [], license: [] }
})

const activeChips = ref([])

onMounted(() => {
  loadData()
})

watch(activeTab, () => {
  loadData()
})

const parseFiltersToParams = () => {
  const params = new URLSearchParams()
  activeChips.value = []

  if (searchQuery.value.trim()) {
    params.append('q', searchQuery.value.trim())
    activeChips.value.push({ label: `Поиск: ${searchQuery.value.trim()}`, type: 'q', value: 'q' })
  }

  const filterKey = activeTab.value === 'models' ? 'model' : 'dataset'
  const currentFilters = filters.value[filterKey]

  if (currentFilters.task) {
    params.append('task', currentFilters.task)
    activeChips.value.push({ 
      label: dictionaries.task[currentFilters.task] || currentFilters.task, 
      type: 'task', 
      value: currentFilters.task 
    })
  }

  if (activeTab.value === 'models') {
    if (currentFilters.framework.length > 0) {
      params.append('framework_like', `^(${currentFilters.framework.join('|')})$`)
      currentFilters.framework.forEach(f => activeChips.value.push({ 
        label: dictionaries.framework[f] || f, type: 'framework', value: f 
      }))
    }
  } else {
    if (currentFilters.modality.length > 0) {
      params.append('modality_like', `^(${currentFilters.modality.join('|')})$`)
      currentFilters.modality.forEach(m => activeChips.value.push({ 
        label: dictionaries.modality[m] || m, type: 'modality', value: m 
      }))
    }
  }

  if (currentFilters.license.length > 0) {
    params.append('license_like', `^(${currentFilters.license.join('|')})$`)
    currentFilters.license.forEach(l => activeChips.value.push({ 
      label: dictionaries.license[l] || l, type: 'license', value: l 
    }))
  }

  return params
}

const loadData = async () => {
  const endpoint = activeTab.value === 'models' ? 'models' : 'datasets'
  errorMsg.value = ''

  try {
    const params = parseFiltersToParams()
    const response = await api.get(`/${endpoint}`, { params })
    results.value = response.data
  } catch (err) {
    console.error('Error fetching hub data:', err)
    errorMsg.value = 'Ошибка подключения к серверу.'
    results.value = []
  }
}

const handleSearch = () => loadData()
const applyFilters = () => loadData()

const resetFilters = () => {
  if (activeTab.value === 'models') {
    filters.value.model = { task: '', framework: [], license: [] }
  } else {
    filters.value.dataset = { task: '', modality: [], license: [] }
  }
  loadData()
}

const removeChip = (index) => {
  const chip = activeChips.value[index]
  if (chip.type === 'q') {
    searchQuery.value = ''
  } else {
    const filterKey = activeTab.value === 'models' ? 'model' : 'dataset'
    const filterRefs = filters.value[filterKey]
    
    if (chip.type === 'task') {
      filterRefs.task = ''
    } else {
      filterRefs[chip.type] = filterRefs[chip.type].filter(item => item !== chip.value)
    }
  }
  loadData()
}
</script>

<template>
  <main class="col-md-9 col-lg-10 px-md-4">
    <section class="mb-4">
      <h1 class="display-5 fw-bold mb-2">Модели и Датасеты</h1>
      <p class="text-blunted fs-5">
          Исследуйте, скачивайте и делитесь тысячами AI-моделей и датасетов для машинного обучения
      </p>
    </section>

    <section class="mb-3">
      <form @submit.prevent="handleSearch" id="hubSearchForm">
        <label class="visually-hidden" for="searchInput">Поиск моделей и датасетов</label>
        <div class="input-group input-group-lg rounded" id="hubSearchBar">
          <span class="input-group-text border-end-0 text-blunted">
            <svg class="svg-icon" aria-hidden="true"><use href="/icons.svg#search"></use></svg>
          </span>
          <input type="text" class="form-control border-start-0 ps-0" id="searchInput" v-model="searchQuery" placeholder="Поиск по названию, задаче или фреймворку..." autocomplete="off">
          <button class="btn bg-primary text-white px-4" type="submit">Найти</button>
        </div>
      </form>
    </section>

    <section class="d-flex align-items-center gap-2 mb-4 overflow-x-auto pb-2 flex-nowrap" id="activeFiltersBar">
      <button class="btn btn-outline-dark text-blunted rounded-pill flex-shrink-0" type="button" data-bs-toggle="modal" data-bs-target="#filtersModal">
        <svg class="svg-icon me-1" aria-hidden="true"><use href="/icons.svg#sliders"></use></svg> Все фильтры
      </button>

      <div class="vr"></div>

      <div class="d-flex align-items-center gap-2 flex-nowrap" id="activeFilterChips">
        <span v-if="activeChips.length === 0" class="text-blunted">Нет активных фильтров</span>
        <span v-for="(chip, idx) in activeChips" :key="idx" class="badge rounded-pill text-bg-primary d-flex align-items-center gap-1 flex-shrink-0 py-2 px-3 fs-6 fw-normal">
          {{ chip.label }}
          <button type="button" class="btn btn-link p-0 border-0 text-white filter-chip-remove" @click="removeChip(idx)" aria-label="Удалить фильтр">
            <svg class="svg-icon ms-2" aria-hidden="true"><use href="/icons.svg#x-lg"></use></svg>
          </button>
        </span>
      </div>
    </section>

    <section id="searchResultsSection">
      <h2 class="mb-3 fs-5 fw-normal text-blunted">
        Найдено: {{ results.length }} {{ activeTab === 'models' ? 'моделей' : 'датасетов' }}
      </h2>
      
      <div v-if="errorMsg" class="col-12"><p class="text-danger">{{ errorMsg }}</p></div>
      <div v-else-if="results.length === 0" class="col-12"><p class="text-blunted fs-5">По вашему запросу ничего не найдено.</p></div>

      <div v-else class="row g-4" id="resultsGrid">
        <ItemCard v-for="item in results" :key="item.id" :item="item" :type="activeTab === 'models' ? 'model' : 'dataset'" />
      </div>
    </section>

    <div class="modal fade" id="filtersModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"><svg class="svg-icon me-2" aria-hidden="true"><use href="/icons.svg#sliders"></use></svg> Расширенный поиск</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          
          <div class="modal-body">
            <ul class="nav nav-tabs mb-4">
              <li class="nav-item">
                <button class="nav-link text-contrast" :class="{ active: activeTab === 'models' }" @click="activeTab = 'models'">Модели</button>
              </li>
              <li class="nav-item">
                <button class="nav-link text-contrast" :class="{ active: activeTab === 'datasets' }" @click="activeTab = 'datasets'">Датасеты</button>
              </li>
            </ul>

            <div v-if="activeTab === 'models'">
              <label class="form-label fw-bold mb-2">Задача (Task)</label>
              <select class="form-select mb-4" v-model="filters.model.task">
                <option value="">Любая задача</option>
                <option value="cv">Computer Vision</option>
                <option value="nlp">Natural Language Processing</option>
                <option value="audio">Audio Classification</option>
                <option value="rl">Reinforcement Learning</option>
              </select>

              <h6 class="fw-bold mb-2">Фреймворк</h6>
              <div class="mb-4">
                <div class="form-check mb-1" v-for="fw in ['pytorch', 'tensorflow', 'jax']" :key="fw">
                  <input class="form-check-input" type="checkbox" :value="fw" v-model="filters.model.framework" :id="`fw-${fw}`">
                  <label class="form-check-label" :for="`fw-${fw}`">{{ dictionaries.framework[fw] || fw }}</label>
                </div>
              </div>

              <h6 class="fw-bold mb-2">Лицензия</h6>
              <div class="mb-2">
                <div class="form-check mb-1" v-for="lic in ['mit', 'apache-2.0', 'gpl-3.0']" :key="lic">
                  <input class="form-check-input" type="checkbox" :value="lic" v-model="filters.model.license" :id="`lic-model-${lic}`">
                  <label class="form-check-label" :for="`lic-model-${lic}`">{{ dictionaries.license[lic] || lic }}</label>
                </div>
              </div>
            </div>

            <div v-else>
              <label class="form-label fw-bold mb-2">Применимость (Task)</label>
              <select class="form-select mb-4" v-model="filters.dataset.task">
                <option value="">Любая задача</option>
                <option value="img_clf">Классификация изображений</option>
                <option value="obj_det">Детекция объектов</option>
                <option value="text_gen">Генерация текста</option>
                <option value="translation">Машинный перевод</option>
              </select>

              <h6 class="fw-bold mb-2">Тип данных</h6>
              <div class="mb-4">
                <div class="form-check mb-1" v-for="mod in ['images', 'text', 'tabular', 'audio-video']" :key="mod">
                  <input class="form-check-input" type="checkbox" :value="mod" v-model="filters.dataset.modality" :id="`mod-${mod}`">
                  <label class="form-check-label" :for="`mod-${mod}`">{{ dictionaries.modality[mod] || mod }}</label>
                </div>
              </div>

              <h6 class="fw-bold mb-2">Лицензия</h6>
              <div class="mb-2">
                <div class="form-check mb-1" v-for="lic in ['cc0', 'cc-by-4.0', 'custom']" :key="lic">
                  <input class="form-check-input" type="checkbox" :value="lic" v-model="filters.dataset.license" :id="`lic-ds-${lic}`">
                  <label class="form-check-label" :for="`lic-ds-${lic}`">{{ dictionaries.license[lic] || lic }}</label>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-footer border-top">
            <button class="btn btn-outline-secondary" @click="resetFilters" data-bs-dismiss="modal">Сбросить</button>
            <button class="btn bg-primary text-white" @click="applyFilters" data-bs-dismiss="modal">Применить фильтры</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>