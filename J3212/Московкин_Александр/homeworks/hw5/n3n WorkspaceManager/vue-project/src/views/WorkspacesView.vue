<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppNavbar from '../components/AppNavbar.vue'
import WorkspaceCard from '../components/WorkspaceCard.vue'
import EmptyState from '../components/EmptyState.vue'
import { useWorkspacesStore } from '../stores/workspaces'

const workspacesStore = useWorkspacesStore()
const router = useRouter()

onMounted(() => {
  workspacesStore.loadWorkspaces()
})

const handleDelete = async (id) => {
  const confirmed = window.confirm('Удалить workspace?')
  if (!confirmed) return

  await workspacesStore.removeWorkspace(id)
}

const handleEdit = (workspace) => {
  console.log('Редактирование workspace:', workspace)
}

const handleOpen = (workspace) => {
  console.log('Открыть workspace:', workspace)
}
</script>

<template>
  <AppNavbar />

  <main class="container py-4">
    <section class="mb-4">
      <p class="section-kicker mb-2">n3n Workspace Manager</p>
      <h1 class="display-6 fw-bold mb-2">Рабочие пространства</h1>
      <p class="text-muted mb-0">
        Список всех рабочих пространств, доступных в системе.
      </p>
    </section>

    <div v-if="workspacesStore.isLoading" class="alert alert-light border">
      Загрузка рабочих пространств...
    </div>

    <div v-else-if="workspacesStore.error" class="alert alert-danger">
      {{ workspacesStore.error }}
    </div>

    <EmptyState
      v-else-if="!workspacesStore.items.length"
      title="Список пуст"
      text="Создайте первое рабочее пространство, чтобы оно появилось здесь."
    />

    <section v-else class="row g-4">
      <div
        v-for="workspace in workspacesStore.items"
        :key="workspace.id"
        class="col-md-6 col-xl-4"
      >
        <WorkspaceCard
          :workspace="workspace"
          @delete="handleDelete"
          @edit="handleEdit"
          @open="handleOpen"
        />
      </div>
    </section>
  </main>
</template>