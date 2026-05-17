<script setup>
import { ref, onMounted } from 'vue'
import { commentsApi } from '@/api'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  modelId: { type: String, required: true }
})

const authStore = useAuthStore()
const comments = ref([])
const loading = ref(false)
const submitting = ref(false)
const commentText = ref('')
const submitError = ref('')

// Генерируем цвет аватара по имени автора
function avatarColor(name) {
  const colors = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
  let hash = 0
  for (const ch of name) hash = ch.charCodeAt(0) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

function initials(name) {
  return name ? name.slice(0, 2).toUpperCase() : '?'
}

async function loadComments() {
  loading.value = true
  try {
    const res = await commentsApi.getByModelId(props.modelId)
    comments.value = res.data
  } finally {
    loading.value = false
  }
}

async function addComment() {
  if (!commentText.value.trim()) {
    submitError.value = 'Комментарий не может быть пустым'
    return
  }
  submitError.value = ''
  submitting.value = true
  try {
    await commentsApi.create({
      modelId: props.modelId,
      author: authStore.user.username,
      text: commentText.value.trim(),
      date: new Date().toLocaleDateString('ru-RU')
    })
    commentText.value = ''
    await loadComments()
  } catch {
    submitError.value = 'Не удалось отправить комментарий'
  } finally {
    submitting.value = false
  }
}

onMounted(loadComments)
</script>

<template>
  <div>
    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border spinner-border-sm text-primary" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
    </div>

    <div v-else>
      <div v-if="comments.length === 0" class="text-center py-3">
        <p class="text-muted mb-0">Здесь пока нет комментариев. Будьте первым!</p>
      </div>
      <div v-for="comment in comments" :key="comment.id" class="comment-item d-flex gap-3 mb-3">
        <div
          class="comment-avatar flex-shrink-0"
          :style="{ background: avatarColor(comment.author) }"
          :aria-label="comment.author"
        >
          {{ initials(comment.author) }}
        </div>
        <div class="comment-body flex-grow-1">
          <div class="d-flex align-items-baseline gap-2 mb-1">
            <strong class="text-primary small">@{{ comment.author }}</strong>
            <small class="text-muted">{{ comment.date }}</small>
          </div>
          <p class="mb-0 small">{{ comment.text }}</p>
        </div>
      </div>
    </div>

    <div v-if="authStore.isLoggedIn" class="comment-form mt-4">
      <div class="d-flex gap-3 align-items-start">
        <div
          class="comment-avatar flex-shrink-0"
          :style="{ background: avatarColor(authStore.user.username) }"
        >
          {{ initials(authStore.user.username) }}
        </div>
        <div class="flex-grow-1">
          <textarea
            v-model="commentText"
            class="form-control mb-2"
            :class="{ 'is-invalid': submitError }"
            rows="2"
            placeholder="Написать комментарий..."
            @input="submitError = ''"
            @keydown.ctrl.enter="addComment"
          ></textarea>
          <div v-if="submitError" class="invalid-feedback d-block mb-2 small">{{ submitError }}</div>
          <div class="d-flex justify-content-between align-items-center">
            <small class="text-muted">Ctrl+Enter для отправки</small>
            <button
              @click="addComment"
              class="btn btn-primary btn-sm px-3"
              :disabled="submitting"
            >
              <span v-if="submitting" class="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
              Отправить
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-3 border-top mt-3">
      <p class="text-muted small mb-0">
        <router-link to="/login" class="fw-semibold">Войдите</router-link>, чтобы оставить комментарий
      </p>
    </div>
  </div>
</template>
