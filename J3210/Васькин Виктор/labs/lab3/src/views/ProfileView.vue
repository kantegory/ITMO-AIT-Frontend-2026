<script setup>
import { ref, onMounted, computed } from 'vue'
import instance from '@/api/instance'
import { useAuthStore } from '@/stores/auth'
import BaseLayout from '@/layouts/BaseLayout.vue'

const authStore = useAuthStore()
const courses = ref([])
const loading = ref(true)

const newCourse = ref({ 
  title: '', desc: '', price: 0, image: '', category: 'lang', level: 'beginner' 
})

const categoryLabels = { lang: 'Языки', data: 'Данные/ML', math: 'Математика' }
const levelLabels = { beginner: 'Новичок', pro: 'Pro' }

const fetchMyCourses = async () => {
  if (authStore.user?.role === 'teacher') {
    try {
      const res = await instance.get(`/courses?teacherName=${encodeURIComponent(authStore.user.name)}`)
      courses.value = res.data
    } catch (e) { console.error(e) }
  }
  loading.value = false
}

const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { newCourse.value.image = ev.target.result }
  reader.readAsDataURL(file)
}

const createCourse = async () => {
  try {
    await instance.post('/courses', {
      title: newCourse.value.title,
      desc: newCourse.value.desc,
      price: newCourse.value.price,
      category: newCourse.value.category,
      categoryLabel: categoryLabels[newCourse.value.category],
      level: newCourse.value.level,
      levelLabel: levelLabels[newCourse.value.level],
      rating: 5, 
      reviews: 0,
      image: newCourse.value.image || '/img/course1.png',
      teacherName: authStore.user.name,
      teacherRole: "Преподаватель",
      teacherAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(authStore.user.name)}&background=a855f7&color=fff`
    })
    window.location.reload()
  } catch (e) { alert('Ошибка создания') }
}

const deleteCourse = async (id) => {
  if (confirm('Точно удалить?')) {
    await instance.delete(`/courses/${id}`)
    fetchMyCourses()
  }
}

onMounted(() => fetchMyCourses())

const isTeacher = computed(() => authStore.user?.role === 'teacher')
const userAvatar = computed(() => `https://ui-avatars.com/api/?name=${encodeURIComponent(authStore.user?.name || '')}&background=a855f7&color=fff&size=128`)
</script>

<template>
  <BaseLayout>
    <div v-if="authStore.user">
      <div class="card bg-dark border-secondary rounded-4 p-4 mb-5">
        <div class="d-flex flex-column flex-md-row align-items-center justify-content-between">
          <div class="d-flex align-items-center mb-3 mb-md-0">
            <img :src="userAvatar" class="rounded-circle border border-3 border-secondary" width="128" height="128" alt="Аватар" style="object-fit: cover;">
            <div class="ms-4">
              <h2 class="text-white fw-bold mb-1">{{ authStore.user.name }}</h2>
              <div class="text-white-50 mb-2">{{ authStore.user.email }}</div>
              <span class="badge bg-neon rounded-pill px-3 py-2">{{ isTeacher ? 'Преподаватель' : 'Студент' }}</span>
            </div>
          </div>
          <div class="d-flex gap-4 text-center">
            <div><div class="fs-3 fw-bold text-white">{{ isTeacher ? courses.length : 0 }}</div><div class="text-white-50 small">{{ isTeacher ? 'Мои курсы' : 'Курсов' }}</div></div>
            <div><div class="fs-3 fw-bold text-white">{{ isTeacher ? courses.length * 42 : 0 }}</div><div class="text-white-50 small">{{ isTeacher ? 'Студентов' : 'Сертификатов' }}</div></div>
            <div><div class="fs-3 fw-bold neon-text">{{ isTeacher && courses.length ? '5.0' : '0.0' }}</div><div class="text-white-50 small">Рейтинг</div></div>
          </div>
        </div>
      </div>

      <ul class="nav nav-tabs custom-tabs border-secondary mb-4">
        <li class="nav-item" v-if="!isTeacher"><button class="nav-link active bg-transparent fw-bold" data-bs-toggle="tab" data-bs-target="#student">🎓 Мое обучение</button></li>
        <li class="nav-item" v-if="isTeacher"><button class="nav-link active bg-transparent fw-bold" data-bs-toggle="tab" data-bs-target="#teacher">👨‍🏫 Преподавание</button></li>
      </ul>

      <div class="tab-content">
        <div v-if="!isTeacher" class="tab-pane fade show active" id="student">
          <div class="col-12"><p class="text-white-50 fs-5">Вы пока не записались ни на один курс. Самое время перейти в <RouterLink to="/" class="text-neon">каталог</RouterLink>!</p></div>
        </div>

        <div v-if="isTeacher" class="tab-pane fade show active" id="teacher">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="text-white mb-0">Мои авторские курсы</h4>
            <button class="btn btn-neon rounded-pill px-4 fw-bold" data-bs-toggle="modal" data-bs-target="#createCourseModal">+ Создать курс</button>
          </div>

          <div class="table-responsive mt-3">
            <table class="table table-dark table-hover border-secondary align-middle">
              <thead><tr><th class="text-white-50">Название</th><th class="text-white-50">Цена</th><th class="text-white-50 text-end">Действия</th></tr></thead>
              <tbody>
                <tr v-if="loading"><td colspan="3" class="text-center text-white-50 py-4">Загрузка...</td></tr>
                <tr v-else-if="courses.length === 0"><td colspan="3" class="text-center text-white-50 py-4">У вас пока нет созданных курсов.</td></tr>
                <tr v-else v-for="c in courses" :key="c.id">
                  <td class="text-white fw-bold">{{ c.title }}</td>
                  <td class="text-white-50">{{ c.price === 0 ? 'Бесплатно' : c.price + ' ₽' }}</td>
                  <td class="text-end"><button class="btn btn-sm btn-outline-danger rounded-pill px-3" @click="deleteCourse(c.id)">Удалить</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="createCourseModal" tabindex="-1" data-bs-theme="dark">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-dark border-secondary rounded-4">
          <div class="modal-header border-secondary"><h5 class="modal-title text-white fw-bold">Новый курс</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
          <div class="modal-body">
            <form id="createForm" @submit.prevent="createCourse">
              <div class="mb-3"><label class="text-white-50">Название</label><input type="text" v-model="newCourse.title" class="form-control bg-dark text-white border-secondary" required></div>
              <div class="mb-3"><label class="text-white-50">Описание</label><textarea v-model="newCourse.desc" class="form-control bg-dark text-white border-secondary" rows="3" required></textarea></div>
              
              <div class="row g-3 mb-3">
                <div class="col-6">
                  <label class="text-white-50">Направление</label>
                  <select v-model="newCourse.category" class="form-select bg-dark text-white border-secondary">
                    <option value="lang">Языки</option>
                    <option value="data">Данные/ML</option>
                    <option value="math">Математика</option>
                  </select>
                </div>
                <div class="col-6">
                  <label class="text-white-50">Сложность</label>
                  <select v-model="newCourse.level" class="form-select bg-dark text-white border-secondary">
                    <option value="beginner">Новичок</option>
                    <option value="pro">Pro</option>
                  </select>
                </div>
              </div>

              <div class="row g-3 mb-4">
                <div class="col-6"><label class="text-white-50">Цена (₽)</label><input type="number" v-model.number="newCourse.price" class="form-control bg-dark text-white border-secondary"></div>
                <div class="col-6"><label class="text-white-50">Обложка</label><input type="file" @change="handleFileUpload" class="form-control bg-dark text-white border-secondary" accept="image/*"></div>
              </div>
            </form>
          </div>
          <div class="modal-footer border-secondary">
            <button type="button" class="btn btn-outline-light rounded-pill px-4" data-bs-dismiss="modal">Отмена</button>
            <button type="submit" form="createForm" class="btn btn-neon rounded-pill px-4 fw-bold" data-bs-dismiss="modal">Опубликовать</button>
          </div>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>