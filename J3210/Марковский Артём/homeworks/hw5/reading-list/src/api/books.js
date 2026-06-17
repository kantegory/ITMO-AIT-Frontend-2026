class BooksApi {
  constructor(instance) {
    this.API = instance
  }

  getAll = async () => {
    return this.API({
      url: '/books'
    })
  }

  createBook = async (data) => {
    return this.API({
      method: 'POST',
      url: '/books',
      data,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

export default BooksApi
