<template>
  <div v-if="modelValue" class="modal d-block" style="background:rgba(0,0,0,0.5)">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header"><h5>Схема зала</h5><button class="btn-close" @click="$emit('update:modelValue', false)"></button></div>
        <div class="modal-body text-center">
          <div class="bg-dark text-white p-2 rounded mb-3">СЦЕНА</div>
          <div class="d-flex flex-wrap justify-content-center gap-1">
            <span v-for="i in 20" :key="i" class="seat" :class="{ taken: i % 5 === 0 }" style="width:30px;height:30px;border-radius:4px;display:inline-block;background:#28a745"></span>
          </div>
          <p class="text-muted mt-2">Интерактивный выбор - заглушка</p>
        </div>
        <div class="modal-footer"><button class="btn btn-secondary" @click="$emit('update:modelValue', false)">Закрыть</button></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ modelValue: Boolean, event: Object })
defineEmits(['update:modelValue'])
</script>