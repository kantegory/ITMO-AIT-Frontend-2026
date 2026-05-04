<template>
  <section class="card tripatropa-card" aria-labelledby="notes-title">
    <div class="card-body">
      <h2 class="h5 mb-3" id="notes-title">Путевые заметки</h2>
      <p class="text-muted-sm">
        Сохраняйте заметки о поездках: эмоции, лайфхаки, контакты гидов.
      </p>
      <ul class="list-group list-group-flush mb-3">
        <li
          v-if="!notes.length"
          class="list-group-item text-muted-sm"
        >
          Пока нет заметок — добавьте первую ниже.
        </li>
        <li
          v-for="note in notes"
          :key="note.id"
          class="list-group-item d-flex align-items-start justify-content-between gap-2"
        >
          <div class="flex-grow-1 min-w-0">
            <div class="text-muted-sm small">
              {{ formatDate(note.updatedAt) }}
            </div>
            <div class="mt-1">{{ note.text }}</div>
          </div>
          <button
            type="button"
            class="btn btn-sm btn-outline-danger flex-shrink-0"
            @click="$emit('delete', note)"
          >
            Удалить
          </button>
        </li>
      </ul>
      <div class="mb-3">
        <label for="travelNotes" class="form-label">Новая заметка</label>
        <textarea
          v-model="draft"
          class="form-control textarea-fixed"
          id="travelNotes"
          rows="4"
          placeholder="Например: «В следующий раз взять с собой power-bank и дождевик»"
        ></textarea>
      </div>
      <button type="button" class="btn btn-primary" @click="submit">
        <i class="bi bi-bookmark-check me-1"></i> Добавить заметку
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  notes: { type: Array, default: () => [] }
});
const emit = defineEmits(["add", "delete"]);
const draft = ref("");

function submit() {
  const text = draft.value.trim();
  if (!text) return;
  emit("add", text);
  draft.value = "";
}

function formatDate(iso) {
  if (!iso) return "без даты";
  return new Date(iso).toLocaleString("ru-RU");
}
</script>
