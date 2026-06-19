<script setup>
import { computed } from 'vue'

const props = defineProps({ transaction: Object })

const categoriesMap = {
  food: 'Еда / Супермаркеты',
  transport: 'Транспорт',
  income: 'Поступления / Зарплата',
  transfers: 'Переводы'
}

const isExpense = computed(() => props.transaction.transType === 'expense')
</script>

<template>
  <tr>
    <td class="px-4">{{ transaction.date }}</td>
    <td>{{ transaction.accountName }}</td>
    <td class="fw-bold">{{ transaction.description }}</td>
    <td>{{ categoriesMap[transaction.category] || transaction.category }}</td>
    <td :class="isExpense ? 'text-danger' : 'text-success'">
      {{ isExpense ? '- ' : '+ ' }}{{ parseFloat(transaction.amount).toLocaleString('ru-RU') }} ₽
    </td>
  </tr>
</template>
