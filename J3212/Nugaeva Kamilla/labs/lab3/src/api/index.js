import instance from './instance.js'

import AuthApi from './auth.js'
import NotesApi from './notes.js'
import PlacesApi from './places.js'
import SavedRoutesApi from './savedRoutes.js'
import SharedApi from './shared.js'

const authApi = new AuthApi(instance)
const notesApi = new NotesApi(instance)
const placesApi = new PlacesApi(instance)
const savedRoutesApi = new SavedRoutesApi(instance)
const sharedApi = new SharedApi(instance)

export {
  authApi,
  notesApi,
  placesApi,
  savedRoutesApi,
  sharedApi,
}