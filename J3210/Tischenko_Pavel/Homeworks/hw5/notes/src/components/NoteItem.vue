<script setup>
defineProps({
  note: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['remove'])

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString('ru-RU', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return ''
  }
}
</script>

<template>
  <article class="note-card">
    <header class="note-head">
      <h2 class="note-title">{{ note.title }}</h2>
      <time class="note-time" :datetime="note.createdAt">{{ formatDate(note.createdAt) }}</time>
    </header>
    <p class="note-body">{{ note.text }}</p>
    <footer class="note-actions">
      <button type="button" class="btn danger" @click="emit('remove', note.id)">Удалить</button>
    </footer>
  </article>
</template>
