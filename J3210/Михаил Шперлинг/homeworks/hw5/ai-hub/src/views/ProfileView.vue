<script setup>
import { ref, computed, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import BaseLayout from '@/layouts/BaseLayout.vue'
import { modelsApi } from '@/api'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const models = ref([])
const loadingModels = ref(false)
const editFormEl = ref(null)
const editValidated = ref(false)
const editForm = ref({ username: '', email: '' })
let editModal = null

const avatarUrl = computed(() =>
  `https://ui-avatars.com/api/?name=${authStore.user.username}&background=6366f1&color=fff&size=150`
)

async function loadModels() {
  loadingModels.value = true
  try {
    const res = await modelsApi.getAll()
    models.value = res.data.filter(m => m.author === authStore.user.username)
  } finally {
    loadingModels.value = false
  }
}

function openEditModal() {
  editForm.value = { username: authStore.user.username, email: authStore.user.email }
  editValidated.value = false
  if (!editModal) {
    editModal = new Modal(document.getElementById('editProfileModal'))
  }
  editModal.show()
}

function closeEditModal() {
  editModal?.hide()
}

async function saveProfile() {
  if (!editFormEl.value.checkValidity()) {
    editValidated.value = true
    return
  }
  try {
    await authStore.updateProfile(authStore.user.id, editForm.value)
    closeEditModal()
  } catch (e) {
    console.error(e)
  }
}

onMounted(loadModels)
</script>

<template>
  <base-layout>
    <div class="row mt-2 g-4">
      <div class="col-md-4">
        <div class="card p-4 text-center">
          <img
            :src="avatarUrl"
            class="rounded-circle mx-auto mb-3 profile-img"
            :alt="authStore.user.username"
          >
          <h4 class="fw-bold mb-1">{{ authStore.user.username }}</h4>
          <p class="text-muted mb-3">{{ authStore.user.email }}</p>
          <button class="btn btn-outline-primary btn-sm" @click="openEditModal">
            Редактировать профиль
          </button>
        </div>
        <div class="card p-3 mt-3 text-center">
          <div class="fw-bold fs-3">{{ models.length }}</div>
          <div class="text-muted small">Моделей загружено</div>
        </div>
      </div>

      <div class="col-md-8">
        <h5 class="fw-bold mb-3">Мои модели</h5>
        <div v-if="loadingModels" class="text-center py-3">
          <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
        </div>
        <p v-else-if="models.length === 0" class="text-muted">
          Вы ещё не загрузили ни одной модели.
        </p>
        <div v-else class="list-group">
          <router-link
            v-for="model in models"
            :key="model.id"
            :to="`/model/models/${model.id}`"
            class="list-group-item list-group-item-action p-3"
          >
            <div class="d-flex justify-content-between align-items-center mb-1">
              <h6 class="mb-0 fw-bold text-primary">{{ model.title }}</h6>
              <span class="badge bg-primary">Модель</span>
            </div>
            <p class="mb-2 text-muted small">{{ model.desc }}</p>
            <div class="d-flex gap-1">
              <span class="badge border bg-light text-dark">{{ model.task?.toUpperCase() }}</span>
              <span class="badge border bg-light text-dark">{{ model.framework }}</span>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Модалка редактирования профиля -->
    <div
      class="modal fade"
      id="editProfileModal"
      tabindex="-1"
      aria-labelledby="editProfileLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow">
          <div class="modal-header border-bottom-0">
            <h5 class="modal-title fw-bold" id="editProfileLabel">Редактировать профиль</h5>
            <button type="button" class="btn-close" @click="closeEditModal" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body">
            <form
              ref="editFormEl"
              @submit.prevent="saveProfile"
              novalidate
              :class="{ 'was-validated': editValidated }"
            >
              <div class="mb-3">
                <label for="editUsername" class="form-label">Имя пользователя</label>
                <input
                  v-model="editForm.username"
                  type="text"
                  class="form-control"
                  id="editUsername"
                  required
                >
                <div class="invalid-feedback">Введите имя пользователя</div>
              </div>
              <div class="mb-4">
                <label for="editEmail" class="form-label">Email</label>
                <input
                  v-model="editForm.email"
                  type="email"
                  class="form-control"
                  id="editEmail"
                  required
                >
                <div class="invalid-feedback">Введите корректный email</div>
              </div>
              <button type="submit" class="btn btn-primary w-100">Сохранить</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </base-layout>
</template>
