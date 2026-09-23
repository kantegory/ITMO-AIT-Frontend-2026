<template>
  <div class="table-responsive">
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Категория</th>
          <th>Значение</th>
          <th>Потрачено</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="budget in budgets" :key="budget.id">
          <td>{{ budget.categoryName }}</td>
          <td>{{ formatCurrency(budget.limit) }}</td>
          <td>{{ formatCurrency(getSpentAmount(budget.category)) }}</td>
          <td class="d-flex gap-2">
            <button class="btn btn-sm btn-outline-primary" @click="$emit('edit', budget)" :disabled="disabled">
              Изменить
            </button>
            <button class="btn btn-sm btn-outline-danger" @click="$emit('remove', budget.id)" :disabled="disabled">
              Удалить
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  budgets: {
    type: Array,
    default: () => [],
  },
  expensesByCategory: {
    type: Array,
    default: () => [],
  },
  formatCurrency: {
    type: Function,
    required: true,
  },
  disabled: Boolean,
});

defineEmits(['edit', 'remove']);

function getSpentAmount(category) {
  return props.expensesByCategory.find((item) => item.key === category)?.amount || 0;
}
</script>