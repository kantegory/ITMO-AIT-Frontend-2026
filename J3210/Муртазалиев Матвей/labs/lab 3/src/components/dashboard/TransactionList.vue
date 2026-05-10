<template>
  <div class="transaction-list mt-4" role="list" aria-label="Список транзакций">
    <article
      v-for="transaction in transactions"
      :key="transaction.id || `${transaction.title}-${transaction.date}`"
      class="transaction-item"
      role="listitem"
      :aria-label="`${transaction.title}, ${transaction.category}, ${formatLongDate(transaction.date)}, ${transaction.type === 'income' ? 'доход' : 'расход'} ${formatCurrency(transaction.amount)}`"
    >
      <div class="transaction-item__icon" :class="getCategoryMeta(transaction.category, transaction.type).backgroundClass">
        <SvgIcon :name="getCategoryMeta(transaction.category, transaction.type).icon" class-name="icon--sm" />
      </div>
      <div class="transaction-item__body">
        <div class="d-flex justify-content-between gap-3 flex-wrap">
          <div>
            <h3>{{ transaction.title }}</h3>
            <p class="mb-0 text-secondary">{{ transaction.category }} • {{ formatLongDate(transaction.date) }}</p>
          </div>
          <strong :class="transaction.type === 'income' ? 'text-success' : 'text-danger'">
            {{ transaction.type === "income" ? "+" : "−" }} {{ formatCurrency(transaction.amount) }}
          </strong>
        </div>
      </div>
    </article>
  </div>
  <div v-if="!transactions.length" class="empty-state mt-4">
    По текущим фильтрам транзакций нет.
  </div>
</template>

<script setup>
import SvgIcon from "@/components/SvgIcon.vue";
import { formatCurrency, formatLongDate } from "@/utils/formatters";
import { getCategoryMeta } from "@/utils/financeMetrics";

defineProps({
  transactions: {
    type: Array,
    required: true,
  },
});
</script>

