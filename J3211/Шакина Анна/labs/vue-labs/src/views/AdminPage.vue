<template>
  <base-layout>
    <section class="events-explorer py-5">
      <div class="container pt-4 pt-lg-5">
        <div class="events-shell">
          <h1 class="events-title mb-4">Панель администратора</h1>

          <!-- МЕРОПРИЯТИЯ -->
          <section class="dashboard-panel-section" id="adminEventsSection">
            <h2 class="events-title h3 mb-3">Все мероприятия</h2>
            <div class="row g-4 mb-4">
              <event-card v-for="event in events" :key="event.id" :event="event" />
            </div>

            <!-- Форма добавления мероприятия -->
            <article class="dashboard-panel">
              <div class="dashboard-panel-head">
                <div>
                  <h3 class="dashboard-panel-title">Добавить мероприятие</h3>
                  <p class="dashboard-panel-text mb-0">Заполните данные нового мероприятия.</p>
                </div>
              </div>
              <form class="row g-3" @submit.prevent="submitEvent">
                <div class="col-12 col-lg-6">
                  <label class="form-label filter-label">Название</label>
                  <input v-model="eventForm.title" class="form-control search-input" type="text" placeholder="Например: Турнир по шахматам">
                </div>
                <div class="col-12 col-lg-6">
                  <label class="form-label filter-label">Дата (ДД.ММ.ГГГГ)</label>
                  <input v-model="eventForm.date" class="form-control search-input" type="text" placeholder="25.12.2025">
                </div>
                <div class="col-12">
                  <label class="form-label filter-label">Описание</label>
                  <textarea v-model="eventForm.description" class="form-control search-input dashboard-textarea" placeholder="Коротко опишите мероприятие"></textarea>
                </div>
                <div class="col-12 col-lg-6">
                  <label class="form-label filter-label">Фото (URL)</label>
                  <input v-model="eventForm.image" class="form-control search-input" type="text" placeholder="img/carousel1.webp">
                </div>
                <div class="col-12 col-md-6 col-lg-3">
                  <label class="form-label filter-label">Категория</label>
                  <select v-model="eventForm.goal" class="form-control search-input">
                    <option value="fun">Развлекательные</option>
                    <option value="sport">Спортивные</option>
                    <option value="study">Учебные</option>
                    <option value="ceremony">Торжественные</option>
                  </select>
                </div>
                <div class="col-12 col-md-6 col-lg-3">
                  <label class="form-label filter-label">Место</label>
                  <select v-model="eventForm.place" class="form-control search-input">
                    <option value="assembly">Актовый зал</option>
                    <option value="yard">Школьный двор</option>
                    <option value="classroom">Школьный класс</option>
                    <option value="outside">Вне школы</option>
                    <option value="stadium">Стадион</option>
                    <option value="gym1">Спортивный зал №1</option>
                    <option value="gym2">Спортивный зал №2</option>
                  </select>
                </div>
                <div class="col-12 col-md-6 col-lg-3">
                  <label class="form-label filter-label">Для кого</label>
                  <input v-model="eventForm.audience" class="form-control search-input" type="text" placeholder="5–11 классы">
                </div>
                <div class="col-12 col-md-6 col-lg-3">
                  <label class="form-label filter-label">Лимит мест</label>
                  <input v-model.number="eventForm.capacity" class="form-control search-input" type="number" min="1">
                </div>
                <div class="col-12 col-lg-6">
                  <label class="form-label filter-label">Ответственный учитель</label>
                  <select v-model="eventForm.responsibleTeacherId" class="form-control search-input">
                    <option value="">Выберите учителя</option>
                    <option v-for="t in teachers" :key="t.id" :value="t.id">
                      {{ t.firstName }} {{ t.lastName }}
                    </option>
                  </select>
                </div>
                <div class="col-12 d-flex align-items-end">
                  <button type="submit" class="site-button">Добавить мероприятие</button>
                </div>
                <div class="col-12">
                  <p v-if="eventMsg.text" :class="['auth-form-msg small mb-0', eventMsg.ok ? 'auth-form-msg--success' : 'auth-form-msg--error']">
                    {{ eventMsg.text }}
                  </p>
                </div>
              </form>
            </article>
          </section>

          <!-- УЧИТЕЛЯ -->
          <section class="dashboard-panel-section mt-4" id="teachersSection">
            <h2 class="events-title h3 mb-3">Управление учителями</h2>

            <article class="dashboard-panel mb-4">
              <h3 class="dashboard-panel-title mb-3">Список учителей</h3>
              <div class="dashboard-list">
                <div v-for="t in teachers" :key="t.id" class="dashboard-list-row">
                  <div>
                    <div class="dashboard-list-title">{{ t.firstName }} {{ t.lastName }}</div>
                    <div class="dashboard-list-subtitle">{{ t.email }}</div>
                    <div class="dashboard-list-subtitle">Пароль: {{ t.passwordText || 'не указан' }}</div>
                  </div>
                  <div class="dashboard-row-actions">
                    <span class="event-meta-pill">Мероприятий: {{ events.filter(e => String(e.responsibleTeacherId) === String(t.id)).length }}</span>
                    <button class="subtle-button dashboard-action-button" @click="editTeacher(t)">Редактировать</button>
                    <button class="subtle-button dashboard-action-button" @click="deleteTeacher(t.id)">Удалить</button>
                  </div>
                </div>
                <div v-if="!teachers.length" class="profile-state-card mb-0">
                  <p class="events-empty-text mb-0">Список учителей пуст.</p>
                </div>
              </div>
            </article>

            <article class="dashboard-panel">
              <h3 class="dashboard-panel-title mb-1">{{ teacherForm.editingId ? 'Редактировать учителя' : 'Добавить учителя' }}</h3>
              <p class="dashboard-panel-text mb-3">Заполните данные учителя.</p>
              <form class="row g-3" @submit.prevent="submitTeacher">
                <div class="col-12 col-md-6">
                  <label class="form-label filter-label">Имя</label>
                  <input v-model="teacherForm.firstName" class="form-control search-input" type="text" placeholder="Имя">
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label filter-label">Фамилия</label>
                  <input v-model="teacherForm.lastName" class="form-control search-input" type="text" placeholder="Фамилия">
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label filter-label">Почта</label>
                  <input v-model="teacherForm.email" class="form-control search-input" type="email" placeholder="teacher@example.com">
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label filter-label">Пароль</label>
                  <input v-model="teacherForm.password" class="form-control search-input" type="text" placeholder="Оставьте пустым для автогенерации">
                </div>
                <div class="col-12 d-flex flex-wrap gap-2">
                  <button type="submit" class="site-button">{{ teacherForm.editingId ? 'Сохранить' : 'Добавить учителя' }}</button>
                  <button type="button" class="subtle-button" @click="resetTeacherForm">Очистить</button>
                </div>
                <div class="col-12">
                  <p v-if="teacherMsg.text" :class="['auth-form-msg small mb-0', teacherMsg.ok ? 'auth-form-msg--success' : 'auth-form-msg--error']">
                    {{ teacherMsg.text }}
                  </p>
                </div>
              </form>
            </article>
          </section>

          <!-- УЧЕНИКИ -->
          <section class="dashboard-panel-section mt-4" id="studentsSection">
            <h2 class="events-title h3 mb-3">Список учеников</h2>

            <div class="row g-3 mb-3">
              <div class="col-12 col-lg-5">
                <input v-model="studentSearch" class="form-control search-input" type="text" placeholder="Поиск по имени...">
              </div>
            </div>

            <p class="events-counter mb-2">Найдено учеников: {{ filteredStudents.length }}</p>

            <article class="dashboard-panel mb-4">
              <div class="dashboard-list">
                <div v-for="s in filteredStudents" :key="s.id" class="dashboard-list-row">
                  <div>
                    <div class="dashboard-list-title">{{ s.firstName }} {{ s.lastName }}</div>
                    <div class="dashboard-list-subtitle">{{ getClassLabel(s) }}</div>
                    <div class="dashboard-list-subtitle">Пароль: {{ s.passwordText || 'не указан' }}</div>
                  </div>
                  <div class="dashboard-row-actions">
                    <span class="event-meta-pill">{{ s.email }}</span>
                    <button class="subtle-button dashboard-action-button" @click="editStudent(s)">Редактировать</button>
                    <button class="subtle-button dashboard-action-button" @click="deleteStudent(s.id)">Удалить</button>
                  </div>
                </div>
                <div v-if="!filteredStudents.length" class="profile-state-card mb-0">
                  <p class="events-empty-text mb-0">Ученики не найдены.</p>
                </div>
              </div>
            </article>

            <article class="dashboard-panel">
              <h3 class="dashboard-panel-title mb-1">{{ studentForm.editingId ? 'Редактировать ученика' : 'Добавить ученика' }}</h3>
              <form class="row g-3" @submit.prevent="submitStudent">
                <div class="col-12 col-md-6">
                  <label class="form-label filter-label">Имя</label>
                  <input v-model="studentForm.firstName" class="form-control search-input" type="text" placeholder="Имя">
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label filter-label">Фамилия</label>
                  <input v-model="studentForm.lastName" class="form-control search-input" type="text" placeholder="Фамилия">
                </div>
                <div class="col-12 col-md-6">
                  <label class="form-label filter-label">Почта</label>
                  <input v-model="studentForm.email" class="form-control search-input" type="email" placeholder="student@example.com">
                </div>
                <div class="col-12 col-md-6 d-flex align-items-end">
                  <div class="form-check small mb-3">
                    <input v-model="studentForm.isExternal" class="form-check-input" type="checkbox" id="isExternal">
                    <label class="form-check-label" for="isExternal">Не является учеником школы</label>
                  </div>
                </div>
                <template v-if="!studentForm.isExternal">
                  <div class="col-12 col-sm-6">
                    <label class="form-label filter-label">Класс</label>
                    <input v-model.number="studentForm.studentClass" class="form-control search-input" type="number" min="1" max="11" placeholder="9">
                  </div>
                  <div class="col-12 col-sm-6">
                    <label class="form-label filter-label">Буква</label>
                    <input v-model="studentForm.studentLetter" class="form-control search-input" type="text" maxlength="1" placeholder="А">
                  </div>
                </template>
                <div class="col-12 d-flex flex-wrap gap-2">
                  <button type="submit" class="site-button">{{ studentForm.editingId ? 'Сохранить' : 'Добавить ученика' }}</button>
                  <button type="button" class="subtle-button" @click="resetStudentForm">Очистить</button>
                </div>
                <div class="col-12">
                  <p v-if="studentMsg.text" :class="['auth-form-msg small mb-0', studentMsg.ok ? 'auth-form-msg--success' : 'auth-form-msg--error']">
                    {{ studentMsg.text }}
                  </p>
                </div>
              </form>
            </article>
          </section>

        </div>
      </div>
    </section>
  </base-layout>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { eventsApi, usersApi, registrationsApi } from '@/api'
