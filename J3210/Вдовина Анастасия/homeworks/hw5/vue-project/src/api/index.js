import instance from '@/api/instance'
import EventsApi from '@/api/events'

const eventsApi = new EventsApi(instance)

export { eventsApi }
