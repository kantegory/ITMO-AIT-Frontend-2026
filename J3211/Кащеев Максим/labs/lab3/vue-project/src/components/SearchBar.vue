<template>
  <form class="d-flex gap-2 mb-3" @submit.prevent="$emit('search', query)">
    <input
      v-model="query"
      class="form-control-glass flex-grow-1"
      type="search"
      :placeholder="placeholder"
    />
    <button type="submit" class="btn btn-primary-glass px-4">
      <i class="bi bi-search me-1"></i>Найти
    </button>
    <button
      v-if="query"
      type="button"
      class="btn btn-outline-glass px-3"
      @click="query = ''; $emit('search', '')"
    >
      <i class="bi bi-x-lg"></i>
    </button>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Поиск...' }
})

defineEmits(['search', 'update:modelValue'])

const query = ref(props.modelValue)
watch(() => props.modelValue, (v) => { query.value = v })
</script>
