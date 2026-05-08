<template>
  <section>
    <h4 class="mb-4 fw-bold">Добавить новый курс</h4>

    <div v-if="success" class="alert alert-success" role="alert">{{ success }}</div>
    <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>

    <form @submit.prevent="onSubmit">
      <CourseFormFields v-model="form"/>

      <div class="d-flex gap-2">
        <button type="submit" class="btn btn-primary" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
          <svg class="icon me-1">
            <use href="#icon-check-lg"></use>
          </svg>
          Сохранить курс
        </button>
        <router-link to="/teacher" class="btn btn-outline-secondary">Отмена</router-link>
      </div>
    </form>
  </section>
</template>

<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {useAuthStore} from '@/stores/auth'
import {coursesApi} from '@/api'
import CourseFormFields from '@/components/CourseForm.vue'

const auth = useAuthStore()
const router = useRouter()

const form = ref({
  title: '', category: '', shortDescription: '', fullDescription: '',
  language: 'Русский', level: 'Начинающий', image: '',
  price: 0, hasCertificate: false, isPublished: false,
})

const loading = ref(false)
const success = ref('')
const error = ref('')

async function onSubmit() {
  success.value = ''
  error.value = ''

  if (!form.value.title.trim()) {
    error.value = 'Введите название курса'
    return
  }

  loading.value = true
  try {
    await coursesApi.create({...form.value, teacherId: auth.user.id})
    success.value = 'Курс создан!'
    setTimeout(() => router.push('/teacher'), 1000)
  } catch {
    error.value = 'Ошибка создания курса'
  } finally {
    loading.value = false
  }
}
</script>
