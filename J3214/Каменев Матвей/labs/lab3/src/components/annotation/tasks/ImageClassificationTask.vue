<script setup>
import { ref } from 'vue'

import LabelChoice from '@/components/annotation/LabelChoice.vue'
import ConfirmButton from '@/components/annotation/ConfirmButton.vue'

defineProps({
  datapoint: {
    type: Object,
    required: true,
  },
  labels: {
    type: Array,
    required: true,
  },
  saving: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit'])

const selected = ref(null)
</script>

<template>
  <div class="annotation-image-wrap mx-auto mb-4">
    <img :src="datapoint.image" :alt="datapoint.alt" class="annotation-image" />
  </div>
  <label-choice v-model="selected" :labels="labels" name="class" aria-label="Выберите класс изображения" />
  <confirm-button :disabled="!selected || saving" @confirm="emit('submit', { label: selected })" />
</template>

<style scoped>
.annotation-image-wrap {
  max-width: 480px;
}

.annotation-image {
  width: 100%;
  display: block;
  border-radius: var(--bs-border-radius);
  border: 1px solid var(--bs-border-color);
}
</style>
