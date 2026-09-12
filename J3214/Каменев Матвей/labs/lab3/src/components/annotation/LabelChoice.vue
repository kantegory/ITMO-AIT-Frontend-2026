<script setup>
defineProps({
  labels: {
    type: Array,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  ariaLabel: {
    type: String,
    required: true,
  },
})

const selected = defineModel({ type: String, default: null })
</script>

<template>
  <div class="d-flex justify-content-center gap-3 mb-4 flex-wrap" role="group" :aria-label="ariaLabel">
    <template v-for="label in labels" :key="label.value">
      <input
        v-model="selected"
        type="radio"
        class="btn-check"
        :name="name"
        :id="`${name}-${label.value}`"
        :value="label.value"
        autocomplete="off"
      />
      <label class="btn btn-outline-primary btn-lg" :for="`${name}-${label.value}`">{{ label.title }}</label>
    </template>
  </div>
</template>
