<template>
  <BaseLayout>
    <div v-if="currentUser">
      <div class="welcome-section">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-md-8">
              <h1>
                <svg class="icon"><use xlink:href="/sprite.svg#icon-person-circle"></use></svg>
                Добро пожаловать, {{ currentUser.name || 'путешественник' }}!
              </h1>
              <p class="lead mb-0">Ваше путешествие начинается здесь.</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Статистика -->
      <section class="mb-4">
        <h2 class="visually-hidden">Статистика</h2>
        <div class="row mb-4">
          <div class="col-md-4 mb-3 mb-md-0">
            <div class="stat-card d-flex align-items-center">
              <div class="stat-icon me-3">
                <svg class="icon"><use xlink:href="/sprite.svg#icon-journal-bookmark"></use></svg>
              </div>
              <div>
                <div class="stat-number">{{ notesCount }}</div>
                <p class="text-muted mb-0">Путевых заметок</p>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-3 mb-md-0">
            <div class="stat-card d-flex align-items-center">
              <div class="stat-icon me-3">
                <svg class="icon"><use xlink:href="/sprite.svg#icon-map"></use></svg>
              </div>
              <div>
                <div class="stat-number">{{ routesCount }}</div>
                <p class="text-muted mb-0">Сохранённых маршрутов</p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="stat-card d-flex align-items-center">
              <div class="stat-icon me-3">
                <svg class="icon"><use xlink:href="/sprite.svg#icon-airplane"></use></svg>
              </div>
              <div>
                <div class="stat-number">{{ countriesCount }}</div>
                <p class="text-muted mb-0">Стран посещено</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Вкладки -->
      <ul class="nav nav-tabs mb-4" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link" :class="{ active: activeTab === 'notes' }" @click="activeTab = 'notes'">
            <svg class="icon"><use xlink:href="/sprite.svg#icon-journal-bookmark"></use></svg>
            Путевые заметки
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" :class="{ active: activeTab === 'routes' }" @click="activeTab = 'routes'">
            <svg class="icon"><use xlink:href="/sprite.svg#icon-map"></use></svg>
            Сохранённые маршруты
          </button>
        </li>
      </ul>
      
      <!-- Заметки -->
      <div v-show="activeTab === 'notes'">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="h4 mb-0">
            <svg class="icon"><use xlink:href="/sprite.svg#icon-journal-bookmark"></use></svg>
            Мои заметки
          </h2>
          <button class="btn btn-success" @click="openAddModal">
            <svg class="icon"><use xlink:href="/sprite.svg#icon-plus"></use></svg>
            Новая заметка
          </button>
        </div>
        
        <div v-if="userNotesData.length === 0" class="empty-state">
          <svg class="icon"><use xlink:href="/sprite.svg#icon-journal-bookmark"></use></svg>
          <h3>У вас пока нет заметок</h3>
          <p class="text-muted">Создайте первую заметку о ваших путешествиях!</p>
        </div>
        
        <div v-else class="row g-4">
          <div v-for="note in userNotesData" :key="note.id" class="col-lg-4 col-md-6">
            <NoteCard :note="note" @edit="openEditModal(note)" @delete="deleteNote(note.id)" />
          </div>
        </div>
      </div>
      
      <!-- Маршруты -->
      <div v-show="activeTab === 'routes'">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="h4 mb-0">
            <svg class="icon"><use xlink:href="/sprite.svg#icon-map"></use></svg>
            Сохранённые маршруты
          </h2>
          <RouterLink to="/search" class="btn btn-success">
            <svg class="icon"><use xlink:href="/sprite.svg#icon-search"></use></svg>
            Найти маршруты
          </RouterLink>
        </div>
        
        <div v-if="userRoutesData.length === 0" class="empty-state">
          <svg class="icon"><use xlink:href="/sprite.svg#icon-map"></use></svg>
          <h3>У вас пока нет сохранённых маршрутов</h3>
          <p class="text-muted">Найдите интересные направления в поиске!</p>
        </div>
        
        <div v-else class="row g-4">
          <div v-for="route in userRoutesData" :key="route.id" class="col-lg-6">
            <RouteCard :route="route" @delete="deleteRoute(route.id)" />
          </div>
        </div>
      </div>
      
      <!-- Модалка: новая заметка -->
      <div v-if="showAddModal" class="modal-overlay" @click.self="closeAddModal">
        <div class="modal-container modal-lg">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">
              <svg class="icon"><use xlink:href="/sprite.svg#icon-journal-bookmark"></use></svg>
              Новая путевая заметка
            </h5>
            <button type="button" class="btn-close-custom" @click="closeAddModal">×</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="createNote">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Название/Место <span>*</span></label>
                  <input type="text" class="form-control" v-model="newNote.title" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Дата поездки</label>
                  <input type="text" class="form-control" v-model="newNote.date" placeholder="Например: Март 2026">
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Тип путешествия</label>
                  <select class="form-select" v-model="newNote.type">
                    <option value="Город">Город</option>
                    <option value="Природа">Природа</option>
                    <option value="Смешанный">Смешанный</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Страна <span>*</span></label>
                  <input type="text" class="form-control" v-model="newNote.country" required>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Заметка <span>*</span></label>
                <textarea class="form-control" rows="4" v-model="newNote.content" required></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Теги</label>
                <input type="text" class="form-control" v-model="newNote.tags" placeholder="#париж #франция">
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeAddModal">Отмена</button>
                <button type="submit" class="btn btn-success">Сохранить заметку</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <!-- Модалка: редактирование заметки -->
      <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
        <div class="modal-container modal-lg">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">
              <svg class="icon"><use xlink:href="/sprite.svg#icon-pencil"></use></svg>
              Редактировать заметку
            </h5>
            <button type="button" class="btn-close-custom" @click="closeEditModal">×</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateNote">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Название/Место <span>*</span></label>
                  <input type="text" class="form-control" v-model="editingNote.title" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Дата поездки</label>
                  <input type="text" class="form-control" v-model="editingNote.date">
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Тип путешествия</label>
                  <select class="form-select" v-model="editingNote.type">
                    <option value="Город">Город</option>
                    <option value="Природа">Природа</option>
                    <option value="Смешанный">Смешанный</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Страна <span>*</span></label>
                  <input type="text" class="form-control" v-model="editingNote.country" required>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Заметка <span>*</span></label>
                <textarea class="form-control" rows="4" v-model="editingNote.content" required></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Теги</label>
                <input type="text" class="form-control" v-model="editingNote.tags">
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeEditModal">Отмена</button>
                <button type="submit" class="btn btn-success">Сохранить изменения</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import BaseLayout from '@/components/layouts/BaseLayout.vue'
