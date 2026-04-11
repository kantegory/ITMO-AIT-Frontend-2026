<template>
  <form class="filters" aria-label="Фильтры курсов" @submit.prevent>
    <fieldset class="filters-group">
      <legend>Подбор курса</legend>

      <label class="form-group">
        <span>Поиск</span>
        <input
          :value="filters.search"
          type="search"
          name="search"
          placeholder="Введите название курса"
          @input="updateFilter('search', $event.target.value)"
        >
      </label>

      <label class="form-group">
        <span>Предмет</span>
        <select :value="filters.subject" name="subject" @change="updateFilter('subject', $event.target.value)">
          <option>Все</option>
          <option v-for="subject in subjects" :key="subject">{{ subject }}</option>
        </select>
      </label>

      <label class="form-group">
        <span>Уровень</span>
        <select :value="filters.level" name="level" @change="updateFilter('level', $event.target.value)">
          <option>Все</option>
          <option v-for="level in levels" :key="level">{{ level }}</option>
        </select>
      </label>

      <label class="form-group">
        <span>Цена</span>
        <select :value="filters.price" name="price" @change="updateFilter('price', $event.target.value)">
          <option>Все</option>
          <option>Бесплатно</option>
          <option>Платные</option>
        </select>
      </label>
    </fieldset>
  </form>
</template>

<script setup>
defineProps({
  filters: {
    type: Object,
    required: true
  },
  subjects: {
    type: Array,
    default: () => []
  },
  levels: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:filters']);

function updateFilter(key, value) {
  emit('update:filters', { key, value });
}
</script>
