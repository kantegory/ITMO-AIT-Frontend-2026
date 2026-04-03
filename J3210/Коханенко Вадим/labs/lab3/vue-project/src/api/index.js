import instance from './instance'
import AuthApi from './auth'
import NotesApi from './notes'
import RoutesApi from './routes'
import DestinationsApi from './destinations'

export const authApi = new AuthApi(instance)
export const notesApi = new NotesApi(instance)
export const routesApi = new RoutesApi(instance)
export const destinationsApi = new DestinationsApi(instance)