import { useAuth } from '@/composables/useAuth'
import { useNotesStore } from '@/stores/notes'
import { useRoutesStore } from '@/stores/routes'
import { useNotification } from '@/composables/useNotification'
import NoteCard from '@/components/notes/NoteCard.vue'
import RouteCard from '@/components/routes/RouteCard.vue'

const { currentUser } = useAuth()
const notesStore = useNotesStore()
const routesStore = useRoutesStore()
const { showNotification } = useNotification()

const activeTab = ref('notes')
const showAddModal = ref(false)
const showEditModal = ref(false)

const userNotesData = computed(() => {
  if (!currentUser.value) return []
  return notesStore.notes.filter(n => n.userId === currentUser.value.id)
})

const userRoutesData = computed(() => {
  if (!currentUser.value) return []
  return routesStore.routes.filter(r => r.userId === currentUser.value.id)
})

const notesCount = computed(() => userNotesData.value.length)
const routesCount = computed(() => userRoutesData.value.length)
const countriesCount = computed(() => {
  const countries = [...new Set(userNotesData.value.map(n => n.country).filter(Boolean))]
  return countries.length
})

const newNote = reactive({
  title: '',
  date: '',
  type: 'Смешанный',
  country: '',
  content: '',
  tags: ''
})

const editingNote = reactive({
  id: null,
  title: '',
  date: '',
  type: 'Смешанный',
  country: '',
  content: '',
  tags: ''
})

const openAddModal = () => {
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
  Object.assign(newNote, { title: '', date: '', type: 'Город', country: '', content: '', tags: '' })
}

const openEditModal = (note) => {
  editingNote.id = note.id
  editingNote.title = note.title
  editingNote.date = note.date || ''
  editingNote.type = note.type
  editingNote.country = note.country
  editingNote.content = note.content
  editingNote.tags = note.tags || ''
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  Object.assign(editingNote, {
    id: null,
    title: '',
    date: '',
    type: 'Смешанный',
    country: '',
    content: '',
    tags: ''
  })
}

const createNote = async () => {
  if (!newNote.title || !newNote.content || !newNote.country) {
    showNotification('Заполните обязательные поля', true)
    return
  }
  
  try {
    await notesStore.createNote({
      ...newNote,
      userId: currentUser.value.id,
      id: Date.now().toString()
    })
    showNotification('Заметка успешно сохранена')
    closeAddModal()
  } catch (error) {
    console.error('Ошибка при сохранении:', error)
    showNotification('Ошибка при сохранении заметки', true)
  }
}

const deleteNote = async (id) => {
  if (confirm('Удалить эту заметку?')) {
    try {
      await notesStore.deleteNote(id)
      showNotification('Заметка успешно удалена')
    } catch (error) {
      console.error('Ошибка при удалении:', error)
      showNotification('Ошибка при удалении заметки', true)
    }
  }
}

const updateNote = async () => {
  console.log('Обновляем заметку:', editingNote)
  
  if (!editingNote.title || !editingNote.content || !editingNote.country) {
    showNotification('Заполните обязательные поля', true)
    return
  }
  
  try {
    const originalNote = userNotesData.value.find(n => n.id === editingNote.id)
    if (!originalNote) {
      showNotification('Заметка не найдена', true)
      return
    }
    
    const updatedNoteData = {
      ...editingNote,
      userId: originalNote.userId
    }
    
    await notesStore.updateNote(editingNote.id, updatedNoteData)
    showNotification('Заметка успешно обновлена')
    closeEditModal()
  } catch (error) {
    console.error('Ошибка при обновлении:', error)
    showNotification('Ошибка при обновлении заметки: ' + (error.message || 'Неизвестная ошибка'), true)
  }
}

const deleteRoute = async (id) => {
  if (confirm('Удалить этот маршрут?')) {
    try {
      await routesStore.deleteRoute(id)
      showNotification('Маршрут успешно удалён')
    } catch (error) {
      console.error('Ошибка при удалении маршрута:', error)
      showNotification('Ошибка при удалении маршрута', true)
    }
  }
}

onMounted(async () => {
  await Promise.all([
    notesStore.loadNotes(),
    routesStore.loadRoutes()
  ])
})
</script>