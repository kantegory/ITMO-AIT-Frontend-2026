<script setup>
import { computed, ref } from 'vue'
import NoteItem from './components/NoteItem.vue'
import { useNotes } from './composables/useNotes.js'

const { notes, addNote, removeNote } = useNotes()

const draftTitle = ref('')
const draftText = ref('')
const query = ref('')
const formError = ref('')

const filteredNotes = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return notes.value
  return notes.value.filter(
    (n) =>
      n.title.toLowerCase().includes(q) || n.text.toLowerCase().includes(q)
  )
})

function onSubmit() {
  formError.value = ''
  const ok = addNote(draftTitle.value, draftText.value)
  if (!ok) {
    formError.value = 'Введите текст заметки.'
    return
  }
  draftTitle.value = ''
  draftText.value = ''
}
</script>

<template>
  <div class="page">
    <header class="top">
      <h1>Заметки</h1>
      <p class="credit">made by Tischenko Pavel</p>
    </header>

    <section class="panel">
      <h2 class="h3">Новая заметка</h2>
      <form class="form" @submit.prevent="onSubmit">
        <label class="field">
          <span>Заголовок</span>
          <input v-model.trim="draftTitle" type="text" autocomplete="off" placeholder="Например: список на тренировку" />
        </label>
        <label class="field">
          <span>Текст</span>
          <textarea v-model="draftText" rows="4" placeholder="Содержимое заметки"></textarea>
        </label>
        <p v-if="formError" class="err" role="alert">{{ formError }}</p>
        <button type="submit" class="btn primary">Добавить</button>
      </form>
    </section>

    <section class="panel">
      <div class="row-between">
        <h2 class="h3">Список</h2>
        <label class="field inline">
          <span class="sr-only">Поиск</span>
          <input v-model.trim="query" type="search" placeholder="Поиск по заголовку и тексту" />
        </label>
      </div>

      <p v-if="!notes.length" class="empty">Пока нет заметок — добавьте первую выше.</p>
      <p v-else-if="!filteredNotes.length" class="empty">Ничего не найдено по запросу.</p>

      <ul v-else class="note-list">
        <li v-for="note in filteredNotes" :key="note.id">
          <NoteItem :note="note" @remove="removeNote" />
        </li>
      </ul>
    </section>
  </div>
</template>
