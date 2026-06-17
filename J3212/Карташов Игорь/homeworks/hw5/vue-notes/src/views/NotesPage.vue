<template>
  <base-layout>
    <h1>Notes app</h1>

    <form
      ref="noteForm"
      class="d-flex flex-column my-5"
      @submit.prevent="createCard"
    >
      <input v-model="form.name" type="text" class="my-1 form-control" placeholder="Название" />

      <textarea
        v-model="form.text"
        cols="30"
        rows="10"
        class="my-1 form-control"
        placeholder="Текст заметки"
      />

      <button type="submit" class="btn btn-primary mt-2">Отправить</button>
    </form>

    <p v-if="!notes.length" class="text-muted">Заметок пока нет — добавьте первую.</p>

    <div v-else class="row row-cols-1 row-cols-md-2 g-4 mt-2" id="notes">
      <div v-for="note in notes" :key="note.id" class="col">
        <note-card :name="note.name" :text="note.text" />
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
        userId: 1,
      },
    }
  },

  computed: {
    ...mapState(useNotesStore, ['notes']),
  },

  mounted() {
    this.loadNotes()
  },

  methods: {
    ...mapActions(useNotesStore, ['loadNotes', 'createNote']),

    async createCard() {
      await this.createNote(this.form)

      this.$refs.noteForm.reset()
      this.form = { name: '', text: '', userId: 1 }
    },
  },
}
</script>
