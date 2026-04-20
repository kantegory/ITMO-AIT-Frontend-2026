import instance from '@/api/instance'
import EventsApi from '@/api/events'
import UsersApi from '@/api/users'
import RegistrationsApi from '@/api/registrations'

export const eventsApi = new EventsApi(instance)
export const usersApi = new UsersApi(instance)
export const registrationsApi = new RegistrationsApi(instance)