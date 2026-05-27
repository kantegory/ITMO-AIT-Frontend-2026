<script setup>
const props = defineProps({ transaction: Object })

const CATEGORY_LABELS = {
  income: 'Доход', food: 'Еда', housing: 'Жильё',
  transport: 'Транспорт', entertainment: 'Развлечения', services: 'Сервисы'
}
const CATEGORY_BADGES = {
  income: 'bg-success', food: 'bg-warning text-dark', housing: 'bg-secondary',
  transport: 'bg-primary', entertainment: 'bg-info', services: 'bg-info'
}

function formatAmount(amount) {
  const sign = amount >= 0 ? '+' : '−'
  return `${sign} ${Math.abs(amount).toLocaleString('ru-RU')} ₽`
}
function formatDate(d) {
  const [y, m, day] = d.split('-')
  return `${day}.${m}.${y}`
}
</script>

<template>
  <tr>
    <td>{{ transaction.description }}</td>
    <td><span class="badge" :class="CATEGORY_BADGES[transaction.category]">{{ CATEGORY_LABELS[transaction.category] }}</span></td>
    <td class="text-muted small">{{ formatDate(transaction.date) }}</td>
    <td class="text-end" :class="transaction.amount >= 0 ? 'amount-plus' : 'amount-minus'">
      {{ formatAmount(transaction.amount) }}
    </td>
  </tr>
</template>
