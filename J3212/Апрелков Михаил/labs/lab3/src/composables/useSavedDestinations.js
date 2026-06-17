import { computed, ref } from "vue";
import { savedApi, destinationsApi } from "../api/api.js";

export function useSavedDestinations() {
  const items = ref([]);
  const details = ref([]);

  const savedSet = computed(
    () => new Set(items.value.map((i) => String(i.destinationId)))
  );

  async function load(userId) {
    if (!userId) {
      items.value = [];
      return;
    }
    try {
      items.value = await savedApi.listByUser(userId);
    } catch (e) {
      items.value = [];
    }
  }

  async function loadWithDetails(userId) {
    await load(userId);
    const seen = new Set();
    const unique = items.value.filter((i) => {
      const key = String(i.destinationId);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    const fetched = await Promise.all(
      unique.map((i) => destinationsApi.get(i.destinationId).catch(() => null))
    );
    details.value = fetched.filter(Boolean);
  }

  async function toggleSave(userId, destinationId) {
    const did = String(destinationId);
    const existing = items.value.find(
      (i) => String(i.destinationId) === did
    );
    if (existing) {
      await savedApi.remove(existing.id);
      items.value = items.value.filter((i) => i.id !== existing.id);
    } else {
      const created = await savedApi.add(userId, destinationId);
      items.value = [...items.value, created];
    }
  }

  return { items, details, savedSet, load, loadWithDetails, toggleSave };
}
