<template>
  <tr>
    <td>{{ formattedDate }}</td>
    <td>{{ transaction.name }}</td>
    <td><span class="badge bg-secondary">{{ transaction.category }}</span></td>
    <td class="text-end fw-bold" :class="amountClass">
      {{ transaction.amount > 0 ? '+' : '' }}{{ transaction.amount.toLocaleString('ru-RU') }} ₽
    </td>
  </tr>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ transaction: { type: Object, required: true } })
const isExpense = computed(() => props.transaction.amount < 0)
const amountClass = computed(() => isExpense.value ? 'text-expense' : 'text-income')
const formattedDate = computed(() => {
  const p = props.transaction.date.split('-')
  return p.length === 3 ? `${p[2]}.${p[1]}.${p[0]}` : props.transaction.date
})

const formatDate = (date) => {
  if (!date) return ''
  const parts = date.split('-')
  return parts.length === 3 ? `${parts[2]}.${parts[1]}.${parts[0]}` : date
}
</script>