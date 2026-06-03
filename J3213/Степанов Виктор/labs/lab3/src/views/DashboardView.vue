<template>
  <div>
    <div class="bg-dark text-white py-3">
      <div class="container d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center gap-3">
          <div class="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold"
               style="width:48px;height:48px;">{{ initials }}</div>
          <div>
            <div class="fw-bold">{{ user?.name }}</div>
            <div class="text-secondary" style="font-size:13px;">@{{ user?.username }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid py-3">
      <div class="row g-0">
        <nav class="col-lg-2 pe-3">
          <div v-for="tab in tabs" :key="tab.id"
            class="sidebar-link" :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id" style="cursor:pointer; padding:8px 16px; display:block; border-radius:4px; margin-bottom:4px;">
            {{ tab.label }}
          </div>
        </nav>

        <div class="col-lg-10">
          <div v-if="activeTab === 'overview'">
            <h2 class="h5 mb-3">Обзор</h2>
            <div class="row g-3 mb-4">
              <div class="col-6 col-md-3"><div class="card text-center p-3"><h3 class="mb-0">12</h3><small class="text-muted">Моделей</small></div></div>
              <div class="col-6 col-md-3"><div class="card text-center p-3"><h3 class="mb-0">4</h3><small class="text-muted">Датасетов</small></div></div>
              <div class="col-6 col-md-3"><div class="card text-center p-3"><h3 class="mb-0">3.2K</h3><small class="text-muted">Загрузок</small></div></div>
              <div class="col-6 col-md-3"><div class="card text-center p-3"><h3 class="mb-0">284</h3><small class="text-muted">Звёзд</small></div></div>
            </div>
          </div>

          <div v-if="activeTab === 'settings'">
            <h2 class="h5 mb-3">Настройки профиля</h2>
            <div class="card p-4" style="max-width:500px;">
              <div class="mb-3">
                <label for="sName" class="form-label">Имя</label>
                <input id="sName" type="text" class="form-control" :value="user?.name">
              </div>
              <div class="mb-3">
                <label for="sUsername" class="form-label">Username</label>
                <input id="sUsername" type="text" class="form-control" :value="user?.username">
              </div>
              <button class="btn btn-primary" @click="alert('Сохранено!')">Сохранить</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '../composables/useAuth.js'

const { user } = useAuth()
const activeTab = ref('overview')

const tabs = [
  { id: 'overview', label: 'Обзор' },
  { id: 'settings', label: 'Настройки' },
]

const initials = computed(() => {
  if (!user.value) return 'U'
  return (user.value.name || user.value.username || 'U').slice(0, 2).toUpperCase()
})
</script>

<style scoped>
.sidebar-link { color: var(--text-primary); text-decoration: none; }
.sidebar-link:hover { background: var(--bg-secondary); }
.sidebar-link.active { background: #0d6efd; color: white; }
</style>
