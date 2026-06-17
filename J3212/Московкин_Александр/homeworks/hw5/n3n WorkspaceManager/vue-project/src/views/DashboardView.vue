<script setup>
import { computed, onMounted } from 'vue'
import AppNavbar from '../components/AppNavbar.vue'
import StatsCard from '../components/StatsCard.vue'
import { useWorkspacesStore } from '../stores/workspaces'

const workspacesStore = useWorkspacesStore()

const totalWorkspaces = computed(() => workspacesStore.totalCount)
const activeWorkspaces = computed(() => workspacesStore.activeCount)
const totalNodes = computed(() =>
  workspacesStore.items.reduce((sum, item) => sum + Number(item.nodes || 0), 0)
)

onMounted(() => {
  workspacesStore.loadWorkspaces()
})
</script>

<template>
  <AppNavbar />

  <main class="container py-4">
    <section class="hero-section mb-4">
      <p class="section-kicker mb-2">n3n Workspace Manager</p>
      <h1 class="display-6 fw-bold mb-2">Dashboard</h1>
    </section>

    <section class="row g-4">
      <div class="col-md-4">
        <StatsCard
          title="Всего workspace"
          :value="totalWorkspaces"
          description="Общее количество рабочих пространств в приложении"
        />
      </div>
      <div class="col-md-4">
        <StatsCard
          title="Активные"
          :value="activeWorkspaces"
          description="Сейчас доступны для работы"
        />
      </div>
      <div class="col-md-4">
        <StatsCard
          title="Всего узлов"
          :value="totalNodes"
          description="Суммарное число узлов во всех workflow"
        />
      </div>
    </section>
  </main>
</template>