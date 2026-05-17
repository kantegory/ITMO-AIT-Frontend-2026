<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

function close() {
  emit('update:modelValue', false);
}
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-backdrop fade show"></div>
    <div
      v-if="modelValue"
      class="modal fade show modal-opened"
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      @keydown.esc="close"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title h5">{{ title }}</h2>
            <button type="button" class="btn-close" aria-label="Закрыть модальное окно" @click="close"></button>
          </div>
          <div class="modal-body">
            <slot />
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button type="button" class="btn btn-secondary" @click="close">Закрыть</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
