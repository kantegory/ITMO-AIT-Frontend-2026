<template>
  <a href="#main-content" class="skip-link">Перейти к содержимому</a>

  <header class="profile-hero" aria-label="Профиль пользователя">
    <div class="d-flex align-items-center gap-4 flex-wrap">
      <div class="profile-avatar" aria-hidden="true">{{ initials }}</div>
      <div>
        <h1 class="serif mb-1" style="font-size:1.5rem;">{{ fullName }}</h1>
        <div class="d-flex gap-2 flex-wrap">
          <span class="tag"><i class="bi bi-geo-alt" style="font-size:.7rem;"></i> Москва</span>
          <span class="tag tag-green"><i class="bi bi-calendar" style="font-size:.7rem;"></i> С нами с 2023</span>
          <span class="tag tag-warm" aria-label="Уровень: Pro">🏆 Pro</span>
        </div>
      </div>
      <div class="ms-auto d-flex gap-2 flex-wrap">
        <button class="btn-ghost-custom" aria-label="Редактировать профиль">
          <i class="bi bi-pencil me-1"></i>Редактировать
        </button>
        <RouterLink to="/collab" class="btn-primary-custom">
          <i class="bi bi-people me-1"></i>Пригласить
        </RouterLink>
      </div>
    </div>
    <div class="row g-3 mt-3" role="list" aria-label="Статистика поездок">
      <div v-for="s in stats" :key="s.label" class="col-6 col-sm-3" role="listitem">
        <div class="stat-card">
          <div class="stat-card-num">{{ s.num }}</div>
          <div class="stat-card-label">{{ s.label }}</div>
        </div>
      </div>
    </div>
  </header>

  <main class="container-fluid py-4 px-3 px-md-4" id="main-content"
    style="max-width:1200px;position:relative;z-index:1;">
    <div class="row g-4">

      <div class="col-lg-8">
        <section class="mb-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h2 class="serif mb-0" style="font-size:1.1rem;">Сохранённые маршруты</h2>
            <RouterLink to="/search" style="font-size:.85rem;color:var(--accent);">Добавить +</RouterLink>
          </div>
          <div class="row g-3">
            <div v-for="r in savedRoutes" :key="r.id" class="col-sm-6 col-md-4">
              <RouterLink :to="`/destination/${r.id}`" class="dest-card"
                style="display:flex;flex-direction:column;text-decoration:none;">
                <div class="dest-card-img">
                  <img :src="r.photo" :alt="r.name" loading="lazy"
                    @error="e => e.target.style.display='none'" />
                  <div class="dest-card-overlay"></div>
                  <div style="position:absolute;bottom:10px;left:12px;z-index:1;">
                    <span style="font-size:.78rem;color:#fff;font-weight:600;">{{ r.name }}</span>
                  </div>
                </div>
                <div class="dest-card-body">
                  <div style="font-size:.78rem;color:var(--text-muted);">{{ r.date }} · {{ r.places }} мест</div>
                  <div class="d-flex gap-1 flex-wrap">
                    <span :class="`tag tag-${r.tagColor}`" style="font-size:.7rem;">{{ r.type }}</span>
                    <span class="tag" style="font-size:.7rem;">{{ r.days }}</span>
                  </div>
                </div>
              </RouterLink>
            </div>
          </div>
        </section>

        <section>
          <h2 class="serif mb-3" style="font-size:1.1rem;">Предстоящая поездка</h2>
          <div class="card p-3">
            <div class="d-flex align-items-center gap-3 flex-wrap">
              <div style="width:52px;height:52px;border-radius:12px;background:var(--accent-light);display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0;">🌊</div>
              <div>
                <div class="d-flex align-items-center gap-2 flex-wrap mb-1">
                  <strong>Мальдивы 2025</strong>
                  <span class="tag tag-warm" style="font-size:.72rem;">Через 23 дня</span>
                </div>
                <div style="font-size:.82rem;color:var(--text-muted);">15–25 мая 2025 · 5 участников</div>
              </div>
              <RouterLink to="/collab" class="btn-outline-custom ms-auto"
                style="font-size:.82rem;padding:.4rem 1rem;">
                <i class="bi bi-people me-1"></i>Открыть
              </RouterLink>
            </div>
            <div class="mt-3">
              <div class="d-flex justify-content-between mb-1"
                style="font-size:.8rem;color:var(--text-muted);">
                <span>Готовность поездки</span>
                <span style="color:var(--accent);font-weight:500;">68%</span>
              </div>
              <div class="progress-bar-wrap" style="height:6px;"
                role="progressbar" aria-valuenow="68" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar-fill" style="width:68%;height:6px;"></div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div class="col-lg-4">
        <section class="mb-4" aria-label="Путевые заметки">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h2 class="serif mb-0" style="font-size:1.1rem;">Путевые заметки</h2>
            <button class="btn-primary-custom" style="font-size:.78rem;padding:.35rem .75rem;"
              data-bs-toggle="modal" data-bs-target="#noteModal">
              <i class="bi bi-plus me-1"></i>Новая
            </button>
          </div>
          <div aria-live="polite">
            <div v-if="notesLoading" style="color:var(--text-muted);font-size:.85rem;">Загрузка...</div>
            <template v-else>
              <NoteItem v-for="note in notes" :key="note.id" :note="note" @delete="deleteNoteHandler" />
              <template v-if="!notes.length">
                <div class="note-item">
                  <div class="d-flex justify-content-between mb-1">
                    <strong style="font-size:.875rem;">🗼 Лучший вид на Эйфелеву башню</strong>
                    <span style="font-size:.75rem;color:var(--text-light);">12 июня</span>
                  </div>
                  <p style="font-size:.82rem;color:var(--text-muted);margin:0;">Трокадеро на рассвете — никаких толп, золотой свет...</p>
                </div>
                <div class="note-item" style="border-left-color:var(--warm);">
                  <div class="d-flex justify-content-between mb-1">
                    <strong style="font-size:.875rem;">🍜 Рамэн в Киото</strong>
                    <span style="font-size:.75rem;color:var(--text-light);">15 сент.</span>
                  </div>
                  <p style="font-size:.82rem;color:var(--text-muted);margin:0;">Ippudo на Каварамати — тонкоцу рамэн, топ...</p>
                </div>
                <div class="note-item">
                  <div class="d-flex justify-content-between mb-1">
                    <strong style="font-size:.875rem;">💡 Лайфхак: аэропорт CDG</strong>
                    <span style="font-size:.75rem;color:var(--text-light);">10 июня</span>
                  </div>
                  <p style="font-size:.82rem;color:var(--text-muted);margin:0;">Терминал 2E зал L — тихий, есть душевые...</p>
                </div>
              </template>
            </template>
          </div>
        </section>

        <section>
          <h2 class="serif mb-3" style="font-size:1.1rem;">Достижения</h2>
          <div class="card p-3">
            <div class="row g-2 text-center">
              <div class="col-4">
                <div style="font-size:1.6rem;">🌍</div>
                <div style="font-size:.72rem;color:var(--accent);margin-top:.2rem;">1-й континент</div>
              </div>
              <div class="col-4">
                <div style="font-size:1.6rem;">✈️</div>
                <div style="font-size:.72rem;color:var(--accent);margin-top:.2rem;">10 перелётов</div>
              </div>
              <div class="col-4">
                <div style="font-size:1.6rem;">🤝</div>
                <div style="font-size:.72rem;color:var(--accent);margin-top:.2rem;">Командный</div>
              </div>
              <div class="col-4">
                <div style="font-size:1.6rem;filter:grayscale(1);opacity:.4;">📷</div>
                <div style="font-size:.72rem;color:var(--text-light);margin-top:.2rem;">Фотограф</div>
              </div>
              <div class="col-4">
                <div style="font-size:1.6rem;filter:grayscale(1);opacity:.4;">🏅</div>
                <div style="font-size:.72rem;color:var(--text-light);margin-top:.2rem;">Первопроходец</div>
              </div>
              <div class="col-4">
                <div style="font-size:1.6rem;filter:grayscale(1);opacity:.4;">🔥</div>
                <div style="font-size:.72rem;color:var(--text-light);margin-top:.2rem;">Марафонец</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>

  <div class="modal fade" id="noteModal" tabindex="-1" aria-labelledby="noteModalTitle" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title serif" id="noteModalTitle">Новая заметка</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label" for="noteTitle">Заголовок</label>
            <input type="text" id="noteTitle" v-model="newNote.title"
              class="form-control" placeholder="Название заметки..." />
          </div>
          <div class="mb-3">
            <label class="form-label" for="noteDestination">Направление</label>
            <select id="noteDestination" v-model="newNote.dest" class="form-select">
              <option value="">Выберите направление...</option>
              <option>🗼 Париж</option>
              <option>🗾 Токио</option>
              <option>🌊 Мальдивы</option>
              <option>🏔 Патагония</option>
              <option>🏖 Бали</option>
              <option>🎈 Каппадокия</option>
            </select>
          </div>
          <div class="mb-2">
            <label class="form-label" for="noteText">Текст</label>
            <textarea id="noteText" v-model="newNote.text"
              class="form-control" rows="4" placeholder="Ваши впечатления, советы..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-ghost-custom" data-bs-dismiss="modal">Отмена</button>
          <button type="button" class="btn-primary-custom" :disabled="saveLoading" @click="saveNote">
            <span v-if="saveLoading" class="spinner-border spinner-border-sm me-1"></span>
            <i v-else class="bi bi-check2 me-1"></i>Сохранить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import NoteItem from '@/components/NoteItem.vue'

