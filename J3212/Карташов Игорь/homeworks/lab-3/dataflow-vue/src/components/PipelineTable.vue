<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import StatusBadge from './StatusBadge.vue'

const props = defineProps({
  pipelines: { type: Array, default: () => [] },
  search: { type: String, default: '' },
  filter: { type: String, default: 'all' },
})

const filtered = computed(() => {
  const query = props.search.toLowerCase()
  return props.pipelines.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(query)
    const matchesFilter = props.filter === 'all' || p.status === props.filter
    return matchesSearch && matchesFilter
  })
})
</script>

<template>
  <div class="table-responsive bg-card rounded shadow-sm">
    <table class="table table-hover mb-0">
      <thead class="table-light">
        <tr>
          <th>Name</th>
          <th>Schedule</th>
          <th>Last Run</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="filtered.length === 0">
          <td colspan="5" class="text-center p-4 text-muted">No pipelines found</td>
        </tr>
        <tr v-for="pipeline in filtered" :key="pipeline.id" :data-status="pipeline.status">
          <td>
            <RouterLink
              :to="{ name: 'pipeline-detail', params: { id: pipeline.id } }"
              class="pipeline-name"
            >
              {{ pipeline.name }}
            </RouterLink>
          </td>
          <td><code>{{ pipeline.schedule }}</code></td>
          <td>{{ pipeline.lastRun }}</td>
          <td><StatusBadge :status="pipeline.status" /></td>
          <td>
            <button
              type="button"
              class="btn btn-sm btn-outline-success"
              :aria-label="`Trigger run for ${pipeline.name}`"
            >
              <i class="bi bi-play-fill" aria-hidden="true"></i>
            </button>
            <button
              type="button"
              class="btn btn-sm btn-outline-secondary"
              :aria-label="`Pause ${pipeline.name}`"
            >
              <i class="bi bi-pause-fill" aria-hidden="true"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
