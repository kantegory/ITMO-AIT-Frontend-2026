<template>
  <div class="dashboard-page">
    <div class="app">
      <Sidebar />

      <div class="main">
        <TopBar search-placeholder="Поиск..." role-label="Автор курсов" />

        <main class="content" id="main-content" tabindex="-1" aria-label="Управление курсами">
          <section aria-label="Заголовок страницы">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
              <div>
                <h1 class="page-title mb-1">Мои курсы</h1>
                <p class="page-subtitle mb-0">Управление курсами, материалами и уроками</p>
              </div>
              <button class="btn btn-primary-custom" type="button" data-bs-toggle="modal" data-bs-target="#addCourseModal">
                Добавить курс
              </button>
            </div>
          </section>

          <section aria-label="Статистика преподавателя">
            <div class="row g-3 mb-4">
              <div class="col-md-4">
                <div class="card stat-card h-100">
                  <div class="stat-label">Всего курсов</div>
                  <div class="stat-value">{{ myCourses.length }}</div>
                  <div class="stat-note">Создано</div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card stat-card h-100">
                  <div class="stat-label">Студентов</div>
                  <div class="stat-value text-primary">{{ studentCount }}</div>
                  <div class="stat-note">Записано</div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card stat-card h-100">
                  <div class="stat-label">Активных</div>
                  <div class="stat-value text-success">{{ myCourses.length }}</div>
                  <div class="stat-note">В работе</div>
                </div>
              </div>
            </div>
          </section>

          <section aria-label="Таблица моих курсов">
            <div class="card mb-4">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                  <h2 class="fw-bold mb-0">Мои курсы</h2>
                  <small class="text-muted">Управление контентом</small>
                </div>

                <div class="table-responsive">
                  <table class="table align-middle mb-0">
                    <thead>
                      <tr>
                        <th scope="col">Курс</th>
                        <th scope="col">Студенты</th>
                        <th scope="col">Статус</th>
                        <th scope="col">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="loading">
                        <td colspan="4" class="text-center py-4">
                          <span class="spinner-border spinner-border-sm" role="status"></span> Загрузка...
                        </td>
                      </tr>
                      <tr v-else-if="myCourses.length === 0">
                        <td colspan="4" class="text-center text-muted py-4">У вас пока нет курсов</td>
                      </tr>
                      <tr v-for="course in myCourses" :key="course.id">
                        <th scope="row">
                          <div class="fw-semibold">{{ course.title }}</div>
                          <div class="small text-muted">{{ course.subject || '—' }}</div>
                        </th>
                        <td>{{ getStudentsCount(course.id) }}</td>
                        <td><span class="badge text-bg-success">Активный</span></td>
                        <td>
                          <div class="d-flex flex-wrap gap-1">
                            <button @click="openCourseContent(course)" class="btn btn-sm btn-outline-custom" title="Управление материалами">
                              📁 Материалы
                            </button>
                            <button @click="openEditModal(course)" class="btn btn-sm btn-outline-custom">Изменить</button>
                            <button @click="confirmDelete(course)" class="btn btn-sm btn-outline-danger">Удалить</button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          <section v-if="selectedCourse" aria-label="Управление контентом курса" class="mb-4">
            <div class="card">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
                  <div>
                    <h2 class="fw-bold mb-1">{{ selectedCourse.title }}</h2>
                    <p class="text-muted mb-0 small">Управление материалами и уроками</p>
                  </div>
                  <button @click="selectedCourse = null" class="btn btn-sm btn-outline-secondary">
                    ✕ Закрыть
                  </button>
                </div>

                <ul class="nav nav-tabs mb-4" id="contentTabs" role="tablist">
                  <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="materials-tab" data-bs-toggle="tab" data-bs-target="#materials" type="button">
                      📄 Материалы ({{ courseMaterials.length }})
                    </button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button class="nav-link" id="lessons-tab" data-bs-toggle="tab" data-bs-target="#lessons" type="button">
                      🎬 Уроки ({{ courseLessons.length }})
                    </button>
                  </li>
                </ul>

                <div class="tab-content" id="contentTabsContent">
                  <div class="tab-pane fade show active" id="materials" role="tabpanel">
                    <div v-if="courseMaterials.length === 0" class="text-center py-4 text-muted">
                      Материалов пока нет. Добавьте первый материал выше.
                    </div>
                    <div v-else class="table-responsive">
                      <table class="table align-middle">
                        <thead>
                          <tr>
                            <th>Название</th>
                            <th>Ссылка</th>
                            <th style="width: 150px;">Действия</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(material, index) in courseMaterials" :key="index">
                            <td class="fw-semibold">{{ material.title }}</td>
                            <td>
                              <a :href="material.link" target="_blank" class="text-decoration-none">
                                {{ truncateLink(material.link) }}
                              </a>
                            </td>
                            <td>
                              <div class="d-flex gap-1">
                                <button @click="openEditMaterialModal(index)" class="btn btn-sm btn-outline-custom" title="Редактировать">
                                  ✏️
                                </button>
                                <button @click="deleteMaterial(index)" class="btn btn-sm btn-outline-danger" title="Удалить">
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div class="tab-pane fade" id="lessons" role="tabpanel">
                    <div v-if="courseLessons.length === 0" class="text-center py-4 text-muted">
                      Уроков пока нет. Добавьте первый урок выше.
                    </div>
                    <div v-else class="table-responsive">
                      <table class="table align-middle">
                        <thead>
                          <tr>
                            <th>Название</th>
                            <th>Длительность</th>
                            <th>Видео</th>
                            <th style="width: 150px;">Действия</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(lesson, index) in courseLessons" :key="index">
                            <td class="fw-semibold">{{ lesson.title }}</td>
                            <td>{{ lesson.duration || '—' }}</td>
                            <td>
                              <a v-if="lesson.videoId" :href="lesson.videoId" target="_blank" class="text-decoration-none">
                                {{ truncateLink(lesson.videoId) }}
                              </a>
                              <span v-else class="text-muted">—</span>
                            </td>
                            <td>
                              <div class="d-flex gap-1">
                                <button @click="openEditLessonModal(index)" class="btn btn-sm btn-outline-custom" title="Редактировать">
                                  ✏️
                                </button>
                                <button @click="deleteLesson(index)" class="btn btn-sm btn-outline-danger" title="Удалить">
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section aria-label="Формы добавления">
            <div class="row g-4">
              <div class="col-lg-6">
                <div class="card h-100">
                  <div class="card-body">
                    <h2 class="fw-bold mb-3">Добавить материал</h2>
                    <form @submit.prevent="addMaterial">
                      <div class="mb-3">
                        <label class="form-label">Выберите курс</label>
                        <select class="form-select" v-model="materialForm.courseId">
                          <option value="">Выберите курс</option>
                          <option v-for="c in myCourses" :key="c.id" :value="c.id">{{ c.title }}</option>
                        </select>
                      </div>
                      <div class="mb-3">
                        <label class="form-label">Название материала</label>
                        <input type="text" class="form-control" v-model="materialForm.title" placeholder="Конспект лекции 1" />
                      </div>
                      <div class="mb-3">
                        <label class="form-label">Ссылка на ресурс</label>
                        <input type="url" class="form-control" v-model="materialForm.link" placeholder="https://example.com/file.pdf" />
                      </div>
                      <button type="submit" class="btn btn-primary-custom w-100">Добавить материал</button>
                    </form>
                  </div>
                </div>
              </div>

              <div class="col-lg-6">
                <div class="card h-100">
                  <div class="card-body">
                    <h2 class="fw-bold mb-3">Добавить урок</h2>
                    <form @submit.prevent="addLesson">
                      <div class="mb-3">
                        <label class="form-label">Курс</label>
                        <select class="form-select" v-model="lessonForm.courseId">
                          <option value="">Выберите курс</option>
                          <option v-for="c in myCourses" :key="c.id" :value="c.id">{{ c.title }}</option>
                        </select>
                      </div>
                      <div class="mb-3">
                        <label class="form-label">Название урока</label>
                        <input type="text" class="form-control" v-model="lessonForm.title" placeholder="Введение в Bootstrap" />
                      </div>
                      <div class="mb-3">
                        <label class="form-label">Длительность</label>
                        <input type="text" class="form-control" v-model="lessonForm.duration" placeholder="08:30" />
                        <small class="form-text text-muted">Формат: ММ:СС</small>
                      </div>
                      <div class="mb-3">
                        <label class="form-label">Ссылка на видео</label>
                        <input type="url" class="form-control" v-model="lessonForm.videoUrl" placeholder="YouTube ссылка или прямая .mp4" />
                      </div>
                      <button type="submit" class="btn btn-primary-custom w-100">Добавить урок</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>

    <!-- Модалка: Новый курс -->
    <div class="modal fade" id="addCourseModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Новый курс</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="createCourse">
              <div class="mb-3">
                <label class="form-label">Название</label>
                <input type="text" class="form-control" v-model="newCourse.title" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Предмет</label>
                <input type="text" class="form-control" v-model="newCourse.subject" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Уровень</label>
                <select class="form-select" v-model="newCourse.level" required>
                  <option value="">Выберите уровень</option>
                  <option value="Новичок">Новичок</option>
                  <option value="Средний">Средний</option>
                  <option value="Продвинутый">Продвинутый</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Цена</label>
                <input type="number" class="form-control" v-model.number="newCourse.price" min="0" value="0" />
              </div>
              <div class="mb-3">
                <label class="form-label">Описание</label>
                <textarea class="form-control" rows="4" v-model="newCourse.desc" required></textarea>
              </div>
              <button type="submit" class="btn btn-primary-custom w-100">Создать курс</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="editCourseModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Редактировать курс</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateCourse">
              <div class="mb-3">
                <label class="form-label">Название</label>
                <input type="text" class="form-control" v-model="editCourse.title" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Предмет</label>
                <input type="text" class="form-control" v-model="editCourse.subject" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Уровень</label>
                <select class="form-select" v-model="editCourse.level" required>
                  <option value="">Выберите уровень</option>
                  <option value="Новичок">Новичок</option>
                  <option value="Средний">Средний</option>
                  <option value="Продвинутый">Продвинутый</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Цена</label>
                <input type="number" class="form-control" v-model.number="editCourse.price" min="0" value="0" />
              </div>
              <div class="mb-3">
                <label class="form-label">Описание</label>
                <textarea class="form-control" rows="4" v-model="editCourse.desc" required></textarea>
              </div>
              <button type="submit" class="btn btn-primary-custom w-100">Сохранить</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="editMaterialModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Редактировать материал</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateMaterial">
              <div class="mb-3">
                <label class="form-label">Название материала</label>
                <input type="text" class="form-control" v-model="editMaterialData.title" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Ссылка на ресурс</label>
                <input type="url" class="form-control" v-model="editMaterialData.link" required />
              </div>
              <button type="submit" class="btn btn-primary-custom w-100">Сохранить изменения</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="editLessonModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Редактировать урок</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateLesson">
              <div class="mb-3">
                <label class="form-label">Название урока</label>
                <input type="text" class="form-control" v-model="editLessonData.title" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Длительность</label>
                <input type="text" class="form-control" v-model="editLessonData.duration" placeholder="08:30" />
              </div>
              <div class="mb-3">
                <label class="form-label">Ссылка на видео</label>
                <input type="url" class="form-control" v-model="editLessonData.videoId" required />
              </div>
              <button type="submit" class="btn btn-primary-custom w-100">Сохранить изменения</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { Modal } from 'bootstrap'