const { getNotes, createNote, deleteNote } = useApi()
const { getFullName, getInitials } = useAuth()
const { showToast } = useToast()

const fullName = computed(() => getFullName())
const initials = computed(() => getInitials())

const stats = [
  { num: 14, label: 'Поездок'  },
  { num: 32, label: 'Маршрута' },
  { num: 8,  label: 'Стран'    },
  { num: 47, label: 'Заметок'  },
]

const savedRoutes = [
  { id:'paris',     name:'Париж',     photo:'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=280&fit=crop&auto=format&q=80', date:'Июнь 2024',     places:12, type:'Город',   tagColor:'green', days:'7 дней'  },
  { id:'tokyo',     name:'Токио',     photo:'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=280&fit=crop&auto=format&q=80', date:'Сентябрь 2024', places:18, type:'Природа', tagColor:'warm',  days:'10 дней' },
  { id:'patagonia', name:'Патагония', photo:'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=280&fit=crop&auto=format&q=80', date:'Январь 2025',   places:8,  type:'Природа', tagColor:'green', days:'14 дней' },
]

const notes         = ref([])
const notesLoading  = ref(true)
const saveLoading   = ref(false)
const newNote       = ref({ title:'', text:'', dest:'' })

async function loadNotes() {
  notesLoading.value = true
  try { notes.value = await getNotes() }
  catch { notes.value = [] }
  finally { notesLoading.value = false }
}

async function saveNote() {
  if (!newNote.value.title.trim()) { showToast('Введите заголовок', 'error'); return }
  saveLoading.value = true
  try {
    await createNote(newNote.value)
    showToast('Заметка сохранена!')
    newNote.value = { title:'', text:'', dest:'' }
    window.bootstrap?.Modal.getInstance(document.getElementById('noteModal'))?.hide()
    await loadNotes()
  } catch {
    showToast('Не удалось сохранить заметку', 'error')
  } finally {
    saveLoading.value = false
  }
}

async function deleteNoteHandler(id) {
  try {
    await deleteNote(id)
    showToast('Заметка удалена', 'info')
    await loadNotes()
  } catch {
    showToast('Не удалось удалить', 'error')
  }
}

onMounted(loadNotes)
</script>
