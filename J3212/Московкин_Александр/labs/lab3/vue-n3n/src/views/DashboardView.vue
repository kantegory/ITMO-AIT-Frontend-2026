<template>
  <div class="bg-light min-vh-100">
    <AppNavbar />
    <main class="container my-4" id="main-content">
      <h1 class="h4 mb-4">Добро пожаловать, {{ currentUser?.name || 'пользователь' }}</h1>

      <div class="row g-3 mb-4">
        <div class="col-md-4">
          <StatsCard label="Рабочих пространств" :value="store.totalCount" />
        </div>
        <div class="col-md-4">
          <StatsCard label="Всего узлов" :value="totalNodes" />
        </div>
        <div class="col-md-4">
          <StatsCard label="Активных типов" :value="store.activeCount" />
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <h2 class="h6 mb-3">Последние пространства</h2>
          <ul v-if="store.items.length" class="list-group list-group-flush">
            <WorkspaceCard
              v-for="ws in store.items.slice(0, 5)"
              :key="ws.id"
              :workspace="ws"
              @delete="handleDelete"
            />
          </ul>
          <EmptyState v-else title="Пространств пока нет" subtitle="Создайте первое на странице «Пространства»" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import AppNavbar from '@/components/AppNavbar.vue'
import StatsCard from '@/components/StatsCard.vue'
import WorkspaceCard from '@/components/WorkspaceCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { useWorkspacesStore } from '@/stores/workspaces'
import { useCurrentUser } from '@/composables/useCurrentUser'

const store = useWorkspacesStore()
const { currentUser } = useCurrentUser()

const totalNodes = computed(() =>
  store.items.reduce((acc, ws) => {
    const data = ws.graph?.drawflow?.Home?.data
    return acc + (data ? Object.keys(data).length : 0)
  }, 0)
)

onMounted(() => {
  if (currentUser.value) {
    store.load({ ownerId: currentUser.value.id })
  }
})

async function handleDelete(id) {
  await store.remove(id)
}
</script>