import Sidebar from '@/components/Sidebar.vue'
import TopBar from '@/components/TopBar.vue'
import { useAuthStore } from '@/stores/auth'
import { useCoursesStore } from '@/stores/courses'

const auth = useAuthStore()
const store = useCoursesStore()

const loading = ref(true)
const myCourses = ref([])
const allEnrollments = ref([])

const selectedCourse = ref(null)
const courseMaterials = ref([])
const courseLessons = ref([])

const newCourse = reactive({ title: '', subject: '', level: '', price: 0, desc: '' })
const editCourse = reactive({ id: null, title: '', subject: '', level: '', price: 0, desc: '' })
const materialForm = reactive({ courseId: '', title: '', link: '' })
const lessonForm = reactive({ courseId: '', title: '', duration: '', videoUrl: '' })

const editMaterialData = reactive({ index: null, title: '', link: '' })
const editLessonData = reactive({ index: null, title: '', duration: '', videoId: '' })

const studentCount = computed(() => {
  const ids = new Set(myCourses.value.map(c => c.id))
  return allEnrollments.value.filter(e => ids.has(e.courseId)).length
})

function getStudentsCount(courseId) {
  return allEnrollments.value.filter(e => e.courseId === courseId).length
}

function truncateLink(link) {
  if (!link) return '—'
  return link.length > 40 ? link.substring(0, 40) + '...' : link
}

