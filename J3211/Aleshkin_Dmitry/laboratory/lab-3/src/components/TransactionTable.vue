<template>
  <section class="table-card">
    <div v-if="items.length" class="table-responsive">
      <table class="table app-table align-middle mb-0">
        <thead>
          <tr>
            <th>Дата</th>
            <th>Описание</th>
            <th>Категория</th>
            <th>Сумма</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ formatDate(item.date) }}</td>
            <td>{{ item.description }}</td>
            <td>{{ item.categoryName }}</td>
            <td :class="Number(item.amount) >= 0 ? 'amount-positive' : 'amount-negative'">
              {{ formatCurrency(item.amount) }}
            </td>
            <td>
              <button
                class="btn btn-sm btn-outline-danger"
                :disabled="disabled"
                @click="$emit('remove', item.id)"
              >
                Удалить
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="empty-table-state">
      <div class="empty-table-title">Транзакции не найдены</div>
      <div class="empty-table-text">
        Попробуйте изменить фильтры или добавить новую транзакцию.
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  disabled: Boolean,
  formatCurrency: {
    type: Function,
    required: true,
  },
  formatDate: {
    type: Function,
    required: true,
  },
});

defineEmits(['remove']);
</script>