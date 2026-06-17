<script setup>
import { computed } from 'vue'

const props = defineProps({
  transaction: {
    type: Object,
    required: true,
  },
  accountMap: {
    type: Object,
    default: () => ({}),
  },
})

const accName = computed(() => props.accountMap[props.transaction.accountId] || 'Неизвестный счет')
const sign = computed(() => (props.transaction.type === 'expense' ? '-' : '+'))
const colorClass = computed(() => (props.transaction.type === 'expense' ? 'text-danger' : 'text-success'))

const displayDate = computed(() => {
  if (!props.transaction.date) return 'Нет даты'

  const dateObject = new Date(props.transaction.date)

  if (Number.isNaN(dateObject.getTime())) {
    return props.transaction.date
  }

  return dateObject.toLocaleDateString('ru-RU')
})
</script>

<template>
  <tr>
    <td class="align-middle">{{ displayDate }}</td>
    <td class="align-middle">{{ transaction.description || transaction.category }}</td>
    <td class="align-middle">{{ accName }}</td>
    <td class="align-middle">{{ transaction.category }}</td>
    <td class="align-middle fw-bold" :class="colorClass">
      {{ sign }}{{ transaction.amount }} ₽
    </td>
  </tr>
</template>
