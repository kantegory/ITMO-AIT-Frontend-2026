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
  <div class="card mb-4">
    <div class="card-body">
      <p
        v-for="(paragraph, index) in datapoint.paragraphs"
        :key="index"
        :class="index === datapoint.paragraphs.length - 1 ? 'mb-0' : 'mb-2'"
      >
        {{ paragraph }}
      </p>
    </div>
  </div>
  <label-choice v-model="selected" :labels="labels" name="textclass" aria-label="Выберите категорию обращения" />
  <confirm-button :disabled="!selected || saving" @confirm="emit('submit', { label: selected })" />
</template>
