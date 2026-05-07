import api from './instance'

export const getFaqs = () => api.get('/faqs')