<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import BaseLayout from "../layouts/BaseLayout.vue";
import { useAuthStore } from "../stores/auth";
import { useTripStore } from "../stores/trip";
import { useFormatters } from "../composables/useFormatters";

const authStore = useAuthStore();
const tripStore = useTripStore();
const { currentUser } = storeToRefs(authStore);
const { trip, notes, budgetPercent, isLoading, error } = storeToRefs(tripStore);
const { formatPrice } = useFormatters();
const newNote = ref("");
const noteError = ref("");

async function addNote() {
  if (!newNote.value.trim()) return;
  noteError.value = "";

  try {
    await tripStore.addNote(newNote.value, currentUser.value.id);
    newNote.value = "";
  } catch (requestError) {
    noteError.value = "Не удалось добавить заметку.";
  }
}

async function deleteNote(id) {
  noteError.value = "";
  try {
    await tripStore.deleteNote(id);
  } catch (requestError) {
    noteError.value = "Не удалось удалить заметку.";
  }
}

onMounted(() => tripStore.loadTrip());
</script>

<template>
  <BaseLayout>
    <section class="container page-section">
      <div v-if="isLoading" class="loading-card">Загружаем поездку…</div>
      <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

      <template v-else-if="trip">
        <header class="trip-heading">
          <div>
            <p class="eyebrow text-primary">Моя поездка</p>
            <h1>{{ trip.title }}</h1>
            <p class="lead mb-0">{{ trip.dates }}</p>
          </div>
          <RouterLink class="btn btn-outline-primary" :to="`/destination/${trip.destinationId}`">
            Открыть маршрут
          </RouterLink>
        </header>

        <div class="row g-4 mt-2">
          <div class="col-lg-7">
            <section class="detail-card" aria-labelledby="budget-title">
              <h2 id="budget-title" class="h4">Бюджет поездки</h2>
              <div class="d-flex justify-content-between mb-2">
                <span>Запланировано: {{ formatPrice(trip.planned) }}</span>
                <strong>{{ budgetPercent }}%</strong>
              </div>
              <div class="progress" role="progressbar" :aria-valuenow="budgetPercent" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar" :style="{ width: `${budgetPercent}%` }"></div>
              </div>
              <p class="text-secondary mt-2 mb-0">Общий бюджет: {{ formatPrice(trip.budget) }}</p>
            </section>

            <section class="detail-card mt-4" aria-labelledby="notes-title">
              <h2 id="notes-title" class="h4">Общие заметки</h2>
              <div v-if="noteError" class="alert alert-danger">{{ noteError }}</div>
              <form class="d-flex gap-2 mb-3" @submit.prevent="addNote">
                <input v-model="newNote" class="form-control" placeholder="Добавить заметку" required>
                <button class="btn btn-primary" type="submit">Добавить</button>
              </form>
              <ul class="notes-list">
                <li v-for="note in notes" :key="note.id">
                  <span>{{ note.text }}</span>
                  <button class="btn btn-sm btn-outline-danger" type="button" @click="deleteNote(note.id)">
                    Удалить
                  </button>
                </li>
              </ul>
            </section>
          </div>

          <div class="col-lg-5">
            <section class="detail-card" aria-labelledby="participants-title">
              <h2 id="participants-title" class="h4">Участники</h2>
              <div v-for="participant in trip.participants" :key="participant.name" class="participant">
                <span class="participant-avatar">{{ participant.name.charAt(0) }}</span>
                <div>
                  <strong>{{ participant.name }}</strong>
                  <small>{{ participant.role }}</small>
                </div>
              </div>
            </section>
          </div>
        </div>
      </template>
    </section>
  </BaseLayout>
</template>
