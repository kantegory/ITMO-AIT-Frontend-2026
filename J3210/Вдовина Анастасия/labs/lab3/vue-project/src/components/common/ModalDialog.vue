<template>
  <div>
    <div class="modal d-block" tabindex="-1" role="dialog" aria-modal="true" :aria-label="title">
      <div class="modal-dialog" :class="size">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title h5">{{ title }}</h2>
            <button type="button" class="btn-close" aria-label="Закрыть" @click="$emit('close')" />
          </div>

          <div class="modal-body">
            <slot />
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" @click="$emit('close')">Отмена</button>
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>

    <div class="modal-backdrop show" />
  </div>
</template>

<script>
export default {
  name: 'ModalDialog',
  props: {
    title: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: '',
    },
  },
  emits: ['close'],
  methods: {
    onKeydown(event) {
      if (event.key === 'Escape') this.$emit('close')
    },
  },
  mounted() {
    document.addEventListener('keydown', this.onKeydown)
  },
  unmounted() {
    document.removeEventListener('keydown', this.onKeydown)
  },
}
</script>
