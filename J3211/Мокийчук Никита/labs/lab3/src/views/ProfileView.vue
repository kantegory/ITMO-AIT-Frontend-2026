<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { AppAPI } from '../api/api'
import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'
import { useFormatters } from '../composables/useFormatters'
import { useTheme } from '../composables/useTheme'
import ProfileCourseCard from '../components/ProfileCourseCard.vue'
import EmptyState from '../components/EmptyState.vue'

const router = useRouter()
const { currentUser, logout, updateUserData } = useAuth()
const { showToast } = useToast()
const { getInitials, formatMonthYear } = useFormatters()
const { isDark, toggleTheme } = useTheme()

if (!currentUser.value) {
  router.replace({ name: 'login' })
}

const myCourses = ref([])
const enrollments = ref([])
const loading = ref(false)
const activeTab = ref('tabCourses')

const settingsFirstName = ref('')
const settingsLastName = ref('')
const settingsEmail = ref('')
const settingsPhone = ref('')

const editName = ref('')
const editBio = ref('')

const startedCount = computed(() =>
  currentUser.value?.role === 'teacher' ? myCourses.value.length : enrollments.value.length
)
const completedCount = computed(() =>
  currentUser.value?.role === 'teacher'
    ? 0
    : enrollments.value.filter((item) => item.progress === 100).length
)
const lessonsCount = computed(() =>
  currentUser.value?.role === 'teacher'
    ? 0
    : enrollments.value.reduce((sum, item) => sum + (item.completedLessons?.length || 0), 0)
)

const initials = computed(() => getInitials(currentUser.value?.name || ''))
const profileMeta = computed(() => {
  const user = currentUser.value
  if (!user) return ''
  const role = user.role === 'teacher' ? 'Преподаватель' : 'Студент'
  return `${user.email} · ${role} с ${formatMonthYear(user.registeredAt)}`
})

const initSettingsForm = () => {
  const user = currentUser.value
  if (!user) return
  const parts = (user.name || '').trim().split(/\s+/)
  settingsFirstName.value = parts[0] || ''
  settingsLastName.value = parts.slice(1).join(' ') || ''
  settingsEmail.value = user.email || ''
  settingsPhone.value = user.phone || ''
  editName.value = user.name || ''
  editBio.value = user.bio || ''
}

const loadProfileCourses = async () => {
  const user = currentUser.value
  if (!user) return
  loading.value = true
  try {
    if (user.role === 'teacher') {
      const teacherCourses = await AppAPI.getTeacherCourses(user.id)
      myCourses.value = teacherCourses.map((course) => ({
        ...course,
        enrollment: { completedLessons: [], progress: 0 }
      }))
    } else {
      enrollments.value = await AppAPI.getEnrollmentsByUser(user.id)
      const allCourses = await AppAPI.getCourses()
      myCourses.value = enrollments.value
        .map((enrollment) => {
          const course = allCourses.find(
            (item) => Number(item.id) === Number(enrollment.courseId)
          )
          if (!course) return null
          return { ...course, enrollment }
        })
        .filter(Boolean)
    }
  } catch (err) {
    showToast('Не удалось загрузить данные профиля', 'danger')
  } finally {
    loading.value = false
  }
}

const handleEditProfile = async () => {
  if (!currentUser.value) return
  try {
    const updated = await AppAPI.updateUser(currentUser.value.id, {
      name: editName.value.trim() || currentUser.value.name,
      bio: editBio.value.trim()
    })
    updateUserData({ name: updated.name, bio: updated.bio })
    initSettingsForm()
    showToast('Профиль обновлен', 'success')
  } catch (err) {
    showToast('Не удалось сохранить профиль', 'danger')
  }
}

const handleLogout = () => {
  logout()
  showToast('Вы вышли из аккаунта', 'success')
  setTimeout(() => router.push({ name: 'login' }), 600)
}

onMounted(async () => {
  if (!currentUser.value) return
  initSettingsForm()
  await loadProfileCourses()
})
</script>

