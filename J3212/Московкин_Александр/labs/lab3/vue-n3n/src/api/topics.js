import api from './instance'

export const getTopics = () => api.get('/topics')
export const createTopic = (data) => api.post('/topics', data)