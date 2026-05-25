<template>
  <form class="row g-3" @submit.prevent="apply">
    <div class="col-md-5">
      <input v-model="q" class="form-control" placeholder="Поиск по названию или месту">
    </div>
    <div class="col-md-2">
      <select v-model="type" class="form-select">
        <option value="">Все типы</option>
        <option value="theater">Театр</option>
        <option value="concert">Концерт</option>
        <option value="standup">Стендап</option>
        <option value="festival">Фестиваль</option>
      </select>
    </div>
    <div class="col-md-1">
      <button type="submit" class="btn btn-primary w-100">Найти</button>
    </div>
    <div class="col-md-1">
      <button type="button" class="btn btn-outline-secondary w-100" @click="reset">Сброс</button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
const q = ref('')
const type = ref('')
const emit = defineEmits(['filter', 'reset'])

const apply = () => {
  emit('filter', {
    _q: q.value || undefined,
    type: type.value || undefined
  })
}

const reset = () => {
  q.value = ''
  type.value = ''
  emit('reset')
}
</script>