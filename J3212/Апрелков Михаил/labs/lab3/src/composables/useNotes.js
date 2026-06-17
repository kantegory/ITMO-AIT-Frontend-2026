import { computed, ref } from "vue";
import { notesApi } from "../api/api.js";

export function useNotes() {
  const notes = ref([]);

  const sorted = computed(() =>
    [...notes.value].sort(
      (a, b) =>
        new Date(b.updatedAt || 0).getTime() -
        new Date(a.updatedAt || 0).getTime()
    )
  );

  async function load(userId) {
    try {
      notes.value = await notesApi.listByUser(userId);
    } catch (e) {
      notes.value = [];
    }
  }

  async function add(userId, text) {
    const created = await notesApi.create({
      userId,
      text,
      updatedAt: new Date().toISOString()
    });
    notes.value = [created, ...notes.value];
    return created;
  }

  async function remove(id) {
    await notesApi.remove(id);
    notes.value = notes.value.filter((n) => n.id !== id);
  }

  return { notes, sorted, load, add, remove };
}
