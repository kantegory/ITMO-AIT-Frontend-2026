import { computed, onMounted, reactive, ref } from 'vue'
import { sharedApi } from '../api/index.js'

export function useSharedItems() {
  const sharedItems = ref([])
  const isLoading = ref(false)
  const error = ref('')
  const message = ref('')

  const form = reactive({
    to: '',
    title: '',
    type: 'city',
    note: '',
  })

  const sharedItemsCount = computed(() => sharedItems.value.length)

  async function loadSharedItems() {
    isLoading.value = true
    error.value = ''

    try {
      const response = await sharedApi.getAll()
      sharedItems.value = Array.isArray(response.data) ? response.data : []
    } catch {
      sharedItems.value = getLocalSharedItems()
      error.value = 'JSON Server недоступен, поэтому используются локальные записи.'
    } finally {
      isLoading.value = false
    }
  }

  async function createSharedItem() {
    error.value = ''
    message.value = ''

    if (!form.to.trim() || !form.title.trim() || !form.note.trim()) {
      error.value = 'Заполните получателя, маршрут и заметку.'
      return
    }

    const newItem = {
      id: Date.now(),
      to: form.to.trim(),
      title: form.title.trim(),
      type: form.type,
      typeLabel: getTypeLabel(form.type),
      note: form.note.trim(),
      createdAt: new Date().toLocaleDateString('ru-RU'),
    }

    try {
      const response = await sharedApi.create(newItem)
      sharedItems.value.unshift(response.data)
    } catch {
      sharedItems.value.unshift(newItem)
      saveToLocalStorage()
    }

    resetForm()
    message.value = 'Маршрут отправлен.'
  }

  function clearSharedItems() {
    sharedItems.value = []
    saveToLocalStorage()
    message.value = 'Лента очищена.'
  }

  function resetForm() {
    form.to = ''
    form.title = ''
    form.type = 'city'
    form.note = ''
  }

  function saveToLocalStorage() {
    localStorage.setItem('travel_shared_items', JSON.stringify(sharedItems.value))
  }

  function getTypeLabel(type) {
    if (type === 'city') return 'Город'
    if (type === 'nature') return 'Природа'

    return 'Маршрут'
  }

  onMounted(loadSharedItems)

  return {
    sharedItems,
    sharedItemsCount,
    form,
    isLoading,
    error,
    message,
    loadSharedItems,
    createSharedItem,
    clearSharedItems,
  }
}

function getLocalSharedItems() {
  try {
    return JSON.parse(localStorage.getItem('travel_shared_items')) || []
  } catch {
    return []
  }
}