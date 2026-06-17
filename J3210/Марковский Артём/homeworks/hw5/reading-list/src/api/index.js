import instance from '@/api/instance'
import BooksApi from '@/api/books'

const booksApi = new BooksApi(instance)

export {
  booksApi
}
