<script setup>
defineProps({
  modelValue: { type: String, required: true },
  filter: { type: String, required: true },
  resultCount: { type: Number, required: true },
})

defineEmits(['update:modelValue', 'update:filter'])

const filters = [
  { value: 'all', label: 'Все' },
  { value: 'active', label: 'В работе' },
  { value: 'completed', label: 'Готово' },
  { value: 'pinned', label: 'Закреплённые' },
]
</script>

<template>
  <div class="notes-toolbar">
    <label class="search-control" for="notesSearch">
      <span aria-hidden="true"></span>
      <input
        id="notesSearch"
        type="search"
        :value="modelValue"
        placeholder="Поиск по заметкам"
        autocomplete="off"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <button
        v-if="modelValue"
        type="button"
        aria-label="Очистить поиск"
        @click="$emit('update:modelValue', '')"
      >
        ×
      </button>
    </label>

    <div class="filter-list" aria-label="Фильтр заметок">
      <button
        v-for="item in filters"
        :key="item.value"
        type="button"
        :class="{ active: filter === item.value }"
        :aria-pressed="filter === item.value"
        @click="$emit('update:filter', item.value)"
      >
        {{ item.label }}
      </button>
    </div>

    <span class="toolbar-count">Найдено: {{ resultCount }}</span>
  </div>
</template>
