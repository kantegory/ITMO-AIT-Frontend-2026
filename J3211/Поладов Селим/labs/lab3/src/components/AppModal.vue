<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-backdrop fade show" />
    <div
      v-if="modelValue"
      class="modal fade show d-block"
      tabindex="-1"
      @click.self="$emit('update:modelValue', false)"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="btn-close" @click="$emit('update:modelValue', false)" />
          </div>
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' }
})
defineEmits(['update:modelValue'])
</script>
