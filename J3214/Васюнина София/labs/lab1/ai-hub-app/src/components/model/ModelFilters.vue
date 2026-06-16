<template>
  <aside class="col-lg-3 mb-4">
    <div class="filter-sidebar p-4" :style="{ backgroundColor: cardBg }">
      <h5 class="fw-bold mb-4" :class="textClass">Filters</h5>

      <div class="accordion accordion-flush" id="filterAccordion">
        <div class="accordion-item" :style="{ borderBottom: `1px solid ${borderColor}` }">
          <h2 class="accordion-header">
            <button 
              class="accordion-button" 
              :class="{ collapsed: !expandedTasks, 'bg-transparent': !expandedTasks }"
              :style="{ color: textColor }"
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#collapseTasks"
              @click="expandedTasks = !expandedTasks"
            >
              Tasks
            </button>
          </h2>
          <div id="collapseTasks" class="accordion-collapse collapse show">
            <div class="accordion-body px-0">
              <div v-for="tag in categoryGroups.NLP" :key="tag" class="form-check mb-2">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  :id="tag"
                  :value="tag"
                  v-model="selectedCategoryTags"
                >
                <label class="form-check-label small" :class="textClass" :for="tag">
                  {{ formatTagName(tag) }}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="accordion-item" :style="{ borderBottom: `1px solid ${borderColor}` }">
          <h2 class="accordion-header">
            <button 
              class="accordion-button collapsed" 
              :class="{ 'bg-transparent': !expandedFrameworks }"
              :style="{ color: textColor }"
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#collapseFrameworks"
              @click="expandedFrameworks = !expandedFrameworks"
            >
              Frameworks
            </button>
          </h2>
          <div id="collapseFrameworks" class="accordion-collapse collapse">
            <div class="accordion-body px-0">
              <div v-for="tag in categoryGroups.CV" :key="tag" class="form-check mb-2">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  :id="tag"
                  :value="tag"
                  v-model="selectedCategoryTags"
                >
                <label class="form-check-label small" :class="textClass" :for="tag">
                  {{ formatTagName(tag) }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button 
        @click="resetFilters" 
        class="btn btn-outline-info btn-sm w-100 mt-4"
      >
        Reset all filters
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  modelTags: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['filter-change'])

const selectedCategoryTags = ref([])
const expandedTasks = ref(true)
const expandedFrameworks = ref(false)

const categoryGroups = {
  NLP: [
    'text-generation', 'text-classification', 'token-classification',
    'translation', 'summarization', 'question-answering', 'fill-mask', 'conversational'
  ],
  CV: [
    'image-classification', 'image-segmentation', 'object-detection',
    'image-to-image', 'text-to-image', 'depth-estimation'
  ],
  Audio: [
    'automatic-speech-recognition', 'audio-classification',
    'text-to-speech', 'text-to-audio'
  ]
}

const cardBg = computed(() => {
  const theme = document.documentElement.getAttribute('data-theme')
  return theme === 'light' ? '#ffffff' : '#1e293b'
})

const textColor = computed(() => {
  const theme = document.documentElement.getAttribute('data-theme')
  return theme === 'light' ? '#1f2937' : '#E6EDF3'
})

const textClass = computed(() => {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'text-secondary' : 'text-white-50'
})

const borderColor = computed(() => {
  const theme = document.documentElement.getAttribute('data-theme')
  return theme === 'light' ? '#dee2e6' : '#4b5563'
})

const formatTagName = (tag) => {
  return tag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const resetFilters = () => {
  selectedCategoryTags.value = []
}

watch(selectedCategoryTags, (newValue) => {
  emit('filter-change', { categoryTags: newValue })
}, { deep: true })

onMounted(() => {
  emit('filter-change', { categoryTags: [] })
})
</script>
