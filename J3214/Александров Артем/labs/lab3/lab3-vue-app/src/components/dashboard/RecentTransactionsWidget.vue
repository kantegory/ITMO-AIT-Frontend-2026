<template>
  <div class="theme-card p-4 shadow-sm border-0 theme-border rounded-4 h-100 d-flex flex-column">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="h6 fw-bold m-0">Последние операции</h3>
      <button 
        type="button" 
        class="btn theme-bg-secondary btn-sm theme-text-main rounded-pill px-3 py-1 border-0 fw-medium" 
        @click="$emit('open-add-modal')"
      >
        <i class="bi bi-plus-lg me-1"></i>Добавить
      </button>
    </div>

    <div class="d-flex flex-column gap-3 overflow-auto flex-grow-1 no-scrollbar" style="max-height: 280px;">
      <div v-if="transactions.length === 0" class="theme-text-muted small text-center py-4">
        Транзакций пока нет
      </div>

      <TransactionItem 
        v-for="tx in transactions" 
        :key="tx.id" 
        :item="tx" 
        @delete-item="$emit('delete-tx', $event)" 
      />
    </div>
  </div>
</template>

<script setup>
import TransactionItem from './TransactionItem.vue'

defineProps({
  transactions: {
    type: Array,
    default: () => []
  }
})

defineEmits(['open-add-modal', 'delete-tx'])
</script>