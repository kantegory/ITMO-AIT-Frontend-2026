import { createPinia } from 'pinia'
import { persist } from 'pinia-persists'

const store = createPinia()

store.use(persist())

export default store
