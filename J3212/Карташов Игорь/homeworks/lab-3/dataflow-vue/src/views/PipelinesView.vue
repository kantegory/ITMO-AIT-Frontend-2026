<script setup>
import { onMounted, ref } from 'vue'
import AppLayout from '../components/layout/AppLayout.vue'
import PipelineFilterBar from '../components/PipelineFilterBar.vue'
import PipelineTable from '../components/PipelineTable.vue'
import { pipelinesApi } from '../api'

const pipelines = ref([])
const error = ref('')
const loading = ref(true)
const search = ref('')
const activeFilter = ref('all')

onMounted(async () => {
  try {
    pipelines.value = await pipelinesApi.getAll()
  } catch {
    error.value = 'Failed to load pipelines. Is json-server running?'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <AppLayout title="Pipelines">
    <PipelineFilterBar v-model:search="search" v-model:filter="activeFilter" />

    <div v-if="loading" class="text-center p-4 text-muted">Loading...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <PipelineTable
      v-else
      :pipelines="pipelines"
      :search="search"
      :filter="activeFilter"
    />
  </AppLayout>
</template>
