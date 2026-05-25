<script setup lang="ts">
import { ref } from 'vue';
import SvgIcon from './SvgIcon.vue';

defineProps<{
  modelValue: string;
  placeholder?: string;
  autocomplete?: string;
  describedby?: string;
  minlength?: number;
  invalid?: boolean;
}>();

const emit = defineEmits<{ 'update:modelValue': [v: string] }>();

const shown = ref(false);
function toggle(): void {
  shown.value = !shown.value;
}
</script>

<template>
  <div class="input-wrapper">
    <SvgIcon name="lock" :size="17" />
    <input
      :type="shown ? 'text' : 'password'"
      class="form-input with-right"
      :class="{ 'is-invalid': invalid }"
      :value="modelValue"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :aria-describedby="describedby"
      :minlength="minlength"
      required
      aria-required="true"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <button
      type="button"
      class="icon-right"
      aria-label="Показать или скрыть пароль"
      :aria-pressed="shown"
      @click="toggle"
    >
      <SvgIcon v-show="!shown" name="eye" :size="17" />
      <SvgIcon v-show="shown" name="eye-off" :size="17" />
    </button>
  </div>
</template>

<style scoped>
.input-wrapper :first-child {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 17px;
  height: 17px;
  color: var(--text-muted);
  pointer-events: none;
}
.input-wrapper .form-input {
  padding-left: 44px;
}
</style>
