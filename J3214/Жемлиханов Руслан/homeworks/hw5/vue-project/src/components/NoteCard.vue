<template>
  <article class="card note-card shadow-sm">
    <div class="card-body">
      <h3 class="card-title h5 mb-2">{{ name }}</h3>
      <p v-if="text" class="card-text mb-0">{{ text }}</p>
      <p v-else class="card-text text-muted mb-0">No note text provided.</p>
    </div>
  </article>
</template>

<script>
export default {
  name: 'NoteCard',
  props: {
    name: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      default: '',
    },
  },
}
</script>
