<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  id: { type: String, required: true },
  placeholder: { type: String, default: '' },
  autocomplete: { type: String, default: 'current-password' },
  required: { type: Boolean, default: false }
})

defineEmits(['update:modelValue'])

const visible = ref(false)
const toggle = () => (visible.value = !visible.value)
</script>

<template>
  <div class="input-group">
    <input
      :type="visible ? 'text' : 'password'"
      class="form-control input-no-right-border"
      :id="id"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :required="required"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <button
      class="btn toggle-password"
      type="button"
      :aria-label="visible ? 'Скрыть пароль' : 'Показать пароль'"
      :aria-pressed="visible"
      @click="toggle"
    >
      <i class="bi" :class="visible ? 'bi-eye-slash' : 'bi-eye'" aria-hidden="true"></i>
    </button>
  </div>
</template>
