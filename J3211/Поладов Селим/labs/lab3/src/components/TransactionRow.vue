<template>
  <tr>
    <td>
      <span class="rounded bg-light d-inline-flex align-items-center justify-content-center me-2" style="width:36px;height:36px">{{ categoryEmoji(transaction.category) }}</span>
      <div class="d-inline-block">
        <span class="fw-medium">{{ transaction.name }}</span>
        <template v-if="showCounterparty">
          <br />
          <span class="small text-muted">{{ transaction.counterparty || '' }}</span>
        </template>
      </div>
    </td>
    <td><span class="badge bg-light text-dark">{{ transaction.category }}</span></td>
    <td :class="transaction.amount < 0 ? 'amount-negative' : 'text-success'">
      {{ formatSignedMoney(transaction.amount) }}
    </td>
    <td>{{ withTime ? formatDateTime(transaction.date) : formatDate(transaction.date) }}</td>
    <td v-if="showAccount">{{ transaction.accountId || '—' }}</td>
    <td v-if="actionable">
      <button type="button" class="btn btn-view btn-sm" @click="$emit('view', transaction)">Просмотр</button>
    </td>
  </tr>
</template>

<script setup>
import { useFormatters } from '../composables/useFormatters.js'

defineProps({
  transaction: { type: Object, required: true },
  showCounterparty: { type: Boolean, default: false },
  showAccount: { type: Boolean, default: false },
  actionable: { type: Boolean, default: false },
  withTime: { type: Boolean, default: false }
})
defineEmits(['view'])

const { formatDate, formatDateTime, formatSignedMoney, categoryEmoji } = useFormatters()
</script>
