<template>
  <div class="card mb-3 shadow-sm">
    <div class="card-body">
      <h5 class="card-title">{{ title }}</h5>
      <p class="card-text">{{ content }}</p>
      <button class="btn btn-outline-danger btn-sm" @click="$emit('delete-note')">
        Удалить
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoteCard',
  props: {
    title: String,
    content: String
  },
  emits: ['delete-note']
}
</script>
