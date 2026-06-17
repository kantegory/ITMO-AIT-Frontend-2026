<template>
  <section class="page container py-4">
    <header class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h1 class="h4 mb-1 d-inline-flex align-items-center gap-2 flex-wrap">
          <svg class="sprite-icon text-secondary" width="22" height="22" aria-hidden="true" focusable="false">
            <use href="#icon-user" />
          </svg>
          <span>Личный кабинет</span>
        </h1>
        <p class="text-secondary mb-0">{{ currentUser?.email }}</p>
      </div>
      <button type="button" class="btn btn-outline-danger btn-sm" aria-label="Выйти из аккаунта" @click="onLogout">
        Выйти
      </button>
    </header>

    <section class="mb-4" aria-labelledby="ticketsHeading">
      <h2 id="ticketsHeading" class="h6 mb-2">Купленные билеты</h2>
      <div class="row g-3" role="region" aria-live="polite" :aria-busy="loading ? 'true' : undefined">
        <template v-if="!loading && tickets.length">
          <div v-for="t in tickets" :key="t.id" class="col-12 col-md-6">
            <article class="card h-100">
              <div class="card-body">
                <h3 class="h6 mb-1">{{ t.eventTitle }}</h3>
                <p class="small text-secondary mb-1">{{ t.city }} · {{ t.date }}</p>
                <p class="small mb-0">Цена: {{ t.price }} ₽</p>
              </div>
            </article>
          </div>
        </template>
      </div>
      <p v-if="emptyText" class="text-secondary small mb-0">{{ emptyText }}</p>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { http, unwrap } from '@/api/http'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { currentUser, logout } = useAuth()
const { show } = useToast()

const tickets = ref([])
const loading = ref(true)

const emptyText = computed(() => {
  if (loading.value) return ''
  if (!tickets.value.length) return 'Вы ещё не покупали билеты.'
  return ''
})

async function loadTickets() {
  const user = currentUser.value
  if (!user?.id) return
  loading.value = true
  try {
    const res = await http.get(`/tickets?userId=${encodeURIComponent(user.id)}`)
    const data = await unwrap(res, 'Не удалось загрузить билеты')
    tickets.value = Array.isArray(data) ? data : []
  } catch {
    show('Не удалось загрузить билеты')
    tickets.value = []
  } finally {
    loading.value = false
  }
}

async function onLogout() {
  logout()
  show('Вы вышли из аккаунта')
  await router.push({ name: 'home' })
}

onMounted(loadTickets)

watch(
  () => currentUser.value?.id,
  () => loadTickets(),
)
</script>
