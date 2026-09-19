import { computed, reactive, ref } from "vue";
import { defineStore } from "pinia";
import { destinationsApi } from "../api";

export const useDestinationsStore = defineStore("destinations", () => {
  const destinations = ref([]);
  const selectedDestination = ref(null);
  const savedRoutes = ref([]);
  const isLoading = ref(false);
  const error = ref("");
  const filters = reactive({
    search: "",
    type: "all",
    budget: "all",
    duration: "all"
  });

  const filteredDestinations = computed(() => {
    const searchValue = filters.search.trim().toLowerCase();

    return destinations.value.filter((destination) => {
      const matchesSearch = destination.name.toLowerCase().includes(searchValue);
      const matchesType = filters.type === "all" || destination.type === filters.type;
      const matchesBudget = filters.budget === "all" || destination.budget === filters.budget;
      const matchesDuration = filters.duration === "all" || destination.duration === filters.duration;

      return matchesSearch && matchesType && matchesBudget && matchesDuration;
    });
  });

  function resetFilters() {
    filters.search = "";
    filters.type = "all";
    filters.budget = "all";
    filters.duration = "all";
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

  async function loadDestination(id) {
    isLoading.value = true;
    error.value = "";
    selectedDestination.value = null;

    try {
      const response = await destinationsApi.getById(id);
      selectedDestination.value = response.data;
    } catch (requestError) {
      error.value = "Направление не найдено.";
    } finally {
      isLoading.value = false;
    }
  }

  async function loadSavedRoutes(userId) {
    try {
      const routesResponse = await destinationsApi.getSavedRoutes(userId);
      savedRoutes.value = routesResponse.data;

      if (!destinations.value.length) {
        const destinationsResponse = await destinationsApi.getAll();
        destinations.value = destinationsResponse.data;
      }
    } catch (requestError) {
      error.value = "Не удалось загрузить сохранённые маршруты.";
    }
  }

  async function saveRoute(userId, destinationId) {
    const alreadySaved = savedRoutes.value.some(
      (route) => String(route.destinationId) === String(destinationId)
    );

    if (alreadySaved) return "Маршрут уже сохранён";

    try {
      const response = await destinationsApi.saveRoute({
        userId: Number(userId),
        destinationId: Number(destinationId)
      });
      savedRoutes.value.push(response.data);
      return "Маршрут добавлен в профиль";
    } catch (requestError) {
      throw new Error("Не удалось сохранить маршрут");
    }
  }

  const savedDestinations = computed(() => {
    const ids = savedRoutes.value.map((route) => String(route.destinationId));
    return destinations.value.filter((destination) => ids.includes(String(destination.id)));
  });

  return {
    destinations,
    selectedDestination,
    savedRoutes,
    savedDestinations,
    filteredDestinations,
    filters,
    isLoading,
    error,
    loadDestinations,
    loadDestination,
    loadSavedRoutes,
    saveRoute,
    resetFilters
  };
});
