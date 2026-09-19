<script setup>
import { ref } from 'vue'

defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])
const isVisible = ref(false)
</script>

<template>
  <div class="floating-input password-container">
    <input
      :id="id"
      :type="isVisible ? 'text' : 'password'"
      :value="modelValue"
      required
      @input="emit('update:modelValue', $event.target.value)"
    />
    <label :for="id">{{ label }}</label>

    <button
      class="toggle-password"
      type="button"
      @click="isVisible = !isVisible"
      :aria-label="isVisible ? 'Hide password' : 'Show password'"
    >
      👁
    </button>

    <small v-if="error" class="error-text" aria-live="polite">{{ error }}</small>
  </div>
</template>