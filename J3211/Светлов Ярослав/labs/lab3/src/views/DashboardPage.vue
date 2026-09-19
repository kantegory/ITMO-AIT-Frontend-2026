<template>
  <h1 class="h3 mb-3" tabindex="-1">Личный кабинет</h1>
  <RequestState :loading="loading" :error="error" />
  <template v-if="!loading && !error">
    <p><strong>{{ user?.name }}</strong> · {{ user?.email }}</p>
    <p>Эксперименты: {{ experiments.length }} · Версии моделей: {{ models.length }} · Артефакты: {{ artifacts.length }}</p>
    <h2 class="h5 mt-4">Мои эксперименты</h2><ExperimentTable :experiments="experiments" caption="Мои эксперименты" />
    <h2 class="h5 mt-4">Мои модели</h2><ModelTable :models="models" />
    <h2 class="h5 mt-4">Мои артефакты</h2><ArtifactList :artifacts="artifacts" />
  </template>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../api';
import { useAuth } from '../composables/useAuth';
import { useRequest } from '../composables/useRequest';
import RequestState from '../components/RequestState.vue';
import ExperimentTable from '../components/ExperimentTable.vue';
import ModelTable from '../components/ModelTable.vue';
import ArtifactList from '../components/ArtifactList.vue';
const { user } = useAuth();
const { loading, error, run } = useRequest();
const experiments = ref([]), models = ref([]);
const artifacts = computed(() => experiments.value.flatMap(item => item.artifacts));
onMounted(() => run(() => Promise.all([
  api.get('/experiments', { params: { userId: user.value.id, _sort: 'date', _order: 'desc' } }),
  api.get('/models', { params: { userId: user.value.id } })
]), ([runs, versions]) => { experiments.value = runs.data; models.value = versions.data; }));
</script>
