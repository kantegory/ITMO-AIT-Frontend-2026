<template>
  <div class="card mb-3 custom-tx-card">
    <div class="card-body d-flex justify-content-between align-items-center">
      <div class="text-start">
        <h5 class="card-title mb-1 fw-bold">{{ description || 'Без описания' }}</h5>
        <div class="tx-meta">{{ date }} • {{ category }}</div>
      </div>
      <div>
        <h4 :class="amount < 0 ? 'text-danger' : 'text-success'" class="m-0 fw-bold text-end">
          {{ amount > 0 ? '+' : '' }}{{ formatCurrency(amount) }}
        </h4>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFormatter } from '../composables/useFormatter'

const props = defineProps({
  description: String,
  date: String,
  category: String,
  amount: Number
})

const { formatCurrency } = useFormatter()
</script>

<style scoped>
.custom-tx-card {
    background-color: var(--bg-card) !important;
    border: 1px solid var(--border-color) !important;
    color: var(--text-main) !important;
    transition: transform 0.2s, box-shadow 0.2s;
}

.custom-tx-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--card-shadow);
}

.card-title {
    color: var(--text-main) !important;
}

.tx-meta {
    font-size: 0.85rem;
    color: var(--text-muted) !important; 
    opacity: 0.9; 
}
</style>