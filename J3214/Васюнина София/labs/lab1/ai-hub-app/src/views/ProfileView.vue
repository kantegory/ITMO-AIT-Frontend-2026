<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useModels } from '@/composables/useModels'
import ModelCard from '@/components/model/ModelCard.vue'

const authStore = useAuthStore()
const { fetchModels, getPaginatedModels, totalPages, currentPage, setPage, toggleLike, isLiked, applyFilters } = useModels()

const activeTab = ref('models')
const editForm = ref({ firstName: '', lastName: '' })
const showEditModal = ref(false)

const likedModels = computed(() => {
  const stored = localStorage.getItem('likedModels')
  return stored ? JSON.parse(stored) : []
})

const handleLikeFilter = (newFilters) => {
  applyFilters({ ...newFilters, searchQuery: '', dropdownTag: 'all' })
}

const openEditModal = () => {
  if (authStore.user) {
    editForm.value = {
      firstName: authStore.user.firstName || '',
      lastName: authStore.user.lastName || ''
    }
    showEditModal.value = true
  }
}

const saveProfile = async () => {
  if (authStore.user) {
    const result = await authStore.updateProfile(editForm.value)
    if (result.success) {
      showEditModal.value = false
    } else {
      alert(result.message)
    }
  }
}

onMounted(() => {
  if (!authStore.isLoggedIn) {
    // Redirect to home if not logged in
    // window.location.href = '/' // или используйте router.push
  }
})
</script>

<template>
  <div class="profile-page container my-5">
    <div v-if="!authStore.isLoggedIn" class="text-center py-5">
      <h3 class="text-white-50 mb-4">Пожалуйста, войдите в аккаунт</h3>
      <router-link to="/" class="btn btn-info">Перейти на главную</router-link>
    </div>

    <div v-else class="profile-content">
      <div class="row align-items-center mb-5 bg-dark p-4 rounded-4 border border-secondary shadow-sm profile-card">
        <div class="col-md-8 d-flex align-items-center gap-4">
          <h2 class="fw-bold mb-1" :class="textClass">
            {{ authStore.userName }}
          </h2>
          <p class="text-secondary mb-3">{{ authStore.user.email }}</p>
          <button @click="openEditModal" class="btn btn-outline-info btn-sm">
            Edit Profile
          </button>
        </div>
        
        <div class="col-md-4 text-md-end mt-3 mt-md-0">
          <button class="btn btn-primary">+ New Model</button>
        </div>
      </div>

      <ul class="nav nav-tabs border-secondary mb-4" id="profileTab" role="tablist">
        <li class="nav-item" role="presentation">
          <button 
            class="nav-link"
            :class="{ 
              active: activeTab === 'liked',
              'text-white border-bottom border-3 border-info': activeTab === 'liked',
              'text-secondary': activeTab !== 'liked'
            }"
            @click="activeTab = 'liked'"
            type="button"
          >
            Liked Models
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button 
            class="nav-link"
            :class="{ 
              active: activeTab === 'models',
              'text-white border-bottom border-3 border-info': activeTab === 'models',
              'text-secondary': activeTab !== 'models'
            }"
            @click="activeTab = 'models'"
            type="button"
          >
            My Models
          </button>
        </li>
      </ul>

      <div v-if="activeTab === 'liked'" class="row g-4">
        <ModelCard
          v-for="model in likedModels.slice(0, 6)"
          :key="model.id"
          :model="model"
          :is-liked="true"
          @view-details="$router.push(`/model/${model.id}`)"
          @toggle-like="toggleLike"
        />
        
        <div v-if="likedModels.length === 0" class="col-12 text-center py-5 border border-secondary rounded-3">
          <p class="text-white-50 mb-0">Вы ещё не лайкнули ни одной модели.</p>
        </div>
      </div>

      <div v-if="activeTab === 'models'" class="row g-4">
        <div class="col-12 text-center py-5 border border-secondary rounded-3 border-dashed">
          <p class="text-white-50 mb-0">У вас ещё нет загруженных моделей.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Edit Profile Modal -->
  <div v-if="showEditModal" class="modal fade show" tabindex="-1" style="display: block; background: rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content text-white" style="background-color: #1e293b;">
        <div class="modal-header border-secondary">
          <h5 class="modal-title">Edit Profile</h5>
          <button @click="showEditModal = false" type="button" class="btn-close btn-close-white"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveProfile">
            <div class="mb-3">
              <label class="form-label">First Name</label>
              <input v-model="editForm.firstName" type="text" class="form-control bg-transparent text-white border-secondary" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Last Name</label>
              <input v-model="editForm.lastName" type="text" class="form-control bg-transparent text-white border-secondary" required>
            </div>
            <button type="submit" class="btn btn-info w-100">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  setup() {
    const textClass = computed(() => {
      return document.documentElement.getAttribute('data-theme') === 'light' ? 'text-dark' : 'text-white'
    })

    return { textClass }
  }
}
</script>

<style scoped>
.profile-card {
  background-color: var(--card-bg) !important;
}

.border-dashed {
  border-style: dashed !important;
}
</style>
