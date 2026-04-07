<template>
  <base-layout>
    <h1>Notes app</h1>

    <form ref="noteForm" class="d-flex flex-column my-5">
      <input type="text" class="my-1" />
      <textarea cols="30" rows="10" class="my-1" />

      <button type="submit" class="btn btn-primary">Отправить</button>
    </form>

    <div class="row row-cols-1 row-cols-md-2 g-4 mt-5" id="notes">
      <div class="col" v-for="note in notes" :key="note.id">
        <note-card :name="note.name" :text="note.text" />
      </div>
    </div>
  </base-layout>
</template>

<script>
import BaseLayout from '@/layouts/BaseLayout.vue'
import NoteCard from '@/components/NoteCard.vue'

export default {
  name: 'NotesPage',
  components: { BaseLayout, NoteCard },
  data() {
    return {
      notes: [],
    }
  },
}
</script>