<template>
  <base-layout>
    <h1 class="mb-4">Моя библиотека</h1>

    <p class="text-muted">Всего книг в библиотеке: {{ booksCount }}</p>

    <form
      ref="bookForm"
      @submit.prevent="addBook"
      class="row g-2 align-items-end my-4 p-3 bg-light rounded"
    >
      <div class="col-md-4">
        <label class="form-label">Название</label>
        <input
          type="text"
          class="form-control"
          v-model="form.title"
          required
        >
      </div>
      <div class="col-md-4">
        <label class="form-label">Автор</label>
        <input
          type="text"
          class="form-control"
          v-model="form.author"
          required
        >
      </div>
      <div class="col-md-2">
        <label class="form-label">Год</label>
        <input
          type="number"
          class="form-control"
          v-model.number="form.year"
        >
      </div>
      <div class="col-md-2">
        <button type="submit" class="btn btn-primary w-100">
          Добавить
        </button>
      </div>
    </form>

    <div v-if="books.length === 0" class="alert alert-info">
      Список пуст. Добавьте первую книгу через форму выше.
    </div>
    <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
      <div class="col" v-for="book in books" :key="book.id">
        <book-card
          :title="book.title"
          :author="book.author"
          :year="book.year"
        />
      </div>
    </div>
  </base-layout>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import useBooksStore from '@/stores/books'

import BaseLayout from '@/layouts/BaseLayout.vue'
import BookCard from '@/components/BookCard.vue'

export default {
  name: 'BooksPage',
  components: { BaseLayout, BookCard },

  data() {
    return {
      form: {
        title: '',
        author: '',
        year: null
      }
    }
  },

  computed: {
    ...mapState(useBooksStore, ['books']),
    booksCount() {
      return this.books.length
    }
  },

  methods: {
    ...mapActions(useBooksStore, ['loadBooks', 'createBook']),

    async addBook() {
      await this.createBook({ ...this.form })
      this.$refs.bookForm.reset()
      this.form = { title: '', author: '', year: null }
    }
  },

  mounted() {
    this.loadBooks()
  }
}
</script>
