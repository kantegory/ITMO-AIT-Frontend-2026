<template>
  <article class="border rounded p-3 mb-3">
    <h2 class="h5">{{ note.title }}</h2>
    <p class="note-text">{{ note.text }}</p>
    <time :datetime="note.createdAt">{{ new Date(note.createdAt).toLocaleString('ru-RU') }}</time>
  </article>
</template>
<script setup>
defineProps({ note: { type: Object, required: true } });
</script>
