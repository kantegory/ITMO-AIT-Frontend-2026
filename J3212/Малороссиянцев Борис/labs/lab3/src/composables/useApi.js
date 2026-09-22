import axios from 'axios'
import { useAuth } from './useAuth'

const OWM_KEY = '7c2bf5858469b96c2bd0d162aa5610a9'
const api = axios.create({ baseURL: 'http://localhost:3000' })
api.interceptors.request.use(config => {
  const { getToken } = useAuth()
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function useApi() {
  const { getUserId } = useAuth()
  async function register({ email, password, firstName, lastName }) {
    const { data } = await api.post('/register', { email, password, firstName, lastName })
    return data
  }

  async function login(email, password) {
    const { data } = await api.post('/login', { email, password })
    return data
  }
  async function getNotes() {
    const { data } = await api.get('/notes', {
      params: { userId: getUserId(), _sort: 'id', _order: 'desc' },
    })
    return data
  }

  async function createNote({ title, text = '', dest = '' }) {
    const { data } = await api.post('/notes', {
      id:     Date.now(),
      userId: getUserId(),
      title, text, dest,
      date:   new Date().toLocaleDateString('ru', { day: 'numeric', month: 'short' }),
    })
    return data
  }

  async function deleteNote(id) {
    await api.delete(`/notes/${id}`)
  }
  async function getSavedRoutes() {
    const { data } = await api.get('/savedRoutes', { params: { userId: getUserId() } })
    return data
  }

  async function saveRoute(destinationId) {
    const { data } = await api.post('/savedRoutes', {
      id: Date.now(), destinationId, userId: getUserId(),
    })
    return data
  }

  async function unsaveRoute(destinationId) {
    const { data: list } = await api.get('/savedRoutes', {
      params: { userId: getUserId(), destinationId },
    })
    if (list.length) await api.delete(`/savedRoutes/${list[0].id}`)
  }
  async function getWeather(city) {
    const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: { q: city, appid: OWM_KEY, units: 'metric', lang: 'ru' },
    })
    return data
  }

  async function getCountryInfo(countryName) {
    const { data } = await axios.get(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`,
      { params: { fields: 'name,capital,currencies,flags,population,region,languages' } }
    )
    return data[0]
  }

  return {
    register, login,
    getNotes, createNote, deleteNote,
    getSavedRoutes, saveRoute, unsaveRoute,
    getWeather, getCountryInfo,
  }
}
