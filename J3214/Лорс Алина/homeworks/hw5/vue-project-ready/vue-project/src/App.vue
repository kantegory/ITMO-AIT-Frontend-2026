<template>
  <main class="container py-5">
    <h1 class="mb-4">Notes app</h1>

    <form @submit.prevent="addNote" class="mb-5">
      <div class="mb-3">
        <label for="noteTitle" class="form-label">Название заметки</label>
        <input
          id="noteTitle"
          v-model="newNote.title"
          type="text"
          class="form-control"
          placeholder="Введите название"
        >
      </div>

      <div class="mb-3">
        <label for="noteText" class="form-label">Текст заметки</label>
        <textarea
          id="noteText"
          v-model="newNote.text"
          class="form-control"
          rows="5"
          placeholder="Введите текст заметки"
        ></textarea>
      </div>

      <button type="submit" class="btn btn-primary">
        Добавить заметку
      </button>
    </form>

    <section>
      <h2 class="mb-3">Список заметок</h2>

      <p v-if="notes.length === 0" class="text-muted">
        Пока заметок нет. Добавьте первую заметку через форму выше.
      </p>

      <div class="row g-3">
        <div
          v-for="note in notes"
          :key="note.id"
          class="col-12 col-md-6"
        >
          <NoteCard
            :title="note.title"
            :text="note.text"
          />
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import NoteCard from './components/NoteCard.vue'

export default {
  name: 'App',

  components: {
    NoteCard
  },

  data() {
    return {
      newNote: {
        title: '',
        text: ''
      },

      notes: [
        {
          id: 1,
          title: 'заметка ура прототайп',
          text: 'возьми телефон детка я знаю ты хочешь позвонить'
        }
      ]
    }
  },

  methods: {
    addNote() {
      if (!this.newNote.title || !this.newNote.text) {
        return
      }

      const note = {
        id: Date.now(),
        title: this.newNote.title,
        text: this.newNote.text
      }

      this.notes.push(note)

      this.newNote.title = ''
      this.newNote.text = ''
    }
  }
}
</script>
