<template>
  <div class="account-shell">
    <div class="account-wrapper">

      <aside class="account-sidebar">
        <div class="d-flex align-items-center gap-3 mb-3">
          <div class="account-avatar">{{ initials }}</div>
          <div>
            <div style="font-size:0.95rem;font-weight:600">{{ auth.user?.name }}</div>
            <div style="font-size:0.8rem;color:#6b7280">{{ auth.user?.email }}</div>
          </div>
        </div>
        <hr style="border-color:rgba(148,163,184,0.4)" />
        <nav class="d-flex flex-column gap-1">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="sidebar-item"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            <i :class="tab.icon"></i> {{ tab.label }}
          </button>
        </nav>
        <div class="mt-auto pt-3">
          <button
            class="sidebar-item w-100"
            style="color:#ef4444"
            @click="handleLogout"
          >
            <i class="bi bi-box-arrow-right" style="color:#ef4444"></i> Выйти
          </button>
        </div>
      </aside>

      <main class="account-content">
        <div class="detail-card">
          <h2 class="page-title mb-1">{{ currentTab?.label }}</h2>
          <p class="page-subtitle">{{ currentTab?.desc }}</p>

          <template v-if="activeTab === 'liked'">
            <LoadingState :loading="loading" :error="error" :empty="!likedModels.length" empty-text="Вы ещё не лайкнули ни одной модели">
              <div class="cards-grid">
                <ItemCard
                  v-for="model in likedModels"
                  :key="model.id"
                  :item="model"
                  :to="`/models/${model.id}`"
                  :is-liked-item="true"
                />
              </div>
            </LoadingState>
          </template>

          <template v-else-if="activeTab === 'profile'">
            <div class="row g-3" style="max-width:480px">
              <div class="col-12">
                <label class="form-label fw-500">Имя</label>
                <input class="form-control-glass" :value="auth.user?.name" readonly />
              </div>
              <div class="col-12">
                <label class="form-label fw-500">Email</label>
                <input class="form-control-glass" :value="auth.user?.email" readonly />
              </div>
            </div>
          </template>

          <template v-else-if="activeTab === 'uploaded'">
            <div class="empty-box">
              <i class="bi bi-cloud-upload fs-1 d-block mb-2 opacity-40"></i>
              У вас пока нет загруженных моделей
            </div>
          </template>
        </div>
      </main>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useApi } from '@/composables/useApi'
import { getModels } from '@/api/models'
import ItemCard from '@/components/ItemCard.vue'
import LoadingState from '@/components/LoadingState.vue'

const auth = useAuthStore()
const router = useRouter()
const activeTab = ref('liked')

const tabs = [
  { id: 'liked', label: 'Понравившиеся', icon: 'bi bi-heart', desc: 'Модели, которые вы лайкнули.' },
  { id: 'uploaded', label: 'Загруженные', icon: 'bi bi-cloud-upload', desc: 'Ваши опубликованные модели.' },
  { id: 'profile', label: 'Профиль', icon: 'bi bi-person', desc: 'Данные вашего аккаунта.' }
]

const currentTab = computed(() => tabs.find((t) => t.id === activeTab.value))

const initials = computed(() => {
  const name = auth.user?.name || ''
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
})

const likedIds = computed(() => {
  return new Set(JSON.parse(localStorage.getItem('liked_models') || '[]'))
})

const { data, loading, error, execute } = useApi(getModels)
const likedModels = ref([])

watch(data, (v) => {
  if (v) likedModels.value = v.filter((m) => likedIds.value.has(m.id))
})

function handleLogout() {
  auth.logout()
  router.push('/')
}

onMounted(() => execute({}))
</script>
