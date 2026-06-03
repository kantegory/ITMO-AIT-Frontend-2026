<template>
  <BaseLayout>
    <h1>Notes app</h1>

    <form
      ref="noteForm"
      @submit.prevent="createCard"
      class="d-flex flex-column my-5"
    >
      <input
        type="text"
        v-model="form.name"
        class="form-control my-1"
        placeholder="Название заметки"
      >

      <textarea
        cols="30"
        rows="10"
        v-model="form.text"
        class="form-control my-1"
        placeholder="Текст заметки"
      ></textarea>

      <button
        type="submit"
        class="btn btn-primary mt-2"
      >
        Отправить
      </button>
    </form>

    <div class="row row-cols-1 row-cols-md-2 g-4 mt-5" id="notes">
      <div class="col" v-for="note in notes" :key="note.id">
        <NoteCard :name="note.name" :text="note.text" />
      </div>
    </div>
  </BaseLayout>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import useNotesStore from '@/stores/notes'
import BaseLayout from '@/layouts/BaseLayout.vue'
import NoteCard from '@/components/NoteCard.vue'

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

  mounted() {
    this.loadNotes()
  },

  methods: {
    ...mapActions(useNotesStore, ['loadNotes', 'createNote']),

    async createCard() {
      await this.createNote(this.form)
      await this.loadNotes()

      this.form = {
        name: '',
        text: '',
        userId: 1
      }
    }
  }
}
</script>