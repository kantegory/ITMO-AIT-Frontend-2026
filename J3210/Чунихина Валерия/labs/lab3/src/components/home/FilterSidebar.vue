<script setup>
defineProps({
  task: {
    type: String,
    default: ''
  },
  license: {
    type: String,
    default: ''
  },
  frameworks: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:task', 'update:license', 'toggle-framework', 'submit'])

const frameworkOptions = [
  { id: 'pt', value: 'pytorch', label: 'PyTorch' },
  { id: 'tf', value: 'tensorflow', label: 'TensorFlow' },
  { id: 'jax', value: 'jax', label: 'JAX / Flax' }
]
</script>

<template>
  <aside class="col-lg-3 mb-4" aria-labelledby="filters-title">
    <div class="card p-4 border-0 shadow-sm sticky-lg-top" style="top: 100px;">
      <h2 id="filters-title" class="h5 mb-3 fw-bold" style="color: var(--bloom-green);">Параметры роста</h2>
      <form id="filterForm" aria-describedby="filtersHelp" @submit.prevent="emit('submit')">
        <p id="filtersHelp" class="visually-hidden">
          Выберите задачу, фреймворк и лицензию, затем примените фильтры.
        </p>

        <div class="mb-4">
          <label for="taskSelect" class="form-label small fw-bold text-uppercase">Задача</label>
          <select
            id="taskSelect"
            class="form-select border-0 bg-light"
            :value="task"
            @change="emit('update:task', $event.target.value)"
          >
            <option value="">Все задачи</option>
            <option value="text-classification">NLP (текст)</option>
            <option value="image-classification">Computer Vision</option>
            <option value="audio-classification">Audio</option>
            <option value="reinforcement-learning">Reinforcement Learning</option>
          </select>
        </div>

        <fieldset class="mb-4">
          <legend class="form-label small fw-bold text-uppercase">Фреймворк</legend>
          <div
            v-for="option in frameworkOptions"
            :key="option.id"
            class="form-check mb-1"
          >
            <input
              :id="option.id"
              class="form-check-input fw-check"
              type="checkbox"
              :value="option.value"
              :checked="frameworks.includes(option.value)"
              @change="emit('toggle-framework', option.value)"
            >
            <label class="form-check-label small" :for="option.id">{{ option.label }}</label>
          </div>
        </fieldset>

        <div class="mb-4">
          <label for="licenseSelect" class="form-label small fw-bold text-uppercase">Лицензия</label>
          <select
            id="licenseSelect"
            class="form-select border-0 bg-light"
            :value="license"
            @change="emit('update:license', $event.target.value)"
          >
            <option value="">Любая лицензия</option>
            <option value="mit">MIT</option>
            <option value="apache-2.0">Apache 2.0</option>
            <option value="cc-by-4.0">Creative Commons</option>
            <option value="openrail">OpenRail</option>
          </select>
        </div>

        <button type="submit" class="btn btn-primary w-100 shadow-sm mt-2" :disabled="loading">
          {{ loading ? 'Обновляем...' : 'Применить фильтры' }}
        </button>
      </form>
    </div>
  </aside>
</template>
