<template>
  <div class="card h-100">
    <div class="card-body">
      <h5 class="card-title">{{ title }}</h5>
      <p class="card-text mb-1">{{ author }}</p>
      <p v-if="year" class="book-year mb-0">{{ year }} г.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookCard',
  props: {
    title: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    year: {
      type: [Number, String],
      required: false,
      default: null
    }
  }
}
</script>
