<template>
  <div class="card h-100 shadow-sm">
    <div class="card-body">
      <h3 class="h5 card-title text-success">{{ name }}</h3>
      <p class="card-text">{{ text }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoteCard',
  props: {
    name: { type: String, required: true },
    text: { type: String, required: false }
  }
}
</script>