import BaseLayout from '@/layouts/BaseLayout.vue'
import EventCard from '@/components/EventCard.vue'

export default {
  name: 'AdminPage',
  components: { BaseLayout, EventCard },
  setup() {
    const users = ref([])
    const events = ref([])
    const registrations = ref([])
    const studentSearch = ref('')

    const teachers = computed(() => users.value.filter(u => u.role === 'teacher'))
    const students = computed(() => users.value.filter(u => u.role === 'student'))
    const filteredStudents = computed(() => {
      const q = studentSearch.value.toLowerCase()
      return students.value.filter(s =>
          !q || `${s.firstName} ${s.lastName} ${s.email}`.toLowerCase().includes(q)
      )
    })

    // --- Сообщения ---
    const eventMsg = ref({ text: '', ok: false })
    const teacherMsg = ref({ text: '', ok: false })
    const studentMsg = ref({ text: '', ok: false })

    function msg(target, text, ok) {
      target.value = { text, ok }
      setTimeout(() => { target.value = { text: '', ok: false } }, 4000)
    }

    // --- Формы ---
    const eventForm = ref({ title: '', description: '', date: '', image: 'img/carousel1.webp', goal: 'fun', place: 'assembly', audience: '5–11 классы', capacity: 30, responsibleTeacherId: '' })
    const teacherForm = ref({ editingId: '', firstName: '', lastName: '', email: '', password: '' })
    const studentForm = ref({ editingId: '', firstName: '', lastName: '', email: '', isExternal: false, studentClass: '', studentLetter: '' })

    // --- Утилиты ---
    function randPass() { return Math.random().toString(36).slice(2, 10) }

    function parseDate(raw) {
      const m = String(raw).match(/^(\d{2})\.(\d{2})\.(\d{4})$/)
      if (!m) return ''
      const d = new Date(m[3], m[2] - 1, m[1])
      if (isNaN(d) || d.getDate() !== +m[1]) return ''
      return `${m[3]}-${m[2]}-${m[1]}`
    }

    function getClassLabel(s) {
      if (s.isExternal) return 'Не является учеником школы'
      if (s.studentClass && s.studentLetter) return `${s.studentClass} ${s.studentLetter} класс`
      return 'Класс не указан'
    }

    // --- Загрузка ---
    async function loadAll() {
      const [ev, us, re] = await Promise.all([eventsApi.getAll(), usersApi.getAll(), registrationsApi.getAll()])
      events.value = ev.data.sort((a, b) => new Date(a.date) - new Date(b.date))
      users.value = us.data
      registrations.value = re.data
    }

    // --- Мероприятия ---
    async function submitEvent() {
      const { title, description, date: rawDate, image, goal, place, audience, capacity, responsibleTeacherId } = eventForm.value
      if (!title || !description || !rawDate || !responsibleTeacherId) {
        msg(eventMsg, 'Заполните все обязательные поля.', false); return
      }
      const date = parseDate(rawDate)
      if (!date) { msg(eventMsg, 'Дата должна быть в формате ДД.ММ.ГГГГ.', false); return }
      try {
        await eventsApi.create({ id: crypto.randomUUID(), title, description, date, image: image || 'img/carousel1.webp', goal, place, audience, capacity, responsibleTeacherId })
        msg(eventMsg, 'Мероприятие добавлено!', true)
        eventForm.value = { title: '', description: '', date: '', image: 'img/carousel1.webp', goal: 'fun', place: 'assembly', audience: '5–11 классы', capacity: 30, responsibleTeacherId: '' }
        await loadAll()
      } catch { msg(eventMsg, 'Не удалось сохранить мероприятие.', false) }
    }

    // --- Учителя ---
    function editTeacher(t) {
      teacherForm.value = { editingId: t.id, firstName: t.firstName, lastName: t.lastName, email: t.email, password: t.passwordText || '' }
    }

    function resetTeacherForm() {
      teacherForm.value = { editingId: '', firstName: '', lastName: '', email: '', password: '' }
    }

    async function submitTeacher() {
      const { editingId, firstName, lastName, email, password } = teacherForm.value
      if (!firstName || !lastName || !email) { msg(teacherMsg, 'Заполните имя, фамилию и почту.', false); return }
      const pass = password || randPass()
      try {
        if (editingId) {
          await usersApi.update(editingId, { firstName, lastName, email, role: 'teacher', passwordText: password || undefined })
          msg(teacherMsg, 'Данные учителя обновлены.', true)
        } else {
          await usersApi.create({ id: `teacher-${crypto.randomUUID()}`, firstName, lastName, email, password: pass, passwordText: pass, role: 'teacher' })
          msg(teacherMsg, `Учитель добавлен. Логин: ${email}, пароль: ${pass}`, true)
        }
        resetTeacherForm()
        await loadAll()
      } catch { msg(teacherMsg, 'Не удалось сохранить учителя.', false) }
    }

    async function deleteTeacher(id) {
      if (events.value.some(e => String(e.responsibleTeacherId) === String(id))) {
        msg(teacherMsg, 'Сначала переназначьте мероприятия этого учителя.', false); return
      }
      if (!confirm('Удалить учителя?')) return
      try { await usersApi.delete(id); await loadAll() }
      catch { msg(teacherMsg, 'Не удалось удалить учителя.', false) }
    }

    // --- Ученики ---
    function editStudent(s) {
      studentForm.value = { editingId: s.id, firstName: s.firstName, lastName: s.lastName, email: s.email, isExternal: s.isExternal, studentClass: s.studentClass || '', studentLetter: s.studentLetter || '' }
    }

    function resetStudentForm() {
      studentForm.value = { editingId: '', firstName: '', lastName: '', email: '', isExternal: false, studentClass: '', studentLetter: '' }
    }

    async function submitStudent() {
      const { editingId, firstName, lastName, email, isExternal, studentClass, studentLetter } = studentForm.value
      if (!firstName || !lastName || !email) { msg(studentMsg, 'Заполните имя, фамилию и почту.', false); return }
      try {
        const payload = { firstName, lastName, email, role: 'student', isExternal, studentClass: isExternal ? null : +studentClass, studentLetter: isExternal ? null : studentLetter.toUpperCase() }
        if (editingId) {
          await usersApi.update(editingId, payload)
          msg(studentMsg, 'Данные ученика сохранены.', true)
        } else {
          const pass = randPass()
          await usersApi.create({ id: `student-${crypto.randomUUID()}`, ...payload, password: pass, passwordText: pass })
          msg(studentMsg, `Ученик добавлен. Логин: ${email}`, true)
        }
        resetStudentForm()
        await loadAll()
      } catch { msg(studentMsg, 'Не удалось сохранить ученика.', false) }
    }

    async function deleteStudent(id) {
      if (!confirm('Удалить ученика?')) return
      try {
        const toDelete = registrations.value.filter(r => String(r.userId) === String(id))
        await Promise.all(toDelete.map(r => registrationsApi.delete(r.id)))
        await usersApi.delete(id)
        await loadAll()
      } catch { msg(studentMsg, 'Не удалось удалить ученика.', false) }
    }

    onMounted(loadAll)

    return {
      events, teachers, filteredStudents, studentSearch,
      eventForm, teacherForm, studentForm,
      eventMsg, teacherMsg, studentMsg,
      submitEvent, editTeacher, resetTeacherForm, submitTeacher, deleteTeacher,
      editStudent, resetStudentForm, submitStudent, deleteStudent, getClassLabel
    }
  }
}
</script>