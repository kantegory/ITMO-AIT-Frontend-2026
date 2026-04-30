<template>
  <article class="card h-100">
    <div class="card-body">
      <h3 class="card-title h5">
        {{ title }}
      </h3>

      <p class="card-text">
        {{ text }}
      </p>
    </div>
  </article>
</template>

<script>
export default {
  name: 'NoteCard',

  props: {
    title: {
      type: String,
      required: true
    },

    text: {
      type: String,
      required: true
    }
  }
}
</script>
