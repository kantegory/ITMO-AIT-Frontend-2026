<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '../components/layout/AppLayout.vue'
import StatusBadge from '../components/StatusBadge.vue'
import DagGraph from '../components/DagGraph.vue'
import LogTerminal from '../components/LogTerminal.vue'
import RunHistoryTable from '../components/RunHistoryTable.vue'
import TaskModal from '../components/TaskModal.vue'
import { logsApi, pipelinesApi, runsApi, tasksApi } from '../api'

const route = useRoute()
const pipelineId = computed(() => route.params.id)

const pipeline = ref(null)
const tasks = ref([])
const logs = ref([])
const runs = ref([])
const selectedTask = ref(null)
const activeTab = ref('graph')
const error = ref('')
const loading = ref(true)

onMounted(loadData)
watch(() => route.params.id, loadData)

async function loadData() {
  loading.value = true
  error.value = ''
  try {
    const id = pipelineId.value
    const [pipelineData, tasksData, logsData, runsData] = await Promise.all([
      pipelinesApi.getById(id),
      tasksApi.getByPipeline(id),
      logsApi.getByPipeline(id),
      runsApi.getByPipeline(id),
    ])
    pipeline.value = pipelineData
    tasks.value = tasksData
    logs.value = logsData
    runs.value = runsData
  } catch {
    error.value = 'Failed to load pipeline data. Is json-server running?'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AppLayout :breadcrumb="pipeline?.name || 'Loading...'">
    <div v-if="loading" class="text-center p-4 text-muted">Loading...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <template v-else-if="pipeline">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 class="text-brand"><i class="bi bi-diagram-3"></i> {{ pipeline.name }}</h5>
          <p class="text-muted mb-0">
            Schedule: <code>{{ pipeline.schedule }}</code> · Last Run: {{ pipeline.lastRun }} ·
            <StatusBadge :status="pipeline.status" />
          </p>
        </div>
        <div>
          <button class="btn btn-sm btn-outline-success"><i class="bi bi-play-fill"></i> Run</button>
          <button class="btn btn-sm btn-outline-secondary"><i class="bi bi-pause-fill"></i> Pause</button>
        </div>
      </div>

      <ul class="nav nav-tabs mb-3">
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{ active: activeTab === 'graph' }"
            @click="activeTab = 'graph'"
          >
            <i class="bi bi-diagram-3"></i> Graph View
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{ active: activeTab === 'logs' }"
            @click="activeTab = 'logs'"
          >
            <i class="bi bi-terminal"></i> Logs
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{ active: activeTab === 'history' }"
            @click="activeTab = 'history'"
          >
            <i class="bi bi-clock-history"></i> History
          </button>
        </li>
      </ul>

      <div v-show="activeTab === 'graph'" class="bg-card rounded shadow-sm p-4">
        <DagGraph :tasks="tasks" @task-click="selectedTask = $event" />
      </div>

      <div v-show="activeTab === 'logs'">
        <LogTerminal :logs="logs" />
      </div>

      <div v-show="activeTab === 'history'">
        <RunHistoryTable :runs="runs" />
      </div>

      <TaskModal :task="selectedTask" @close="selectedTask = null" />
    </template>
  </AppLayout>
</template>
