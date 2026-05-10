<template>
  <div class="btn-group" role="group" aria-label="Период отчета">
    <button
      v-for="option in options"
      :key="option.value"
      class="btn btn-outline-dark btn-sm"
      :class="{ active: modelValue === option.value }"
      type="button"
      :aria-pressed="String(modelValue === option.value)"
      @click="$emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup>
defineEmits(["update:modelValue"]);

defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});

const options = [
  { value: "week", label: "Неделя" },
  { value: "month", label: "Месяц" },
  { value: "quarter", label: "Квартал" },
];
</script>

