<template>
  <div class="card h-100">
    <div class="card-body">
      <h5 class="card-title">{{ name }}</h5>
      <p class="card-text">{{ text }}</p>
      <button type="button" class="btn btn-outline-danger btn-sm" @click="$emit('delete-note', id)">
        Удалить
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoteCard',
  emits: ['delete-note'],
  props: {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: false,
      default: '',
    },
  },
}
</script>
