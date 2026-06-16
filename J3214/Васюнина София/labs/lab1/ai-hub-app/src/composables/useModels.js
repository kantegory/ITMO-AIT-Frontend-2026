import { ref, computed } from 'vue'
import axios from 'axios'

const API_BASE = 'https://huggingface.co/api/models'

export function useModels() {
  const models = ref([])
  const filteredModels = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentPage = ref(1)
  const itemsPerPage = 6

  const allTags = computed(() => {
    const tags = new Set()
    models.value.forEach(model => {
      if (model.pipeline_tag) {
        tags.add(model.pipeline_tag)
      }
    })
    return Array.from(tags)
  })

  const likedModels = computed(() => {
    const stored = localStorage.getItem('likedModels')
    return stored ? JSON.parse(stored) : []
  })

  const fetchModels = async (limit = 60) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.get(API_BASE, {
        params: {
          sort: 'downloads',
          direction: -1,
          limit
        }
      })
      models.value = response.data
      filteredModels.value = [...models.value]
    } catch (err) {
      console.error('Error fetching models:', err)
      error.value = 'Не удалось загрузить модели. Проверьте подключение к интернету.'
    } finally {
      loading.value = false
    }
  }

  const applyFilters = (filters) => {
    const { categoryTags, dropdownTag, searchQuery } = filters

    filteredModels.value = models.value.filter(model => {
      const matchesCategory = categoryTags.length === 0 || 
        categoryTags.includes(model.pipeline_tag)
      
      const matchesDropdown = !dropdownTag || 
        dropdownTag === 'all' || 
        model.pipeline_tag === dropdownTag

      const matchesSearch = !searchQuery || 
        model.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (model.author && model.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (model.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesCategory && matchesDropdown && matchesSearch
    })

    currentPage.value = 1
  }

  const getPaginatedModels = () => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredModels.value.slice(start, end)
  }

  const totalPages = computed(() => {
    return Math.ceil(filteredModels.value.length / itemsPerPage) || 1
  })

  const setPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const toggleLike = (model) => {
    let liked = JSON.parse(localStorage.getItem('likedModels')) || []
    const index = liked.findIndex(m => m.id === model.id)

    if (index > -1) {
      liked.splice(index, 1)
    } else {
      liked.push(model)
    }

    localStorage.setItem('likedModels', JSON.stringify(liked))
  }

  const isLiked = (modelId) => {
    const liked = JSON.parse(localStorage.getItem('likedModels')) || []
    return liked.some(m => m.id === modelId)
  }

  const fetchModelDetails = async (modelId) => {
    try {
      const response = await axios.get(`${API_BASE}/${modelId}`)
      return response.data
    } catch (err) {
      console.error('Error fetching model details:', err)
      return null
    }
  }

  const fetchModelFiles = async (modelId) => {
    try {
      const response = await axios.get(`${API_BASE}/${modelId}/tree/main`)
      return response.data
    } catch (err) {
      console.error('Error fetching model files:', err)
      return []
    }
  }

  return {
    models,
    filteredModels,
    loading,
    error,
    currentPage,
    itemsPerPage,
    allTags,
    likedModels,
    fetchModels,
    applyFilters,
    getPaginatedModels,
    totalPages,
    setPage,
    toggleLike,
    isLiked,
    fetchModelDetails,
    fetchModelFiles
  }
}
