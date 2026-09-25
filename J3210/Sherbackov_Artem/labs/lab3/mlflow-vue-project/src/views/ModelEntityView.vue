<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useModelStore } from '@/stores/models';
import BaseLayout from '@/layouts/BaseLayout.vue';

const route = useRoute();
const modelStore = useModelStore();

onMounted(() => {
  modelStore.fetchModelDetails(route.params.id);
});
</script>

<template>
  <BaseLayout>
    <div v-if="modelStore.isLoading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <template v-else-if="modelStore.currentModel">
      <div class="d-flex justify-content-between flex-wrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <div>
          <router-link to="/modelss" class="text-decoration-none">
            <span aria-hidden="true">&larr;</span> Back to models
          </router-link>
          <h1 class="h2 mt-1">{{ modelStore.currentModel.name }}</h1>
        </div>
      </div>

      <section class="row mb-4">
        <div class="col-md-4 d-flex">
          <div class="card text-center flex-fill shadow-sm border-0">
            <div class="card-body">
              <h2 class="h5 card-title text-muted">{{ modelStore.bestMetric.name }}</h2>
              <p class="display-6 fw-semibold text-primary">{{ modelStore.bestMetric.value }}</p>
            </div>
          </div>
        </div>

        <div class="col-md-4 d-flex">
          <div class="card text-center flex-fill shadow-sm border-0">
            <div class="card-body">
              <h2 class="h5 card-title text-muted">Total Versions</h2>
              <p class="display-6 fw-semibold">{{ modelStore.modelVersions.length }}</p>
            </div>
          </div>
        </div>

        <div class="col-md-4 d-flex">
          <div class="card text-center flex-fill shadow-sm border-0">
            <div class="card-body">
              <h2 class="h5 card-title text-muted">Stage</h2>
              <div>
                <span class="badge bg-success fs-6">{{ modelStore.currentModel.version || 'v1.0' }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="card border-0 shadow-sm">
        <div class="card-header bg-white border-bottom-0 py-3">
          <h5 class="mb-0">Model Versions (Experiments)</h5>
        </div>
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th>Version ID</th>
                <th>Metric</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="v in modelStore.modelVersions" :key="v.id">
                <td class="fw-bold">v{{ v.id }}</td>
                <td>
                  <span v-if="v.metricValue" class="badge bg-light text-dark border">
                    {{ v.metricName }}: {{ v.metricValue }}
                  </span>
                  <span v-else class="text-muted">—</span>
                </td>
                <td>
                  <span class="badge bg-success">Finished</span>
                </td>
                <td class="text-muted">{{ new Date(v.createdAt).toLocaleDateString() }}</td>
                <td>
                  <router-link :to="`/experiments/${v.id}`" class="btn btn-sm btn-outline-primary">
                    View Experiment
                  </router-link>
                </td>
              </tr>
              <tr v-if="!modelStore.modelVersions.length">
                <td colspan="5" class="text-center py-4 text-muted">
                  No versions found for this model.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>

    <div v-else class="alert alert-danger mt-3">
      Model not found.
    </div>
  </BaseLayout>
</template>