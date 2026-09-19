<template>
  <h1 class="h3" tabindex="-1">Заметки</h1>
  <p v-if="store.loading" role="status">Загрузка…</p>
  <div v-else-if="store.error"><p class="alert alert-danger" role="alert">{{ store.error }}</p><button class="btn btn-secondary" @click="store.load">Повторить</button></div>
  <template v-else><p v-if="!store.notes.length">Заметок пока нет. Добавьте первую.</p>
    <NoteCard v-for="note in store.notes" :key="note.id" :note="note" />
  </template>
</template>
<script setup>
import { onMounted } from 'vue';
import { useNotesStore } from '../stores/notes';
import NoteCard from '../components/NoteCard.vue';
const store = useNotesStore();
onMounted(store.load);
</script>
