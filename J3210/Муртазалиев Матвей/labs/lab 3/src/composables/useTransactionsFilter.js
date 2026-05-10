import { computed, reactive } from "vue";

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

export function useTransactionsFilter(transactions) {
  const filters = reactive({
    search: "",
    category: "all",
    amount: "",
    from: "",
    to: "",
  });

  const categories = computed(() => (
    [...new Set(transactions.value.map((item) => item.category).filter(Boolean))]
  ));

  const filteredTransactions = computed(() => filterTransactions(transactions.value, filters));

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
    resetFilters,
  };
}

