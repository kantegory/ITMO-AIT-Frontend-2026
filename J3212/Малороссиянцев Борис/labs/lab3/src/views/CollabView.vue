<template>
  <a href="#main-content" class="skip-link">Перейти к содержимому</a>

  <!-- Hero шапка поездки -->
  <header class="collab-hero">
    <div class="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-3">
      <div>
        <p style="font-size:.8rem;color:var(--text-muted);margin-bottom:.4rem;">
          <RouterLink to="/dashboard" style="color:var(--accent);">← Мои поездки</RouterLink>
        </p>
        <h1 class="serif mb-2" style="font-size:1.7rem;">🌊 Мальдивы 2025</h1>
        <div class="d-flex gap-2 flex-wrap">
          <span class="tag tag-warm">15–25 мая 2025</span>
          <span class="tag tag-green">5 участников</span>
          <span class="tag">~280 000 ₽/чел.</span>
        </div>
      </div>
      <button class="btn-primary-custom" @click="copyLink">
        <i class="bi bi-share me-1"></i>Поделиться
      </button>
    </div>

    <!-- Участники -->
    <div class="d-flex gap-2 flex-wrap mb-3">
      <div v-for="m in members" :key="m.name" class="member-chip">
        <div class="member-dot" :style="`background:${m.color};`"></div>
        {{ m.name }}
      </div>
    </div>

    <!-- Прогресс -->
    <div style="max-width:480px;">
      <div class="d-flex justify-content-between mb-1" style="font-size:.8rem;">
        <span style="color:var(--text-muted);">Готовность поездки</span>
        <span style="color:var(--accent);font-weight:500;">{{ taskProgress }}%</span>
      </div>
      <div class="progress-bar-wrap" style="height:6px;"
        role="progressbar" :aria-valuenow="taskProgress" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar-fill" :style="`width:${taskProgress}%;height:6px;`"></div>
      </div>
    </div>
  </header>

  <main class="container-fluid py-4 px-3 px-md-4" id="main-content" style="max-width:1200px;position:relative;z-index:1;">
    <div class="row g-4">

      <!-- Левая колонка: чаты + задачи -->
      <div class="col-lg-8">

        <!-- Чат -->
        <section class="card p-4 mb-4">
          <h2 class="serif mb-3" style="font-size:1rem;">💬 Чат группы</h2>
          <div id="chatMessages" ref="chatEl"
            style="height:220px;overflow-y:auto;display:flex;flex-direction:column;gap:.5rem;margin-bottom:1rem;">
            <div v-for="msg in messages" :key="msg.id"
              class="d-flex flex-column gap-1"
              :style="msg.own ? 'align-items:flex-end' : 'align-items:flex-start'">
              <div style="font-size:.72rem;color:var(--text-light);">{{ msg.own ? 'Вы' : msg.author }} · {{ msg.time }}</div>
              <div :class="msg.own ? 'chat-msg chat-msg-out' : 'chat-msg'">{{ msg.text }}</div>
            </div>
          </div>
          <div class="d-flex gap-2">
            <textarea v-model="chatInput" class="form-control" rows="1"
              placeholder="Напишите сообщение..."
              @keydown.enter.exact.prevent="sendChat"
              style="resize:none;"></textarea>
            <button class="btn-primary-custom" style="flex-shrink:0;" @click="sendChat">
              <i class="bi bi-send"></i>
            </button>
          </div>
        </section>

        <!-- Задачи -->
        <section class="card p-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h2 class="serif mb-0" style="font-size:1rem;">✅ Чеклист задач</h2>
            <button class="btn-primary-custom" style="font-size:.82rem;padding:.35rem .75rem;"
              data-bs-toggle="modal" data-bs-target="#addTaskModal">
              + Задача
            </button>
          </div>

          <div style="font-size:.78rem;color:var(--text-muted);margin-bottom:.75rem;">
            {{ doneTasks }} / {{ tasks.length }} выполнено
          </div>

          <div class="d-flex flex-column gap-1">
            <label v-for="task in tasks" :key="task.id"
              style="display:flex;align-items:center;gap:.5rem;cursor:pointer;font-size:.875rem;padding:.25rem 0;">
              <input type="checkbox" class="task-checkbox" v-model="task.done" @change="saveTasks" />
              <span :style="task.done ? 'text-decoration:line-through;color:var(--text-light);' : ''">
                {{ task.text }}
              </span>
              <button @click="removeTask(task.id)" style="margin-left:auto;background:none;border:none;color:var(--text-light);cursor:pointer;padding:0;font-size:.9rem;" title="Удалить">
                <i class="bi bi-x"></i>
              </button>
            </label>
          </div>
        </section>
      </div>

      <!-- Правая колонка: таймлайн -->
      <div class="col-lg-4">
        <section class="card p-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h2 class="serif mb-0" style="font-size:1rem;">🗺 Маршрут</h2>
            <button class="btn-primary-custom" style="font-size:.82rem;padding:.35rem .75rem;"
              data-bs-toggle="modal" data-bs-target="#addStopModal">
              + Точка
            </button>
          </div>

          <div class="timeline" ref="timelineEl">
            <div v-for="stop in stops" :key="stop.id" class="timeline-item">
              <div class="timeline-dot-wrap">
                <div class="timeline-dot"></div>
                <div class="timeline-line"></div>
              </div>
              <div>
                <div style="font-size:.75rem;color:var(--text-light);">{{ formatDate(stop.date) }}</div>
                <strong style="font-size:.875rem;">📍 {{ stop.name }}</strong>
                <p v-if="stop.note" style="font-size:.8rem;color:var(--text-muted);margin:.2rem 0 0;">{{ stop.note }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>

  <!-- Модалка: добавить задачу -->
  <div class="modal fade" id="addTaskModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title serif">Новая задача</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <input v-model="newTaskText" type="text" class="form-control" placeholder="Название задачи" />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-ghost-custom" data-bs-dismiss="modal">Отмена</button>
          <button type="button" class="btn-primary-custom" @click="addTask">Добавить</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Модалка: добавить остановку -->
  <div class="modal fade" id="addStopModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title serif">Добавить точку маршрута</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Название *</label>
            <input v-model="newStop.name" type="text" class="form-control" placeholder="Например: Мале (прилёт)" />
          </div>
          <div class="mb-3">
            <label class="form-label">Дата</label>
            <input v-model="newStop.date" type="date" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Примечание</label>
            <input v-model="newStop.note" type="text" class="form-control" placeholder="Рейс, отель..." />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-ghost-custom" data-bs-dismiss="modal">Отмена</button>
          <button type="button" class="btn-primary-custom" @click="addStop">Добавить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()

const members = [
  { name: 'Алексей (вы)', color: '#22c55e' },
  { name: 'Мария',        color: '#22c55e' },
  { name: 'Дмитрий',      color: '#f59e0b' },
  { name: 'Виктория',     color: '#94a3b8' },
  { name: 'Николай',      color: '#94a3b8' },
]
const DEFAULT_TASKS = [
  { id:1, text:'Купить авиабилеты',       done:true  },
  { id:2, text:'Забронировать отель',     done:false },
  { id:3, text:'Организовать трансфер',   done:false },
  { id:4, text:'Оформить страховку',      done:true  },
  { id:5, text:'Записаться на дайвинг',   done:false },
]

function loadTasks() {
  try { return JSON.parse(localStorage.getItem('wl_collab_tasks') || 'null') || DEFAULT_TASKS }
  catch { return DEFAULT_TASKS }
}

const tasks      = ref(loadTasks())
const newTaskText = ref('')
const doneTasks  = computed(() => tasks.value.filter(t => t.done).length)
const taskProgress = computed(() =>
  tasks.value.length ? Math.round(doneTasks.value / tasks.value.length * 100) : 0
)

function saveTasks() {
  localStorage.setItem('wl_collab_tasks', JSON.stringify(tasks.value))
}

function addTask() {
  if (!newTaskText.value.trim()) { showToast('Введите название задачи', 'error'); return }
  tasks.value.push({ id: Date.now(), text: newTaskText.value.trim(), done: false })
  saveTasks()
  newTaskText.value = ''
  window.bootstrap?.Modal.getInstance(document.getElementById('addTaskModal'))?.hide()
  showToast('Задача добавлена!')
}

function removeTask(id) {
  tasks.value = tasks.value.filter(t => t.id !== id)
  saveTasks()
  showToast('Задача удалена', 'info')
}
const DEFAULT_STOPS = [
  { id:1, name:'Мале (прилёт)',   date:'2025-05-15', note:'Рейс SU270'          },
  { id:2, name:'Риф Мальдивы',   date:'2025-05-16', note:'Трансфер на катере'  },
  { id:3, name:'Мале (отлёт)',    date:'2025-05-25', note:''                    },
]

const stops   = ref(DEFAULT_STOPS)
const newStop = ref({ name: '', date: '', note: '' })

function formatDate(dateStr) {
  if (!dateStr) return 'Дата не указана'
  return new Date(dateStr).toLocaleDateString('ru', { day:'numeric', month:'short' })
}

function addStop() {
  if (!newStop.value.name.trim()) { showToast('Введите название точки', 'error'); return }
  stops.value.push({ id: Date.now(), ...newStop.value })
  newStop.value = { name: '', date: '', note: '' }
  window.bootstrap?.Modal.getInstance(document.getElementById('addStopModal'))?.hide()
  showToast('Точка добавлена!')
}
const chatEl    = ref(null)
const chatInput = ref('')
const messages  = ref([
  { id:1, own:false, author:'Мария',   time:'10:21', text:'Всем привет! Отель забронировала 🎉' },
  { id:2, own:false, author:'Дмитрий', time:'10:34', text:'Страховку тоже нужно сделать, кто занимается?' },
  { id:3, own:true,  author:'Вы',      time:'11:02', text:'Я разберусь со страховкой сегодня!' },
])

async function sendChat() {
  if (!chatInput.value.trim()) return
  const now = new Date()
  messages.value.push({
    id: Date.now(),
    own: true,
    author: 'Вы',
    time: `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`,
    text: chatInput.value.trim(),
  })
  chatInput.value = ''
  await nextTick()
  if (chatEl.value) chatEl.value.scrollTop = chatEl.value.scrollHeight
}

function copyLink() {
  navigator.clipboard?.writeText('wanderlust.app/trip/maldives-2025-x7k')
    .then(() => showToast('Ссылка скопирована!'))
}
</script>
