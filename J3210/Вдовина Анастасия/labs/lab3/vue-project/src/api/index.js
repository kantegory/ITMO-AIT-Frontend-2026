import instance from '@/api/instance'
import EventsApi from '@/api/events'
import AuthApi from '@/api/auth'
import TicketsApi from '@/api/tickets'

const eventsApi = new EventsApi(instance)
const authApi = new AuthApi(instance)
const ticketsApi = new TicketsApi(instance)

export { eventsApi, authApi, ticketsApi }
