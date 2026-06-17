<template>
  <section class="card tripatropa-card" aria-labelledby="group-notes-title">
    <div class="card-body">
      <h2 class="h6 mb-3" id="group-notes-title">Общие заметки по поездке</h2>
      <ul class="list-group list-group-flush">
        <li
          v-for="note in notes"
          :key="note.id"
          class="list-group-item d-flex align-items-start"
        >
          <span class="badge me-2" :class="badgeClass(note.initialVariant)">
            {{ note.initial || "?" }}
          </span>
          <div class="flex-grow-1 min-w-0">
            <div class="fw-semibold">{{ note.author }}</div>
            <div class="text-muted-sm">{{ note.text }}</div>
          </div>
          <button
            v-if="canDelete(note)"
            type="button"
            class="btn btn-sm btn-outline-danger ms-2 align-self-start flex-shrink-0"
            @click="$emit('delete', note)"
          >
            Удалить
          </button>
        </li>
        <li v-if="!notes.length" class="list-group-item text-muted-sm">
          Заметок пока нет.
        </li>
      </ul>
      <div class="mt-3 pt-3 border-top">
        <label class="form-label text-muted-sm mb-1" for="collabNoteInput">
          Добавить заметку для группы
        </label>
        <div class="input-group input-group-sm">
          <input
            v-model="draft"
            type="text"
            class="form-control"
            id="collabNoteInput"
            placeholder="Например: согласовать время вылета"
            autocomplete="off"
            @keyup.enter="submit"
          />
          <button class="btn btn-primary" type="button" @click="submit">
            Добавить
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useAuth } from "../composables/useAuth.js";

defineProps({
  notes: { type: Array, default: () => [] }
});
const emit = defineEmits(["add", "delete"]);
const { currentUser } = useAuth();
const draft = ref("");

function badgeClass(variant) {
  const v = String(variant || "primary");
  if (v === "success") return "bg-success-subtle text-success";
  if (v === "warning") return "bg-warning-subtle text-warning";
  if (v === "secondary") return "bg-secondary-subtle text-secondary";
  return "bg-primary-subtle text-primary";
}

function canDelete(note) {
  if (!currentUser.value) return false;
  if (note.authorId == null) return false;
  return String(note.authorId) === String(currentUser.value.id);
}

function submit() {
  const text = draft.value.trim();
  if (!text) return;
  emit("add", text);
  draft.value = "";
}
</script>
