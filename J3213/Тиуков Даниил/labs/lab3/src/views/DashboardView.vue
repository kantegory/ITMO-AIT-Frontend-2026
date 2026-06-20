<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'
import { useDestinations, labelMaps } from '@/composables/useDestinations.js'
import { useRoutes } from '@/composables/useRoutes.js'
import { useNotes } from '@/composables/useNotes.js'
import { useFavorites } from '@/composables/useFavorites.js'
import { useToast } from '@/composables/useToast.js'

const router = useRouter()
const { currentUser, logout, updateProfile } = useAuth()
const { destinations, destinationsById, loadDestinations } = useDestinations()
const { routes, addRoute, removeRoute, loadRoutes } = useRoutes()
const { notes, addNote, updateNote, removeNote, loadNotes } = useNotes()
const { favoriteDestinations, remove: removeFavoriteFn, loadFavorites } = useFavorites()
const { showToast } = useToast()

const activeTab = ref('routes')

const profileForm = reactive({
  firstName: '',
  lastName: '',
  preference: 'mixed'
})

const routeForm = reactive({
  name: '',
  duration: '',
  budget: '',
  description: '',
  destinationId: ''
})

const noteForm = reactive({ id: '', title: '', text: '' })

const isProfileOpen = ref(false)
const isRouteOpen = ref(false)

const profileAvatar = computed(() => {
  const first = currentUser.value?.firstName?.[0] || 'T'
  const last = currentUser.value?.lastName?.[0] || 'P'
  return `${first}${last}`.toUpperCase()
})

const preferenceLabel = computed(() => labelMaps.type[currentUser.value?.preference] || 'Смешанный')

watch(currentUser, (user) => {
  if (!user) return
  profileForm.firstName = user.firstName || ''
  profileForm.lastName = user.lastName || ''
  profileForm.preference = user.preference || 'mixed'
}, { immediate: true })

function openProfileModal() {
  if (currentUser.value) {
    profileForm.firstName = currentUser.value.firstName || ''
    profileForm.lastName = currentUser.value.lastName || ''
    profileForm.preference = currentUser.value.preference || 'mixed'
  }
  isProfileOpen.value = true
}

async function saveProfile() {
  if (!profileForm.firstName.trim() || !profileForm.lastName.trim() || !profileForm.preference) {
    showToast('Заполните все поля профиля', 'error')
    return
  }
  try {
    await updateProfile({
      firstName: profileForm.firstName.trim(),
      lastName: profileForm.lastName.trim(),
      preference: profileForm.preference
    })
    showToast('Профиль обновлён', 'success')
    isProfileOpen.value = false
  } catch {
    showToast('Не удалось сохранить профиль', 'error')
  }
}

function openRouteModal() {
  routeForm.name = ''
  routeForm.duration = ''
  routeForm.budget = ''
  routeForm.description = ''
  routeForm.destinationId = ''
  isRouteOpen.value = true
}

async function submitRoute() {
  if (!routeForm.name.trim() || !routeForm.duration.trim() || !routeForm.budget || !routeForm.description.trim()) {
    showToast('Заполните все поля маршрута', 'error')
    return
  }
  try {
    await addRoute({
      name: routeForm.name.trim(),
      duration: routeForm.duration.trim(),
      budget: routeForm.budget,
      description: routeForm.description.trim(),
      destinationId: routeForm.destinationId ? Number(routeForm.destinationId) : null
    })
    showToast('Маршрут добавлен', 'success')
    isRouteOpen.value = false
  } catch {
    showToast('Не удалось сохранить маршрут', 'error')
  }
}

async function deleteRoute(routeId) {
  try {
    await removeRoute(routeId)
    showToast('Маршрут удалён', 'info')
  } catch {
    showToast('Не удалось удалить маршрут', 'error')
  }
}

async function submitNote() {
  if (!noteForm.title.trim() || !noteForm.text.trim()) {
    showToast('Заполните заголовок и текст заметки', 'error')
    return
  }
  try {
    if (noteForm.id) {
      await updateNote(noteForm.id, { title: noteForm.title.trim(), text: noteForm.text.trim() })
      showToast('Заметка обновлена', 'success')
    } else {
      await addNote({ title: noteForm.title.trim(), text: noteForm.text.trim() })
      showToast('Заметка добавлена', 'success')
    }
    noteForm.id = ''
    noteForm.title = ''
    noteForm.text = ''
  } catch {
    showToast('Не удалось сохранить заметку', 'error')
  }
}

