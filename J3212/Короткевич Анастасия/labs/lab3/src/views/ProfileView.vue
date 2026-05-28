<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import ItemCard from '../components/ItemCard.vue'
import StatsPanel from '../components/StatsPanel.vue'
import { useAuth } from '../composables/useAuth'
import { useItems } from '../composables/useItems'

const router = useRouter()
const { userId, logout, updateUserMeta } = useAuth()
const { allItems, loadItems } = useItems()

const user      = ref(null)
const activeTab = ref('models')
const isLoading = ref(true)

const showModal   = ref(false)
const isSaving    = ref(false)
const saveError   = ref('')
const editForm    = ref({ name: '', avatar: '', description: '', role: '' })

function openEditModal() {
  if (!user.value) return
  editForm.value = {
    name:        user.value.name        || '',
    avatar:      user.value.avatar      || '',
    description: user.value.description || '',
    role:        user.value.role        || '',
  }
  saveError.value = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function saveProfile() {
  if (isSaving.value) return
  isSaving.value = true
  saveError.value = ''

  try {
    const id = userId.value
    const body = {
      name:        editForm.value.name.trim(),
      avatar:      editForm.value.avatar.trim(),
      description: editForm.value.description.trim(),
      role:        editForm.value.role.trim(),
    }

    const res = await api.patch(`/users/${id}`, body)
    user.value = res.data

    updateUserMeta(body.name, body.avatar, body.role)

    closeModal()
  } catch (e) {
    saveError.value = 'Ошибка сохранения'
  } finally {
    isSaving.value = false
  }
}

function handleLogout() {
  logout()
  router.push('/')
}

onMounted(async () => {
  await loadItems()
  const id = userId.value || 'u1'
  const response = await api.get(`/users/${id}`)
  user.value = response.data
  isLoading.value = false
})

const userItems    = computed(() => allItems.value.filter(i => i.authorId === (user.value?.id || 'u1')))
const userModels   = computed(() => userItems.value.filter(i => i.type === 'model'))
const userDatasets = computed(() => userItems.value.filter(i => i.type === 'dataset'))
const visibleItems = computed(() => activeTab.value === 'models' ? userModels.value : userDatasets.value)
</script>

<template>
  <main class="profile-page page-gradient">
    <p v-if="isLoading" class="empty-text">Загрузка профиля</p>

    <section v-else-if="user" class="profile-dashboard">
      <div class="profile-left">
        <aside class="profile-card modern-card">
          <img
            :src="user.avatar || 'https://i.pravatar.cc/150'"
            :alt="`Аватар ${user.name}`"
            class="profile-avatar"
          />

          <h1>{{ user.name }}</h1>
          <p class="profile-email">Email: <span>{{ user.email }}</span></p>
          <p class="profile-id">ID: {{ user.id }}</p>
          <p class="profile-role">{{ user.role }}</p>
          <p class="profile-description">{{ user.description }}</p>

          <button class="edit-profile-btn" type="button" @click="openEditModal">
            Редактировать профиль
          </button>
          <button class="logout-btn" type="button" @click="handleLogout">
            Выйти
          </button>

          <div class="profile-counters">
            <div><strong>{{ userModels.length }}</strong><span>Модели</span></div>
            <div><strong>{{ userDatasets.length }}</strong><span>Датасеты</span></div>
            <div><strong>0</strong><span>Подписки</span></div>
          </div>
        </aside>

        <StatsPanel :items="userItems" />
      </div>

      <section class="profile-workspace modern-card">
        <div class="profile-tabs">
          <button
            :class="{ active: activeTab === 'models' }"
            type="button"
            @click="activeTab = 'models'"
          >
            Мои модели
          </button>
          <button
            :class="{ active: activeTab === 'datasets' }"
            type="button"
            @click="activeTab = 'datasets'"
          >
            Мои датасеты
          </button>
        </div>

        <div class="profile-items-list">
          <ItemCard v-for="item in visibleItems" :key="item.id" :item="item" />
          <p v-if="!visibleItems.length" class="empty-text">
            Публикаций в этом разделе пока нет.
          </p>
        </div>
      </section>
    </section>
  </main>

  <Teleport to="body">
    <Transition name="modal">
      <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
        <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-title">

          <div class="modal-header">
            <h2 id="modal-title">Редактировать профиль</h2>
            <button class="modal-close" type="button" @click="closeModal" aria-label="Закрыть">✕</button>
          </div>

          <div class="modal-body">
            <div class="modal-field">
              <label for="edit-name">Имя</label>
              <input id="edit-name" v-model="editForm.name" type="text" class="modal-input" />
            </div>

            <div class="modal-field">
              <label for="edit-avatar">Ссылка на аватар</label>
              <input id="edit-avatar" v-model="editForm.avatar" type="text" class="modal-input" />
              <img
                v-if="editForm.avatar"
                :src="editForm.avatar"
                class="avatar-preview"
                alt="Предпросмотр аватара"
              />
            </div>

            <div class="modal-field">
              <label for="edit-desc">Описание</label>
              <textarea id="edit-desc" v-model="editForm.description" class="modal-input" rows="3"></textarea>
            </div>

            <div class="modal-field">
              <label for="edit-role">Роль</label>
              <input id="edit-role" v-model="editForm.role" type="text" class="modal-input" />
            </div>

            <p v-if="saveError" class="modal-error">{{ saveError }}</p>
          </div>

          <div class="modal-footer">
            <button class="modal-btn-cancel" type="button" @click="closeModal">Закрыть</button>
            <button class="modal-btn-save" type="button" :disabled="isSaving" @click="saveProfile">
              {{ isSaving ? 'Сохраняем...' : 'Сохранить' }}
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>
