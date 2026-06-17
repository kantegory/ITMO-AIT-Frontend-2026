<template>
  <div class="budget-progress mb-4">
    <div class="d-flex justify-content-between mb-2">
      <span>{{ budget.category }}</span>
      <span class="text-secondary">{{ formatMoney(budget.spent) }} / {{ formatMoney(budget.limit) }}</span>
    </div>
    <div class="progress">
      <div class="progress-bar" :class="budget.color || 'bg-primary'" :style="{ width: `${percent}%` }"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatMoney } from '@/utils'

const props = defineProps({
  budget: {
    type: Object,
    required: true
  }
})

const percent = computed(() => {
  const spent = Number(props.budget.spent || 0)
  const limit = Number(props.budget.limit || 1)
  return Math.min(100, Math.round((spent / limit) * 100))
})
</script>
