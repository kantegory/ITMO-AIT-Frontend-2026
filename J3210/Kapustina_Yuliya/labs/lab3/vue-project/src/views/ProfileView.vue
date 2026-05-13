<template>
  <div class="container mt-4">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else-if="profile">
      <div class="profile-header">
        <div class="row align-items-center">
          <div class="col-md-2 text-center">
            <img
              :src="avatarUrl"
              class="avatar"
              alt="Аватар"
            />
          </div>

          <div class="col-md-7">
            <h2>{{ profile.username }}</h2>
            <p>{{ profile.bio || 'Нет описания' }}</p>
          </div>

          <div class="col-md-3 text-end">
            <button
              v-if="isOwnProfile"
              class="btn btn-light"
              data-bs-toggle="modal"
              data-bs-target="#editProfileModal"
            >
              Редактировать профиль
            </button>

            <button
              v-else-if="isAuthenticated"
              class="btn"
              :class="isSubscribed ? 'btn-secondary' : 'btn-light'"
              @click="handleSubscribe"
            >
              {{ isSubscribed ? 'Отписаться' : 'Подписаться' }}
            </button>

            <router-link
              v-else
              to="/login"
              class="btn btn-light"
            >
              Войти, чтобы подписаться
            </router-link>
          </div>
        </div>
      </div>

      <ProfileStats :stats="profileStats" />

      <div v-if="isOwnProfile" class="text-center my-5 py-3">
        <router-link to="/write" class="btn btn-main btn-lg px-5">
          Создать новую работу
        </router-link>
      </div>

      <ul class="nav nav-tabs mt-5 border-0">
        <li class="nav-item">
          <button
            class="nav-link fw-semibold px-4 py-2"
            :class="{ active: activeTab === 'works' }"
            @click="activeTab = 'works'"
          >
            Фанфики
          </button>
        </li>
        <li v-if="isOwnProfile" class="nav-item">
          <button
            class="nav-link fw-semibold px-4 py-2"
            :class="{ active: activeTab === 'drafts' }"
            @click="activeTab = 'drafts'"
          >
            Черновики
          </button>
        </li>
        <li v-if="isOwnProfile" class="nav-item">
          <button
            class="nav-link fw-semibold px-4 py-2"
            :class="{ active: activeTab === 'favorites' }"
            @click="activeTab = 'favorites'"
          >
            Избранное
          </button>
        </li>
        <li v-if="isOwnProfile" class="nav-item">
          <button
            class="nav-link fw-semibold px-4 py-2"
            :class="{ active: activeTab === 'history' }"
            @click="activeTab = 'history'"
          >
            История
          </button>
        </li>
        <li v-if="isOwnProfile" class="nav-item">
          <button
            class="nav-link fw-semibold px-4 py-2"
            :class="{ active: activeTab === 'subscriptions' }"
            @click="activeTab = 'subscriptions'"
          >
            Подписки
          </button>
        </li>
      </ul>

      <div class="tab-content mt-4">
        <div v-show="activeTab === 'works'">
          <div v-if="publishedFics.length === 0" class="text-center text-muted py-5">
            Нет фанфиков
          </div>
          <FicCardDetailed
            v-for="fic in publishedFics"
            :key="fic.id"
            :fic="fic"
            :show-edit-button="isOwnProfile"
          />
        </div>

        <div v-show="activeTab === 'drafts' && isOwnProfile">
          <div v-if="draftFics.length === 0" class="text-center text-muted py-5">
            Нет черновиков
          </div>
          <FicCardDetailed
            v-for="fic in draftFics"
            :key="fic.id"
            :fic="fic"
            :show-edit-button="true"
          />
        </div>

        <div v-show="activeTab === 'favorites' && isOwnProfile">
          <div v-if="likedFics.length === 0" class="text-center text-muted py-5">
            Нет избранных фанфиков
          </div>
          <FicCardDetailed
            v-for="fic in likedFics"
            :key="fic.id"
            :fic="fic"
          />
        </div>

        <div v-show="activeTab === 'history' && isOwnProfile">
          <div v-if="historyFics.length === 0" class="text-center text-muted py-5">
            История просмотров пуста
          </div>
          <div v-for="fic in historyFics" :key="fic.id" class="col-12 mb-4">
            <div class="card h-100">
              <div class="card-body">
                <router-link :to="`/fic/${fic.id}`" class="fic-title">
                  {{ fic.title }}
                </router-link>
                <span class="rating-tag">{{ fic.rating }}</span>
                <span class="ms-2" :class="fic.status === 'completed' ? 'text-success' : 'text-warning'">
                  {{ fic.status === 'completed' ? 'Закончен' : 'В процессе' }}
                </span>
                <p class="text-muted mb-2 mt-2">
                  <span class="author-info">{{ fic.authorName }}</span>
                  <span class="ms-3 date-info">{{ formatDate(fic.createdAt) }}</span>
                </p>
                <span class="fandom-tag">{{ fic.fandom }}</span>
                <p class="mt-2 mb-2 small">{{ truncateText(fic.description, 100) }}</p>
                <small class="text-muted">Просмотрено: {{ formatDateTime(fic.viewedAt) }}</small>
              </div>
            </div>
          </div>
        </div>

        <div v-show="activeTab === 'subscriptions' && isOwnProfile">
          <div v-if="subscriptions.length === 0" class="text-center text-muted py-5">
            Вы ни на кого не подписаны
          </div>
          <div v-for="sub in subscriptions" :key="sub.username" class="col-12 mb-3">
            <router-link
              :to="`/profile/${sub.username}`"
              class="text-decoration-none"
            >
              <div class="card hover-card">
                <div class="card-body d-flex align-items-center">
                  <div class="me-3">
                    <img
                      :src="sub.avatar && sub.avatar !== 'default-avatar.png' ? `/pics/${sub.avatar}` : '/pics/ava.jpg'"
                      class="rounded-circle"
                      style="width: 50px; height: 50px; object-fit: cover;"
                      alt=""
                    />
                  </div>
                  <div>
                    <h5 class="mb-0" style="color: #ff7043;">{{ sub.username }}</h5>
                    <p class="text-muted small mb-0">{{ truncateText(sub.bio, 60) || 'Нет описания' }}</p>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-5">
      <h2>Пользователь не найден</h2>
      <router-link to="/" class="btn btn-main mt-3">На главную</router-link>
    </div>

    <div class="modal fade" id="editProfileModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Редактировать профиль</h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <form @submit.prevent="handleSaveProfile">
              <div class="mb-3">
                <label class="form-label">Имя пользователя</label>
                <input type="text" class="form-control" v-model="editForm.username" />
              </div>

              <div class="mb-3">
                <label class="form-label">Описание</label>
                <textarea class="form-control" rows="3" v-model="editForm.bio"></textarea>
              </div>

              <div class="mb-3">
                <label class="form-label">Аватар</label>
                <input
                  type="file"
                  class="form-control"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  @change="handleAvatarChange"
                />
                <div v-if="avatarPreview" class="mt-2">
                  <img
                    :src="avatarPreview"
                    style="width: 80px; height: 80px; object-fit: cover; border-radius: 50%;"
                    alt="Предпросмотр"
                  />
                </div>
                <small class="text-muted">Допустимые форматы: JPEG, PNG, GIF, WEBP. Максимальный размер: 5 МБ</small>
              </div>
            </form>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            <button class="btn btn-main" @click="handleSaveProfile" :disabled="savingProfile">
              {{ savingProfile ? 'Сохранение...' : 'Сохранить' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useProfile } from '@/composables/useProfile'
import { useFics } from '@/composables/useFics'
import ProfileStats from '@/components/ProfileStats.vue'
import FicCardDetailed from '@/components/FicCardDetailed.vue'
import { Modal } from 'bootstrap'

const route = useRoute()
const { isAuthenticated, currentUser, updateCurrentUser } = useAuth()
const {
  profile,
  profileStats,
  profileFics,
  loading,
  fetchProfile,
  updateProfile,
  checkSubscription,
  toggleSubscribe,
  fetchSubscriptions
} = useProfile()
const { fetchLikedFics, fetchHistory, formatDate, formatDateTime } = useFics()

const activeTab = ref('works')
const isOwnProfile = ref(false)
const isSubscribed = ref(false)
const likedFics = ref([])
const historyFics = ref([])
const subscriptions = ref([])
const savingProfile = ref(false)
const avatarPreview = ref(null)
const selectedAvatarFile = ref(null)

const editForm = reactive({
  username: '',
  bio: '',
})

const publishedFics = computed(() => {
  return profileFics.value.filter(f => f.status !== 'draft')
})

const draftFics = computed(() => {
  return profileFics.value.filter(f => f.status === 'draft')
})

const avatarUrl = computed(() => {
  if (profile.value?.avatar && profile.value.avatar !== 'default-avatar.png') {
    return `/pics/${profile.value.avatar}`
  }
  return '/pics/ava.jpg'
})

function handleAvatarChange(event) {
  const file = event.target.files[0]
  if (!file) return

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    alert('Можно загружать только изображения (JPEG, PNG, GIF, WEBP)')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    alert('Размер файла не должен превышать 5 МБ')
    return
  }

  selectedAvatarFile.value = file

  const reader = new FileReader()
  reader.onload = (e) => {
    avatarPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

function truncateText(text, maxLength) {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

async function handleSubscribe() {
  if (!profile.value) return

  const result = await toggleSubscribe(profile.value.username)
  if (result.success) {
    isSubscribed.value = result.subscribed
  }
}

async function handleSaveProfile() {
  if (editForm.username.length < 3) {
    alert('Имя пользователя должно быть не менее 3 символов')
    return
  }

  savingProfile.value = true

  const formData = new FormData()
  formData.append('username', editForm.username)
  formData.append('bio', editForm.bio)
  if (selectedAvatarFile.value) {
    formData.append('avatar', selectedAvatarFile.value)
  }

  const result = await updateProfile(formData)

  if (result.success) {
    updateCurrentUser(result.data.user)

    const modal = Modal.getInstance(document.getElementById('editProfileModal'))
    modal.hide()

    loadProfileData()
  } else {
    alert(result.error || 'Ошибка при сохранении профиля')
  }

  savingProfile.value = false
}

async function loadProfileData() {
  let username = route.params.username

  if (!username && currentUser.value) {
    username = currentUser.value.username
  }

  if (!username) return

  isOwnProfile.value = currentUser.value?.username === username

  await fetchProfile(username)

  if (profile.value && isOwnProfile.value) {
    editForm.username = profile.value.username
    editForm.bio = profile.value.bio || ''

    const liked = await fetchLikedFics()
    likedFics.value = liked

    const history = await fetchHistory()
    historyFics.value = history

    const subs = await fetchSubscriptions()
    const subProfiles = []
    for (const subUsername of subs) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/profile/${subUsername}`)
        if (response.ok) {
          const data = await response.json()
          subProfiles.push(data.user)
        } else {
          subProfiles.push({ username: subUsername, bio: '', avatar: 'default-avatar.png' })
        }
      } catch {
        subProfiles.push({ username: subUsername, bio: '', avatar: 'default-avatar.png' })
      }
    }
    subscriptions.value = subProfiles
  }

  if (profile.value && !isOwnProfile.value && isAuthenticated.value) {
    const subscribed = await checkSubscription(profile.value.username)
    isSubscribed.value = subscribed
  }
}

onMounted(() => {
  loadProfileData()
})

watch(() => route.params.username, () => {
  loadProfileData()
})
</script>