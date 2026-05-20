<script setup>
import { computed } from 'vue'

const props = defineProps({
  pipelines: { type: Array, default: () => [] },
  runs: { type: Array, default: () => [] },
})

const successRate = computed(() => {
  if (props.runs.length === 0) return '—'
  const successful = props.runs.filter((r) => r.status === 'success').length
  return `${((successful / props.runs.length) * 100).toFixed(1)}%`
})
</script>

<template>
  <div class="bg-card rounded shadow-sm p-4 mb-4">
    <h6><i class="bi bi-bar-chart"></i> Statistics</h6>
    <div class="row text-center mt-3">
      <div class="col-3">
        <div class="fs-4 fw-bold text-brand">{{ pipelines.length }}</div>
        <small class="text-muted">DAGs</small>
      </div>
      <div class="col-3">
        <div class="fs-4 fw-bold text-success">{{ runs.length }}</div>
        <small class="text-muted">Runs</small>
      </div>
      <div class="col-3">
        <div class="fs-4 fw-bold text-warning">{{ successRate }}</div>
        <small class="text-muted">Success Rate</small>
      </div>
      <div class="col-3">
        <div class="fs-4 fw-bold text-info">3m 44s</div>
        <small class="text-muted">Avg Duration</small>
      </div>
    </div>
  </div>
</template>
