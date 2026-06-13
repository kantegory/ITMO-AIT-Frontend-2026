<template>
  <div class="mt-5">
    <h4>Комментарии ({{ comments.length }})</h4>
    
    <div v-if="isAuthenticated" class="comment-input-group mb-4">
      <input
        type="text"
        class="form-control"
        v-model="newComment"
        placeholder="Напишите комментарий..."
        @keypress.enter="submitComment"
      />
      <button class="btn btn-main" @click="submitComment">
        Отправить
      </button>
    </div>
    
    <div v-else class="alert alert-light mb-4">
      <router-link to="/login">Войдите</router-link>, чтобы оставить комментарий
    </div>
    
    <div v-if="comments.length === 0" class="text-muted">
      Пока нет комментариев. Будьте первым!
    </div>
    
    <div
      v-for="comment in comments"
      :key="comment.id"
      class="comment card mb-3"
    >
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <strong>{{ comment.username }}</strong>
          <small class="text-muted">{{ formatDate(comment.createdAt) }}</small>
        </div>
        <p class="mb-0">{{ comment.content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

const props = defineProps({
  comments: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['add-comment'])

const { isAuthenticated } = useAuth()
const newComment = ref('')

function submitComment() {
  const content = newComment.value.trim()
  if (!content) return
  
  emit('add-comment', content)
  newComment.value = ''
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('ru-RU')
}
</script>