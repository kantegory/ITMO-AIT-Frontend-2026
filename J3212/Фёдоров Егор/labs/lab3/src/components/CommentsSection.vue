<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

const props = defineProps({
  comments: {
    type: Array,
    default: () => [],
  },
  commentText: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['update:commentText', 'submit'])
const { isLoggedIn } = useAuth()
const showForm = ref(false)
const localMessage = ref('')

function openForm() {
  localMessage.value = ''
  if (!isLoggedIn.value) {
    localMessage.value = 'Для комментариев нужно войти.'
    return
  }
  showForm.value = !showForm.value
}

async function submit() {
  await emit('submit')
  showForm.value = false
}
</script>

<template>
  <div class="hub-card">
    <div class="d-flex justify-content-between align-items-center mb-3 gap-3 flex-wrap">
      <h2 class="fw-bold fs-4 mb-0">Комментарии</h2>
      <button class="btn btn-light" type="button" @click="openForm">Добавить комментарий</button>
    </div>

    <div v-if="localMessage" class="alert alert-warning">{{ localMessage }}</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="showForm" class="mb-3">
      <textarea
        class="form-control mb-2"
        rows="4"
        placeholder="Напишите комментарий"
        :value="props.commentText"
        @input="emit('update:commentText', $event.target.value)"
      ></textarea>
      <button class="btn btn-primary" type="button" @click="submit">Отправить</button>
    </div>

    <div v-if="comments.length">
      <div v-for="comment in comments" :key="comment.id" class="list-item">
        <div class="fw-semibold">{{ comment.author }}</div>
        <div class="muted small mb-2">{{ new Date(comment.createdAt).toLocaleString('ru-RU') }}</div>
        <div>{{ comment.text }}</div>
      </div>
    </div>

    <div v-else class="muted">Комментариев пока нет.</div>
  </div>
</template>