function editNote(note) {
  noteForm.id = note.id
  noteForm.title = note.title
  noteForm.text = note.text
  activeTab.value = 'notes'
}

async function deleteNote(noteId) {
  try {
    await removeNote(noteId)
    if (noteForm.id === noteId) {
      noteForm.id = ''
      noteForm.title = ''
      noteForm.text = ''
    }
    showToast('Заметка удалена', 'info')
  } catch {
    showToast('Не удалось удалить заметку', 'error')
  }
}

async function deleteFavorite(destinationId) {
  try {
    await removeFavoriteFn(destinationId)
    showToast('Направление удалено из избранного', 'info')
  } catch {
    showToast('Не удалось удалить из избранного', 'error')
  }
}

function handleLogout() {
  logout()
  showToast('Вы вышли из профиля', 'info')
  router.push('/')
}

function destinationName(routeItem) {
  if (!routeItem.destinationId) return 'Свободный маршрут'
  return destinationsById.value.get(Number(routeItem.destinationId))?.name || 'Свободный маршрут'
}

function destinationLink(routeItem) {
  if (!routeItem.destinationId) return null
  return { name: 'destination-details', params: { id: routeItem.destinationId } }
}

function formatDate(value) {
  return new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(value))
}

onMounted(async () => {
  await loadDestinations()
  await Promise.all([loadRoutes(true), loadNotes(true), loadFavorites(true)])
})
</script>

