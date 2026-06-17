<script setup>
const STRATEGY_LABELS = {
  bluegreen: 'Blue/Green',
  canary: 'Canary',
  rolling: 'Rolling'
};

const props = defineProps({
  strategy: { type: String, required: true }
});
</script>

<template>
  <span :class="['deploy-strategy', `strategy-${props.strategy}`]">
    {{ STRATEGY_LABELS[props.strategy] || props.strategy }}
  </span>
</template>
