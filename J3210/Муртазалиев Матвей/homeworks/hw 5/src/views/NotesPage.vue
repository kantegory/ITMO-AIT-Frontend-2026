<template>
  <base-layout>
    <h1 class="notes-title text-center">ZameTochka.</h1>

    <form
      ref="noteForm"
      @submit.prevent="createCard"
      class="d-flex flex-column my-5"
    >
      <label for="note-name" class="note-form-label">Название заметки</label>
      <input
        id="note-name"
        type="text"
        v-model="form.name"
        class="my-1"
      >

      <label for="note-text" class="note-form-label mt-3">Текст заметки</label>
      <textarea
        id="note-text"
        cols="30"
        rows="10"
        v-model="form.text"
        class="my-1"
      />

      <button
        type="submit"
        class="btn note-save-btn mt-3 align-self-center"
      >
        Сохранить
      </button>
    </form>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mt-5" id="notes">
      <div class="col" v-for="note in notes" :key="note.id">
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
        userId: 1
      }
    }
  },

  computed: {
    ...mapState(useNotesStore, ['notes'])
  },

  methods: {
    ...mapActions(useNotesStore, ['loadNotes', 'createNote']),

    async createCard() {
      await this.createNote(this.form)
      await this.loadNotes()

      this.$refs.noteForm.reset()
    }
  },

  mounted() {
    this.loadNotes()
  }
}
</script>
