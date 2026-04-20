import { defineStore } from 'pinia'
import { booksApi } from '@/api'

const useBooksStore = defineStore('books', {
  state: () => ({
    books: []
  }),
  actions: {
    async loadBooks() {
      const response = await booksApi.getAll()
      this.books = response.data
      return response
    },
    async createBook(data) {
      const response = await booksApi.createBook(data)
      await this.loadBooks()
      return response
    }
  }
})

export default useBooksStore
