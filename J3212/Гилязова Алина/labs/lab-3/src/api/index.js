import instance from '@/api/instance'
import EventsApi from '@/api/events'
import TicketsApi from '@/api/tickets'
import AuthApi from '@/api/auth'

const eventsApi = new EventsApi(instance)
const ticketsApi = new TicketsApi(instance)
const authApi = new AuthApi(instance)

export { eventsApi, ticketsApi, authApi }
