import { computed, reactive, ref, watch } from "vue";
import { getFilteredTransactions } from "@/services/authApi";

export function filterTransactions(transactions, filters) {
  return transactions.filter((item) => {
    const title = `${item.title} ${item.category} ${item.accountName || ""}`.toLowerCase();
    const category = String(item.category || "").toLowerCase();
    const search = String(filters.search || "").trim().toLowerCase();
    const selectedCategory = String(filters.category || "all").toLowerCase();
    const maxAmount = Number(filters.amount || 0);

    return (
      (!search || title.includes(search)) &&
      (selectedCategory === "all" || category === selectedCategory) &&
      (!maxAmount || Number(item.amount) <= maxAmount) &&
      (!filters.from || item.date >= filters.from) &&
      (!filters.to || item.date <= filters.to)
    );
  });
}

export function useTransactionsFilter(transactions, userId) {
  const filters = reactive({
    search: "",
    category: "all",
    amount: "",
    from: "",
    to: "",
  });

  const filteredTransactions = ref([]);
  const filterLoading = ref(false);

  const categories = computed(() =>
    [...new Set(transactions.value.map((item) => item.category).filter(Boolean))]
  );

  let debounceTimer = null;

  async function fetchFiltered() {
    const id = userId.value;
    if (!id) return;
    filterLoading.value = true;
    try {
      filteredTransactions.value = await getFilteredTransactions(id, filters);
    } finally {
      filterLoading.value = false;
    }
  }

  function scheduleFilter() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fetchFiltered, 300);
  }

  watch(filters, scheduleFilter, { deep: true });
  watch(userId, (id) => { if (id) fetchFiltered(); }, { immediate: true });

  function resetFilters() {
    filters.search = "";
    filters.category = "all";
    filters.amount = "";
    filters.from = "";
    filters.to = "";
  }

  return {
    filters,
    categories,
    filteredTransactions,
    filterLoading,
    resetFilters,
  };
}