<template>
  <div id="dashboardPage">
    <section class="page-header">
      <div class="container">
        <div class="page-header-card">
          <h1 class="section-title-sm mb-2">Личный кабинет путешественника</h1>
          <p>Здесь собраны профиль пользователя, сохранённые маршруты, путевые заметки и избранные направления.</p>
        </div>
      </div>
    </section>

    <section class="pb-5">
      <div class="container">
        <div class="dashboard-profile-card mb-4">
          <div class="row g-4 align-items-center">
            <div class="col-lg-8">
              <div class="d-flex align-items-center gap-3 mb-3">
                <div class="profile-avatar">{{ profileAvatar }}</div>
                <div>
                  <h2 class="section-title-sm mb-1">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</h2>
                  <p class="text-secondary mb-0">{{ currentUser?.email }}</p>
                </div>
              </div>
              <div class="card-meta">
                <span class="badge badge-soft">Тип отдыха: <span>{{ preferenceLabel }}</span></span>
                <span class="badge badge-soft">Активный профиль путешественника</span>
              </div>
            </div>
            <div class="col-lg-4 text-lg-end">
              <div class="d-flex flex-wrap justify-content-lg-end gap-2">
                <button class="btn btn-outline-danger" type="button" @click="handleLogout">Выйти</button>
                <button class="btn btn-primary" type="button" @click="openProfileModal">Редактировать профиль</button>
              </div>
            </div>
          </div>
        </div>

        <div class="stats-grid mb-4">
          <article class="dashboard-stat-card dashboard-card">
            <div class="metric-value">{{ routes.length }}</div>
            <p class="metric-label">сохранённых маршрутов</p>
          </article>
          <article class="dashboard-stat-card dashboard-card">
            <div class="metric-value">{{ notes.length }}</div>
            <p class="metric-label">путевых заметок</p>
          </article>
          <article class="dashboard-stat-card dashboard-card">
            <div class="metric-value">{{ favoriteDestinations.length }}</div>
            <p class="metric-label">избранных направлений</p>
          </article>
        </div>

        <ul class="nav nav-pills mb-4 gap-2" role="tablist">
          <li class="nav-item">
            <button
              class="nav-link"
              :class="{ active: activeTab === 'routes' }"
              type="button"
              @click="activeTab = 'routes'"
            >
              Мои маршруты
            </button>
          </li>
          <li class="nav-item">
            <button
              class="nav-link"
              :class="{ active: activeTab === 'notes' }"
              type="button"
              @click="activeTab = 'notes'"
            >
              Путевые заметки
            </button>
          </li>
          <li class="nav-item">
            <button
              class="nav-link"
              :class="{ active: activeTab === 'favorites' }"
              type="button"
              @click="activeTab = 'favorites'"
            >
              Избранные направления
            </button>
          </li>
        </ul>

        <div class="tab-content">
          <div v-show="activeTab === 'routes'">
            <div class="dashboard-card mb-4">
              <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div>
                  <h2 class="h3 mb-1">Мои маршруты</h2>
                  <p class="text-secondary mb-0">Создавайте маршруты, связывайте их с направлениями и открывайте детальные страницы.</p>
                </div>
                <button class="btn btn-primary" type="button" @click="openRouteModal">Добавить маршрут</button>
              </div>
              <div v-if="routes.length" class="row g-4">
                <div v-for="route in routes" :key="route.id" class="col-lg-6">
                  <article class="route-card">
                    <div class="d-flex justify-content-between align-items-start gap-3">
                      <div>
                        <h3 class="h5 mb-2">{{ route.name }}</h3>
                        <p class="text-secondary mb-0">{{ route.description }}</p>
                      </div>
                      <span class="badge text-bg-light">{{ route.duration }}</span>
                    </div>
                    <div class="card-meta">
                      <span class="badge badge-budget">{{ labelMaps.budget[route.budget] || route.budget }}</span>
                      <span class="badge badge-soft">{{ destinationName(route) }}</span>
                    </div>
                    <div class="d-flex flex-wrap gap-2">
                      <RouterLink
                        v-if="destinationLink(route)"
                        class="btn btn-sm btn-primary"
                        :to="destinationLink(route)"
                      >
                        Открыть
                      </RouterLink>
                      <RouterLink v-else class="btn btn-sm btn-primary" to="/destinations">Выбрать направление</RouterLink>
                      <button type="button" class="btn btn-sm btn-outline-danger" @click="deleteRoute(route.id)">Удалить</button>
                    </div>
                  </article>
                </div>
              </div>
              <div v-else class="empty-state">
                <i class="bi bi-map" />
                <h3 class="h4">Маршрутов пока нет</h3>
                <p class="text-secondary mb-0">Добавьте первый маршрут через модальное окно и свяжите его с направлением.</p>
              </div>
            </div>
          </div>

          <div v-show="activeTab === 'notes'">
            <div class="dashboard-card mb-4">
              <div class="row g-4">
                <div class="col-lg-4">
                  <h2 class="h3 mb-3">{{ noteForm.id ? 'Редактировать заметку' : 'Добавить заметку' }}</h2>
                  <form @submit.prevent="submitNote">
                    <div class="mb-3">
                      <label class="form-label" for="noteTitle">Заголовок</label>
                      <input id="noteTitle" v-model="noteForm.title" class="form-control" type="text" placeholder="Например: Идеи по транспорту" />
                    </div>
                    <div class="mb-3">
                      <label class="form-label" for="noteText">Текст заметки</label>
                      <textarea id="noteText" v-model="noteForm.text" class="form-control" placeholder="Краткий план, адреса, список дел" />
                    </div>
                    <button class="btn btn-primary w-100" type="submit">{{ noteForm.id ? 'Сохранить изменения' : 'Добавить заметку' }}</button>
                  </form>
                </div>
                <div class="col-lg-8">
                  <h2 class="h3 mb-3">Список заметок</h2>
                  <div v-if="notes.length" class="row g-4">
                    <div v-for="note in notes" :key="note.id" class="col-lg-6">
                      <article class="note-card">
                        <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
                          <div>
                            <h3 class="h5 mb-1">{{ note.title }}</h3>
                            <p class="text-secondary mb-0">{{ note.author || 'Пользователь' }} • {{ formatDate(note.date) }}</p>
                          </div>
                        </div>
                        <p class="mb-3">{{ note.text }}</p>
                        <div class="d-flex flex-wrap gap-2">
                          <button type="button" class="btn btn-sm btn-outline-primary" @click="editNote(note)">Редактировать</button>
                          <button type="button" class="btn btn-sm btn-outline-danger" @click="deleteNote(note.id)">Удалить</button>
                        </div>
                      </article>
                    </div>
                  </div>
                  <div v-else class="empty-state">
                    <i class="bi bi-journal-text" />
                    <h3 class="h4">Заметок пока нет</h3>
                    <p class="text-secondary mb-0">Создайте первую заметку, чтобы фиксировать идеи, адреса и задачи по поездке.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-show="activeTab === 'favorites'">
            <div class="dashboard-card">
              <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div>
                  <h2 class="h3 mb-1">Избранные направления</h2>
                  <p class="text-secondary mb-0">Список формируется из каталога направлений и детальных страниц.</p>
                </div>
                <RouterLink class="btn btn-outline-primary" to="/destinations">Перейти в каталог</RouterLink>
              </div>
              <div v-if="favoriteDestinations.length" class="row g-4">
                <div v-for="destination in favoriteDestinations" :key="destination.id" class="col-md-6 col-xl-4">
                  <article class="favorite-card">
                    <img :src="destination.image" :alt="destination.name" class="favorite-image" />
                    <div class="card-meta mt-0">
                      <span class="badge" :class="destination.type === 'city' ? 'badge-city' : 'badge-nature'">{{ labelMaps.type[destination.type] }}</span>
                      <span class="badge badge-budget">{{ labelMaps.budget[destination.budget] }}</span>
                    </div>
                    <h3 class="h5">{{ destination.name }}</h3>
                    <p class="text-secondary">{{ destination.shortDescription }}</p>
                    <div class="d-flex flex-wrap gap-2">
                      <RouterLink class="btn btn-sm btn-primary" :to="{ name: 'destination-details', params: { id: destination.id } }">Подробнее</RouterLink>
                      <button type="button" class="btn btn-sm btn-outline-danger" @click="deleteFavorite(destination.id)">Удалить</button>
                    </div>
                  </article>
                </div>
              </div>
              <div v-else class="empty-state">
                <i class="bi bi-bookmark-heart" />
                <h3 class="h4">Нет избранных направлений</h3>
                <p class="text-secondary mb-0">Сохраните направление в каталоге или на странице деталей, чтобы оно появилось здесь.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div v-if="isProfileOpen" class="modal-backdrop-custom" @click.self="isProfileOpen = false">
      <div class="modal-dialog-custom">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="h5 mb-0">Редактировать профиль</h2>
          <button type="button" class="btn-close" aria-label="Закрыть" @click="isProfileOpen = false" />
        </div>
        <form @submit.prevent="saveProfile">
          <div class="mb-3">
            <label class="form-label" for="profileFirstName">Имя</label>
            <input id="profileFirstName" v-model="profileForm.firstName" class="form-control" type="text" />
          </div>
          <div class="mb-3">
            <label class="form-label" for="profileLastName">Фамилия</label>
            <input id="profileLastName" v-model="profileForm.lastName" class="form-control" type="text" />
          </div>
          <div class="mb-3">
            <label class="form-label" for="profilePreferenceSelect">Тип отдыха</label>
            <select id="profilePreferenceSelect" v-model="profileForm.preference" class="form-select">
              <option value="city">Город</option>
              <option value="nature">Природа</option>
              <option value="mixed">Смешанный</option>
            </select>
          </div>
          <button class="btn btn-primary w-100" type="submit">Сохранить изменения</button>
        </form>
      </div>
    </div>

    <div v-if="isRouteOpen" class="modal-backdrop-custom" @click.self="isRouteOpen = false">
      <div class="modal-dialog-custom">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="h5 mb-0">Добавить маршрут</h2>
          <button type="button" class="btn-close" aria-label="Закрыть" @click="isRouteOpen = false" />
        </div>
        <form @submit.prevent="submitRoute">
          <div class="mb-3">
            <label class="form-label" for="routeName">Название маршрута</label>
            <input id="routeName" v-model="routeForm.name" class="form-control" type="text" placeholder="Летний маршрут по Стамбулу" />
          </div>
          <div class="mb-3">
            <label class="form-label" for="routeDuration">Длительность</label>
            <input id="routeDuration" v-model="routeForm.duration" class="form-control" type="text" placeholder="5 дней" />
          </div>
          <div class="mb-3">
            <label class="form-label" for="routeBudget">Бюджет</label>
            <select id="routeBudget" v-model="routeForm.budget" class="form-select">
              <option value="">Выберите бюджет</option>
              <option value="low">Низкий</option>
              <option value="medium">Средний</option>
              <option value="high">Высокий</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label" for="routeDestination">Связанное направление</label>
            <select id="routeDestination" v-model="routeForm.destinationId" class="form-select">
              <option value="">Выберите направление</option>
              <option v-for="dest in destinations" :key="dest.id" :value="dest.id">{{ dest.name }}</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label" for="routeDescription">Краткое описание</label>
            <textarea id="routeDescription" v-model="routeForm.description" class="form-control" placeholder="Что хотите успеть за эту поездку" />
          </div>
          <button class="btn btn-primary w-100" type="submit">Сохранить маршрут</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 1rem;
}
.modal-dialog-custom {
  background: var(--tp-surface, #fff);
  color: var(--tp-text, #0f172a);
  border-radius: var(--tp-radius-md, 1rem);
  padding: 1.5rem;
  width: min(540px, 100%);
  box-shadow: var(--tp-shadow, 0 30px 60px rgba(15, 23, 42, 0.25));
}
</style>
