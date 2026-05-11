<template>
  <div class="d-flex align-items-center me-2 me-lg-3 theme-select-wrap">
    <label :for="selectId" class="visually-hidden">Тема оформления</label>
    <select :id="selectId" v-model="preference" class="form-select form-select-sm" aria-label="Тема оформления">
      <option value="auto">Авто</option>
      <option value="light">Светлая</option>
      <option value="dark">Тёмная</option>
    </select>
  </div>
</template>

<script setup>
import { useId } from 'vue'

import { useTheme } from '@/composables/useTheme'

const selectId = useId()
const { preference } = useTheme()
</script>
