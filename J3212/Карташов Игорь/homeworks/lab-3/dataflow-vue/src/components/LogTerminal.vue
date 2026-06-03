<script setup>
import { computed } from 'vue'

const props = defineProps({
  logs: { type: Array, default: () => [] },
})

const LOG_CLASSES = {
  info: 'log-info',
  ok: 'log-ok',
  warn: 'log-warn',
  err: 'log-err',
}

const lines = computed(() =>
  props.logs.map((log) => ({
    ...log,
    cls: LOG_CLASSES[log.level] || 'log-info',
  })),
)
</script>

<template>
  <div class="log-terminal">
    <div v-for="log in lines" :key="log.id">
      <span class="log-time">[{{ log.time }}]</span>
      <span :class="log.cls">{{ log.level.toUpperCase() }}</span>
      {{ log.message }}
    </div>
  </div>
</template>
