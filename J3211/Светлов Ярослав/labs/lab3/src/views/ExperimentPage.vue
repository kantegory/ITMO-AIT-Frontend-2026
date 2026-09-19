<template>
  <RouterLink class="d-inline-block mb-3" to="/search">← К поиску</RouterLink>
  <h1 ref="heading" class="h3" tabindex="-1">{{ experiment?.name || 'Эксперимент' }}</h1>
  <RequestState :loading="loading" :error="error" />
  <template v-if="experiment">
    <p>{{ experiment.id }} · {{ experiment.date }} · {{ experiment.tag }}</p><p>{{ experiment.description }}</p>
    <p>Accuracy: {{ experiment.accuracy }} · Loss: {{ experiment.finalLoss }} · Latency: {{ experiment.latencyMs }} мс</p>
    <h2 class="h5">Метрики</h2><MetricsChart :metrics="experiment.metrics" />
    <div class="table-responsive"><table class="table table-sm"><caption class="visually-hidden">Численные значения accuracy и loss по эпохам</caption>
      <thead><tr><th scope="col">Эпоха</th><th scope="col">Accuracy</th><th scope="col">Loss</th></tr></thead>
      <tbody><tr v-for="(label, index) in experiment.metrics.labels" :key="label"><td>{{ label }}</td><td>{{ experiment.metrics.accuracy[index] }}</td><td>{{ experiment.metrics.loss[index] }}</td></tr></tbody>
    </table></div>
    <h2 class="h5 mt-4">Артефакты</h2><ArtifactList :artifacts="experiment.artifacts" />
    <h2 class="h5 mt-4">Логи</h2><pre>{{ experiment.logs.join('\n') }}</pre>
  </template>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../api';
import { useRequest } from '../composables/useRequest';
import RequestState from '../components/RequestState.vue';
import MetricsChart from '../components/MetricsChart.vue';
import ArtifactList from '../components/ArtifactList.vue';
const route = useRoute();
const experiment = ref(null), heading = ref(null);
const { loading, error, run } = useRequest();
onMounted(() => run(() => api.get('/experiments/' + encodeURIComponent(route.params.id)), response => {
  experiment.value = response.data;
  document.title = experiment.value.name + ' — Nexus ML';
}));
</script>
