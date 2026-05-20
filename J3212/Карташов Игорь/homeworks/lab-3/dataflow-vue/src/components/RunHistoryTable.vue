<script setup>
import StatusBadge from './StatusBadge.vue'

defineProps({
  runs: { type: Array, default: () => [] },
})
</script>

<template>
  <div class="table-responsive bg-card rounded shadow-sm">
    <table class="table table-hover mb-0">
      <thead class="table-light">
        <tr>
          <th>Run ID</th>
          <th>Start Time</th>
          <th>Duration</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="runs.length === 0">
          <td colspan="4" class="text-center p-4 text-muted">No runs found</td>
        </tr>
        <tr v-for="run in runs" :key="run.id">
          <td><code>{{ run.runId }}</code></td>
          <td>{{ run.start }}</td>
          <td>{{ run.duration }}</td>
          <td><StatusBadge :status="run.status" /></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
