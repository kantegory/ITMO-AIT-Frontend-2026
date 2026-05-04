<template>
  <aside class="collapse d-lg-block" id="filterSidebar">
    <div class="mb-4">
      <div class="fw-bold mb-2">
        <svg class="icon icon-lg me-2" aria-hidden="true"><use href="#icon-book"></use></svg>Предмет
      </div>
      <div class="d-flex flex-column gap-2">
        <div v-for="subject in subjects" :key="subject.value" class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            :id="`filter-${subject.value}`"
            :value="subject.value"
            v-model="selectedSubjects"
            @change="emitFilters"
          >
          <label class="form-check-label" :for="`filter-${subject.value}`">
            {{ subject.label }}
          </label>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <div class="fw-bold mb-2">
        <svg class="icon icon-lg me-2" aria-hidden="true"><use href="#icon-signal"></use></svg>Уровень
      </div>
      <div class="d-flex flex-column gap-2">
        <div v-for="level in levels" :key="level.value" class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            :id="`level-${level.value}`"
            :value="level.value"
            v-model="selectedLevels"
            @change="emitFilters"
          >
          <label class="form-check-label" :for="`level-${level.value}`">
            <span :class="['badge', level.badgeClass, 'me-1']">{{ level.label }}</span>
          </label>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <fieldset>
        <legend class="fw-bold mb-2">
          <svg class="icon icon-lg me-2" aria-hidden="true"><use href="#icon-ruble-sign"></use></svg>Цена
        </legend>
        <div class="d-flex gap-2 mb-3">
          <input
            type="number"
            class="form-control"
            placeholder="От"
            min="0"
            v-model.number="priceMin"
            @input="emitFilters"
          >
          <span class="align-self-center">-</span>
          <input
            type="number"
            class="form-control"
            placeholder="До"
            min="0"
            v-model.number="priceMax"
            @input="emitFilters"
          >
        </div>
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="filter-free"
            v-model="freeOnly"
            @change="emitFilters"
          >
          <label class="form-check-label" for="filter-free">Только бесплатные</label>
        </div>
      </fieldset>
    </div>

    <div class="mb-4">
      <div class="fw-bold mb-2">
        <svg class="icon icon-lg me-2" aria-hidden="true"><use href="#icon-clock"></use></svg>Длительность
      </div>
      <div class="d-flex flex-column gap-2">
        <div v-for="d in durations" :key="d.value" class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            :id="`duration-${d.value}`"
            :value="d.value"
            v-model="selectedDurations"
            @change="emitFilters"
          >
          <label class="form-check-label" :for="`duration-${d.value}`">
            {{ d.label }}
          </label>
        </div>
      </div>
    </div>

    <div class="d-grid gap-2">
      <button class="btn btn-primary" @click="emitFilters">
        <svg class="icon icon-lg me-2" aria-hidden="true"><use href="#icon-check"></use></svg>Применить
      </button>
      <button class="btn btn-outline-secondary" @click="resetFilters">
        <svg class="icon icon-lg me-2" aria-hidden="true"><use href="#icon-rotate-left"></use></svg>Сбросить
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['filter-change'])

const subjects = [
  { value: 'deep-learning', label: 'Deep Learning' },
  { value: 'nlp', label: 'NLP' },
  { value: 'cv', label: 'Computer Vision' },
  { value: 'rl', label: 'Reinforcement Learning' },
  { value: 'gen-ai', label: 'Generative AI' },
  { value: 'ml-basics', label: 'Основы ML' }
]

const levels = [
  { value: 'beginner', label: 'Новичок', badgeClass: 'bg-success' },
  { value: 'intermediate', label: 'Средний', badgeClass: 'bg-warning text-dark' },
  { value: 'advanced', label: 'Продвинутый', badgeClass: 'bg-danger' }
]

const durations = [
  { value: 'short', label: 'До 20 часов' },
  { value: 'medium', label: '20-50 часов' },
  { value: 'long', label: 'Более 50 часов' }
]

const selectedSubjects = ref(subjects.map(s => s.value))
const selectedLevels = ref(levels.map(l => l.value))
const selectedDurations = ref(durations.map(d => d.value))
const priceMin = ref(0)
const priceMax = ref(100000)
const freeOnly = ref(false)

function emitFilters() {
  emit('filter-change', {
    subjects: selectedSubjects.value,
    levels: selectedLevels.value,
    durations: selectedDurations.value,
    priceMin: priceMin.value,
    priceMax: priceMax.value,
    freeOnly: freeOnly.value
  })
}

function resetFilters() {
  selectedSubjects.value = subjects.map(s => s.value)
  selectedLevels.value = levels.map(l => l.value)
  selectedDurations.value = durations.map(d => d.value)
  priceMin.value = 0
  priceMax.value = 100000
  freeOnly.value = false
  emitFilters()
}
</script>
