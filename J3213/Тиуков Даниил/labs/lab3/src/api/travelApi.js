import { apiClient } from './httpClient.js'

async function unwrap(promise) {
  const response = await promise
  return response.data
}

export const TravelApi = {
  // === Users / auth ===
  findUserByEmail(email) {
    return unwrap(apiClient.get('/users', { params: { email } })).then((items) => items[0] || null)
  },
  findUserByCredentials(email, password) {
    return unwrap(apiClient.get('/users', { params: { email, password } })).then((items) => items[0] || null)
  },
  registerUser(payload) {
    return unwrap(apiClient.post('/users', payload))
  },
  updateUser(userId, patch) {
    return unwrap(apiClient.patch(`/users/${userId}`, patch))
  },

  // === Destinations ===
  getDestinations() {
    return unwrap(apiClient.get('/destinations'))
  },
  getDestination(id) {
    return unwrap(apiClient.get(`/destinations/${id}`))
  },

  // === Reviews ===
  getReviews(destinationId) {
    return unwrap(apiClient.get('/reviews', { params: { destinationId } }))
  },
  addReview(payload) {
    return unwrap(apiClient.post('/reviews', payload))
  },

  // === Routes ===
  getRoutes(userId) {
    return unwrap(apiClient.get('/routes', { params: userId ? { userId } : {} }))
  },
  addRoute(payload) {
    return unwrap(apiClient.post('/routes', payload))
  },
  updateRoute(routeId, patch) {
    return unwrap(apiClient.patch(`/routes/${routeId}`, patch))
  },
  deleteRoute(routeId) {
    return unwrap(apiClient.delete(`/routes/${routeId}`))
  },

  // === Notes ===
  getNotes(userId) {
    return unwrap(apiClient.get('/notes', { params: userId ? { userId } : {} }))
  },
  addNote(payload) {
    return unwrap(apiClient.post('/notes', payload))
  },
  updateNote(noteId, patch) {
    return unwrap(apiClient.patch(`/notes/${noteId}`, patch))
  },
  deleteNote(noteId) {
    return unwrap(apiClient.delete(`/notes/${noteId}`))
  },

  // === Favorites ===
  getFavorites(userId) {
    return unwrap(apiClient.get('/favorites', { params: userId ? { userId } : {} }))
  },
  addFavorite(payload) {
    return unwrap(apiClient.post('/favorites', payload))
  },
  deleteFavorite(favoriteId) {
    return unwrap(apiClient.delete(`/favorites/${favoriteId}`))
  },

  // === Collaboration ===
  getParticipants() {
    return unwrap(apiClient.get('/participants'))
  },
  addParticipant(payload) {
    return unwrap(apiClient.post('/participants', payload))
  },

  getStages() {
    return unwrap(apiClient.get('/stages'))
  },
  addStage(payload) {
    return unwrap(apiClient.post('/stages', payload))
  },
  updateStage(stageId, patch) {
    return unwrap(apiClient.patch(`/stages/${stageId}`, patch))
  },
  deleteStage(stageId) {
    return unwrap(apiClient.delete(`/stages/${stageId}`))
  },

  getSharedNotes() {
    return unwrap(apiClient.get('/shared-notes'))
  },
  addSharedNote(payload) {
    return unwrap(apiClient.post('/shared-notes', payload))
  },
  deleteSharedNote(noteId) {
    return unwrap(apiClient.delete(`/shared-notes/${noteId}`))
  },

  getIdeas() {
    return unwrap(apiClient.get('/ideas'))
  },
  addIdea(payload) {
    return unwrap(apiClient.post('/ideas', payload))
  },
  updateIdea(ideaId, patch) {
    return unwrap(apiClient.patch(`/ideas/${ideaId}`, patch))
  }
}
