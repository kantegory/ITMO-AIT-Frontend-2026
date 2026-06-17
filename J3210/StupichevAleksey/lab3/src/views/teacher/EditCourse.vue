<template>
  <section>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold mb-0">Редактирование курса</h4>
      <router-link to="/teacher" class="btn btn-secondary btn-sm">
        <svg class="icon me-1">
          <use href="#icon-arrow-left"></use>
        </svg>
        Назад к списку
      </router-link>
    </div>

    <div v-if="success" class="alert alert-success" role="alert">{{ success }}</div>
    <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>

    <div v-if="pageLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <form v-else @submit.prevent="onSubmit">
      <CourseFormFields v-model="form"/>

      <div class="d-flex gap-2">
        <button type="submit" class="btn btn-primary" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
          <svg class="icon me-1">
            <use href="#icon-check-lg"></use>
          </svg>
          Сохранить изменения
        </button>
        <router-link to="/teacher" class="btn btn-secondary">Отмена</router-link>
        <button type="button" class="btn btn-danger ms-auto" @click="onDelete">
          <svg class="icon me-1">
            <use href="#icon-trash"></use>
          </svg>
          Удалить курс
        </button>
      </div>
    </form>
  </section>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {coursesApi} from '@/api'
import CourseFormFields from '@/components/CourseForm.vue'

const route = useRoute()
const router = useRouter()
const courseId = route.params.id

const form = ref({
  title: '', category: '', shortDescription: '', fullDescription: '',
  language: 'Русский', level: 'Начинающий', image: '',
  price: 0, hasCertificate: false, isPublished: false,
})

const pageLoading = ref(true)
const loading = ref(false)
const success = ref('')
const error = ref('')

onMounted(async () => {
  try {
    const {data: c} = await coursesApi.getById(courseId)
    form.value = {
      title: c.title || '',
      category: c.category || '',
      shortDescription: c.shortDescription || '',
      fullDescription: c.fullDescription || '',
      language: c.language || 'Русский',
      level: c.level || 'Начинающий',
      image: c.image || '',
      price: c.price ?? 0,
      hasCertificate: c.hasCertificate || false,
      isPublished: c.isPublished || false,
    }
  } catch {
    error.value = 'Курс не найден'
  } finally {
    pageLoading.value = false
  }
})

async function onSubmit() {
  success.value = ''
  error.value = ''
  loading.value = true
  try {
    await coursesApi.update(courseId, form.value)
    success.value = 'Изменения сохранены!'
  } catch {
    error.value = 'Ошибка сохранения'
  } finally {
    loading.value = false
  }
}

async function onDelete() {
  if (!confirm('Удалить курс?')) return
  try {
    await coursesApi.remove(courseId)
    router.push('/teacher')
  } catch {
    alert('Ошибка удаления')
  }
}
</script>
