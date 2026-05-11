class NotesApi {
  constructor(instance) {
    this.API = instance
  }

  getAll = async () => {
    return this.API({
      url: '/notes',
      method: 'GET',
    })
  }

  getByUserId = async (userId) => {
    const response = await this.API({
      url: '/notes',
      method: 'GET',
      params: {
        userId,
      },
    })

    const note = Array.isArray(response.data) ? response.data[0] : null

    return {
      data: note || null,
    }
  }

  create = async (data) => {
    return this.API({
      url: '/notes',
      method: 'POST',
      data,
    })
  }

  update = async (noteId, data) => {
    return this.API({
      url: `/notes/${noteId}`,
      method: 'PATCH',
      data,
    })
  }
}

export default NotesApi