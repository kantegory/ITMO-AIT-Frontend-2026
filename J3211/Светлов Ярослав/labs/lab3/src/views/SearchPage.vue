<template>
  <h1 class="h3 mb-3" tabindex="-1">Поиск экспериментов</h1>
  <form class="row g-3 mb-4" @submit.prevent="search">
    <div class="col-sm-6 col-lg-3"><label for="date" class="form-label">Дата (ГГГГ-ММ-ДД)</label><input id="date" v-model="filters.date" class="form-control" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" placeholder="2026-04-02"></div>
    <div class="col-sm-6 col-lg-3"><label for="accuracy" class="form-label">Минимальная accuracy</label><input id="accuracy" v-model="filters.accuracy_gte" class="form-control" type="number" min="0" max="1" step="0.01"></div>
    <div class="col-sm-6 col-lg-3"><label for="latency" class="form-label">Максимальная latency, мс</label><input id="latency" v-model="filters.latencyMs_lte" class="form-control" type="number" min="0" step="1"></div>
    <div class="col-sm-6 col-lg-3"><label for="query" class="form-label">Название, тег или ID</label><input id="query" v-model="filters.q" class="form-control" type="search"></div>
    <div class="col-12 d-flex gap-2"><button class="btn btn-primary" :disabled="loading">Найти</button><button class="btn btn-outline-secondary" type="button" @click="reset">Сбросить</button></div>
  </form>
  <RequestState :loading="loading" :error="error" />
  <template v-if="!loading && !error"><p role="status">Найдено: {{ experiments.length }}</p><ExperimentTable :experiments="experiments" /></template>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue';
import api from '../api';
import { useRequest } from '../composables/useRequest';
import RequestState from '../components/RequestState.vue';
import ExperimentTable from '../components/ExperimentTable.vue';
const filters = reactive({ date: '', accuracy_gte: '', latencyMs_lte: '', q: '' });
const experiments = ref([]);
const { loading, error, run } = useRequest();
function search() {
  const params = { _sort: 'date', _order: 'desc' };
  for (const [key, value] of Object.entries(filters)) if (String(value).trim()) params[key] = String(value).trim();
  run(() => api.get('/experiments', { params }), response => { experiments.value = response.data; });
}
function reset() { Object.keys(filters).forEach(key => { filters[key] = ''; }); search(); }
onMounted(search);
</script>
