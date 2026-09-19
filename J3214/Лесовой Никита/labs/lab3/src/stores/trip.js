import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { tripsApi } from "../api";

export const useTripStore = defineStore("trip", () => {
  const trip = ref(null);
  const notes = ref([]);
  const isLoading = ref(false);
  const error = ref("");

  const budgetPercent = computed(() => {
    if (!trip.value?.budget) return 0;
    return Math.min(Math.round((trip.value.planned / trip.value.budget) * 100), 100);
  });

  async function loadTrip(id = "1") {
    isLoading.value = true;
    error.value = "";

    try {
      const [tripResponse, notesResponse] = await Promise.all([
        tripsApi.getTrip(id),
        tripsApi.getNotes(id)
      ]);
      trip.value = tripResponse.data;
      notes.value = notesResponse.data;
    } catch (requestError) {
      error.value = "Не удалось загрузить поездку.";
    } finally {
      isLoading.value = false;
    }
  }

  async function addNote(text, userId) {
    const response = await tripsApi.createNote({
      tripId: Number(trip.value.id),
      userId: Number(userId),
      text: text.trim()
    });
    notes.value.push(response.data);
  }

  async function deleteNote(id) {
    await tripsApi.deleteNote(id);
    notes.value = notes.value.filter((note) => String(note.id) !== String(id));
  }

  return { trip, notes, isLoading, error, budgetPercent, loadTrip, addNote, deleteNote };
});
