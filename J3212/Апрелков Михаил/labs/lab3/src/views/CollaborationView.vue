<template>
  <div class="page-wrapper">
    <AppHeader />
    <main class="py-4">
      <div class="container">
        <div
          class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4"
        >
          <div>
            <h1 class="h4 mb-1">Совместное планирование поездок</h1>
            <p class="text-muted-sm mb-0">
              Поделитесь маршрутом с друзьями и собирайте идеи в одном месте.
            </p>
          </div>
          <div class="mt-3 mt-md-0">
            <RouterLink to="/destinations/1" class="btn btn-outline-secondary btn-sm me-2">
              <i class="bi bi-map me-1"></i> К примеру маршрута
            </RouterLink>
            <RouterLink to="/search" class="btn btn-primary btn-sm">
              Найти новое направление
            </RouterLink>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-lg-6">
            <ShareRouteCard :url="shareUrl" />
            <CollabNotesCard :notes="notes" @add="onAddNote" @delete="onDeleteNote" />
          </div>
          <div class="col-lg-6">
            <MembersCard :members="members" @invite="onInvite" @remove="onRemoveMember" />
            <ActivityFeed :activities="activities" />
          </div>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { RouterLink } from "vue-router";
import AppHeader from "../components/AppHeader.vue";
import AppFooter from "../components/AppFooter.vue";
import ShareRouteCard from "../components/ShareRouteCard.vue";
import CollabNotesCard from "../components/CollabNotesCard.vue";
import MembersCard from "../components/MembersCard.vue";
import ActivityFeed from "../components/ActivityFeed.vue";
import { useAuth } from "../composables/useAuth.js";
import { useCollab } from "../composables/useCollab.js";

const { currentUser } = useAuth();
const {
  notes,
  activities,
  members,
  load,
  addNote,
  removeNote,
  inviteByEmail,
  removeMember
} = useCollab("default");

const shareUrl = "https://tripatropa.demo/route/paris-weekend";

async function onAddNote(text) {
  const author = currentUser.value?.name || "Гость";
  const initial = (author.trim()[0] || "?").toUpperCase();
  try {
    await addNote({
      authorId: currentUser.value ? String(currentUser.value.id) : null,
      author,
      initial,
      initialVariant: "secondary",
      text
    });
  } catch (e) {
    alert("Не удалось добавить заметку");
  }
}

async function onDeleteNote(note) {
  try {
    await removeNote(note.id);
  } catch (e) {
    alert("Не удалось удалить заметку");
  }
}

async function onInvite({ email, role, resolve, reject }) {
  try {
    const result = await inviteByEmail(email, role);
    resolve(result);
  } catch (e) {
    reject(e);
  }
}

async function onRemoveMember(member) {
  try {
    await removeMember(member.id);
  } catch (e) {
    alert("Не удалось убрать участника");
  }
}

onMounted(load);
</script>
