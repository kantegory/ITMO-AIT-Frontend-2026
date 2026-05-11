<template>
  <template v-if="!currentUser">
    <section class="panel">
      <span class="page-kicker">Личный кабинет</span>

      <h1 class="page-title">
        Нужно войти в аккаунт
      </h1>

      <p class="page-subtitle mb-4">
        Чтобы смотреть сохранённые маршруты и путевые заметки, сначала выполните вход.
      </p>

      <RouterLink class="btn btn-primary" to="/login">
        Перейти ко входу
      </RouterLink>
    </section>
  </template>

  <template v-else>
    <section class="page-intro mb-4">
      <div>
        <span class="page-kicker">Личный кабинет</span>

        <p class="text-muted mb-2">
          {{ profileGreeting }}
        </p>

        <h1 class="page-title">
          Ваши маршруты и заметки
        </h1>

        <p class="page-subtitle mb-0">
          Здесь хранятся сохранённые направления и личные заметки по поездкам.
        </p>
      </div>

      <div class="intro-badge-wrap">
        <div class="profile-stat compact-stat text-center">
          <h3 aria-live="polite">
            {{ savedRoutes.length }}
          </h3>

          <p class="mb-0 text-muted small">
            сохранено маршрутов
          </p>
        </div>
      </div>
    </section>

    <div class="row g-4 align-items-stretch">
      <div class="col-12 col-xl-7">
        <section class="panel h-100">
          <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
            <div>
              <h2 class="section-heading mb-1 icon-label">
                <span>Сохранённые маршруты</span>
              </h2>

              <p class="section-caption mb-0">
                Все направления, которые вы отметили для себя.
              </p>
            </div>

            <button
              class="btn subtle-action-btn"
              type="button"
              :disabled="savedRoutes.length === 0 || routesLoading"
              @click="handleClearRoutes"
            >
              Очистить
            </button>
          </div>

          <div v-if="routesLoading" class="text-muted">
            Загружаем маршруты...
          </div>

          <div v-else-if="routesError" class="alert alert-danger" role="alert">
            {{ routesError }}
          </div>

          <div v-else-if="savedRoutes.length === 0" class="empty-state">
            Пока нет сохранённых маршрутов. Перейдите в поиск и добавьте понравившееся направление.
          </div>

          <div v-else class="saved-routes-grid" aria-live="polite">
            <SavedRouteCard
              v-for="route in savedRoutes"
              :key="route.id"
              :route="route"
              @delete="handleDeleteRoute"
            />
          </div>
        </section>
      </div>

      <div class="col-12 col-xl-5">
        <section class="panel notes-panel h-100 d-flex flex-column">
          <div class="mb-4">
            <h2 class="section-heading mb-1 icon-label">
              <span>Путевые заметки</span>
            </h2>

            <p class="section-caption mb-0">
              Короткие идеи, список вещей и всё, что важно не забыть.
            </p>
          </div>

          <div v-if="notesError" class="alert alert-danger" role="alert">
            {{ notesError }}
          </div>

          <div v-if="notesMessage" class="alert alert-success" role="alert">
            {{ notesMessage }}
          </div>

          <label for="notes" class="form-label">
            Текст путевых заметок
          </label>

          <textarea
            id="notes"
            v-model="noteText"
            class="form-control mb-3 flex-grow-1"
            rows="8"
            placeholder="Напишите заметки..."
            aria-describedby="notesHelp"
          ></textarea>

          <button
            class="btn btn-primary align-self-start"
            type="button"
            :disabled="notesLoading"
            @click="handleSaveNote"
          >
            {{ notesLoading ? 'Сохраняем...' : 'Сохранить заметки' }}
          </button>

          <p id="notesHelp" class="text-muted small mt-3 mb-0">
            Заметки сохраняются через mock API JSON Server.
          </p>
        </section>
      </div>
    </div>
  </template>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import SavedRouteCard from '../components/SavedRouteCard.vue'
import { useAuth } from '../composables/useAuth'
import { useSavedRoutes } from '../composables/useSavedRoutes'
import { useNotes } from '../composables/useNotes'

const { currentUser } = useAuth()

const {
  savedRoutes,
  loading: routesLoading,
  error: routesError,
  loadSavedRoutes,
  deleteSavedRoute,
  clearSavedRoutes,
} = useSavedRoutes()

const {
  noteText,
  loading: notesLoading,
  error: notesError,
  loadNote,
  saveNote,
} = useNotes()

const notesMessage = ref('')

const profileGreeting = computed(() => {
  return `Здравствуйте, ${currentUser.value?.name || 'пользователь'}!`
})

async function handleDeleteRoute(routeId) {
  await deleteSavedRoute(routeId)
}

async function handleClearRoutes() {
  if (!currentUser.value) {
    return
  }

  await clearSavedRoutes(currentUser.value.id)
}

async function handleSaveNote() {
  if (!currentUser.value) {
    return
  }

  notesMessage.value = ''

  await saveNote(currentUser.value.id)

  notesMessage.value = 'Заметки сохранены.'
}

onMounted(async () => {
  if (!currentUser.value) {
    return
  }

  await Promise.all([
    loadSavedRoutes(currentUser.value.id),
    loadNote(currentUser.value.id),
  ])
})
</script>