<template>
  <div class="bg-light min-vh-100">
    <AppNavbar />
    <main class="container my-4" id="main-content">
      <h1 class="h4 mb-4">Рабочие пространства</h1>

      <div class="card mb-4">
        <div class="card-body">
          <h2 class="h6 mb-3">Создать новое</h2>
          <form @submit.prevent="handleCreate">
            <div class="mb-3">
              <label class="form-label" for="ws-name">Название</label>
              <input id="ws-name" type="text" class="form-control" v-model="newName" placeholder="Название пространства" />
            </div>
            <div class="mb-3">
              <label class="form-label" for="ws-desc">Описание</label>
              <input id="ws-desc" type="text" class="form-control" v-model="newDesc" placeholder="Описание (необязательно)" />
            </div>
            <div class="mb-3">
              <label class="form-label" for="ws-type">Тип</label>
              <select id="ws-type" class="form-select" v-model="newType">
                <option value="other">Другое</option>
                <option value="marketing">Marketing</option>
                <option value="dev">Dev</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary" :disabled="!newName.trim()">Создать</button>
          </form>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <h2 class="h6 mb-3">Список ваших пространств</h2>
          <div v-if="store.isLoading" class="text-muted small">Загрузка...</div>
          <div v-else-if="store.error" class="text-danger small">{{ store.error }}</div>
          <ul v-else-if="store.items.length" class="list-group list-group-flush">
            <WorkspaceCard
              v-for="ws in store.items"
              :key="ws.id"
              :workspace="ws"
              @delete="handleDelete"
            />
          </ul>
          <EmptyState v-else title="Пространств пока нет" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppNavbar from '@/components/AppNavbar.vue'
import WorkspaceCard from '@/components/WorkspaceCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { useWorkspacesStore } from '@/stores/workspaces'
import { useCurrentUser } from '@/composables/useCurrentUser'

const store = useWorkspacesStore()
const { currentUser } = useCurrentUser()

const newName = ref('')
const newDesc = ref('')
const newType = ref('other')

onMounted(() => {
  if (currentUser.value) store.load({ ownerId: currentUser.value.id })
})

async function handleCreate() {
  if (!newName.value.trim()) return
  await store.add({
    name: newName.value.trim(),
    description: newDesc.value.trim(),
    type: newType.value,
    ownerId: currentUser.value?.id ?? null,
    graph: {}
  })
  newName.value = ''
  newDesc.value = ''
  newType.value = 'other'
}

async function handleDelete(id) {
  await store.remove(id)
}
</script>