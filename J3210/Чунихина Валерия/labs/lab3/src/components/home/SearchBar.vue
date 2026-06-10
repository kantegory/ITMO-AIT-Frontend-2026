<script setup>
defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])
</script>

<template>
  <form
    id="searchForm"
    class="input-group mb-5 shadow-sm rounded-pill overflow-hidden bg-white"
    role="search"
    aria-labelledby="searchLabel"
    @submit.prevent="emit('submit')"
  >
    <label id="searchLabel" for="searchInput" class="visually-hidden">
      Поиск модели, датасета или автора
    </label>

    <input
      id="searchInput"
      type="text"
      class="form-control border-0 px-4 py-3"
      placeholder="Найдите модель, датасет или автора..."
      autocomplete="off"
      aria-describedby="searchHelp"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
    >

    <span id="searchHelp" class="visually-hidden">
      Введите запрос и нажмите кнопку поиска.
    </span>

    <button id="searchBtn" type="submit" class="btn btn-primary px-4" :disabled="loading">
      <svg class="ui-icon ui-icon-sm me-2" aria-hidden="true">
        <use href="/sprite.svg#icon-search"></use>
      </svg>
      {{ loading ? 'Ищем...' : 'Поиск' }}
    </button>
  </form>
</template>
