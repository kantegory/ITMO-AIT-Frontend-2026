import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { destinationsApi } from "../api";

export const useDestinationsStore = defineStore("destinations", () => {
  const search = ref("");
  const destinations = ref([]);
  const isLoading = ref(false);
  const error = ref("");

  const filteredDestinations = computed(() => {
    const value = search.value.trim().toLowerCase();

    if (!value) {
      return destinations.value;
    }

    return destinations.value.filter((destination) =>
      destination.name.toLowerCase().includes(value)
    );
  });

  function resetSearch() {
    search.value = "";
  }

  async function loadDestinations() {
    isLoading.value = true;
    error.value = "";

    try {
      const response = await destinationsApi.getAll();
      destinations.value = response.data;
    } catch (requestError) {
      error.value = "Не удалось загрузить направления. Проверьте, запущен ли JSON Server.";
    } finally {
      isLoading.value = false;
    }
  }

  async function createDestination(data) {
    error.value = "";

    try {
      const response = await destinationsApi.create(data);
      destinations.value.push(response.data);
      return true;
    } catch (requestError) {
      error.value = "Не удалось добавить направление.";
      return false;
    }
  }

  return {
    search,
    destinations,
    filteredDestinations,
    isLoading,
    error,
    loadDestinations,
    createDestination,
    resetSearch
  };
}, {
  persist: {
    pick: ["search"]
  }
});
