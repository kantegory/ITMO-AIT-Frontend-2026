import { ref, watch } from 'vue'

const cache = new Map()

export const STORAGE_KEYS = {
  currentUser: 'tripplannerCurrentUser',
  registeredUser: 'tripplannerRegisteredUser',
  favorites: 'tripplannerFavorites',
  routes: 'tripplannerRoutes',
  notes: 'tripplannerNotes',
  theme: 'tripplannerTheme',
  collaborationParticipants: 'tripplannerCollaborationParticipants',
  collaborationStages: 'tripplannerCollaborationStages',
  collaborationNotes: 'tripplannerCollaborationNotes',
  collaborationIdeas: 'tripplannerCollaborationIdeas'
}

function readRaw(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch (error) {
    console.error(`useStorage: не удалось прочитать ${key}`, error)
    return fallback
  }
}

function writeRaw(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`useStorage: не удалось записать ${key}`, error)
  }
}

export function useStorage(key, fallback) {
  if (!cache.has(key)) {
    const state = ref(readRaw(key, fallback))
    watch(state, (next) => writeRaw(key, next), { deep: true })

    window.addEventListener('storage', (event) => {
      if (event.key === key) {
        state.value = readRaw(key, fallback)
      }
    })

    cache.set(key, state)
  }
  return cache.get(key)
}

export function clearStorage(key) {
  try {
    localStorage.removeItem(key)
    if (cache.has(key)) {
      cache.get(key).value = null
    }
  } catch (error) {
    console.error(`useStorage: не удалось удалить ${key}`, error)
  }
}
