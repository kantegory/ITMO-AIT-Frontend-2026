<template>
  <section>
    <div ref="commentsList" class="comments-list mb-3">
      <p v-if="!comments.length" class="text-muted text-center mt-4">Нет комментариев</p>
      <article v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-meta">
          <span>{{ comment.author || comment.user }}</span>
          <span class="comment-time">{{ comment.time }}</span>
        </div>
        <div>{{ comment.text }}</div>
      </article>
    </div>

    <form class="comment-input-area" @submit.prevent="send">
      <input v-model.trim="text" class="form-control" type="text" placeholder="Написать комментарий..." aria-label="Текст комментария" />
      <button class="btn btn-outline-black" type="submit">Отправить</button>
    </form>
  </section>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'

const props = defineProps({ comments: { type: Array, default: () => [] } })
const emit = defineEmits(['send'])
const text = ref('')
const commentsList = ref(null)

function scrollToBottom() {
  nextTick(() => {
    if (commentsList.value) commentsList.value.scrollTop = commentsList.value.scrollHeight
  })
}

function send() {
  if (!text.value) return
  emit('send', text.value)
  text.value = ''
}

watch(() => props.comments.length, scrollToBottom, { immediate: true })
</script>
