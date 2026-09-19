<script setup>
defineProps({
  query: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
});

defineEmits(['update:query', 'update:subject', 'update:level', 'update:price', 'reset']);
</script>

<template>
  <form class="filters" aria-label="Фильтры каталога" @submit.prevent>
    <label>
      Название
      <input
        :value="query"
        type="search"
        placeholder="Например, Python"
        autocomplete="off"
        @input="$emit('update:query', $event.target.value)"
      />
    </label>

    <label>
      Предмет
      <select :value="subject" @change="$emit('update:subject', $event.target.value)">
        <option value="all">Все</option>
        <option value="programming">Программирование</option>
        <option value="analytics">Аналитика</option>
        <option value="design">Дизайн</option>
      </select>
    </label>

    <label>
      Уровень
      <select :value="level" @change="$emit('update:level', $event.target.value)">
        <option value="all">Все</option>
        <option value="beginner">Начальный</option>
        <option value="middle">Средний</option>
      </select>
    </label>

    <label>
      Цена
      <select :value="price" @change="$emit('update:price', $event.target.value)">
        <option value="all">Все</option>
        <option value="free">Бесплатно</option>
        <option value="paid">Платно</option>
      </select>
    </label>

    <button class="ghost-button" type="button" @click="$emit('reset')">Сбросить</button>
  </form>
</template>
