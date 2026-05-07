<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  wide: { type: Boolean, default: false },
})

const modalEl = ref(null)
let bsModal = null

onMounted(() => {
  bsModal = window.bootstrap.Modal.getOrCreateInstance(modalEl.value)
})

function show() {
  bsModal?.show()
}

function hide() {
  bsModal?.hide()
}

defineExpose({ show, hide })
</script>

<template>
  <div class="modal fade" ref="modalEl" tabindex="-1" aria-modal="true" aria-hidden="true">
    <div
      class="modal-dialog modal-dialog-centered"
      :class="{ 'modal-xl modal-dialog-scrollable': wide }"
    >
      <div class="modal-content app-modal">
        <div class="modal-header">
          <h2 class="modal-title h5 mb-0">{{ title }}</h2>
          <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Закрыть"></button>
        </div>
        <div class="modal-body">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
