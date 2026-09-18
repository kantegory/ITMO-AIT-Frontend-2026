import instance from './instance'

class NotesApi {
  async getAll() {
    const { data } = await instance.get('/notes')

    return data
  }

  async createNote(data) {
    const { data: createdNote } = await instance.post('/notes', data)

    return createdNote
  }
}

export default NotesApi
