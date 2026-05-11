import { computed, ref } from 'vue';
import { useApi } from './useApi';

export function useTransactions() {
  const { api } = useApi();
  const transactions = ref([]);
  const loading = ref(false);
  const error = ref('');

  async function loadTransactions() {
    loading.value = true;
    error.value = '';

    try {
      const response = await api.get('/transactions');
      transactions.value = response.data;
    } catch (e) {
      error.value = 'Не удалось загрузить транзакции';
    } finally {
      loading.value = false;
    }
  }

  function filterTransactions(filters) {
    const search = filters.search.toLowerCase().trim();
    const category = filters.category;
    const amount = filters.amount;
    const date = filters.date;

    return transactions.value.filter((item) => {
      const matchSearch =
        item.description.toLowerCase().includes(search) ||
        item.category.toLowerCase().includes(search);

      const matchCategory = !category || item.category === category;
      const matchAmount = !amount || Math.abs(item.amount) === Number(amount);
      const matchDate = !date || item.date === date;

      return matchSearch && matchCategory && matchAmount && matchDate;
    });
  }

  const summary = computed(() => {
    let income = 0;
    let expenses = 0;

    transactions.value.forEach((item) => {
      if (item.amount > 0) {
        income += item.amount;
      } else {
        expenses += Math.abs(item.amount);
      }
    });

    return {
      income,
      expenses,
      balance: income - expenses
    };
  });

  const lastTransactions = computed(() => {
    return [...transactions.value]
      .sort((a, b) => b.id - a.id)
      .slice(0, 3);
  });

  const categories = computed(() => {
    return [...new Set(transactions.value.map((item) => item.category))];
  });

  return {
    transactions,
    loading,
    error,
    summary,
    lastTransactions,
    categories,
    loadTransactions,
    filterTransactions
  };
}
