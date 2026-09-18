<template>
  <base-layout>
    <div class="d-flex justify-content-center">
      <img src="@/assets/logo.svg" alt="Notes Icon" width="40" height="40" class="me-3">
      <h2 class="text-center">Заметки</h2>
    </div>

    <form ref="noteForm" @submit.prevent="createCard" class="d-flex flex-column my-4 p-4 border rounded bg-light">
      <h2 class="h5 mb-3">Создать новую заметку</h2>
      <input type="text" v-model="form.name" class="form-control mb-3" placeholder="Тема" required>
      <textarea v-model="form.text" cols="30" rows="3" class="form-control mb-3" placeholder="Текст заметки" required></textarea>
      <button type="submit" class="btn btn-success w-100">Добавить</button>
    </form>

    <div class="row row-cols-1 row-cols-md-2 g-4 mt-2" id="notes">
      <div class="col" v-for="note in notes" :key="note.id">
        <note-card :name="note.name" :text="note.text" />
      </div>
    </div>
  </base-layout>
</template>

<script>
import BaseLayout from '@/layouts/BaseLayout.vue'
import NoteCard from '@/components/NoteCard.vue'
import { mapState, mapActions } from 'pinia'
import useNotesStore from '@/stores/notes'

export default {
  name: 'NotesPage',
  components: { BaseLayout, NoteCard },
  data() {
    return {
      form: {
        name: '',
        text: ''
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
      this.form.name = ''
      this.form.text = ''
    }
  },
  mounted() {
    this.loadNotes()
  }
}
</script>