async function loadData() {
  try {
    const [coursesData, enrollmentsData] = await Promise.all([
      store.loadCourses({ userId: auth.user.id }),
      store.getAllEnrollments()
    ])
    myCourses.value = store.allCourses
    allEnrollments.value = enrollmentsData
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

async function openCourseContent(course) {
  selectedCourse.value = course

  const fullCourse = await store.loadCourse(course.id)
  if (fullCourse) {
    courseMaterials.value = fullCourse.materials || []
    courseLessons.value = fullCourse.lessons || []
  }
}

async function createCourse() {
  if (newCourse.title.length < 5) return alert('Название курса должно быть не короче 5 символов')
  if (!newCourse.subject) return alert('Укажите предмет')
  if (newCourse.desc.length < 15) return alert('Описание должно быть не короче 15 символов')

  try {
    await store.createCourse({
      ...newCourse,
      userId: auth.user.id,
      lessons: [],
      materials: [],
      tasks: []
    })
    alert('✅ Курс успешно создан!')
    const modalEl = document.getElementById('addCourseModal')
    const modal = Modal.getInstance(modalEl)
    if (modal) modal.hide()
    Object.assign(newCourse, { title: '', subject: '', level: '', price: 0, desc: '' })
    await loadData()
  } catch (err) {
    alert('Ошибка создания: ' + err.message)
  }
}

function openEditModal(course) {
  Object.assign(editCourse, {
    id: course.id,
    title: course.title,
    subject: course.subject || '',
    level: course.level || 'Новичок',
    price: course.price || 0,
    desc: course.desc || ''
  })
  nextTick(() => {
    const modalEl = document.getElementById('editCourseModal')
    if (modalEl) {
      new Modal(modalEl).show()
    }
  })
}

async function updateCourse() {
  try {
    const original = myCourses.value.find(c => c.id === editCourse.id)
    await store.updateCourse(editCourse.id, {
      ...original,
      title: editCourse.title,
      subject: editCourse.subject,
      level: editCourse.level,
      price: editCourse.price,
      desc: editCourse.desc
    })
    alert('✅ Курс успешно обновлен!')
    const modalEl = document.getElementById('editCourseModal')
    const modal = Modal.getInstance(modalEl)
    if (modal) modal.hide()
    await loadData()
  } catch (err) {
    alert('Ошибка обновления: ' + err.message)
  }
}

async function confirmDelete(course) {
  if (!confirm(`Вы уверены, что хотите удалить курс «${course.title}»?\n\nВсе записи студентов будут также удалены.\nДействие необратимо.`)) return

  try {
    await store.deleteCourse(course.id)
    alert('Курс «' + course.title + '» удалён.')
    if (selectedCourse.value?.id === course.id) {
      selectedCourse.value = null
    }
    await loadData()
  } catch (err) {
    alert('Ошибка при удалении: ' + err.message)
  }
}

async function addMaterial() {
  if (!materialForm.courseId) return alert('Выберите курс')
  if (!materialForm.title || !materialForm.link) return alert('Заполните все поля')

  try {
    const course = await store.loadCourse(materialForm.courseId)
    const updated = {
      ...course,
      materials: [...(course.materials || []), { title: materialForm.title, link: materialForm.link }]
    }
    await store.updateCourse(materialForm.courseId, updated)
    alert('✅ Материал добавлен!')
    Object.assign(materialForm, { courseId: '', title: '', link: '' })
    await loadData()

    if (selectedCourse.value?.id === materialForm.courseId) {
      await openCourseContent(selectedCourse.value)
    }
  } catch (err) {
    alert('Ошибка: ' + err.message)
  }
}

function openEditMaterialModal(index) {
  const material = courseMaterials.value[index]
  Object.assign(editMaterialData, {
    index: index,
    title: material.title,
    link: material.link
  })
  nextTick(() => {
    const modalEl = document.getElementById('editMaterialModal')
    if (modalEl) {
      new Modal(modalEl).show()
    }
  })
}

async function updateMaterial() {
  if (!selectedCourse.value) return
  
  try {
    const course = await store.loadCourse(selectedCourse.value.id)
    const materials = [...(course.materials || [])]
    materials[editMaterialData.index] = {
      title: editMaterialData.title,
      link: editMaterialData.link
    }
    
    await store.updateCourse(selectedCourse.value.id, {
      ...course,
      materials: materials
    })
    
    alert('✅ Материал обновлён!')
    const modalEl = document.getElementById('editMaterialModal')
    const modal = Modal.getInstance(modalEl)
    if (modal) modal.hide()
    
    await openCourseContent(selectedCourse.value)
  } catch (err) {
    alert('Ошибка обновления: ' + err.message)
  }
}

async function deleteMaterial(index) {
  const material = courseMaterials.value[index]
  if (!confirm(`Удалить материал "${material.title}"?`)) return
  
  try {
    const course = await store.loadCourse(selectedCourse.value.id)
    const materials = [...(course.materials || [])]
    materials.splice(index, 1)
    
    await store.updateCourse(selectedCourse.value.id, {
      ...course,
      materials: materials
    })
    
    alert('✅ Материал удалён!')
    await openCourseContent(selectedCourse.value)
  } catch (err) {
    alert('Ошибка удаления: ' + err.message)
  }
}


async function addLesson() {
  if (!lessonForm.courseId) return alert('Выберите курс')
  if (!lessonForm.title || !lessonForm.duration || !lessonForm.videoUrl) return alert('Заполните все поля урока')

  try {
    const course = await store.loadCourse(lessonForm.courseId)
    const updated = {
      ...course,
      lessons: [...(course.lessons || []), {
        title: lessonForm.title,
        duration: lessonForm.duration,
        videoId: lessonForm.videoUrl
      }]
    }
    await store.updateCourse(lessonForm.courseId, updated)
    alert('✅ Урок добавлен!')
    Object.assign(lessonForm, { courseId: '', title: '', duration: '', videoUrl: '' })
    await loadData()

    if (selectedCourse.value?.id === lessonForm.courseId) {
      await openCourseContent(selectedCourse.value)
    }
  } catch (err) {
    alert('Ошибка: ' + err.message)
  }
}

function openEditLessonModal(index) {
  const lesson = courseLessons.value[index]
  Object.assign(editLessonData, {
    index: index,
    title: lesson.title,
    duration: lesson.duration || '',
    videoId: lesson.videoId || ''
  })
  nextTick(() => {
    const modalEl = document.getElementById('editLessonModal')
    if (modalEl) {
      new Modal(modalEl).show()
    }
  })
}

async function updateLesson() {
  if (!selectedCourse.value) return
  
  try {
    const course = await store.loadCourse(selectedCourse.value.id)
    const lessons = [...(course.lessons || [])]
    lessons[editLessonData.index] = {
      title: editLessonData.title,
      duration: editLessonData.duration,
      videoId: editLessonData.videoId
    }
    
    await store.updateCourse(selectedCourse.value.id, {
      ...course,
      lessons: lessons
    })
    
    alert('✅ Урок обновлён!')
    const modalEl = document.getElementById('editLessonModal')
    const modal = Modal.getInstance(modalEl)
    if (modal) modal.hide()
    
    await openCourseContent(selectedCourse.value)
  } catch (err) {
    alert('Ошибка обновления: ' + err.message)
  }
}

async function deleteLesson(index) {
  const lesson = courseLessons.value[index]
  if (!confirm(`Удалить урок "${lesson.title}"?`)) return
  
  try {
    const course = await store.loadCourse(selectedCourse.value.id)
    const lessons = [...(course.lessons || [])]
    lessons.splice(index, 1)
    
    await store.updateCourse(selectedCourse.value.id, {
      ...course,
      lessons: lessons
    })
    
    alert('✅ Урок удалён!')
    await openCourseContent(selectedCourse.value)
  } catch (err) {
    alert('Ошибка удаления: ' + err.message)
  }
}

onMounted(() => {
  loadData()
})
</script>
