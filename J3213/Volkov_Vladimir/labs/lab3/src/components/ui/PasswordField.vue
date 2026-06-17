<template>
  <div>
    <label class="form-label" :for="id">{{ label }}</label>
    <div class="position-relative">
      <input
        :id="id"
        class="form-control form-control-lg rounded-4 pe-5"
        :type="visible ? 'text' : 'password'"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :required="required"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <button
        type="button"
        class="btn position-absolute top-50 end-0 translate-middle-y me-3 p-0 border-0 bg-transparent text-secondary password-toggle"
        :aria-controls="id"
        aria-label="Показать или скрыть пароль"
        @click="visible = !visible"
      >
        <span class="d-flex align-items-center justify-content-center">
          <IconSprite :name="visible ? 'icon-eye-off' : 'icon-eye'" aria-hidden />
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import IconSprite from '@/components/ui/IconSprite.vue'

defineProps({
  id: {
    type: String,
    required: true
  },
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  },
  autocomplete: {
    type: String,
    default: 'current-password'
  },
  required: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])

const visible = ref(false)
</script>
