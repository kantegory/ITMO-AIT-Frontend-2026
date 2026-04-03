<template>
  <div class="pipeline-card">
    <div class="card-top">
      <div>
        <h3 class="pipeline-name">{{ pipeline.name }}</h3>
        <span class="strategy" :class="'strategy-' + pipeline.strategy">
          {{ strategyLabel }}
        </span>
      </div>
      <StatusBadge :status="pipeline.status" />
    </div>
    <div class="card-meta">
      {{ pipeline.ownerName }} · {{ pipeline.env }} · {{ pipeline.lastRun }}
    </div>
    <div class="progress-wrap">
      <div class="progress-bar">
        <div
          class="progress-fill"
          :class="'fill-' + pipeline.status"
          :style="{ width: progress + '%' }"
        ></div>
      </div>
      <span class="steps-text">
        {{ pipeline.stepsDone }}/{{ pipeline.stepsTotal }} шагов
        <template v-if="pipeline.duration"> · {{ pipeline.duration }}</template>
      </span>
    </div>
  </div>
</template>

<script>
import StatusBadge from './StatusBadge.vue'

export default {
  name: 'PipelineCard',
  components: { StatusBadge },
  props: {
    pipeline: {
      type: Object,
      required: true
    }
  },
  computed: {
    progress() {
      if (this.pipeline.stepsTotal === 0) return 0
      return Math.round((this.pipeline.stepsDone / this.pipeline.stepsTotal) * 100)
    },
    strategyLabel() {
      var labels = { bluegreen: 'Blue/Green', canary: 'Canary', rolling: 'Rolling' }
      return labels[this.pipeline.strategy] || this.pipeline.strategy
    }
  }
}
</script>

<style scoped>
.pipeline-card {
  background: #151c28;
  border: 1px solid #1e2a3a;
  border-radius: 4px;
  padding: 16px 20px;
  margin-bottom: 8px;
  transition: border-color 0.15s;
}
.pipeline-card:hover { border-color: #2a3a4e; }
.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}
.pipeline-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.95rem;
  font-weight: 500;
  color: #e6edf3;
  margin: 0 0 4px 0;
}
.strategy {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 3px;
  font-weight: 500;
}
.strategy-bluegreen { background: rgba(88, 166, 255, 0.1); color: #58a6ff; }
.strategy-canary { background: rgba(210, 153, 34, 0.1); color: #d29922; }
.strategy-rolling { background: rgba(63, 185, 80, 0.1); color: #3fb950; }
.card-meta {
  color: #586069;
  font-size: 0.82rem;
  margin: 8px 0;
}
.progress-wrap { margin-top: 8px; }
.progress-bar {
  height: 4px;
  background: #111820;
  border-radius: 2px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s;
}
.fill-success { background: #3fb950; }
.fill-running { background: #58a6ff; }
.fill-failed { background: #f85149; }
.fill-pending { background: #d29922; }
.steps-text {
  color: #586069;
  font-size: 0.78rem;
  margin-top: 4px;
  display: block;
}
</style>
