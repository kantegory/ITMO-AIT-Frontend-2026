<template>
  <div class="container mt-4">
    <h2 class="mb-4">Мои заметки</h2>
    
    <div class="mb-5 p-3 border rounded bg-light">
      <input v-model="newNote.title" class="form-control mb-2" placeholder="Заголовок">
      <textarea v-model="newNote.content" class="form-control mb-2" placeholder="Текст заметки"></textarea>
      <button @click="addNote" class="btn btn-primary">Добавить заметку</button>
    </div>

    <div class="row">
      <div class="col-md-4" v-for="(note, index) in notes" :key="index">
        <NoteCard 
          :title="note.title" 
          :content="note.content" 
          @delete-note="removeNote(index)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import NoteCard from '@/components/NoteCard.vue';

export default {
  components: { NoteCard },
  data() {
    return {
      notes: [
        { title: 'Первая заметка', content: 'Изучить основы Vue.js' }
      ],
      newNote: { title: '', content: '' }
    }
  },
  methods: {
    addNote() {
      if (this.newNote.title && this.newNote.content) {
        this.notes.push({ ...this.newNote });
        this.newNote.title = '';
        this.newNote.content = '';
      }
    },
    removeNote(index) {
      this.notes.splice(index, 1);
    }
  }
}
</script>
