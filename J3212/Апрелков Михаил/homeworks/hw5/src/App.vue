<script setup>
import { ref } from 'vue'
import NoteItem from './components/NoteItem.vue'
import { useNotes } from './composables/useNotes.js'

const { notes, addNote } = useNotes()
const title = ref('')
const text = ref('')

function handleAdd() {
  addNote(title.value, text.value)
  title.value = ''
  text.value = ''
}
</script>

<template>
  <div class="app">
    <h1>Заметки</h1>
    <form class="form" @submit.prevent="handleAdd">
      <div class="field">
        <label for="note-title">Заголовок</label>
        <input id="note-title" v-model="title" type="text" />
      </div>
      <div class="field">
        <label for="note-text">Текст</label>
        <textarea id="note-text" v-model="text" rows="4"></textarea>
      </div>
      <button type="submit">Добавить</button>
    </form>
    <ul class="list">
      <NoteItem
        v-for="n in notes"
        :key="n.id"
        :title="n.title"
        :text="n.text"
      />
    </ul>
  </div>
</template>

<style scoped>
.app {
  max-width: 520px;
}

h1 {
  margin: 0 0 1rem;
  font-size: 1.35rem;
}

.form {
  margin-bottom: 1rem;
}

.field {
  margin-bottom: 0.5rem;
}

.field label {
  display: block;
  margin-bottom: 0.2rem;
  font-size: 0.9rem;
}

.field input,
.field textarea {
  width: 100%;
  font: inherit;
  padding: 0.25rem 0.35rem;
}

.list {
  margin: 0;
  padding: 0;
}
</style>
