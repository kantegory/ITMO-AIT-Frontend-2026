<script setup>
import StrategyBadge from './StrategyBadge.vue';

const ENV_COLORS = { Production: 'success', Staging: 'warning', Development: 'info' };

const props = defineProps({
  env: { type: Object, required: true }
});

const dotColor = ENV_COLORS[props.env.name] || 'secondary';

const metrics = [
  ['Активные модели:', props.env.models],
  ['Запросов/мин:', props.env.rpm],
  ['Uptime:', props.env.uptime],
  ['Последний деплой:', props.env.lastDeploy]
];
</script>

<template>
  <div class="env-card">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="mb-0">
        <i :class="`bi bi-circle-fill text-${dotColor} me-1`" style="font-size: 0.6rem;"></i>
        {{ env.name }}
      </h5>
      <StrategyBadge :strategy="env.strategy" />
    </div>

    <div class="small mb-2">
      <div v-for="[label, value] in metrics" :key="label" class="d-flex justify-content-between mb-1">
        <span class="text-muted">{{ label }}</span>
        <span>{{ value }}</span>
      </div>
    </div>

    <hr>

    <div class="d-flex gap-2">
      <button class="btn btn-outline-secondary btn-sm flex-grow-1">Настроить</button>
    </div>
  </div>
</template>
