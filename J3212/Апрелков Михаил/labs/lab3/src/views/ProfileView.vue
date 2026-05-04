<template>
  <div class="page-wrapper">
    <AppHeader />
    <main class="py-4">
      <div class="container">
        <ProfileHeader :user="currentUser" />

        <div v-if="!currentUser" class="alert alert-warning">
          Войдите, чтобы открыть профиль.
          <RouterLink to="/login">Перейти ко входу</RouterLink>
        </div>

        <div v-else class="row g-4">
          <div class="col-lg-8">
            <SavedRoutesList :destinations="savedDetails" />
            <NotesSection
              :notes="notesSorted"
              @add="onAddNote"
              @delete="onDeleteNote"
            />
          </div>
          <div class="col-lg-4">
            <section class="card tripatropa-card mb-4" aria-labelledby="upcoming-title">
              <div class="card-body">
                <h2 class="h5 mb-3" id="upcoming-title">Ближайшие поездки</h2>
                <p class="text-muted-sm mb-0">Пока что запланированных поездок нет.</p>
              </div>
            </section>

            <section class="card tripatropa-card" aria-labelledby="quick-access-title">
              <div class="card-body">
                <h2 class="h6 mb-2" id="quick-access-title">Быстрый доступ</h2>
                <div class="d-grid gap-2">
                  <RouterLink to="/search" class="btn btn-outline-primary btn-sm">
                    <i class="bi bi-search me-1"></i> К поиску направлений
                  </RouterLink>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { RouterLink } from "vue-router";
import AppHeader from "../components/AppHeader.vue";
import AppFooter from "../components/AppFooter.vue";
import ProfileHeader from "../components/ProfileHeader.vue";
import SavedRoutesList from "../components/SavedRoutesList.vue";
import NotesSection from "../components/NotesSection.vue";
import { useAuth } from "../composables/useAuth.js";
import { useSavedDestinations } from "../composables/useSavedDestinations.js";
import { useNotes } from "../composables/useNotes.js";

const { currentUser } = useAuth();
const { details: savedDetails, loadWithDetails } = useSavedDestinations();
const { sorted: notesSorted, load: loadNotes, add: addNote, remove: removeNote } = useNotes();

async function onAddNote(text) {
  try {
    await addNote(currentUser.value.id, text);
  } catch (e) {
    alert("Не удалось сохранить заметку");
  }
}

async function onDeleteNote(note) {
  try {
    await removeNote(note.id);
  } catch (e) {
    alert("Не удалось удалить заметку");
  }
}

onMounted(async () => {
  if (!currentUser.value) return;
  await loadWithDetails(currentUser.value.id);
  await loadNotes(currentUser.value.id);
});
</script>