<template>
  <div class="container" v-if="currentUser">
    <header class="profile-header">
      <div class="row align-items-center">
        <div class="col-auto">
          <div class="profile-avatar" aria-hidden="true">{{ initials }}</div>
        </div>
        <div class="col">
          <h1 class="h4 fw-bold mb-1">{{ currentUser.name }}</h1>
          <p class="mb-0 opacity-80">{{ profileMeta }}</p>
        </div>
        <div class="col-auto">
          <button
            class="btn btn-light-custom btn-sm"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#editProfileModal"
          >
            <i class="bi bi-pencil me-1" aria-hidden="true"></i>Редактировать
          </button>
        </div>
      </div>
    </header>

    <div class="row g-4">
      <div class="col-lg-3">
        <nav class="sidebar" aria-label="Разделы личного кабинета">
          <a
            href="#"
            class="nav-link sidebar-link"
            :class="{ active: activeTab === 'tabCourses' }"
            @click.prevent="activeTab = 'tabCourses'"
          >
            <i class="bi bi-collection-play"></i> Мои курсы
          </a>
          <a
            href="#"
            class="nav-link sidebar-link"
            :class="{ active: activeTab === 'tabProgress' }"
            @click.prevent="activeTab = 'tabProgress'"
          >
            <i class="bi bi-graph-up"></i> Прогресс
          </a>
          <a
            href="#"
            class="nav-link sidebar-link"
            :class="{ active: activeTab === 'tabCertificates' }"
            @click.prevent="activeTab = 'tabCertificates'"
          >
            <svg class="svg-icon" aria-hidden="true">
              <use href="/sprite/sprite.svg#icon-award"></use>
            </svg>Сертификаты
          </a>
          <a
            href="#"
            class="nav-link sidebar-link"
            :class="{ active: activeTab === 'tabSettings' }"
            @click.prevent="activeTab = 'tabSettings'"
          >
            <i class="bi bi-gear"></i> Настройки
          </a>
          <a href="#" class="nav-link sidebar-link text-danger" @click.prevent="handleLogout">
            <i class="bi bi-box-arrow-right"></i> Выйти
          </a>
        </nav>
      </div>

      <div class="col-lg-9">
        <section v-show="activeTab === 'tabCourses'">
          <h2 class="h5 fw-bold mb-3">Мои курсы</h2>
          <div class="row g-3">
            <ProfileCourseCard
              v-for="course in myCourses"
              :key="course.id || course.enrollment?.id"
              :course="course"
            />
            <EmptyState
              v-if="!loading && myCourses.length === 0"
              text="Вы пока не записались ни на один курс"
            />
          </div>
          <div class="text-center mt-4">
            <router-link :to="{ name: 'catalog' }" class="btn btn-outline-primary">
              <svg class="svg-icon" aria-hidden="true">
                <use href="/sprite/sprite.svg#icon-plus-circle"></use>
              </svg>Добавить курс
            </router-link>
          </div>
        </section>

        <section v-show="activeTab === 'tabProgress'">
          <h2 class="h5 fw-bold mb-3">Мой прогресс</h2>
          <div class="row g-3 mb-4">
            <div class="col-6 col-md-3">
              <div class="card-custom p-3 text-center">
                <div class="fw-bold text-primary stat-value">{{ startedCount }}</div>
                <small class="text-muted">Курсов начато</small>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="card-custom p-3 text-center">
                <div class="fw-bold text-success stat-value">{{ completedCount }}</div>
                <small class="text-muted">Завершено</small>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="card-custom p-3 text-center">
                <div class="fw-bold text-primary stat-value">{{ lessonsCount }}</div>
                <small class="text-muted">Уроков пройдено</small>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="card-custom p-3 text-center">
                <div class="fw-bold text-primary stat-value">42ч</div>
                <small class="text-muted">Время обучения</small>
              </div>
            </div>
          </div>
          <h3 class="h6 fw-bold mb-3">Активность за неделю</h3>
          <div class="card-custom p-4">
            <div class="d-flex justify-content-between align-items-end chart-container">
              <div class="text-center flex-fill" v-for="(bar, idx) in [
                { day: 'Пн', h: 40 },
                { day: 'Вт', h: 80 },
                { day: 'Ср', h: 20 },
                { day: 'Чт', h: 100 },
                { day: 'Пт', h: 60 },
                { day: 'Сб', h: 120 },
                { day: 'Вс', h: 0 }
              ]" :key="idx">
                <div
                  v-if="bar.h > 0"
                  class="bg-primary rounded chart-bar"
                  :style="{ height: bar.h + 'px' }"
                ></div>
                <div v-else class="chart-bar-empty"></div>
                <small class="text-muted mt-1 d-block">{{ bar.day }}</small>
              </div>
            </div>
          </div>
        </section>

        <section v-show="activeTab === 'tabCertificates'">
          <h2 class="h5 fw-bold mb-3">Мои сертификаты</h2>
          <div class="row g-3">
            <div class="col-md-6">
              <article class="certificate-card">
                <i class="bi bi-award mb-3 d-block"></i>
                <h3 class="h6 fw-bold">Аналитика данных SQL</h3>
                <p class="text-muted mb-2 cert-meta">
                  <time datetime="2025-02-15">Выдан: 15 февраля 2025</time>
                </p>
                <p class="text-muted mb-3 cert-meta">ID: CERT-2025-00142</p>
                <div class="d-flex gap-2 justify-content-center">
                  <button
                    class="btn btn-primary btn-sm"
                    @click="showToast('Скачивание сертификата', 'info')"
                  >
                    <i class="bi bi-download me-1"></i>Скачать
                  </button>
                  <button
                    class="btn btn-outline-primary btn-sm"
                    @click="showToast('Ссылка скопирована!', 'success')"
                  >
                    <i class="bi bi-share me-1"></i>Поделиться
                  </button>
                </div>
              </article>
            </div>
            <div class="col-md-6">
              <article class="certificate-card cert-locked">
                <i class="bi bi-lock mb-3 d-block cert-lock-icon"></i>
                <h3 class="h6 fw-bold">Python для начинающих</h3>
                <p class="text-muted mb-0 cert-meta">
                  Завершите курс, чтобы получить сертификат
                </p>
                <div class="progress progress-custom mt-3 mx-auto cert-progress">
                  <div class="progress-bar" style="width: 65%"></div>
                </div>
                <small class="text-muted">65% пройдено</small>
              </article>
            </div>
          </div>
        </section>

        <section v-show="activeTab === 'tabSettings'">
          <h2 class="h5 fw-bold mb-3">Настройки</h2>

          <div class="card-custom p-4 mb-3">
            <h3 class="h6 fw-bold mb-3">Личные данные</h3>
            <form @submit.prevent="showToast('Данные сохранены', 'success')">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold form-label-sm" for="settingsFirstName">Имя</label>
                  <input
                    type="text"
                    class="form-control"
                    id="settingsFirstName"
                    v-model="settingsFirstName"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold form-label-sm" for="settingsLastName">Фамилия</label>
                  <input
                    type="text"
                    class="form-control"
                    id="settingsLastName"
                    v-model="settingsLastName"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold form-label-sm" for="settingsEmail">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="settingsEmail"
                    v-model="settingsEmail"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold form-label-sm" for="settingsPhone">Телефон</label>
                  <input
                    type="tel"
                    class="form-control"
                    id="settingsPhone"
                    v-model="settingsPhone"
                  />
                </div>
              </div>
              <button class="btn btn-primary mt-3" type="submit">Сохранить</button>
            </form>
          </div>

          <div class="card-custom p-4 mb-3">
            <h3 class="h6 fw-bold mb-3">Тема оформления</h3>
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                id="themeToggle"
                :checked="isDark"
                @change="toggleTheme"
              />
              <label class="form-check-label" for="themeToggle">Темная тема</label>
            </div>
          </div>
        </section>
      </div>
    </div>
    <div class="spacer-bottom"></div>
  </div>

  <div class="modal fade" id="editProfileModal" tabindex="-1" aria-modal="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title h5">Редактировать профиль</h2>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
        </div>
        <form @submit.prevent="handleEditProfile">
          <div class="modal-body">
            <div class="text-center mb-3">
              <div class="profile-avatar mx-auto mb-2" aria-hidden="true">{{ initials }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold" for="editProfileFullName">Имя и фамилия</label>
              <input
                type="text"
                class="form-control"
                id="editProfileFullName"
                v-model="editName"
              />
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold" for="editProfileBio">О себе</label>
              <textarea
                class="form-control"
                rows="3"
                id="editProfileBio"
                placeholder="Расскажите немного о себе..."
                v-model="editBio"
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Отмена</button>
            <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
