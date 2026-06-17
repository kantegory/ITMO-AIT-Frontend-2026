<template>
  <tr>
    <td>{{ formatDate(tx.date) }}</td>
    <td>{{ tx.account }}</td>
    <td>{{ tx.desc || '-' }}</td>
    <td>{{ tx.category }}</td>
    <td :class="tx.sum > 0 ? 'text-income' : 'text-expense'">
      {{ tx.sum > 0 ? '+' : '' }}{{ tx.sum.toFixed(2) }}
    </td>
  </tr>
</template>

<script setup>
defineProps(['tx'])

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const [y, m, d] = dateStr.split('-')
  return `${d}.${m}.${y}`
}
</script>