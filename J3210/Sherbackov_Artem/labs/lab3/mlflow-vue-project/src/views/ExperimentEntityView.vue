<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useRunStore } from "@/stores/runs";
import { useDate } from "@/composables/useDate";
import { useDuration } from "@/composables/useDuration";
import BaseLayout from "@/layouts/BaseLayout.vue";

const route = useRoute();
const runStore = useRunStore();
const { formatDate } = useDate();
const { formatDuration } = useDuration();

const searchQuery = ref("");
const statusFilter = ref("all");
const sortBy = ref("createdAt");

onMounted(() => {
  runStore.fetchExperimentDetails(route.params.id);
});

const filteredRuns = computed(() => {
  let result = [...runStore.runs];

  if (searchQuery.value) {
    result = result.filter((run) =>
      run.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
    );
  }

  if (statusFilter.value !== "all") {
    result = result.filter((run) => run.status === statusFilter.value);
  }

  result.sort((a, b) => {
    if (sortBy.value === "createdAt") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return (b[sortBy.value] || 0) - (a[sortBy.value] || 0);
  });

  return result;
});
</script>

<template>
  <BaseLayout>
    <div v-if="runStore.isLoading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <template v-else-if="runStore.currentExperiment">
      <header class="mb-4">
        <h1 class="mb-0">Experiment: {{ runStore.currentExperiment.name }}</h1>
      </header>

      <section class="card mb-4 border-0 shadow-sm">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <input
                v-model="searchQuery"
                type="search"
                class="form-control"
                placeholder="Filter by run name"
              />
            </div>
            <div class="col-md-3">
              <select v-model="statusFilter" class="form-select">
                <option value="all">All Statuses</option>
                <option value="Finished">Finished</option>
                <option value="In stage">In stage</option>
              </select>
            </div>
            <div class="col-md-3">
              <select v-model="sortBy" class="form-select">
                <option value="createdAt">Sort: Created</option>
                <option value="metricValue">Sort: Metric</option>
                <option value="duration">Sort: Duration</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section class="card border-0 shadow-sm">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th>Run Name</th>
                <th>Created</th>
                <th>Status</th>
                <th>Metrics</th>
                <th>Parameters</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="run in filteredRuns" :key="run.id">
                <td>
                  <router-link :to="`/runs/${run.id}`" class="fw-semibold text-decoration-none">
                    {{ run.name }}
                  </router-link>
                </td>
                <td class="text-muted">{{ new Date(run.createdAt).toLocaleString() }}</td>
                <td>
                  <span
                    class="badge"
                    :class="run.status === 'Finished' ? 'bg-success' : 'bg-warning text-dark'"
                  >
                    {{ run.status }}
                  </span>
                </td>
                <td>
                  <span class="badge bg-primary">
                    {{ run.metricName }}: {{ run.metricValue }}
                  </span>
                </td>
                <td>
                  <router-link
                    :to="`/modelss/${run.modelId}`"
                    class="badge bg-secondary text-decoration-none"
                  >
                    model_id: {{ run.modelId }}
                  </router-link>
                </td>
                <td>{{ formatDuration(run.duration) }}</td>
              </tr>
              <tr v-if="!filteredRuns.length">
                <td colspan="6" class="text-center py-4 text-muted">No runs found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>

    <div v-else class="alert alert-danger">Experiment not found.</div>
  </BaseLayout>
</template>
