<script setup>
import { onMounted, ref } from 'vue'
import AppLayout from '../components/layout/AppLayout.vue'
import ProfileCard from '../components/ProfileCard.vue'
import StatsPanel from '../components/StatsPanel.vue'
import ConnectionList from '../components/ConnectionList.vue'
import { connectionsApi, pipelinesApi, runsApi, usersApi } from '../api'
import { useAuth } from '../composables/useAuth'

const { userId } = useAuth()

const user = ref(null)
const pipelines = ref([])
const runs = ref([])
const connections = ref([])
const error = ref('')
const loading = ref(true)

onMounted(async () => {
  try {
    const id = userId.value
    const [userData, pipelinesData, runsData, connectionsData] = await Promise.all([
      usersApi.getById(id),
      pipelinesApi.getAll(),
      runsApi.getAll(),
      connectionsApi.getByUser(id),
    ])
    user.value = userData
    pipelines.value = pipelinesData
    runs.value = runsData
    connections.value = connectionsData
  } catch {
    error.value = 'Error loading profile'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <AppLayout title="Profile" :show-profile-link="false" show-logout>
    <div v-if="loading" class="text-center p-4 text-muted">Loading...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-else class="row">
      <div class="col-md-4 mb-4">
        <ProfileCard :user="user" />
      </div>
      <div class="col-md-8">
        <StatsPanel :pipelines="pipelines" :runs="runs" />
        <ConnectionList :connections="connections" />
      </div>
    </div>
  </AppLayout>
</template>
