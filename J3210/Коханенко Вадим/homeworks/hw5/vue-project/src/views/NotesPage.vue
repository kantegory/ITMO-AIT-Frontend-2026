<template>
  <base-layout>
    <h1 class="text-center mb-4">notes page</h1>

    <form
      ref="noteForm"
      @submit.prevent="createCard"
      class="d-flex flex-column gap-2 my-4"
    >
      <input
        type="text"
        v-model="form.name"
        class="form-control"
        placeholder="Заголовок заметки"
      >

      <textarea
        cols="30"
        rows="5"
        v-model="form.text"
        class="form-control"
        placeholder="Текст заметки"
      />

      <button
        type="submit"
        class="btn btn-primary align-self-start mt-2"
      >
        Сохранить заметку
      </button>
    </form>

    <div class="row row-cols-1 row-cols-md-2 g-4 mt-4" id="notes">
      <div
        class="col"
        v-for="note in notes"
        :key="note.id"
      >
        <note-card
          :name="note.name"
          :text="note.text"
        />
      </div>
    </div>
  </base-layout>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import useNotesStore from '@/stores/notes'
import BaseLayout from '@/layouts/BaseLayout.vue'
import NoteCard from '@/components/NoteCard.vue'

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
      this.form.name = ''
      this.form.text = ''
    }
  },
  mounted() {
    this.loadNotes()
  }
}
</script>