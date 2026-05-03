<script setup>
import { computed } from 'vue';
import StatusBadge from './StatusBadge.vue';
import StrategyBadge from './StrategyBadge.vue';

const STATUS_COLORS = {
  success: 'success',
  running: 'info',
  failed: 'danger',
  pending: 'warning'
};

const props = defineProps({
  pipeline: { type: Object, required: true }
});

const progress = computed(() =>
  props.pipeline.stepsTotal > 0
    ? Math.round((props.pipeline.stepsDone / props.pipeline.stepsTotal) * 100)
    : 0
);

const progressClass = computed(() => `bg-${STATUS_COLORS[props.pipeline.status]}`);
const animated = computed(() =>
  props.pipeline.status === 'running' ? 'progress-bar-striped progress-bar-animated' : ''
);

const stepsText = computed(() => {
  let text = `${props.pipeline.stepsDone}/${props.pipeline.stepsTotal} шагов`;
  if (props.pipeline.status === 'success') text += ' завершено';
  if (props.pipeline.duration) text += ` · ${props.pipeline.duration}`;
  return text;
});
</script>

<template>
  <div class="pipeline-card">
    <div class="d-flex justify-content-between align-items-start">
      <div>
        <h6 class="mb-1">
          <RouterLink :to="`/pipelines/${pipeline.id}`" class="text-decoration-none">
            {{ pipeline.name }}
          </RouterLink>
          <StrategyBadge :strategy="pipeline.strategy" class="ms-2" />
        </h6>
        <small class="text-muted">{{ pipeline.ownerName }} · {{ pipeline.env }} · {{ pipeline.lastRun }}</small>
      </div>
      <StatusBadge :status="pipeline.status" />
    </div>
    <div class="mt-2">
      <div class="progress" style="height: 4px;">
        <div :class="['progress-bar', progressClass, animated]" :style="{ width: progress + '%' }"></div>
      </div>
      <small class="text-muted">{{ stepsText }}</small>
    </div>
  </div>
</template>
