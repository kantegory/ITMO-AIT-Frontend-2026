<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRunStore } from '@/stores/runs';
import BaseLayout from '@/layouts/BaseLayout.vue';

const route = useRoute();
const runStore = useRunStore();

onMounted(() => {
  runStore.fetchRunDetails(route.params.id);
});

const artefacts = [
  { name: 'model_weights', size: '1 KB' },
  { name: 'requirements.txt', size: '1 KB' },
  { name: 'dataset.csv', size: '1 KB' },
  { name: 'preprocessing_info.json', size: '1 KB' },
  { name: 'config.yaml', size: '1 KB' }
];
</script>

<template>
  <BaseLayout>
    <div v-if="runStore.isLoading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <template v-else-if="runStore.currentRun">
      <div class="d-flex justify-content-between flex-wrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <div>
          <router-link 
            :to="`/experiments/${runStore.currentRun.experimentId}`" 
            class="text-decoration-none"
          >
            <span aria-hidden="true">&larr;</span> Back to experiment
          </router-link>
          
          <h1 class="h2 mt-1">{{ runStore.currentRun.name || 'Unnamed Run' }}</h1>
          <small class="text-muted">
            {{ new Date(runStore.currentRun.createdAt).toLocaleString() }}
          </small>
        </div>
      </div>

      <section class="row mb-4">
        <div class="col-md-4 mb-3">
          <div class="card text-center shadow-sm border-0">
            <div class="card-body">
              <h2 class="h6 card-subtitle mb-2 text-muted">
                {{ runStore.currentRun.metricName || 'Metric' }}
              </h2>
              <p class="card-title h3 text-primary">
                {{ runStore.currentRun.metricValue ?? '-' }}
              </p>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="card text-center shadow-sm border-0">
            <div class="card-body">
              <h2 class="h6 card-subtitle mb-2 text-muted">Epochs</h2>
              <p class="card-title h3">{{ runStore.currentRun.epochs || 'N/A' }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="card text-center shadow-sm border-0">
            <div class="card-body">
              <h2 class="h6 card-subtitle mb-2 text-muted">Batch Size</h2>
              <p class="card-title h3">{{ runStore.currentRun.batch || 'N/A' }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="mb-4">
        <h2 class="h5 mb-3">Artefacts</h2>
        <ul class="list-group shadow-sm">
          <li 
            v-for="file in artefacts" 
            :key="file.name" 
            class="list-group-item d-flex justify-content-between align-items-center border-0"
          >
            <div>
              <strong>{{ file.name }}</strong><br>
              <small class="text-muted">Size: {{ file.size }}</small>
            </div>
            <button class="btn btn-sm btn-outline-primary">View</button>
          </li>
        </ul>
      </section>
    </template>

    <div v-else class="alert alert-danger">
      Run not found or error loading data.
    </div>
  </BaseLayout>
</template>