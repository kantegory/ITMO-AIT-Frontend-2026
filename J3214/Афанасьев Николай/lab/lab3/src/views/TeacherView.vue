<script setup>
import { ref, onMounted } from 'vue'
import AppSidebar from '../components/AppSidebar.vue'
import { useApi }  from '../composables/useApi.js'
import { useAuth } from '../composables/useAuth.js'

const { get, post, patch, del } = useApi()
const { session } = useAuth()

const courses     = ref([])
const loading     = ref(true)
const showModal   = ref(false)
const saving      = ref(false)

const newTitle   = ref('')
const newSubject = ref('Программирование')
const newLevel   = ref('Начинающий')

onMounted(async () => {
  try {
    courses.value = await get('/courses', { authorId: session.value.userId })
  } catch {
    alert('Ошибка загрузки курсов. Убедитесь, что json-server запущен.')
  } finally {
    loading.value = false
  }
})

async function createCourse() {
  if (!newTitle.value.trim()) { alert('Введите название!'); return }
  saving.value = true
  try {
    const course = await post('/courses', {
      title:    newTitle.value.trim(),
      subject:  newSubject.value,
      level:    newLevel.value,
      authorId: session.value.userId,
      author:   `${session.value.firstName} ${session.value.lastName}`,
      status:   'draft',
      price:    0,
      lessons:  0,
      rating:   0,
      emoji:    '📚',
      thumbBg:  '#edeaf8',
    })
    courses.value.push(course)
    newTitle.value   = ''
    newSubject.value = 'Программирование'
    newLevel.value   = 'Начинающий'
    showModal.value  = false
  } catch {
    alert('Ошибка создания курса.')
  } finally {
    saving.value = false
  }
}

async function publishCourse(course) {
  try {
    await patch(`/courses/${course.id}`, { status: 'published' })
    course.status = 'published'
  } catch {
    alert('Ошибка публикации.')
  }
}

async function deleteCourse(course) {
  if (!confirm('Удалить курс?')) return
  try {
    await del(`/courses/${course.id}`)
    courses.value = courses.value.filter(c => c.id !== course.id)
  } catch {
    alert('Ошибка удаления.')
  }
}
</script>

<template>
  <div class="main-wrapper">
    <AppSidebar />

    <div class="main-content">
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 style="font-size:24px;font-weight:700;color:var(--text);">Кабинет преподавателя</h1>
          <p style="font-size:14px;color:var(--muted);margin:0;">Управление вашим образовательным контентом</p>
        </div>
        <button class="btn-purple" type="button" @click="showModal = true">+ Создать курс</button>
      </div>

      <!-- Статистика -->
      <div class="d-flex gap-3 mb-5">
        <div class="stat-card">
          <div class="stat-label">Активных студентов</div>
          <div class="stat-value">1 240</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Средний рейтинг</div>
          <div class="stat-value">4.9 ★</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Доход (мес)</div>
          <div class="stat-value">42 800 ₽</div>
        </div>
      </div>

      <div v-if="loading" style="color:var(--muted);">Загрузка…</div>
      <div v-else-if="courses.length === 0" style="color:var(--muted);font-size:14px;">
        У вас пока нет курсов. Создайте первый!
      </div>
      <div v-else style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;">
        <div v-for="course in courses" :key="course.id" class="course-card-teacher">
          <div class="d-flex justify-content-between mb-3">
            <div style="width:40px;height:40px;background:#f0eefb;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;">
              {{ course.emoji || '📚' }}
            </div>
            <span class="badge-pill"
              :style="course.status === 'published' ? 'background:#e3f9e5;color:#1f7a33' : 'background:#f5f4fb;color:#534AB7'">
              {{ course.status === 'published' ? 'Опубликован' : 'Черновик' }}
            </span>
          </div>
          <div style="font-weight:700;color:var(--text);margin-bottom:4px;">{{ course.title }}</div>
          <div style="font-size:12px;color:var(--muted);margin-bottom:15px;">{{ course.subject }} • {{ course.level }}</div>
          <div class="d-flex gap-2">
            <button v-if="course.status !== 'published'"
              class="btn-action flex-1"
              style="background:#e3f9e5;color:#1f7a33;"
              @click="publishCourse(course)">
              Опубликовать
            </button>
            <button class="btn-action flex-1"
              style="background:#fff1f0;color:#e24b4a;border:1px solid #ffccc7;"
              @click="deleteCourse(course)">
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Модалка создания курса -->
  <Teleport to="body">
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-box">
        <h2 style="font-size:20px;font-weight:700;margin-bottom:20px;">Новый курс</h2>

        <label style="font-size:13px;font-weight:600;margin-bottom:5px;display:block;">Название курса</label>
        <input v-model="newTitle" type="text" class="form-control-custom" placeholder="Например: JavaScript для начинающих">

        <label style="font-size:13px;font-weight:600;margin-bottom:5px;display:block;">Категория</label>
        <select v-model="newSubject" class="form-control-custom">
          <option value="Программирование">Программирование</option>
          <option value="Дизайн">Дизайн</option>
          <option value="Математика">Математика</option>
          <option value="ML / AI">ML / AI</option>
          <option value="Базы данных">Базы данных</option>
        </select>

        <label style="font-size:13px;font-weight:600;margin-bottom:5px;display:block;">Уровень сложности</label>
        <select v-model="newLevel" class="form-control-custom">
          <option value="Начинающий">Начинающий</option>
          <option value="Средний">Средний</option>
          <option value="Продвинутый">Продвинутый</option>
        </select>

        <div class="d-flex gap-2" style="margin-top:24px;">
          <button class="btn-action flex-1" style="background:#eee;color:#333;" @click="showModal = false">Отмена</button>
          <button class="btn-purple flex-1" :disabled="saving" @click="createCourse">
            {{ saving ? 'Создаём…' : 'Создать курс' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
