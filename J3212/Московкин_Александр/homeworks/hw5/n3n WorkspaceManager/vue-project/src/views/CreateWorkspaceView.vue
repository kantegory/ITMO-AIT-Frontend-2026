<script setup>
import { useRouter } from 'vue-router'
import AppNavbar from '../components/AppNavbar.vue'
import WorkspaceForm from '../components/WorkspaceForm.vue'
import { useWorkspacesStore } from '../stores/workspaces'

const router = useRouter()
const workspacesStore = useWorkspacesStore()

async function handleCreateWorkspace(payload) {
  await workspacesStore.addWorkspace(payload)
  router.push('/workspaces')
}
</script>

<template>
  <AppNavbar />

  <main class="container py-4">
    <section class="mb-4">
      <p class="section-kicker mb-2">n3n Workspace Manager</p>
      <h1 class="display-6 fw-bold mb-2">Создание workspace</h1>
      <p class="text-muted mb-0">
        Заполните форму, чтобы добавить новое рабочее пространство в систему.
      </p>
    </section>

    <WorkspaceForm @submit="handleCreateWorkspace" />
  </main>
</template>