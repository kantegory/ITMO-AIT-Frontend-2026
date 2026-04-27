<template>
  <div class="card h-100 shadow-sm">
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">{{ name }}</h5>
      <p class="card-text text-muted flex-grow-1">{{ text }}</p>
      <button class="btn btn-outline-danger btn-sm mt-2 align-self-end" @click="$emit('delete')">
        Удалить
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoteCard',

  props: {
    name: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: false,
      default: ''
    }
  },

  emits: ['delete']
}
</script>
