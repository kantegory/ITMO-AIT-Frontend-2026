<template>
  <base-layout>
    <h1>Notes app</h1>
    <form @submit.prevent="createCard" class="my-4">
      <input v-model="form.name" class="form-control my-2" placeholder="Название">
      <textarea v-model="form.text" class="form-control my-2" placeholder="Текст"></textarea>
      <button class="btn btn-primary">Отправить</button>
    </form>
    <div v-for="note in notes" :key="note.id">
      <note-card :name="note.name" :text="note.text"/>
    </div>
  </base-layout>
</template>

<script>
import BaseLayout from '@/layouts/BaseLayout.vue'
import NoteCard from '@/components/NoteCard.vue'
import {mapActions, mapState} from 'pinia'
import useNotesStore from '@/stores/notes'

export default {
  components: {BaseLayout, NoteCard},
  data() {
    return {form: {name: '', text: ''}}
  },
  computed: {...mapState(useNotesStore, ['notes'])},
  methods: {
    ...mapActions(useNotesStore, ['loadNotes', 'createNote']),
    async createCard() {
      await this.createNote(this.form)
      this.form.name = '';
      this.form.text = ''
    }
  },
  mounted() {
    this.loadNotes()
  }
}
</script>
