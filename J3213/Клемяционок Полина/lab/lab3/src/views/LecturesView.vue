<template>
  <h2 class="mb-4">Видео-лекции</h2>
  <div class="d-flex flex-wrap gap-2 mb-3">
    <button v-for="f in filters" :key="f.val" @click="activeFilter = f.val" :class="activeFilter === f.val ? 'btn btn-danger' : 'btn btn-outline-danger'">{{ f.label }}</button>
  </div>
  <input v-model="search" class="form-control mb-4" placeholder="Поиск...">

  <div v-if="loading" class="text-center">Загрузка...</div>
  <div v-if="error" class="alert alert-danger">{{ error }}</div>

  <div class="row g-4">
    <LectureCard v-for="lec in lectures" :key="lec.id" v-bind="lec">
      <a :href="lec.link" class="btn btn-outline-danger w-100">Купить лекцию</a>
    </LectureCard>
  </div>
  <div v-if="!loading && !lectures.length" class="text-center text-muted py-4">Лекции не найдены</div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useLectures } from '../composables/useLectures'
import LectureCard from '../components/LectureCard.vue'

const { lectures, loading, error, fetch } = useLectures()
const filters = [{label:'Все', val:'all'}, {label:'Новичкам', val:'новичкам'}, {label:'Экстрим', val:'экстрим'}, {label:'Для всех', val:'для всех'}]
const activeFilter = ref('all')
const search = ref('')

watch([activeFilter, search], () => fetch(activeFilter.value, search.value))
onMounted(() => fetch())
</script>