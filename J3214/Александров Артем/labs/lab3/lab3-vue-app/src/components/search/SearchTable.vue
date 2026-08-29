<template>
  <div class="card border-0 shadow-sm p-4 rounded-4 theme-card">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="h6 fw-bold m-0">Результаты поиска</h2>
      <span class="badge px-3 py-2 rounded-pill fw-medium theme-bg-secondary theme-text-main">
        Найдено: {{ transactions.length }} операций
      </span>
    </div>

    <div class="table-responsive">
      <table class="theme-table table table-hover align-middle m-0 border-top">
        <thead class="theme-table-header">
          <tr>
            <th scope="col" class="theme-text-muted small text-uppercase fw-semibold py-3 ps-3 border-0">Дата</th>
            <th scope="col" class="theme-text-muted small text-uppercase fw-semibold py-3 border-0">Описание</th>
            <th scope="col" class="theme-text-muted small text-uppercase fw-semibold py-3 border-0">Категория</th>
            <th scope="col" class="theme-text-muted small text-uppercase fw-semibold py-3 text-end pe-3 border-0">Сумма</th>
          </tr>
        </thead>
        <tbody class="border-top-0">
          <tr v-if="transactions.length === 0">
            <td colspan="4" class="text-center py-4 theme-text-muted">
              {{ totalUserTransactions === 0 ? 'У вас пока нет добавленных операций' : 'По заданным фильтрам операций не найдено' }}
            </td>
          </tr>
          <tr v-for="tx in transactions" :key="tx.id">
            <td class="theme-text-muted py-3 ps-3 small">{{ formatDate(tx.date) }}</td>
            <td>
              <div class="fw-semibold theme-text-main">{{ tx.title }}</div>
            </td>
            <td>
              <span class="badge rounded-pill px-3 py-2" :class="tx.amount > 0 ? 'bg-success-subtle text-success' : 'bg-primary-subtle text-primary'">
                <i class="bi me-1" :class="tx.amount > 0 ? 'bi-wallet2' : 'bi-bag-heart'"></i> {{ tx.category }}
              </span>
            </td>
            <td class="fw-bold text-end pe-3" :class="tx.amount > 0 ? 'text-success' : 'theme-text-main'">
              {{ tx.amount > 0 ? '+' : '-' }}${{ Math.abs(tx.amount).toFixed(2) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  transactions: {
    type: Array,
    default: () => []
  },
  totalUserTransactions: {
    type: Number,
    default: 0
  }
})

const formatDate = (isoStr) => {
  if (!isoStr) return '--.--.----'
  const d = new Date(isoStr)
  return isNaN(d.getTime()) ? isoStr : d.toLocaleDateString('ru-RU')
}
</script>