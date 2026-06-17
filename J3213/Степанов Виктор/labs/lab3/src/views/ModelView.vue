<template>
  <div>
    <div v-if="loading" class="container py-5 text-muted">Загрузка...</div>
    <div v-else-if="model">
      <div class="bg-dark text-white py-4">
        <div class="container">
          <p class="text-secondary mb-1">@{{ model.owner }}</p>
          <h1 class="h2">{{ model.name }}</h1>
          <p class="text-secondary">{{ model.desc }}</p>
          <div class="d-flex flex-wrap gap-2 mb-3">
            <span class="badge bg-primary">{{ model.task }}</span>
            <span v-if="model.framework" class="badge bg-secondary">{{ model.framework }}</span>
            <span class="badge bg-success">{{ model.license }}</span>
          </div>
          <div class="d-flex gap-2 flex-wrap">
            <button class="btn btn-outline-warning btn-sm" @click="toggleStar">
              ⭐ {{ model.stars }}
            </button>
            <button class="btn btn-outline-light btn-sm">🍴 Форк</button>
            <button class="btn btn-primary btn-sm">📥 Скачать</button>
          </div>
        </div>
      </div>

      <div class="border-bottom bg-white">
        <div class="container">
          <ul class="nav nav-tabs border-0">
            <li v-for="tab in tabs" :key="tab.id" class="nav-item">
              <a class="nav-link" :class="{ active: activeTab === tab.id }"
                href="#" @click.prevent="activeTab = tab.id">{{ tab.label }}</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="container py-4">
        <div class="row g-4">
          <div class="col-lg-8">
            <div v-if="activeTab === 'readme'" class="card p-4">
              <h2 class="h5">{{ model.name }}</h2>
              <p class="text-muted">{{ model.desc }}</p>
              <hr>
              <h3 class="h6">Быстрый старт</h3>
              <div style="background:#212529;color:#f8f9fa;padding:16px;border-radius:6px;font-family:monospace;font-size:14px;">
                from transformers import AutoModel<br><br>
                model = AutoModel.from_pretrained("{{ model.owner }}/{{ model.name }}")
              </div>
            </div>
            <div v-if="activeTab === 'discuss'" class="card p-3">
              <h2 class="h6 mb-2">Комментарии</h2>
              <textarea v-model="comment" class="form-control mb-2" rows="3" placeholder="Ваш вопрос..."></textarea>
              <button class="btn btn-primary btn-sm" @click="addComment">Опубликовать</button>
              <div class="mt-3">
                <div v-for="c in comments" :key="c.time" class="card p-3 mb-2">
                  <strong style="font-size:14px;">@{{ c.user }}</strong>
                  <p class="mb-0 text-muted" style="font-size:14px;">{{ c.text }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="card p-3">
              <h2 class="h6 fw-bold mb-3">Информация</h2>
              <table class="table table-sm table-borderless mb-0">
                <tbody>
                  <tr><td class="text-muted">Тип</td><td>{{ model.type === 'model' ? 'Модель' : 'Датасет' }}</td></tr>
                  <tr><td class="text-muted">Задача</td><td>{{ model.task }}</td></tr>
                  <tr><td class="text-muted">Фреймворк</td><td>{{ model.framework || '—' }}</td></tr>
                  <tr><td class="text-muted">Лицензия</td><td>{{ model.license }}</td></tr>
                  <tr><td class="text-muted">Размер</td><td>{{ model.size }}</td></tr>
                </tbody>
              </table>
            </div>
            <div class="card p-3 mt-3">
              <h2 class="h6 fw-bold mb-2">Теги</h2>
              <span v-for="tag in model.tags" :key="tag" class="badge bg-light text-dark border me-1 mb-1">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '../composables/useApi.js'

const route = useRoute()
const { getModel } = useApi()

const model = ref(null)
const loading = ref(true)
const activeTab = ref('readme')
const comment = ref('')
const comments = ref([
  { user: 'alex_ml', text: 'Отличная модель!', time: '19 мая 2026' },
])

const tabs = [
  { id: 'readme', label: 'README' },
  { id: 'discuss', label: 'Обсуждения' },
]

function toggleStar() {}

function addComment() {
  if (!comment.value.trim()) return
  comments.value.unshift({ user: 'user', text: comment.value, time: 'только что' })
  comment.value = ''
}

onMounted(async () => {
  try {
    model.value = await getModel(route.params.id)
  } catch {
    model.value = null
  } finally {
    loading.value = false
  }
})
</script>
