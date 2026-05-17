<template>
  <AppModal :model-value="!!transaction" title="Детали транзакции" @update:model-value="$emit('close')">
    <div v-if="transaction" class="modal-body">
      <p class="mb-1"><strong>Название:</strong> {{ transaction.name }}</p>
      <p class="mb-1"><strong>Контрагент:</strong> {{ transaction.counterparty || '—' }}</p>
      <p class="mb-1"><strong>Тип:</strong> {{ transaction.category }}</p>
      <p class="mb-1"><strong>Сумма:</strong> {{ formatSignedMoney(transaction.amount) }}</p>
      <p class="mb-1"><strong>Дата:</strong> {{ formatDateTime(transaction.date) }}</p>
      <p class="mb-0"><strong>Счёт:</strong> {{ transaction.accountId || '—' }}</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" @click="$emit('close')">Закрыть</button>
    </div>
  </AppModal>
</template>

<script setup>
import AppModal from './AppModal.vue'
import { useFormatters } from '../composables/useFormatters.js'

defineProps({ transaction: { type: Object, default: null } })
defineEmits(['close'])

const { formatDateTime, formatSignedMoney } = useFormatters()
</script>
