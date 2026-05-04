import { ref } from "vue";
import { destinationsApi } from "../api/api.js";

export function useDestinations() {
  const destinations = ref([]);
  const destination = ref(null);
  const loading = ref(false);
  const error = ref(null);

  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      destinations.value = await destinationsApi.list();
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function fetchOne(id) {
    loading.value = true;
    error.value = null;
    try {
      destination.value = await destinationsApi.get(id);
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  return { destinations, destination, loading, error, fetchAll, fetchOne };
}

export function getDurationGroup(days) {
  const value = Number(days);
  if (value <= 3) return "1-3";
  if (value <= 7) return "4-7";
  if (value <= 14) return "8-14";
  return "15+";
}

export function getRoutesWord(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "маршрут";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "маршрута";
  return "маршрутов";
}

export function typeLabel(type) {
  return type === "nature" ? "Природа" : "Город";
}

export function formatBudget(value) {
  return Number(value).toLocaleString("ru-RU");
}
