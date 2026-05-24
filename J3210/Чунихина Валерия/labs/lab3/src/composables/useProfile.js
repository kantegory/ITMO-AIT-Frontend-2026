import { computed, ref } from 'vue'

import { localInventory, localSubscriptions, localUsers } from '@/data/appData'

export function useProfile() {
  const activeTab = ref('uploads')
  const isUploadFormVisible = ref(false)
  const draftItem = ref({
    name: '',
    type: 'model'
  })

  const storedUser = JSON.parse(localStorage.getItem('currentUser') || 'null')

  const currentUser = computed(() => (
    storedUser || localUsers.find((user) => user.id === 'Kvh2BK6gcts') || localUsers[0]
  ))

  const inventory = ref(localInventory.filter((item) => item.userId === currentUser.value.id))

  const modelItems = computed(() => inventory.value.filter((item) => item.type === 'model'))
  const datasetItems = computed(() => inventory.value.filter((item) => item.type === 'dataset'))

  const stats = computed(() => ([
    { label: 'Моделей', value: modelItems.value.length },
    { label: 'Данных', value: datasetItems.value.length },
    { label: 'Звёзд', value: inventory.value.reduce((total, item) => total + Number(item.stars || 0), 0) }
  ]))

  function addInventoryItem() {
    const nextName = draftItem.value.name.trim()
    if (!nextName) return

    inventory.value = [
      {
        id: `local-${Date.now()}`,
        userId: currentUser.value.id,
        name: nextName,
        slug: nextName.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replaceAll(/^-|-$/g, ''),
        type: draftItem.value.type,
        task: draftItem.value.type === 'model' ? 'AI Model' : 'Dataset',
        framework: draftItem.value.type === 'model' ? 'PyTorch' : 'Dataset',
        license: 'MIT',
        size: 'Новый элемент',
        stars: 0,
        description: 'Добавлено в сад через Vue-интерфейс.'
      },
      ...inventory.value
    ]

    draftItem.value = { name: '', type: 'model' }
    isUploadFormVisible.value = false
  }

  return {
    currentUser,
    activeTab,
    isUploadFormVisible,
    draftItem,
    inventory,
    modelItems,
    datasetItems,
    stats,
    subscriptions: localSubscriptions,
    addInventoryItem
  }
}
