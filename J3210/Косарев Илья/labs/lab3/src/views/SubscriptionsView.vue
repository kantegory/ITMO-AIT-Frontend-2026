<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useFetch } from '@/composables/useFetch'
import { usePageTitle } from '@/composables/usePageTitle'
import api from '../services/api'

const authStore = useAuthStore()
const searchInput = ref('')
const subscriptions = ref([])

usePageTitle('Мои подписки')

const { execute: fetchRequest } = useFetch()

const filteredSubscriptions = computed(() => {
  const q = searchInput.value.toLowerCase()
  return subscriptions.value.filter(u => {
    const name = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase()
    const username = `@${u.username || ''}`.toLowerCase()
    return name.includes(q) || username.includes(q)
  })
})

const subscriptionsCount = computed(() => {
  if (subscriptions.value.length === 0) return 'У вас нет подписок'
  if (filteredSubscriptions.value.length === subscriptions.value.length) {
    return `Вы подписаны на ${subscriptions.value.length} аккаунтов`
  }
  return `Показано ${filteredSubscriptions.value.length} из ${subscriptions.value.length} подписок`
})

async function loadSubscriptions() {
  if (!authStore.user?.id) return
  
  try {
    const user = await fetchRequest(`/users/${authStore.user.id}`)
    const subs = user?.subscriptions || []
    
    if (subs.length === 0) {
      subscriptions.value = []
      return
    }
    
    const params = new URLSearchParams()
    subs.forEach(id => params.append('id', String(id)))
    subscriptions.value = await fetchRequest('/users', { params })
    
  } catch (err) {
    console.error('Ошибка загрузки подписок:', err)
    subscriptions.value = []
  }
}

async function unsubscribe(targetId) {
  try {
    const nextSubscriptions = (authStore.user?.subscriptions || []).filter(id => Number(id) !== Number(targetId))
    const patchRes = await api.patch(`/users/${authStore.user.id}`, { subscriptions: nextSubscriptions })
    authStore.user = patchRes.data
    subscriptions.value = subscriptions.value.filter(u => Number(u.id) !== Number(targetId))
  } catch (err) {
    console.error('Ошибка при отписке:', err)
    alert('Ошибка при отписке.')
  }
}

onMounted(() => {
  loadSubscriptions()
})
</script>

<template>
  <main class="col-md-9 col-lg-10 px-md-4">
    <section class="mb-4">
      <h1 class="display-5 fw-bold mb-2">Мои подписки</h1>
      <p class="text-blunted fs-5">
        Авторы и организации, за обновлениями которых вы следите.
      </p>
    </section>

    <section class="mb-4" id="subscriptionsSearchSection">
      <label class="visually-hidden" for="subscriptionsSearchInput">Поиск подписок</label>
      <div class="input-group input-group-lg rounded subscriptions-search-group" id="subscriptionsSearchBar">
        <span class="input-group-text border-end-0 text-blunted">
            <svg class="svg-icon" aria-hidden="true"><use href="/icons.svg#search"></use></svg>
        </span>
        <input type="text" v-model="searchInput" class="form-control border-start-0 ps-0" id="subscriptionsSearchInput" placeholder="Поиск по имени или @username..." autocomplete="off">
      </div>
    </section>

    <section id="subscriptionsSection">
      <h2 class="mb-3 fs-5 fw-normal text-blunted" id="subscriptionsCount">{{ subscriptionsCount }}</h2>

      <div v-if="subscriptions.length === 0" class="text-center py-5" id="subscriptionsEmptyState">
        <svg class="svg-icon display-1 text-blunted opacity-25" aria-hidden="true"><use href="/icons.svg#bell-slash"></use></svg>
        <p class="text-blunted mt-3 mb-0" id="subscriptionsEmptyText">У вас пока нет подписок.</p>
      </div>

      <div v-else-if="filteredSubscriptions.length === 0" class="text-center py-5">
        <svg class="svg-icon display-1 text-blunted opacity-25" aria-hidden="true"><use href="/icons.svg#bell-slash"></use></svg>
        <p class="text-blunted mt-3 mb-0">По вашему запросу ничего не найдено.</p>
      </div>

      <ul v-else class="list-group rounded-3" id="subscriptionsList">
        <li v-for="user in filteredSubscriptions" :key="user.id" class="list-group-item d-flex flex-column flex-lg-row justify-content-between align-items-lg-center">
          
          <div class="d-flex align-items-center gap-2 mb-3 mb-md-0">
            <img src="https://placekittens.com/60/60" class="rounded-circle" width="60" height="60" alt="Аватар пользователя">
            <div>
              <div class="d-flex align-items-center gap-3">
                <p class="mb-0 fw-bold">{{ user.firstName || '' }} {{ user.lastName || '' }}</p>
                <span class="badge bg-secondary">Пользователь</span>
              </div>
              <div class="text-blunted small">@{{ user.username }}</div>
            </div>
          </div>

          <div class="d-flex align-items-center justify-content-between justify-content-lg-end gap-3">
            <div class="d-flex gap-3 text-center">
              <div>
                <div class="fw-bold">{{ (user.modelIds || []).length }}</div>
                <div class="text-blunted">Моделей</div>
              </div>
              <div class="vr"></div>
              <div>
                <div class="fw-bold">{{ (user.datasetIds || []).length }}</div>
                <div class="text-blunted">Датасетов</div>
              </div>
            </div>
            <button class="btn btn-outline-danger btn-sm rounded-pill px-3 flex-shrink-0" @click="unsubscribe(user.id)">
              <svg class="svg-icon me-1" aria-hidden="true"><use href="/icons.svg#person-x-fill"></use></svg> Отписаться
            </button>
          </div>

        </li>
      </ul>
    </section>
  </main>
</template>