<template>
  <base-layout>
    <h1 class="mb-4">📝 Notes App</h1>

    <form ref="noteForm" @submit.prevent="createCard" class="card p-4 mb-5 shadow-sm">
      <h5 class="mb-3">Новая заметка</h5>
      <div class="mb-3">
        <label class="form-label" for="noteName">Заголовок</label>
        <input
          id="noteName"
          type="text"
          class="form-control"
          placeholder="Введите заголовок..."
          v-model="form.name"
          required
        />
      </div>
      <div class="mb-3">
        <label class="form-label" for="noteText">Текст</label>
        <textarea
          id="noteText"
          class="form-control"
          rows="3"
          placeholder="Введите текст заметки..."
          v-model="form.text"
        />
      </div>
      <button type="submit" class="btn btn-primary">
        Добавить заметку
      </button>
    </form>

    <div v-if="notes.length === 0" class="text-center text-muted py-5">
      Заметок пока нет. Создайте первую!
    </div>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4" v-else>
      <div class="col" v-for="note in notes" :key="note.id">
        <note-card
          :name="note.name"
          :text="note.text"
          @delete="removeNote(note.id)"
        />
      </div>
    </div>
  </base-layout>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import BaseLayout from '@/layouts/BaseLayout.vue'
import NoteCard from '@/components/NoteCard.vue'
import useNotesStore from '@/stores/notes'

export default {
  name: 'NotesPage',

  components: { BaseLayout, NoteCard },

  data() {
    return {
      form: {
        name: '',
        text: '',
        userId: 1
      }
    }
  },

  computed: {
    ...mapState(useNotesStore, ['notes'])
  },

  methods: {
    ...mapActions(useNotesStore, ['loadNotes', 'createNote', 'deleteNote']),

    async createCard() {
      await this.createNote(this.form)
      await this.loadNotes()
      this.$refs.noteForm.reset()
      this.form.name = ''
      this.form.text = ''
    },

    async removeNote(id) {
      await this.deleteNote(id)
    }
  },

  mounted() {
    this.loadNotes()
  }
}
</script>
