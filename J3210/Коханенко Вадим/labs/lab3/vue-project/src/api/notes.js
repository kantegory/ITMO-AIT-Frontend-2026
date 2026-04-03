class NotesApi {
  constructor(instance) {
    this.API = instance
  }

  getAll = async () => {
    return this.API({ url: '/notes' })
  }

  create = async (data) => {
    return this.API({
      method: 'POST',
      url: '/notes',
      data,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  update = async (id, data) => {
    return this.API({
      method: 'PUT',
      url: `/notes/${id}`,
      data
    })
  }

  delete = async (id) => {
    return this.API({
      method: 'DELETE',
      url: `/notes/${id}`
    })
  }
}

export default NotesApi