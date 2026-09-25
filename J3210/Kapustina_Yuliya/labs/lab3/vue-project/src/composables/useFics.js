import { ref } from 'vue'
import { api } from './useApi'

export function useFics() {
  const fics = ref([])
  const currentFic = ref(null)
  const comments = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchFics() {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/fics')
      fics.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Ошибка загрузки фанфиков'
      console.error('Ошибка загрузки фанфиков:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  async function fetchUserFics() {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/user/fics')
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Ошибка загрузки фанфиков'
      console.error('Ошибка загрузки фанфиков пользователя:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  async function fetchFicById(id) {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/fics/${id}`)
      currentFic.value = response.data.fic
      comments.value = response.data.comments || []
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Фанфик не найден'
      console.error('Ошибка загрузки фанфика:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function createFic(ficData) {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/fics', ficData)
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.error || 'Ошибка создания фанфика'
      console.error('Ошибка создания фанфика:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function updateFic(id, ficData) {
    loading.value = true
    error.value = null

    try {
      const response = await api.put(`/fics/${id}`, ficData)
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.error || 'Ошибка обновления фанфика'
      console.error('Ошибка обновления фанфика:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function updateFicStatus(id, status) {
    try {
      const response = await api.patch(`/fics/${id}/status`, { status })
      return { success: true, data: response.data }
    } catch (err) {
      console.error('Ошибка обновления статуса:', err)
      return {
        success: false,
        error: err.response?.data?.error || 'Ошибка обновления статуса'
      }
    }
  }

  async function toggleLike(ficId) {
    try {
      const response = await api.post(`/fics/${ficId}/like`)

      if (currentFic.value && currentFic.value.id === ficId) {
        currentFic.value.likes = response.data.likes
      }

      const ficInList = fics.value.find(f => f.id === ficId)
      if (ficInList) {
        ficInList.likes = response.data.likes
      }

      return { success: true, ...response.data }
    } catch (err) {
      console.error('Ошибка лайка:', err)
      return {
        success: false,
        error: err.response?.data?.error || 'Ошибка при лайке'
      }
    }
  }

  async function fetchLikedFics() {
    try {
      const response = await api.get('/user/likes')
      return response.data
    } catch (err) {
      console.error('Ошибка загрузки избранного:', err)
      return []
    }
  }

  async function addToHistory(ficId) {
    try {
      await api.post('/history', { ficId })
    } catch (err) {
      console.error('Ошибка добавления в историю:', err)
    }
  }

  async function fetchHistory() {
    try {
      const response = await api.get('/user/history')
      return response.data
    } catch (err) {
      console.error('Ошибка загрузки истории:', err)
      return []
    }
  }

  async function addComment(ficId, content) {
    try {
      const response = await api.post(`/fics/${ficId}/comments`, { content })

      comments.value.push(response.data)

      if (currentFic.value && currentFic.value.id === ficId) {
        currentFic.value.commentsCount = comments.value.length
      }

      return { success: true, data: response.data }
    } catch (err) {
      console.error('Ошибка добавления комментария:', err)
      return {
        success: false,
        error: err.response?.data?.error || 'Ошибка добавления комментария'
      }
    }
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('ru-RU')
  }

  function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString('ru-RU')
  }

  function escapeHtml(str) {
    if (!str) return ''
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
  }

  return {
    fics,
    currentFic,
    comments,
    loading,
    error,
    fetchFics,
    fetchUserFics,
    fetchFicById,
    createFic,
    updateFic,
    updateFicStatus,
    toggleLike,
    fetchLikedFics,
    addToHistory,
    fetchHistory,
    addComment,
    formatDate,
    formatDateTime,
    escapeHtml
  }
}