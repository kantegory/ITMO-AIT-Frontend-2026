import { computed, ref } from 'vue';

export function usePagination(items, pageSize = 8) {
  const currentPage = ref(1);

  const totalPages = computed(() => Math.max(1, Math.ceil(items.value.length / pageSize)));
  const pageItems = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return items.value.slice(start, start + pageSize);
  });

  function goToPage(page) {
    currentPage.value = Math.min(Math.max(page, 1), totalPages.value);
  }

  function resetPage() {
    currentPage.value = 1;
  }

  return {
    currentPage,
    totalPages,
    pageItems,
    goToPage,
    resetPage,
  };
}
