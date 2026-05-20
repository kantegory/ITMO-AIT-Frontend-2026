<script setup>
import { onMounted } from 'vue'
import { useTheme } from '../composables/useTheme'
import { useAuth } from '../composables/useAuth'
import { useIntegrations } from '../composables/useIntegrations'
import AppSidebar from '../components/AppSidebar.vue'
import AppTopbar from '../components/AppTopbar.vue'
import IntegrationCard from '../components/IntegrationCard.vue'

const { theme, toggleTheme } = useTheme()
const { currentUser } = useAuth()
const { integrations, rules, loadIntegrations } = useIntegrations()

onMounted(() => {
  if (currentUser.value) {
    loadIntegrations(currentUser.value.id)
  }
})
</script>

<template>
  <div class="app-layout">
    <AppSidebar />
    <main class="main-content">
      <AppTopbar
        :theme="theme"
        :user-name="currentUser && currentUser.name"
        @toggle-theme="toggleTheme"
      />

      <div class="content-section">
        <div class="page-header">
          <div>
            <h1>Интеграции</h1>
            <p>Подключайте сервисы и управляйте правилами</p>
          </div>
        </div>

        <div class="integration-grid">
          <IntegrationCard v-for="item in integrations" :key="item.id" :item="item" />
        </div>

        <div class="dashboard-card">
          <h3>Правила категоризации</h3>
          <div v-for="rule in rules" :key="rule.id" class="rule-item">
            <div>
              <strong>{{ rule.condition }} → {{ rule.category }}</strong>
              <p>{{ rule.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>