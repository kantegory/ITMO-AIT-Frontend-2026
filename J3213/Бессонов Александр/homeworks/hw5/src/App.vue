<script setup>
import { computed, ref, watch } from 'vue'
import AppHeader from './components/AppHeader.vue'
import NoteForm from './components/NoteForm.vue'
import NoteList from './components/NoteList.vue'
import NoteStats from './components/NoteStats.vue'
import NoteToolbar from './components/NoteToolbar.vue'

const STORAGE_KEY = 't-pulse-vue-notes'
const THEME_KEY = 't-pulse-vue-theme'

const initialNotes = [
  {
    id: 'note-1',
    title: 'Подготовить макет страницы профиля',
    content:
      'Собрать состояния формы, проверить адаптивную версию и подготовить макет к обсуждению с командой.',
    category: 'Дизайн',
    completed: false,
    pinned: true,
    updatedAt: '2026-09-01T10:30:00.000Z',
  },
  {
    id: 'note-2',
    title: 'Идеи для следующего спринта',
    content:
      'Добавить быстрые фильтры, историю действий и отдельный вид для просроченных задач.',
    category: 'Идея',
    completed: false,
    pinned: false,
    updatedAt: '2026-08-31T14:20:00.000Z',
  },
  {
    id: 'note-3',
    title: 'Итоги встречи с командой',
    content:
      'Зафиксировали приоритеты релиза, распределили задачи и согласовали демонстрацию прототипа.',
    category: 'Встреча',
    completed: true,
    pinned: false,
    updatedAt: '2026-08-30T09:15:00.000Z',
  },
]

function loadNotes() {
  try {
    const savedNotes = localStorage.getItem(STORAGE_KEY)
    return savedNotes ? JSON.parse(savedNotes) : initialNotes
  } catch {
    return initialNotes
  }
}

function getInitialTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY)
  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const notes = ref(loadNotes())
const query = ref('')
const filter = ref('all')
const theme = ref(getInitialTheme())
const notification = ref('')
let notificationTimer

const filteredNotes = computed(() => {
  const normalizedQuery = query.value.trim().toLocaleLowerCase('ru-RU')

  return notes.value
    .filter((note) => {
      if (filter.value === 'active' && note.completed) return false
      if (filter.value === 'completed' && !note.completed) return false
      if (filter.value === 'pinned' && !note.pinned) return false

      if (!normalizedQuery) return true
      return [note.title, note.content, note.category]
        .join(' ')
        .toLocaleLowerCase('ru-RU')
        .includes(normalizedQuery)
    })
    .sort((first, second) => {
      if (first.pinned !== second.pinned) return Number(second.pinned) - Number(first.pinned)
      return new Date(second.updatedAt) - new Date(first.updatedAt)
    })
})

const stats = computed(() => {
  const completed = notes.value.filter((note) => note.completed).length
  const total = notes.value.length
  return {
    total,
    active: total - completed,
    completed,
    pinned: notes.value.filter((note) => note.pinned).length,
    progress: total ? Math.round((completed / total) * 100) : 0,
  }
})

function showNotification(message) {
  notification.value = message
  window.clearTimeout(notificationTimer)
  notificationTimer = window.setTimeout(() => {
    notification.value = ''
  }, 2600)
}

function createNote(note) {
  notes.value.unshift({
    ...note,
    id: `note-${Date.now().toString(36)}`,
    completed: false,
    pinned: false,
    updatedAt: new Date().toISOString(),
  })
  showNotification('Заметка добавлена')
}

function updateNote(updatedNote) {
  const note = notes.value.find((item) => item.id === updatedNote.id)
  if (!note) return
  Object.assign(note, updatedNote, { updatedAt: new Date().toISOString() })
  showNotification('Изменения сохранены')
}

function toggleCompleted(id) {
  const note = notes.value.find((item) => item.id === id)
  if (!note) return
  note.completed = !note.completed
  note.updatedAt = new Date().toISOString()
  showNotification(note.completed ? 'Заметка завершена' : 'Заметка возвращена в работу')
}

function togglePinned(id) {
  const note = notes.value.find((item) => item.id === id)
  if (!note) return
  note.pinned = !note.pinned
  showNotification(note.pinned ? 'Заметка закреплена' : 'Заметка откреплена')
}

function deleteNote(id) {
  notes.value = notes.value.filter((note) => note.id !== id)
  showNotification('Заметка удалена')
}

watch(
  notes,
  (value) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  },
  { deep: true },
)

watch(
  theme,
  (value) => {
    document.documentElement.dataset.theme = value
    localStorage.setItem(THEME_KEY, value)
  },
  { immediate: true },
)
</script>

<template>
  <div class="app-shell">
    <AppHeader
      :theme="theme"
      :total="stats.total"
      @toggle-theme="theme = theme === 'light' ? 'dark' : 'light'"
    />

    <main class="page-content">
      <section class="hero-section" aria-labelledby="pageTitle">
        <div>
          <p class="eyebrow">Рабочее пространство · Vue 3</p>
          <h1 id="pageTitle">Заметки команды</h1>
          <p class="hero-copy">
            Сохраняйте идеи, фиксируйте решения и держите важные мысли под рукой.
          </p>
        </div>
        <div class="hero-badge" aria-label="Технологии проекта">
          <span class="vue-mark" aria-hidden="true">V</span>
          <div><strong>Vue + Vite</strong><small>Компонентное SPA</small></div>
        </div>
      </section>

      <NoteStats :stats="stats" />

      <div class="workspace-grid">
        <aside class="workspace-sidebar" aria-label="Создание заметки">
          <NoteForm @create="createNote" />

          <section class="learning-card" aria-labelledby="learningTitle">
            <span class="learning-icon" aria-hidden="true">&lt;/&gt;</span>
            <div>
              <h2 id="learningTitle">Что демонстрирует проект</h2>
              <p>Компоненты, реактивность, props, emit, v-model, computed и localStorage.</p>
            </div>
          </section>
        </aside>

        <section class="notes-panel" aria-labelledby="notesTitle">
          <div class="section-heading">
            <div>
              <p class="section-kicker">Коллекция</p>
              <h2 id="notesTitle">Все заметки</h2>
            </div>
            <span class="result-count">{{ filteredNotes.length }} из {{ stats.total }}</span>
          </div>

          <NoteToolbar
            v-model="query"
            :filter="filter"
            :result-count="filteredNotes.length"
            @update:filter="filter = $event"
          />

          <NoteList
            :notes="filteredNotes"
            :has-query="Boolean(query.trim()) || filter !== 'all'"
            @toggle-completed="toggleCompleted"
            @toggle-pinned="togglePinned"
            @update="updateNote"
            @delete="deleteNote"
            @reset-filters="((query = ''), (filter = 'all'))"
          />
        </section>
      </div>
    </main>

    <footer class="app-footer">
      <span>Т-Пульс Notes</span>
      <span>Домашняя работа № 5 · Vue 3 + npm</span>
    </footer>

    <Transition name="toast">
      <div v-if="notification" class="app-toast" role="status" aria-live="polite">
        <span aria-hidden="true">✓</span>{{ notification }}
      </div>
    </Transition>
  </div>
</template>
