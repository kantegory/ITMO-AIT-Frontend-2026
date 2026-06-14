<script setup>
defineProps({
  rows: { type: Array, required: true },
  currency: { type: String, default: 'RUB' },
  formatMoney: { type: Function, required: true },
  formatDate: { type: Function, required: true },
})

const emit = defineEmits(['select'])
</script>

<template>
  <div v-if="!rows.length" class="empty-state">По текущим фильтрам ничего не найдено.</div>
  <div v-else class="table-responsive">
    <table class="table align-middle">
      <thead>
        <tr>
          <th scope="col">Дата</th>
          <th scope="col">Описание</th>
          <th scope="col">Категория</th>
          <th scope="col">Счёт</th>
          <th scope="col">Тип</th>
          <th scope="col">Сумма</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id" role="button" tabindex="0"
            @click="emit('select', row)"
            @keydown.enter.prevent="emit('select', row)"
            @keydown.space.prevent="emit('select', row)">
          <td>{{ formatDate(row.date) }}</td>
          <td>{{ row.description }}</td>
          <td>{{ row.category }}</td>
          <td>{{ row.account }}</td>
          <td :class="row.type === 'income' ? 'transaction-type-income' : 'transaction-type-expense'">
            {{ row.type === 'income' ? 'Доход' : 'Расход' }}
          </td>
          <td>{{ formatMoney(row.amount, currency) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
