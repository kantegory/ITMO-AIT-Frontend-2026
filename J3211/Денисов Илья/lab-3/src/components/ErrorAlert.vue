<script setup>
defineProps({
  text: {
    type: String,
    required: true
  }
});
</script>

<template>
  <div class="alert alert-danger w-100" role="alert">
    {{ text }}
  </div>
</template>
