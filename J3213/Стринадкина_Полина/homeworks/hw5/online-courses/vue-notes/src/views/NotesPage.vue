<template>
  <main class="container my-5">
    <h1 class="mb-4">Notes app</h1>

    <form @submit.prevent="addNote" class="card p-4 shadow-sm mb-5">
      <div class="mb-3">
        <label class="form-label">Название</label>
        <input
          v-model="name"
          type="text"
          class="form-control"
          placeholder="Введите название заметки"
          required
        >
      </div>

      <div class="mb-3">
        <label class="form-label">Текст</label>
        <textarea
          v-model="text"
          class="form-control"
          rows="5"
          placeholder="Введите текст заметки"
          required
        ></textarea>
      </div>

      <button type="submit" class="btn btn-primary">
        Добавить заметку
      </button>
    </form>

    <h2 class="h4 mb-3">Мои заметки</h2>

    <div v-if="notes.length === 0" class="alert alert-info">
      Пока заметок нет.
    </div>

    <div v-else class="row g-4">
      <div
        v-for="note in notes"
        :key="note.id"
        class="col-md-6"
      >
        <article class="card h-100 shadow-sm">
          <div class="card-body">
            <h3 class="card-title h5">
              {{ note.name }}
            </h3>
            <p class="card-text">
              {{ note.text }}
            </p>
          </div>
        </article>
      </div>
    </div>
  </main>
</template>

<script>
import axios from 'axios'

export default {
  name: 'NotesPage',

  data() {
    return {
      name: '',
      text: '',
      notes: []
    }
  },

  methods: {
    async loadNotes() {
      const response = await axios.get('http://localhost:3000/notes')
      this.notes = response.data
    },

    async addNote() {
      await axios.post('http://localhost:3000/notes', {
        name: this.name,
        text: this.text
      })

      this.name = ''
      this.text = ''

      await this.loadNotes()
    }
  },

  mounted() {
    this.loadNotes()
  }
}
</script>