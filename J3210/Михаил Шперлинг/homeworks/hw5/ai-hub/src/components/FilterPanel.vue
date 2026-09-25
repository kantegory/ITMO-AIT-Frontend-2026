<script setup>
const props = defineProps({
  activeTasks: { type: Array, default: () => [] },
  selectedFramework: { type: String, default: 'all' },
  selectedFormat: { type: String, default: 'all' },
  showFramework: { type: Boolean, default: true }
})

const emit = defineEmits(['update:activeTasks', 'update:selectedFramework', 'update:selectedFormat'])

const tasks = [
  { value: 'nlp', label: 'NLP (Текст)' },
  { value: 'cv', label: 'Computer Vision' },
  { value: 'audio', label: 'Audio / Speech' }
]

function toggleTask(value) {
  const updated = props.activeTasks.includes(value)
    ? props.activeTasks.filter(t => t !== value)
    : [...props.activeTasks, value]
  emit('update:activeTasks', updated)
}
</script>

<template>
  <div class="card p-3 shadow-sm">
    <h5 class="fw-bold">Фильтры</h5>
    <hr>
    <h6 class="text-muted text-uppercase small fw-bold">Задача</h6>
    <div v-for="task in tasks" :key="task.value" class="form-check">
      <input
        class="form-check-input"
        type="checkbox"
        :id="`task-${task.value}`"
        :value="task.value"
        :checked="activeTasks.includes(task.value)"
        @change="toggleTask(task.value)"
      >
      <label class="form-check-label" :for="`task-${task.value}`">{{ task.label }}</label>
    </div>

    <template v-if="showFramework">
      <label class="text-muted text-uppercase small fw-bold mt-4 mb-2 d-block">Фреймворк</label>
      <select
        class="form-select"
        :value="selectedFramework"
        @change="emit('update:selectedFramework', $event.target.value)"
      >
        <option value="all">Все</option>
        <option value="pytorch">PyTorch</option>
        <option value="tensorflow">TensorFlow</option>
        <option value="jax">JAX</option>
      </select>
    </template>

    <template v-else>
      <label class="text-muted text-uppercase small fw-bold mt-4 mb-2 d-block">Формат</label>
      <select
        class="form-select"
        :value="selectedFormat"
        @change="emit('update:selectedFormat', $event.target.value)"
      >
        <option value="all">Все форматы</option>
        <option value="csv">CSV / Parquet</option>
        <option value="json">JSON / JSONL</option>
        <option value="images">ZIP (Images)</option>
      </select>
    </template>
  </div>
</template>
