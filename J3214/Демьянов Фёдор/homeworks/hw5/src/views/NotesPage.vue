<template>
  <base-layout>
    <h1 class="mb-4">Notes app</h1>

    <form ref="noteForm" @submit.prevent="createCard" class="d-flex flex-column mb-5">
      <div class="mb-3">
        <label for="titleInput" class="form-label">Название</label>
        <input
          id="titleInput"
          type="text"
          v-model="form.name"
          class="form-control"
          placeholder="Введите название заметки"
          required
        >
      </div>

      <div class="mb-3">
        <label for="textInput" class="form-label">Текст заметки</label>
        <textarea
          id="textInput"
          cols="30"
          rows="4"
          v-model="form.text"
          class="form-control"
          placeholder="Введите содержание"
          required
        ></textarea>
      </div>

      <button type="submit" class="btn btn-primary">
        Отправить
      </button>
    </form>

    <div class="row row-cols-1 row-cols-md-2 g-4" id="notes">
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
  components: {
    BaseLayout,
    NoteCard
  },
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
      this.form.name = ''
      this.form.text = ''
      if (this.$refs.noteForm) {
        this.$refs.noteForm.reset()
      }
    }
  },
  mounted() {
    this.loadNotes()
  }
}
</script>