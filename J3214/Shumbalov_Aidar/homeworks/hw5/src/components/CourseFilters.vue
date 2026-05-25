<script setup>
defineProps({
  query: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  onlyFree: {
    type: Boolean,
    required: true,
  },
  categories: {
    type: Array,
    required: true,
  },
  levels: {
    type: Array,
    required: true,
  },
});

defineEmits([
  'update:query',
  'update:category',
  'update:level',
  'update:onlyFree',
  'reset',
]);
</script>

<template>
  <section class="filters" aria-label="Фильтры курсов">
    <label>
      Поиск
      <input
        :value="query"
        type="search"
        placeholder="Например, Python"
        @input="$emit('update:query', $event.target.value)"
      />
    </label>

    <label>
      Предмет
      <select :value="category" @change="$emit('update:category', $event.target.value)">
        <option v-for="item in categories" :key="item" :value="item">{{ item }}</option>
      </select>
    </label>

    <label>
      Уровень
      <select :value="level" @change="$emit('update:level', $event.target.value)">
        <option v-for="item in levels" :key="item" :value="item">{{ item }}</option>
      </select>
    </label>

    <label class="checkbox-label">
      <input
        :checked="onlyFree"
        type="checkbox"
        @change="$emit('update:onlyFree', $event.target.checked)"
      />
      Только бесплатные
    </label>

    <button type="button" class="secondary-button" @click="$emit('reset')">Сбросить</button>
  </section>
</template>
