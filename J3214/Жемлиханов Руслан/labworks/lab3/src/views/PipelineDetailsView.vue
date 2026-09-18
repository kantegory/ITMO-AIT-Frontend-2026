<template>
  <AppLayout title="Pipeline details">
    <section v-if="pipeline" class="card mb-4" aria-labelledby="pipelineTitle">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start flex-wrap gap-3">
          <header>
            <h1 id="pipelineTitle" class="h4 mb-2">{{ pipeline.name }}</h1>
            <p class="text-secondary mb-2">{{ pipeline.description }}</p>
            <p class="small text-secondary mb-0">
              Owner: <strong>{{ pipeline.owner }}</strong> |
              Schedule: <strong>{{ pipeline.schedule }}</strong> |
              Last run: <strong>{{ pipeline.lastRun }}</strong> |
              Status: <StatusBadge :status="pipeline.status" />
            </p>
          </header>
          <div class="d-flex gap-2 flex-wrap">
            <button class="btn btn-primary" type="button" @click="runNow">Run now</button>
            <button class="btn btn-outline-primary" type="button">Pause DAG</button>
            <button class="btn btn-outline-primary" type="button" @click="retryTasks">Retry failed tasks</button>
          </div>
        </div>
      </div>
    </section>

    <section v-if="pipeline" aria-label="Детали пайплайна">
      <ul class="nav nav-tabs" role="tablist">
        <li class="nav-item"><button class="nav-link" :class="{ active: tab === 'graph' }" type="button" @click="tab = 'graph'">Graph</button></li>
        <li class="nav-item"><button class="nav-link" :class="{ active: tab === 'logs' }" type="button" @click="tab = 'logs'">Logs</button></li>
        <li class="nav-item"><button class="nav-link" :class="{ active: tab === 'history' }" type="button" @click="tab = 'history'">Run history</button></li>
      </ul>

      <div class="tab-content border border-top-0 rounded-bottom p-3 bg-white">
        <PipelineGraph v-if="tab === 'graph'" :graph="pipeline.graph" />
        <article v-if="tab === 'logs'" class="pipeline-logs">
          <p v-for="line in pipeline.logs" :key="line" :class="{ 'text-body': line.includes('ERROR') }">{{ line }}</p>
        </article>
        <article v-if="tab === 'history'" class="table-responsive">
          <table class="table align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th>Run ID</th>
                <th>Start time</th>
                <th>End time</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Triggered by</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="run in pipeline.runHistory" :key="run.runId">
                <td>{{ run.runId }}</td>
                <td>{{ run.startTime }}</td>
                <td>{{ run.endTime }}</td>
                <td>{{ run.duration }}</td>
                <td><StatusBadge :status="run.status" /></td>
                <td>{{ run.triggeredBy }}</td>
              </tr>
            </tbody>
          </table>
        </article>
      </div>
    </section>
  </AppLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import PipelineGraph from '../components/PipelineGraph.vue';
import StatusBadge from '../components/StatusBadge.vue';
import { useToast } from '../composables/useToast';
import { dataApi } from '../services/api';

const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

const { showToast } = useToast();
const pipeline = ref(null);
const tab = ref('graph');

const runNow = () => showToast('DAG запущен вручную.');
const retryTasks = () => showToast('Повтор failed задач инициирован.');

onMounted(async () => {
  const { data } = await dataApi.getPipelineDetails(props.id);
  pipeline.value = data;
});
</script>
