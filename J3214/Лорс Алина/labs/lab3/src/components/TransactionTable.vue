<template>
  <div class="table-responsive">
    <table class="table align-middle mb-0">
      <thead>
        <tr>
          <th scope="col">Дата</th>
          <th scope="col">Описание</th>
          <th scope="col">Категория</th>
          <th scope="col">Счёт</th>
          <th scope="col">Тип</th>
          <th scope="col" class="text-end">Сумма</th>
          <th v-if="editable" scope="col" class="text-end">Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in transactions" :key="item.id">
          <td>{{ formatDate(item.date) }}</td>
          <td class="fw-semibold">{{ item.description }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.accountName || '—' }}</td>
          <td><span class="badge rounded-pill" :class="badgeClass(item.type)">{{ typeTitle(item.type) }}</span></td>
          <td class="text-end fw-semibold" :class="amountClass(item.type)">{{ sign(item.type) }}{{ formatMoney(item.amount) }}</td>
          <td v-if="editable" class="text-end">
            <button class="btn btn-outline-danger btn-sm" type="button" @click="$emit('delete', item.id)">Удалить</button>
          </td>
        </tr>
        <tr v-if="!transactions.length">
          <td :colspan="editable ? 7 : 6" class="text-center text-secondary py-4">Пока нет транзакций</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  transactions: {
    type: Array,
    required: true
  },
  formatMoney: {
    type: Function,
    required: true
  },
  editable: {
    type: Boolean,
    default: false
  }
});

defineEmits(['delete']);

function formatDate(date) {
  return new Date(date).toLocaleDateString('ru-RU');
}

function typeTitle(type) {
  return {
    income: 'Доход',
    expense: 'Расход',
    transfer_in: 'Перевод +',
    transfer_out: 'Перевод -'
  }[type] || type;
}

function badgeClass(type) {
  if (type === 'income' || type === 'transfer_in') return 'text-bg-success';
  if (type === 'expense' || type === 'transfer_out') return 'text-bg-danger';
  return 'text-bg-secondary';
}

function amountClass(type) {
  return type === 'income' || type === 'transfer_in' ? 'text-success' : 'text-danger';
}

function sign(type) {
  return type === 'income' || type === 'transfer_in' ? '+' : '-';
}
</script>
